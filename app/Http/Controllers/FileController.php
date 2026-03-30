<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFileRequest;
use App\Models\BoxToken;
use App\Models\File;
use App\Models\Folder;
use App\Services\BoxService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FileController extends Controller
{
    public function __construct(protected BoxService $box) {}
 
    public function show(File $file): Response|RedirectResponse
    {
        abort_if($file->folder->user_id !== Auth::id(), 403);
 
        if (!BoxToken::where('user_id', Auth::id())->exists()) {
            return redirect()->route('box.connect');
        }
 
        $file->load(['folder.folderType', 'uploadedBy']);
 
        // Build breadcrumb trail by walking up the folder parent chain
        $breadcrumbs = [];
        $node = $file->folder->load('parent.parent.parent.parent');
        while ($node->parent) {
            array_unshift($breadcrumbs, [
                'id'   => $node->parent->id,
                'name' => $node->parent->name,
            ]);
            $node = $node->parent;
        }
        // Append the immediate folder itself
        $breadcrumbs[] = [
            'id'   => $file->folder->id,
            'name' => $file->folder->name,
        ];
 
        // Fetch live Box metadata for this file
        $boxMeta = null;
        if ($file->box_file_id) {
            $boxItems = collect($this->box->getFiles($file->folder->box_folder_id))
                ->keyBy('id')
                ->toArray();
            $boxMeta = $boxItems[$file->box_file_id] ?? null;
        }
 
        return Inertia::render('Files/Show', [
            'file' => [
                'id'              => $file->id,
                'name'            => $file->name,
                'extension'       => $file->extension,
                'size'            => $file->size,
                'size_human'      => $this->formatBytes($file->size),
                'document_type'   => $file->document_type,
                'is_sealed'       => $file->is_sealed,
                'box_file_id'     => $file->box_file_id,
                'uploaded_by'     => $file->uploadedBy->name,
                'created_at'      => $file->created_at->toDateTimeString(),
                'box_modified_at' => $boxMeta['modified_at'] ?? null,
                'download_url'    => $file->is_sealed
                    ? null
                    : route('box.download', $file->box_file_id),
                'folder'          => [
                    'id'          => $file->folder->id,
                    'name'        => $file->folder->name,
                    'folder_type' => $file->folder->folderType?->only('id', 'name'),
                ],
            ],
            'breadcrumbs' => $breadcrumbs,
        ]);
    }
 
    public function store(StoreFileRequest $request): RedirectResponse
    {
        $folder = $request->folder_id
            ? Folder::find($request->folder_id)
            : null;
 
        $uploadedFile = $request->file('file');
 
        // 1. Upload to Box under the folder's Box ID, or root ('0') if none
        $boxFileId = $this->box->uploadFile(
            $uploadedFile,
            $folder?->box_folder_id ?? env('BOX_ROOT_FOLDER_ID', '0')
        );
 
        // 2. Persist locally
        File::create([
            'folder_id'     => $folder?->id,
            'name'          => $uploadedFile->getClientOriginalName(),
            'extension'     => $uploadedFile->getClientOriginalExtension(),
            'size'          => $uploadedFile->getSize(),
            'document_type' => null,
            'is_sealed'     => false,
            'box_file_id'   => $boxFileId,
            'uploaded_by'   => Auth::id(),
        ]);
 
        return redirect()->back();
    }
 
    public function destroy(File $file): RedirectResponse
    {
        abort_if($file->folder->user_id !== Auth::id(), 403);
 
        // 1. Delete from Box
        if ($file->box_file_id) {
            $this->box->deleteFile($file->box_file_id);
        }
 
        // 2. Delete from local database
        $file->delete();
 
        return redirect()->back();
    }
 
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        if ($bytes === 0) return '0 B';
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = floor(log($bytes) / log(1024));
        return round($bytes / (1024 ** $i), $precision) . ' ' . $units[$i];
    }
}
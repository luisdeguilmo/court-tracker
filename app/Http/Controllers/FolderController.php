<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFolderRequest;
use App\Models\BoxToken;
use App\Models\Folder;
use App\Services\BoxService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FolderController extends Controller
{
    // V3 - Added auth guard to redirect to Box connection if not connected yet
     public function __construct(protected BoxService $box) {}
 
    /**
     * List all DB folders for the logged-in user.
     * Mirrors the auth-guard pattern from BoxController::files().
     */
    public function index(Request $request): Response|RedirectResponse
    {
        // Same guard as BoxController — redirect if not connected to Box yet
        if (!BoxToken::where('user_id', Auth::id())->exists()) {
            return redirect()->route('box.connect');
        }
 
        $folders = Folder::with(['folderType', 'files'])
            ->where('user_id', Auth::id())
            ->when(
                $request->search,
                fn($q, $s) => $q->where('name', 'like', "%{$s}%")
                    ->orWhere('case_number', 'like', "%{$s}%")
                    ->orWhere('case_title', 'like', "%{$s}%")
            )
            ->when(
                $request->folder_type_id,
                fn($q, $id) => $q->where('folder_type_id', $id)
            )
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn($folder) => [
                'id'            => $folder->id,
                'name'          => $folder->name,
                'case_number'   => $folder->case_number,
                'case_title'    => $folder->case_title,
                'case_status'   => $folder->case_status,
                'box_folder_id' => $folder->box_folder_id,
                'folder_type'   => $folder->folderType?->only('id', 'name'),
                'files_count'   => $folder->files->count(),
            ]);
 
        return Inertia::render('Folders/Index', [
            'folders' => $folders,
            'filters' => $request->only(['search', 'folder_type_id']),
        ]);
    }
 
    /**
     * Show a single folder and its files, merged with live Box metadata.
     * Downloads are handled by the existing BoxController::download() route,
     * so no duplicate download logic is needed here.
     */
    public function show(Folder $folder): Response|RedirectResponse
    {
        // Ensure the folder belongs to the logged-in user
        abort_if($folder->user_id !== Auth::id(), 403);
 
        // Same guard as BoxController
        if (!BoxToken::where('user_id', Auth::id())->exists()) {
            return redirect()->route('box.connect');
        }
 
        $folder->load(['folderType', 'user', 'files.uploadedBy']);
 
        // Fetch live Box items for this folder, keyed by box_file_id
        $boxItems = [];
        if ($folder->box_folder_id) {
            $boxItems = collect($this->box->getFiles($folder->box_folder_id))
                ->keyBy('id')
                ->toArray();
        }
 
        $files = $folder->files->map(function ($file) use ($boxItems) {
            $boxMeta = $boxItems[$file->box_file_id] ?? null;
 
            return [
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
                // Points to the EXISTING BoxController::download() route
                // so no duplicate download logic is needed here
                'download_url'    => $file->is_sealed
                    ? null
                    : route('box.download', $file->box_file_id),
            ];
        });
 
        return Inertia::render('Folders/Show', [
            'folder' => [
                'id'          => $folder->id,
                'name'        => $folder->name,
                'case_number' => $folder->case_number,
                'case_title'  => $folder->case_title,
                'case_status' => $folder->case_status,
                'folder_type' => $folder->folderType?->only('id', 'name'),
                'owner'       => $folder->user->name,
            ],
            'files' => $files,
        ]);
    }

    public function create() {

    }

    public function store(StoreFolderRequest $request): RedirectResponse
    {
        // Redirect if not connected to Box
        if (!BoxToken::where('user_id', Auth::id())->exists()) {
            return redirect()->route('box.connect');
        }

        // 1. Create the folder in Box and capture the Box folder ID
        $boxParentId  = $request->input('box_parent_id', '0'); // '0' = Box root
        $boxFolderId  = $this->box->createFolder($request->name, $boxParentId);

        // 2. Persist to your local database, storing the Box folder ID
        $folder = Folder::create([
            'user_id'        => Auth::id(),
            'name'           => $request->name,
            // 'case_number'    => $request->case_number,
            // 'case_title'     => $request->case_title,
            // 'case_status'    => $request->case_status,
            'folder_type_id' => 2,
            'box_folder_id'  => $boxFolderId, // ← Returned from Box API
        ]);

        // return redirect()
        //     ->route('folders.show', $folder)
        //     ->with('success', 'Folder created successfully.');

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

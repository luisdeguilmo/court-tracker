<?php

namespace App\Http\Controllers;

use App\Models\BoxToken;
use App\Models\Folder;
use App\Services\BoxService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class RecordsController extends Controller
{
    public function __construct(protected BoxService $box) {}

    // ─────────────────────────────────────────────────────────────────────
    // Browse public folders/files — any logged-in user
    // ─────────────────────────────────────────────────────────────────────
    public function index(Request $request): Response
    {
        $folderId = $request->folder_id;

        if ($folderId) {
            $currentFolder = Folder::where('id', $folderId)
                ->where('folder_scope', 'record')
                ->firstOrFail();

            // Breadcrumbs
            $breadcrumbs = [];
            $node = $currentFolder->load('parent.parent.parent.parent');
            while ($node->parent) {
                array_unshift($breadcrumbs, [
                    'id'   => $node->parent->id,
                    'name' => $node->parent->name,
                ]);
                $node = $node->parent;
            }

            // Public subfolders only
            $subfolders = Folder::with(['folderType'])
                ->withCount('files')
                ->where('parent_id', $currentFolder->id)
                ->where('folder_scope', 'record')
                ->latest()
                ->get()
                ->map(fn($f) => [
                    'id'          => $f->id,
                    'name'        => $f->name,
                    'case_number' => $f->case_number,
                    'case_title'  => $f->case_title,
                    'folder_type' => $f->folderType?->only('id', 'name'),
                    'files_count' => $f->files_count,
                ]);

            // Public files only
            $currentFolder->load(['folderType', 'files.uploadedBy']);

            $files = $currentFolder->files
                // ->where('is_public', true)
                ->map(function ($file) {
                    $canDownload = Auth::user()->hasAnyRole(['admin', 'clerk'])
                        || $file->uploaded_by === Auth::id();

                    return [
                        'id'            => $file->id,
                        'name'          => $file->name,
                        'extension'     => $file->extension,
                        'size'          => $file->size,
                        'size_human'    => $this->formatBytes($file->size),
                        'document_type' => $file->document_type,
                        'is_sealed'     => $file->is_sealed,
                        'box_file_id'   => $file->box_file_id,
                        'uploaded_by'   => $file->uploadedBy->name,
                        'created_at'    => $file->created_at->toDateTimeString(),
                        // Only admins, clerks, or the uploader can download
                        'download_url'    => $file->is_sealed
                            ? null
                            : route('box.download', $file->box_file_id),
                        'owner'       => $file->user->name,
                        'updated_at'       => $file->updated_at,
                    ];
                });

            return Inertia::render('Records/Index', [
                'currentFolder' => [
                    'id'          => $currentFolder->id,
                    'name'        => $currentFolder->name,
                    'case_number' => $currentFolder->case_number,
                    'case_title'  => $currentFolder->case_title,
                    'case_status' => $currentFolder->case_status,
                    'folder_type' => $currentFolder->folderType?->only('id', 'name'),
                ],
                'breadcrumbs'  => $breadcrumbs,
                'subfolders'   => $subfolders,
                'files'        => $files,
                'folders'      => null,
                'filters'      => $request->only(['folder_id']),
                'can'          => [
                    'upload' => Auth::user()->hasAnyRole(['admin', 'clerk']),
                ],
            ]);
        }

        // Root level — public folders only
        $folders = Folder::with(['folderType'])
            ->withCount('files')
            ->whereNull('parent_id')
            ->where('folder_scope', 'record')
            ->when(
                $request->search,
                fn($q, $s) => $q->where('name', 'like', "%{$s}%")
                    ->orWhere('case_number', 'like', "%{$s}%")
                    ->orWhere('case_title', 'like', "%{$s}%")
            )
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn($folder) => [
                'id'          => $folder->id,
                'name'        => $folder->name,
                'case_number' => $folder->case_number,
                'case_title'  => $folder->case_title,
                'case_status' => $folder->case_status,
                'color' => $folder->color,
                'folder_type' => $folder->folderType?->only('id', 'name'),
                'files_count' => $folder->files_count,
            ]);

        return Inertia::render('Records/Index', [
            'folders'       => $folders,
            'currentFolder' => null,
            'breadcrumbs'   => [],
            'subfolders'    => null,
            'files'         => null,
            'filters'       => $request->only(['search']),
            'can'           => [
                'upload' => Auth::user()->hasAnyRole(['admin', 'clerk']),
            ],
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────
    // Create a public folder — Admin & Clerk only
    // ─────────────────────────────────────────────────────────────────────
    public function store(Request $request): RedirectResponse
    {
        // Role gate
        abort_unless(Auth::user()->hasAnyRole(['admin', 'clerk']), 403);

        // Box connection required to create folders
        $boxToken = BoxToken::first(); // shared system token
        abort_if(!$boxToken, 403, 'Box is not connected. Please contact the administrator.');

        $request->validate([
            'name'        => 'required|string|max:255',
            'case_number' => 'nullable|string|max:100',
            'case_title'  => 'nullable|string|max:255',
            'case_status' => 'nullable|string|max:100',
            'parent_id'   => 'nullable|exists:folders,id',
        ]);

        $boxParentId = $request->input('box_parent_id', '0');
        $boxFolderId = $this->box->createFolder($request->name, $boxParentId);

        Folder::create([
            'user_id'        => Auth::id(),
            'parent_id'      => $request->parent_id,
            'name'           => $request->name,
            'case_number'    => $request->case_number,
            'case_title'     => $request->case_title,
            'case_status'    => $request->case_status,
            'folder_type_id' => 2,
            'box_folder_id'  => $boxFolderId,
            'is_public'      => true, // always public in Records
        ]);

        return redirect()->back()->with('success', 'Record folder created successfully.');
    }

    // ─────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        if ($bytes === 0) return '0 B';
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $i = floor(log($bytes) / log(1024));
        return round($bytes / (1024 ** $i), $precision) . ' ' . $units[$i];
    }
}
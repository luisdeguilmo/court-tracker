<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFolderRequest;
use App\Models\BoxToken;
use App\Models\File;
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
  
    public function index(Request $request): Response|RedirectResponse
{
    $folderId = $request->folder_id;

    // ── Inside a folder ──────────────────────────────────────────────────
    if ($folderId) {
        $currentFolder = Folder::where('id', $folderId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Build breadcrumb trail by walking up the parent chain
        $breadcrumbs = [];
        $node = $currentFolder->load('parent.parent.parent.parent');
        while ($node->parent) {
            array_unshift($breadcrumbs, [
                'id'   => $node->parent->id,
                'name' => $node->parent->name,
            ]);
            $node = $node->parent;
        }

        // Subfolders of this folder
        $subfolders = Folder::with(['folderType'])
            ->withCount(['files', 'subfolders'])
            ->where('user_id', Auth::id())
            ->where('parent_id', $currentFolder->id)
            ->latest()
            ->get()
            ->map(fn($f) => [
                'id'          => $f->id,
                'name'        => $f->name,
                'case_number' => $f->case_number,
                'case_title'  => $f->case_title,
                'folder_type' => $f->folderType?->only('id', 'name'),
                'color' => $f->color,
                'files_count' => $f->files_count,
                'subfolders_count' => $f->subfolders_count,
            ]);

        // Files in this folder (+ live Box metadata)
        $currentFolder->load(['folderType', 'user', 'files.uploadedBy']);

        // $boxItems = [];
        // if ($currentFolder->box_folder_id) {
        //     $boxItems = collect($this->box->getFiles($currentFolder->box_folder_id))
        //         ->keyBy('id')
        //         ->toArray();
        // }

        // $files = $currentFolder->files->map(function ($file) use ($boxItems) {
        //     $boxMeta = $boxItems[$file->box_file_id] ?? null;
        //     return [
        //         'id'              => $file->id,
        //         'name'            => $file->name,
        //         'extension'       => $file->extension,
        //         'size'            => $file->size,
        //         'size_human'      => $this->formatBytes($file->size),
        //         'document_type'   => $file->document_type,
        //         'is_sealed'       => $file->is_sealed,
        //         'box_file_id'     => $file->box_file_id,
        //         // 'uploaded_by'     => $file->uploadedBy->name,
        //         'created_at'      => $file->created_at->toDateTimeString(),
        //         'box_modified_at' => $boxMeta['modified_at'] ?? null,
        //         'download_url'    => $file->is_sealed
        //             ? null
        //             : route('box.download', $file->box_file_id),
        //         'owner'       => $file->user->name,
        //         'updated_at'       => $file->updated_at,
        //     ];
        // });

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

        return Inertia::render('Folders/Index', [
            'currentFolder' => [
                'id'          => $currentFolder->id,
                'name'        => $currentFolder->name,
                'case_number' => $currentFolder->case_number,
                'case_title'  => $currentFolder->case_title,
                'case_status' => $currentFolder->case_status,
                'folder_type' => $currentFolder->folderType?->only('id', 'name'),
            ],
            'breadcrumbs' => $breadcrumbs,
            'subfolders'  => $subfolders,
            'files'       => $files,
            'folders'     => null,
            'filters'     => $request->only(['folder_id']),
        ]);
    }

    // ── Root level ───────────────────────────────────────────────────────
    // $folders = Folder::with(['folderType'])
    //     ->withCount(['files', 'subfolders'])
    //     ->where('user_id', Auth::id())
    //     ->whereNull('parent_id')
    //     ->when(
    //         $request->search,
    //         fn($q, $s) => $q->where('name', 'like', "%{$s}%")
    //             ->orWhere('case_number', 'like', "%{$s}%")
    //             ->orWhere('case_title', 'like', "%{$s}%")
    //     )
    //     ->latest()
    //     ->paginate(12)
    //     ->withQueryString()
    //     ->through(fn($folder) => [
    //         'id'          => $folder->id,
    //         'name'        => $folder->name,
    //         'case_number' => $folder->case_number,
    //         'case_title'  => $folder->case_title,
    //         'case_status' => $folder->case_status,
    //         'folder_type' => $folder->folderType?->only('id', 'name'),
    //         'files_count' => $folder->files_count,
    //         'subfolders_count' => $folder->subfolders_count,
    //         'folder_type' => $folder->folderType?->only('id', 'name'),
    //         'owner'       => $folder->user->name,
    //         'created_at'       => $folder->created_at,
    //         'updated_at'       => $folder->updated_at,
    //     ]);

    // return Inertia::render('Folders/Index', [
    //     'folders'       => $folders,
    //     'currentFolder' => null,
    //     'breadcrumbs'   => [],
    //     'subfolders'    => null,
    //     'files'         => null,
    //     'filters'       => $request->only(['search']),
    // ]);

    // ── Root level ───────────────────────────────────────────────────────
$folders = Folder::with(['folderType', 'user'])
    ->withCount(['files', 'subfolders'])
    ->where('user_id', Auth::id())
    ->whereNull('parent_id')
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
        'id'              => $folder->id,
        'name'            => $folder->name,
        'case_number'     => $folder->case_number,
        'case_title'      => $folder->case_title,
        'case_status'     => $folder->case_status,
        'color'     => $folder->color,
        'folder_type'     => $folder->folderType?->only('id', 'name'),
        'files_count'     => $folder->files_count,
        'subfolders_count' => $folder->subfolders_count,
        'owner'           => $folder->user->name,
        'created_at'      => $folder->created_at,
        'updated_at'      => $folder->updated_at,
    ]);

// Fetch root-level files (no folder association)
$rootFiles = File::with(['uploadedBy', 'user'])
    ->where('uploaded_by', Auth::id())
    ->whereNull('folder_id')
    ->latest()
    ->get()
    ->map(function ($file) {
        return [
            'id'            => $file->id,
            'name'          => $file->name,
            'extension'     => $file->extension,
            'size'          => $file->size,
            'size_human'    => $this->formatBytes($file->size),
            'document_type' => $file->document_type,
            'is_sealed'     => $file->is_sealed,
            'box_file_id'   => $file->box_file_id,
            'created_at'    => $file->created_at->toDateTimeString(),
            'download_url'  => $file->is_sealed
                ? null
                : route('box.download', $file->box_file_id),
            'owner'         => $file->user->name,
            'updated_at'    => $file->updated_at,
        ];
    });

return Inertia::render('Folders/Index', [
    'folders'       => $folders,
    'currentFolder' => null,
    'breadcrumbs'   => [],
    'subfolders'    => null,
    'files'         => $rootFiles,  // <-- now populated
    'filters'       => $request->only(['search']),
]);
}
 
    public function show(Folder $folder): Response|RedirectResponse
{
    abort_if($folder->user_id !== Auth::id(), 403);

    $folder->load(['folderType', 'user', 'files.uploadedBy', 'subfolders.folderType']);

    // Build breadcrumb trail by walking up parents
    $breadcrumbs = [];
    $current = $folder->load('parent.parent.parent'); // load ancestors
    while ($current->parent) {
        array_unshift($breadcrumbs, [
            'id'   => $current->parent->id,
            'name' => $current->parent->name,
        ]);
        $current = $current->parent;
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

    $subfolders = $folder->subfolders->map(fn($sub) => [
        'id'          => $sub->id,
        'name'        => $sub->name,
        'case_number' => $sub->case_number,
        'folder_type' => $sub->folderType?->only('id', 'name'),
        'files_count' => $sub->files()->count(),
        'folders_count' => $folder->subfolders()->count(),
    ]);

    return Inertia::render('Folders/Show', [
        'folder'      => [
            'id'          => $folder->id,
            'name'        => $folder->name,
            'case_number' => $folder->case_number,
            'case_title'  => $folder->case_title,
            'case_status' => $folder->case_status,
            'folder_type' => $folder->folderType?->only('id', 'name'),
            'owner'       => $folder->user->name,
        ],
        'subfolders'  => $subfolders, // ← new
        'files'       => $files,
        'breadcrumbs' => $breadcrumbs, // ← new
    ]);
}

    public function create() {

    }

    public function store(StoreFolderRequest $request): RedirectResponse
    {
        // 1. Create the folder in Box and capture the Box folder ID
        // $boxParentId  = $request->input('box_parent_id', '0'); // '0' = Box root
        $boxParentId = $request->parent_id
            ? Folder::find($request->parent_id)?->box_folder_id
            : null;
        $boxParentId ??= env('BOX_ROOT_FOLDER_ID', '0');
        $boxFolderId  = $this->box->createFolder($request->name, $boxParentId);
        

        // 2. Persist to your local database, storing the Box folder ID
        $folder = Folder::create([
            'user_id'        => Auth::id(),
            'parent_id'      => $request->parent_id, 
            'name'           => $request->name,
            'case_number'    => $request->case_number,
            'case_title'     => $request->case_title,
            'case_status'    => $request->case_status,
            'folder_type_id' => 2,
            'box_folder_id'  => $boxFolderId, // ← Returned from Box API
        ]);

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

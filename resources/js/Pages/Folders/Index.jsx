// import { useState } from "react";
// import { Head, Link, router } from "@inertiajs/react";
// import {
//     Folder,
//     FolderOpen,
//     Search,
//     FileText,
//     ChevronRight,
//     ChevronLeft,
//     Plus,
// } from "lucide-react";
// import MainLayout from "@/Layouts/MainLayout";
// import AppDropdown from "@/components/app-dropdown";
// import { Button } from "@/components/ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuPortal,
//     DropdownMenuSeparator,
//     DropdownMenuShortcut,
//     DropdownMenuSub,
//     DropdownMenuSubContent,
//     DropdownMenuSubTrigger,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import AppBreadCrumb from "@/components/app-breadcrumb";

// const STATUS_PILL = {
//     open: "bg-emerald-100 text-emerald-700",
//     closed: "bg-slate-100 text-slate-500",
//     pending: "bg-amber-100 text-amber-700",
// };

// export default function FoldersIndex({ folders, filters }) {
//     const [search, setSearch] = useState(filters.search ?? "");
//     const [breadcrumbs, setBreadcrumbs] = useState([]);

//     function handleSearch(e) {
//         e.preventDefault();
//         router.get(
//             route("folders.index"),
//             { search },
//             { preserveState: true, replace: true },
//         );
//     }

//     function handleClear() {
//         setSearch("");
//         router.get(route("folders.index"), {}, { preserveState: false });
//     }

//     const handleFolderClick = (folder) => {
//         setBreadcrumbs((prev) => [...prev, folder]); // push to trail
//         // fetch subfolders of clicked folder here...
//     };

//     console.log(folders.data);

//     return (
//         <>
//             <Head title="Folders" />
//             <div className="relative min-h-screen bg-gray-50">
//                 <div className="bg-white border-b border-gray-200 px-6 py-5">
//                     <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
//                         <AppBreadCrumb
//                             breadcrumbs={breadcrumbs}
//                             setBreadcrumbs={setBreadcrumbs}
//                         />
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">
//                                 Case Folders
//                             </h1>
//                             <p className="text-sm text-gray-400 mt-0.5">
//                                 {folders.total} folder
//                                 {folders.total !== 1 ? "s" : ""}
//                             </p>
//                         </div>

//                         <form onSubmit={handleSearch} className="flex gap-2">
//                             <div className="relative">
//                                 <Search
//                                     size={15}
//                                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                                 />
//                                 <input
//                                     type="text"
//                                     value={search}
//                                     onChange={(e) => setSearch(e.target.value)}
//                                     placeholder="Search by name, case no…"
//                                     className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//                                 />
//                             </div>
//                             <Button
//                                 type="submit"
//                                 className="px-4 py-2 text-sm transition"
//                             >
//                                 Search
//                             </Button>
//                             {filters.search && (
//                                 <button
//                                     type="button"
//                                     onClick={handleClear}
//                                     className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition text-gray-600"
//                                 >
//                                     Clear
//                                 </button>
//                             )}
//                         </form>

//                         {/* <button
//                             type="button"
//                             className="px-4 py-2 flex items-center gap-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                         >
//                             <Plus className="w-5 h-5" />
//                             New

//                         </button> */}
//                     </div>
//                 </div>

//                 <div className="max-w-7xl mx-auto px-6 py-8">
//                     {folders.data.length === 0 ? (
//                         <div className="text-center py-24 text-gray-400">
//                             <FolderOpen
//                                 size={48}
//                                 className="mx-auto mb-3 opacity-30"
//                             />
//                             <p className="text-lg font-medium">
//                                 No folders found
//                             </p>
//                             {filters.search && (
//                                 <p className="text-sm mt-1">
//                                     Try a different term or{" "}
//                                     <button
//                                         onClick={handleClear}
//                                         className="text-blue-600 underline"
//                                     >
//                                         clear filters
//                                     </button>
//                                 </p>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                             {folders.data.map((folder) => (
//                                 <FolderCard
//                                     key={folder.id}
//                                     folder={folder}
//                                     onClick={() => handleFolderClick(folder)}
//                                 />
//                             ))}
//                         </div>
//                     )}

//                     {folders.last_page > 1 && (
//                         <Pagination links={folders.links} meta={folders} />
//                     )}
//                 </div>

//                 <span className="fixed bottom-20 right-20">
//                     <AppDropdown />
//                 </span>
//             </div>
//         </>
//     );
// }

// FoldersIndex.layout = (page) => <MainLayout>{page}</MainLayout>;

// function FolderCard({ folder }) {
//     const pill =
//         STATUS_PILL[folder.case_status?.toLowerCase()] ??
//         "bg-gray-100 text-gray-500";

//     return (
//         <Link
//             href={route("folders.show", folder.id)}
//             className="flex flex-col justify-between group bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 overflow-hidden"
//         >
//             <div className="px-5 pt-5 pb-2">
//                 <div className="flex items-start justify-between gap-2">
//                     {/* <div className="p-2.5 mb-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
//                         <Folder size={22} className="text-blue-600" />
//                     </div>
//                     {folder.case_status && (
//                         <span
//                             className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${pill}`}
//                         >
//                             {folder.case_status}
//                         </span>
//                     )} */}
//                 </div>

//                 <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
//                     {folder.folder_type.id === 1
//                         ? folder.name
//                         : folder.case_title}
//                 </h3>
//                 {folder.case_number && (
//                     <p className="mt-1 text-xs text-gray-400 font-mono">
//                         {folder.case_number}
//                     </p>
//                 )}
//                 {/* {folder.case_title && (
//                     <p className="mt-1 text-xs text-gray-500 line-clamp-1">
//                         {folder.case_title}
//                     </p>
//                 )} */}
//             </div>

//             <div className="w-full left-0 bottom-0 px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
//                 <div className="flex items-center gap-1 text-xs text-gray-400">
//                     <FileText size={13} />
//                     <span>
//                         {folder.files_count} file
//                         {folder.files_count !== 1 ? "s" : ""}
//                     </span>
//                 </div>
//                 {/* <div className="flex items-center gap-1 text-xs text-gray-400">
//                     <span>{folder.folder_type?.name}</span>
//                     <ChevronRight
//                         size={14}
//                         className="group-hover:text-blue-500 transition"
//                     />
//                 </div> */}
//             </div>
//         </Link>
//     );
// }

// function Pagination({ links, meta }) {
//     return (
//         <div className="mt-8 flex items-center justify-between text-sm text-gray-500">
//             <p>
//                 Showing {meta.from}–{meta.to} of {meta.total}
//             </p>
//             <div className="flex gap-1">
//                 {links.map((link, i) => {
//                     const label = link.label.includes("Previous") ? (
//                         <ChevronLeft size={16} />
//                     ) : link.label.includes("Next") ? (
//                         <ChevronRight size={16} />
//                     ) : (
//                         link.label
//                     );
//                     const base =
//                         "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition";
//                     const cls = link.active
//                         ? `${base} bg-blue-600 text-white`
//                         : !link.url
//                           ? `${base} text-gray-300 cursor-not-allowed`
//                           : `${base} hover:bg-gray-100 text-gray-700`;
//                     if (!link.url)
//                         return (
//                             <span key={i} className={cls}>
//                                 {label}
//                             </span>
//                         );
//                     return (
//                         <Link
//                             key={i}
//                             href={link.url}
//                             className={cls}
//                             preserveScroll
//                         >
//                             {label}
//                         </Link>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Folder,
    FolderOpen,
    Search,
    FileText,
    ChevronRight,
    ChevronLeft,
    File,
    Image,
    Film,
    Lock,
    Download,
    ArrowLeft,
    Home,
} from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
import AppDropdown from "@/components/app-dropdown";
import { Button } from "@/components/ui/button";
import AppBreadCrumb from "@/components/app-breadcrumb";
import Toolbar from "@/components/toolbar";
import SwitchLayout from "@/components/switch-layout";
import FileDetailsPanel from "@/components/details-panel";

const STATUS_PILL = {
    open: "bg-emerald-100 text-emerald-700",
    closed: "bg-slate-100 text-slate-500",
    pending: "bg-amber-100 text-amber-700",
};

const EXT_ICON = {
    pdf: FileText,
    doc: FileText,
    docx: FileText,
    jpg: Image,
    jpeg: Image,
    png: Image,
    gif: Image,
    webp: Image,
    mp4: Film,
    mov: Film,
    avi: Film,
};

function FileIcon({ extension, size = 15 }) {
    const Icon = EXT_ICON[extension?.toLowerCase()] ?? File;
    return <Icon size={size} />;
}

export default function FoldersIndex({
    folders,
    subfolders,
    files,
    breadcrumbs,
    currentFolder,
    filters,
}) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(false);

    // serverBreadcrumbs is an array of { id, name } built by the
    const isRoot = !currentFolder;

    function handleSearch(e) {
        e.preventDefault();
        router.get(
            route("folders.index"),
            { search },
            { preserveState: true, replace: true },
        );
    }

    function handleClear() {
        setSearch("");
        router.get(route("folders.index"), {}, { preserveState: false });
    }

    function handleFolderClick(folder) {
        setSelectedFolder(folder);
        // router.get(
        //     route("folders.index"),
        //     { folder_id: folder.id },
        //     { preserveState: false },
        // );
    }

    function handleNavigate(crumb) {
        if (!crumb) {
            router.get(route("folders.index"), {}, { preserveState: false });
        } else {
            router.get(
                route("folders.index"),
                { folder_id: crumb.id },
                { preserveState: false },
            );
        }
    }

    // At root: show paginated `folders`. Inside a folder: show `subfolders` + `files`.
    const displayFolders = isRoot ? (folders?.data ?? []) : (subfolders ?? []);

    return (
        <div className=""> 
            <Head title={currentFolder ? currentFolder.name : "Folders"} />
            <div className="relative min-h-screen">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {currentFolder ? currentFolder.name : "Case Folders"}
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isRoot
                            ? `${folders?.total ?? 0} folder${folders?.total !== 1 ? "s" : ""}`
                            : `${displayFolders.length} folder${displayFolders.length !== 1 ? "s" : ""}, ${files?.length ?? 0} file${files?.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {/* Header */}
                <div className="bg-white border-b border-gray-200 py-5">
                    <div className="w-full mb-3 flex justify-between items-center">
                        <AppBreadCrumb
                            breadcrumbs={breadcrumbs}
                            currentFolder={currentFolder} // the currently open folder
                            onNavigate={handleNavigate}
                        />
                        <SwitchLayout />
                    </div>

                    <div className="w-full mx-auto flex items-center justify-between gap-4">
                        {/* Search — only at root */}
                        {/* {isRoot && ( */}
                        <span>
                            <AppDropdown parentId={currentFolder?.id} />
                        </span>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative">
                                <Search
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, case no…"
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="px-4 py-2 text-sm transition"
                            >
                                Search
                            </Button>
                            {filters.search && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition text-gray-600"
                                >
                                    Clear
                                </button>
                            )}
                        </form>

                        {/* )} */}
                    </div>
                </div>

                {/* Body */}
                <div className="flex">
                    <div className={`max-w-7xl mx-auto py-8 space-y-8 overflow-y-scroll h-[450px] ${selectedFolder && "pr-4"}`}>
                        {/* Subfolders grid */}
                        {displayFolders.length > 0 && (
                            <section>
                                {!isRoot && (
                                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                        Folders
                                    </h2>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {displayFolders.map((folder) => (
                                        <FolderCard
                                            key={folder.id}
                                            folder={folder}
                                            onClick={() =>
                                                handleFolderClick(folder)
                                            }
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Empty root */}
                        {isRoot && displayFolders.length === 0 && (
                            <div className="text-center py-24 text-gray-400">
                                <FolderOpen
                                    size={48}
                                    className="mx-auto mb-3 opacity-30"
                                />
                                <p className="text-lg font-medium">
                                    No folders found
                                </p>
                                {filters.search && (
                                    <p className="text-sm mt-1">
                                        Try a different term or{" "}
                                        <button
                                            onClick={handleClear}
                                            className="text-blue-600 underline"
                                        >
                                            clear filters
                                        </button>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Files table — only inside a folder */}
                        {!isRoot && (
                            <section>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                    Files{" "}
                                    <span className="text-gray-400 font-normal normal-case">
                                        ({files?.length ?? 0})
                                    </span>
                                </h2>

                                {files?.length === 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
                                        <File
                                            size={36}
                                            className="mx-auto mb-3 opacity-30"
                                        />
                                        <p className="font-medium">
                                            No files in this folder
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                                                    <th className="text-left px-5 py-3 font-medium">
                                                        Name
                                                    </th>
                                                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                                                        Doc Type
                                                    </th>
                                                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                                                        Size
                                                    </th>
                                                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                                                        Uploaded by
                                                    </th>
                                                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                                                        Last Modified
                                                    </th>
                                                    <th className="text-right px-5 py-3 font-medium">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {files.map((file) => (
                                                    <FileRow
                                                        key={file.id}
                                                        file={file}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Pagination — root only */}
                        {isRoot && folders?.last_page > 1 && (
                            <Pagination links={folders.links} meta={folders} />
                        )}
                    </div>

                    {selectedFolder && (
                        <div className="w-72 shrink-0 border-l border-gray-200 p-4">
                            <FileDetailsPanel
                                folder={selectedFolder}
                                onClose={() => setSelectedFolder(null)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

FoldersIndex.layout = (page) => <MainLayout>{page}</MainLayout>;

function FolderCard({ folder, onClick }) {
    return (
        <button
            onClick={onClick}
            className="text-left flex flex-col justify-between group bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 overflow-hidden w-full"
        >
            <div className="px-5 pt-5 pb-2">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                        <Folder size={18} className="text-blue-600" />
                    </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                    {folder.folder_type?.id === 1
                        ? folder.name
                        : (folder.case_title ?? folder.name)}
                </h3>
                {folder.case_number && (
                    <p className="mt-1 text-xs text-gray-400 font-mono">
                        {folder.case_number}
                    </p>
                )}
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <FileText size={13} />
                    <span>
                        {folder.files_count ?? 0} file
                        {(folder.files_count ?? 0) !== 1 ? "s" : ""}
                    </span>
                </div>
                <ChevronRight
                    size={14}
                    className="text-gray-300 group-hover:text-blue-500 transition"
                />
            </div>
        </button>
    );
}

function FileRow({ file }) {
    const download = (id) => window.open(`/box/download/${id}`, "_blank");

    return (
        <tr className="hover:bg-gray-50 transition">
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <span
                        className={`p-1.5 rounded-lg ${file.is_sealed ? "bg-red-50 text-red-400" : "bg-blue-50 text-blue-500"}`}
                    >
                        {file.is_sealed ? (
                            <Lock size={15} />
                        ) : (
                            <FileIcon extension={file.extension} />
                        )}
                    </span>
                    <div>
                        <p className="font-medium text-gray-800 line-clamp-1">
                            {file.name}
                        </p>
                        <p className="text-xs text-gray-400 uppercase">
                            .{file.extension}
                            {file.is_sealed && (
                                <span className="ml-2 text-red-400 normal-case font-medium">
                                    Sealed
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">
                {file.document_type ?? <span className="text-gray-300">—</span>}
            </td>
            <td className="px-4 py-3.5 text-gray-500 hidden sm:table-cell">
                {file.size_human}
            </td>
            <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">
                {file.uploaded_by}
            </td>
            <td className="px-4 py-3.5 text-gray-400 text-xs hidden lg:table-cell">
                {file.box_modified_at ? (
                    new Date(file.box_modified_at).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" },
                    )
                ) : (
                    <span className="text-gray-300">—</span>
                )}
            </td>
            <td className="px-5 py-3.5 text-right">
                {file.is_sealed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-300 select-none">
                        <Lock size={13} /> Restricted
                    </span>
                ) : file.download_url ? (
                    <button
                        onClick={() => download(file.box_file_id)}
                        className="text-green-600 hover:underline text-sm"
                    >
                        Download
                    </button>
                ) : (
                    <span className="text-xs text-gray-300">Unavailable</span>
                )}
            </td>
        </tr>
    );
}

function Pagination({ links, meta }) {
    return (
        <div className="mt-8 flex items-center justify-between text-sm text-gray-500">
            <p>
                Showing {meta.from}–{meta.to} of {meta.total}
            </p>
            <div className="flex gap-1">
                {links.map((link, i) => {
                    const label = link.label.includes("Previous") ? (
                        <ChevronLeft size={16} />
                    ) : link.label.includes("Next") ? (
                        <ChevronRight size={16} />
                    ) : (
                        link.label
                    );
                    const base =
                        "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition";
                    const cls = link.active
                        ? `${base} bg-blue-600 text-white`
                        : !link.url
                          ? `${base} text-gray-300 cursor-not-allowed`
                          : `${base} hover:bg-gray-100 text-gray-700`;
                    if (!link.url)
                        return (
                            <span key={i} className={cls}>
                                {label}
                            </span>
                        );
                    return (
                        <Link
                            key={i}
                            href={link.url}
                            className={cls}
                            preserveScroll
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

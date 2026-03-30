import { useEffect, useRef, useState } from "react";
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
    Download,
    X,
    SidebarOpen,
    SidebarClose,
    Share,
    Trash2,
    EllipsisVertical,
    UserPlus,
} from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
import AppDropdown from "@/components/app-dropdown";
import { Button } from "@/components/ui/button";
import AppBreadCrumb from "@/components/app-breadcrumb";
import SwitchLayout from "@/components/switch-layout";
import FileDetailsPanel from "@/components/details-panel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import FileCard from "@/components/file-card";
import FolderMenuDropdown from "@/components/folder-menu-dropdown";
import FolderContextMenu from "@/components/folder-context-menu";

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
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [layout, setLayout] = useState("grid");
    const containerRef = useRef(null);

    const isRoot = !currentFolder;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setSelectedFolder(null);
                setSelectedFile(null);
            }
        };

        if (selectedFolder || selectedFile) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedFolder, selectedFile]);

    function handleBodyClick(e) {
        if (e.target === e.currentTarget) {
            setSelectedFolder(null);
            setSelectedFile(null);
        }
    }

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
        if (selectedFile) {
            setSelectedFile(null);
        }
        setSelectedFolder(folder);
    }

    function handleFileClick(file) {
        if (selectedFolder) {
            setSelectedFolder(null);
        }
        setSelectedFile(file);
    }

    function handleFolderDoubleClick(folder) {
        setSelectedFolder(folder);
        router.get(
            route("folders.index"),
            { folder_id: folder.id },
            { preserveState: false },
        );
    }

    function handleFileDoubleClick(folder) {}

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

    const displayFolders = isRoot ? (folders?.data ?? []) : (subfolders ?? []);

    return (
        <div ref={containerRef}>
            <Head title={currentFolder ? currentFolder.name : "Folders"} />
            <div className="relative min-h-screen">
                {/* Title */}
                <div>
                    <div
                        onClick={() => setSelectedFolder(null)}
                        className="w-full flex justify-between items-center"
                    >
                        <AppBreadCrumb
                            current="My Drive"
                            breadcrumbs={breadcrumbs}
                            currentFolder={currentFolder}
                            onNavigate={handleNavigate}
                        />
                        <SwitchLayout layout={layout} onSetLayout={setLayout} />
                    </div>
                    <p
                        onClick={() => setSelectedFolder(null)}
                        className="text-sm text-gray-400"
                    >
                        {isRoot
                            ? `${folders?.total ?? 0} folder${folders?.total !== 1 ? "s" : ""}`
                            : `${displayFolders.length} folder${displayFolders.length !== 1 ? "s" : ""}, ${files?.length ?? 0} file${files?.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {/* Header */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white w-full border-b border-gray-200 py-2">
                    <div className="w-full mx-auto flex items-center justify-between gap-4 min-h-[52px]">
                        <span>
                            <AppDropdown parentId={currentFolder?.id} />
                        </span>
                        {!selectedFolder && !selectedFile ? (
                            <>
                                <form
                                    onSubmit={handleSearch}
                                    className="flex gap-2"
                                >
                                    <div className="relative">
                                        <Search
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
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
                            </>
                        ) : (
                            <div className="w-full py-2 px-4 rounded-lg text-gray-700 bg-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => {
                                                setSelectedFolder(null);
                                                setSelectedFile(null);
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <span className="mb-0.5 text-xs">
                                            1 selected
                                        </span>
                                    </div>
                                    <button>
                                        <UserPlus className="w-4 h-4" />
                                    </button>
                                    <button>
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button>
                                        <Share className="w-4 h-4" />
                                    </button>
                                    <button>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button>
                                        <EllipsisVertical className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setDetailsOpen(!detailsOpen)}
                                    className="text-gray-600"
                                >
                                    {detailsOpen ? (
                                        <SidebarClose className="w-5 h-5 rotate-180" />
                                    ) : (
                                        <SidebarOpen className="w-5 h-5 rotate-180" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="flex">
                    <div
                        className={`w-full mx-auto py-6 space-y-8 overflow-y-scroll h-130.5 ${selectedFolder && ""}`}
                        onClick={handleBodyClick}
                    >
                        {/* Subfolders grid */}
                        {displayFolders.length > 0 && (
                            <section>
                                {!isRoot && (
                                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                        Folders
                                    </h2>
                                )}
                                {layout === "grid" ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {displayFolders.map((folder) => (
                                            <FolderCard
                                                key={folder.id}
                                                folder={folder}
                                                selectedFolder={selectedFolder}
                                                onClick={() =>
                                                    handleFolderClick(folder)
                                                }
                                                onDoubleClick={() =>
                                                    handleFolderDoubleClick(
                                                        folder,
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-gray-200 text-xs text-gray-700 uppercase tracking-wide">
                                                        <th className="text-left px-5 py-3 font-medium">
                                                            Name
                                                        </th>
                                                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                                                            Owner
                                                        </th>
                                                        <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                                                            Size
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
                                                    {displayFolders.map(
                                                        (folder) => (
                                                            <FolderRow
                                                                key={folder.id}
                                                                onClick={() =>
                                                                    handleFolderClick(
                                                                        folder,
                                                                    )
                                                                }
                                                                onDoubleClick={() =>
                                                                    handleFolderDoubleClick(
                                                                        folder,
                                                                    )
                                                                }
                                                                folder={folder}
                                                            />
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
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

                        {/* Files — only inside a folder */}
                        {!isRoot && (
                            <section>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                    Files{" "}
                                    <span className="text-gray-400 font-normal normal-case">
                                        ({files?.length ?? 0})
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {files.map((file) => (
                                        <FileCard
                                            key={file.id}
                                            file={file}
                                            selectedFile={selectedFile}
                                            onClick={() =>
                                                handleFileClick(file)
                                            }
                                            onDoubleClick={() =>
                                                handleFileDoubleClick(file)
                                            }
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Pagination — root only */}
                        {isRoot && folders?.last_page > 1 && (
                            <Pagination links={folders.links} meta={folders} />
                        )}
                    </div>

                    {detailsOpen && (
                        <div className="w-80 shrink-0 border-l overflow-y-scroll h-116.25 border-gray-200 p-4">
                            <FileDetailsPanel
                                item={
                                    selectedFolder
                                        ? selectedFolder
                                        : selectedFile
                                }
                                isFolder={selectedFolder ? true : false}
                                onClose={setDetailsOpen}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

FoldersIndex.layout = (page) => <MainLayout>{page}</MainLayout>;

function FolderCard({ folder, selectedFolder, onClick, onDoubleClick }) {
    return (
        <FolderContextMenu>
            <Card
                onDoubleClick={onDoubleClick}
                onClick={onClick}
                className={`cursor-pointer hover:bg-gray-100 py-2 hover:shadow-md transition ${selectedFolder && selectedFolder.id === folder.id && "bg-gray-100"}`}
            >
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div>
                                <Folder
                                    className="w-6 h-6 text-transparent"
                                    fill="gray"
                                />
                            </div>
                            <p className="text-ellipsis text-sm text-nowrap overflow-hidden">
                                {folder.folder_type?.id === 1
                                    ? folder.name
                                    : (folder.case_title ?? folder.name)}
                            </p>
                        </div>
                        {/* <button className="-mr-2 p-2 rounded-full hover:bg-gray-200">
                        <EllipsisVertical className="w-4 h-4 text-gray-700" />
                    </button> */}
                        <FolderMenuDropdown
                            folder={folder}
                            selectedFolder={selectedFolder}
                        />
                    </div>
                </CardContent>
            </Card>
        </FolderContextMenu>
    );
}

function FolderRow({ folder, onClick, onDoubleClick }) {
    return (
        <tr
            onDoubleClick={onDoubleClick}
            onClick={onClick}
            className="hover:bg-gray-50 transition border-b border-gray-200"
        >
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <p className="text-gray-800 ">
                        {" "}
                        {folder.folder_type?.id === 1
                            ? folder.name
                            : (folder.case_title ?? folder.name)}
                    </p>
                </div>
            </td>
            <td className="px-4 py-3.5 text-gray-500  ">{folder.owner}</td>
            <td className="px-4 py-3.5 text-gray-500  ">--</td>
            <td className="px-4 py-3.5 text-gray-400 text-xs  ">
                {folder.created_at
                    ? new Date(folder.created_at).toLocaleDateString(
                          undefined,
                          {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                          },
                      )
                    : "—"}
            </td>
            <td className="py-3.5 pr-10 text-gray-500 text-right">--</td>
        </tr>
    );
}

// function FileRow({ file }) {
//     const download = (id) => window.open(`/box/download/${id}`, "_blank");

//     return (
//         <tr className="hover:bg-gray-50 transition">
//             <td className="px-5 py-3.5">
//                 <div className="flex items-center gap-3">
//                     <span
//                         className={`p-1.5 rounded-lg ${file.is_sealed ? "bg-red-50 text-red-400" : "bg-blue-50 text-blue-500"}`}
//                     >
//                         {file.is_sealed ? (
//                             <Lock size={15} />
//                         ) : (
//                             <FileIcon extension={file.extension} />
//                         )}
//                     </span>
//                     <div>
//                         <p className="font-medium text-gray-800 line-clamp-1">
//                             {file.name}
//                         </p>
//                         <p className="text-xs text-gray-400 uppercase">
//                             .{file.extension}
//                             {file.is_sealed && (
//                                 <span className="ml-2 text-red-400 normal-case font-medium">
//                                     Sealed
//                                 </span>
//                             )}
//                         </p>
//                     </div>
//                 </div>
//             </td>
//             <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">
//                 {file.document_type ?? <span className="text-gray-300">—</span>}
//             </td>
//             <td className="px-4 py-3.5 text-gray-500 hidden sm:table-cell">
//                 {file.size_human}
//             </td>
//             <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">
//                 {file.uploaded_by}
//             </td>
//             <td className="px-4 py-3.5 text-gray-400 text-xs hidden lg:table-cell">
//                 {file.box_modified_at ? (
//                     new Date(file.box_modified_at).toLocaleDateString(
//                         undefined,
//                         { year: "numeric", month: "short", day: "numeric" },
//                     )
//                 ) : (
//                     <span className="text-gray-300">—</span>
//                 )}
//             </td>
//             <td className="px-5 py-3.5 text-right">
//                 {file.is_sealed ? (
//                     <span className="inline-flex items-center gap-1 text-xs text-gray-300 select-none">
//                         <Lock size={13} /> Restricted
//                     </span>
//                 ) : file.download_url ? (
//                     <button
//                         onClick={() => download(file.box_file_id)}
//                         className="text-green-600 hover:underline text-sm"
//                     >
//                         Download
//                     </button>
//                 ) : (
//                     <span className="text-xs text-gray-300">Unavailable</span>
//                 )}
//             </td>
//         </tr>
//     );
// }

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

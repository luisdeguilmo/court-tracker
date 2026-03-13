import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Folder,
    FolderOpen,
    Search,
    FileText,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";

const STATUS_PILL = {
    open: "bg-emerald-100 text-emerald-700",
    closed: "bg-slate-100 text-slate-500",
    pending: "bg-amber-100 text-amber-700",
};

export default function FoldersIndex({ folders, filters }) {
    const [search, setSearch] = useState(filters.search ?? "");

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

    return (
        <>
            <Head title="Folders" />
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-6 py-5">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Case Folders
                            </h1>
                            <p className="text-sm text-gray-400 mt-0.5">
                                {folders.total} folder
                                {folders.total !== 1 ? "s" : ""}
                            </p>
                        </div>

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
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
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
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {folders.data.length === 0 ? (
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
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {folders.data.map((folder) => (
                                <FolderCard key={folder.id} folder={folder} />
                            ))}
                        </div>
                    )}

                    {folders.last_page > 1 && (
                        <Pagination links={folders.links} meta={folders} />
                    )}
                </div>
            </div>
        </>
    );
}

function FolderCard({ folder }) {
    const pill =
        STATUS_PILL[folder.case_status?.toLowerCase()] ??
        "bg-gray-100 text-gray-500";

    return (
        <Link
            href={route("folders.show", folder.id)}
            className="group block bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 overflow-hidden"
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                    <div className="p-2.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                        <Folder size={22} className="text-blue-600" />
                    </div>
                    {folder.case_status && (
                        <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${pill}`}
                        >
                            {folder.case_status}
                        </span>
                    )}
                </div>

                <h3 className="mt-3 font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                    {folder.name}
                </h3>
                {folder.case_number && (
                    <p className="mt-1 text-xs text-gray-400 font-mono">
                        {folder.case_number}
                    </p>
                )}
                {folder.case_title && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                        {folder.case_title}
                    </p>
                )}
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <FileText size={13} />
                    <span>
                        {folder.files_count} file
                        {folder.files_count !== 1 ? "s" : ""}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>{folder.folder_type?.name}</span>
                    <ChevronRight
                        size={14}
                        className="group-hover:text-blue-500 transition"
                    />
                </div>
            </div>
        </Link>
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

import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Folder,
    File,
    FileText,
    Image,
    Film,
    Download,
    Lock,
} from "lucide-react";

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

const STATUS_PILL = {
    open: "bg-emerald-100 text-emerald-700",
    closed: "bg-slate-100 text-slate-500",
    pending: "bg-amber-100 text-amber-700",
};

export default function FoldersShow({ folder, files }) {
    const pill =
        STATUS_PILL[folder.case_status?.toLowerCase()] ??
        "bg-gray-100 text-gray-500";

    return (
        <>
            <Head title={folder.name} />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-5">
                    <div className="max-w-5xl mx-auto">
                        <Link
                            href={route("folders.index")}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition mb-4"
                        >
                            <ArrowLeft size={15} /> Back to Folders
                        </Link>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <Folder size={26} className="text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-2xl font-bold text-gray-900 truncate">
                                        {folder.name}
                                    </h1>
                                    {folder.case_status && (
                                        <span
                                            className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${pill}`}
                                        >
                                            {folder.case_status}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-1 flex items-center gap-3 text-sm text-gray-400 flex-wrap">
                                    {folder.case_number && (
                                        <span className="font-mono">
                                            {folder.case_number}
                                        </span>
                                    )}
                                    {folder.case_title && (
                                        <>
                                            <span className="text-gray-200">
                                                |
                                            </span>
                                            <span>{folder.case_title}</span>
                                        </>
                                    )}
                                    {folder.folder_type && (
                                        <>
                                            <span className="text-gray-200">
                                                |
                                            </span>
                                            <span>
                                                {folder.folder_type.name}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Files */}
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Files{" "}
                        <span className="text-gray-400 font-normal text-base">
                            ({files.length})
                        </span>
                    </h2>

                    {files.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-gray-400">
                            <File
                                size={40}
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
                                        <FileRow key={file.id} file={file} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

FoldersShow.layout = (page) => <MainLayout>{page}</MainLayout>;

function FileRow({ file }) {
    const download = (id) => window.open(`/box/download/${id}`, "_blank");

    return (
        <tr className="hover:bg-gray-50 transition">
            {/* Name */}
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <span
                        className={`p-1.5 rounded-lg ${
                            file.is_sealed
                                ? "bg-red-50 text-red-400"
                                : "bg-blue-50 text-blue-500"
                        }`}
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

            {/* Live Box modified_at */}
            <td className="px-4 py-3.5 text-gray-400 text-xs hidden lg:table-cell">
                {file.box_modified_at ? (
                    new Date(file.box_modified_at).toLocaleDateString(
                        undefined,
                        {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        },
                    )
                ) : (
                    <span className="text-gray-300">—</span>
                )}
            </td>

            {/* Download — uses existing route('box.download', fileId) */}
            <td className="px-5 py-3.5 text-right">
                {file.is_sealed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-300 select-none">
                        <Lock size={13} /> Restricted
                    </span>
                ) : file.download_url ? (
                    // <Link
                    //     href={file.download_url}
                    //     className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition font-medium"
                    // >
                    //     <Download size={15} /> Download
                    // </Link>
                    <button
                        onClick={() => {
                            console.log(file);
                            download(file.box_file_id);
                        }}
                        className="text-green-600 hover:underline"
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

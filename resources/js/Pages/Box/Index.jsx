// resources/js/Pages/Box/FileList.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MainLayout from "@/Layouts/MainLayout";
import { router } from "@inertiajs/react";

export default function Index({ files, folderId }) {
    const openFolder = (id) => router.visit(`/box/files?folder=${id}`);
    const openFile = (fileId) => {
        const url = `https://app.box.com/file/${fileId}`;
        window.open(url, "_blank");
    };

    const download = (id) => window.open(`/box/download/${id}`, "_blank");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📁 Box Files</h1>

            {files.length === 0 ? (
                <p className="text-gray-500">No files in this folder.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2 text-left">Name</th>
                            <th className="border p-2 text-left">Type</th>
                            <th className="border p-2 text-left">Size</th>
                            <th className="border p-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr key={file.id} className="hover:bg-gray-50">
                                <td className="border p-2">{file.name}</td>
                                <td className="border p-2 capitalize">
                                    {file.type}
                                </td>
                                <td className="border p-2">
                                    {file.size
                                        ? `${(file.size / 1024).toFixed(1)} KB`
                                        : "—"}
                                </td>
                                <td className="border p-2">
                                    {file.type === "folder" ? (
                                        <button
                                            onClick={() => openFolder(file.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Open
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    console.log(file.id);
                                                    download(file.id);
                                                }}
                                                className="text-green-600 hover:underline"
                                            >
                                                Download
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openFile(file.id)
                                                }
                                                className="text-blue-600 hover:underline"
                                            >
                                                Open
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;

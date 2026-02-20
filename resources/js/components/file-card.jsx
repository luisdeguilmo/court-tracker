import React from "react";
import {
    EllipsisVertical,
    Folder,
    FileText,
    FileImage,
    FileVideo,
    FileAudio,
    FileSpreadsheet,
    FileArchive,
    File,
} from "lucide-react";

const FileCard = ({ fileName, fileType, fileSize, isFolder = false }) => {
    const renderFileIcon = () => {
        if (isFolder) {
            return <Folder className="w-12 h-12 text-yellow-500" />;
        }

        if (!fileType) {
            return <File className="w-12 h-12 text-gray-400" />;
        }

        if (fileType.startsWith("image/")) {
            return <FileImage className="w-12 h-12 text-purple-500" />;
        }

        if (fileType === "application/pdf") {
            return <FileText className="w-12 h-12 text-red-500" />;
        }

        if (fileType.startsWith("video/")) {
            return <FileVideo className="w-12 h-12 text-blue-500" />;
        }

        if (fileType.startsWith("audio/")) {
            return <FileAudio className="w-12 h-12 text-green-500" />;
        }

        if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
            return <FileSpreadsheet className="w-12 h-12 text-emerald-600" />;
        }

        if (fileType.includes("zip") || fileType.includes("compressed")) {
            return <FileArchive className="w-12 h-12 text-orange-500" />;
        }

        return <File className="w-12 h-12 text-gray-400" />;
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border">
            <div className="flex items-center gap-4">
                {renderFileIcon()}
                <div>
                    <p
                        className="text-gray-800 text-sm font-medium truncate max-w-xs"
                        title={fileName}
                    >
                        {fileName}
                    </p>
                    {!isFolder && (
                        <p className="text-gray-500 text-sm">{fileSize}</p>
                    )}
                </div>
            </div>

            <button
                className="p-2 hover:bg-gray-100 rounded-md transition"
                aria-label="More options"
            >
                <EllipsisVertical className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
};

export default FileCard;

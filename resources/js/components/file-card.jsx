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
import PDFIcon from "../assets/icons/pdf.png";
import ZipIcon from "../assets/icons/zip.png";
import TXTIcon from "../assets/icons/txt.png";
import XLSIcon from "../assets/icons/xls.png";
import PPTXIcon from "../assets/icons/pptx-file.png";
import IMGIcon from "../assets/icons/image.png";
import VideoIcon from "../assets/icons/video.png";
import FolderIcon from "../assets/icons/folder.svg?react";
import FileIcon from "./ui/file-icon";

const FileCard = ({ fileName, fileType, fileSize, isFolder = false }) => {
    const renderFileIcon = () => {
        if (isFolder) {
            return <FolderIcon className="w-8 h-8 text-gray-500" />;
        }

        if (!fileType) {
            return <File className="w-8 h-8 text-gray-400" />;
        }

        if (fileType.startsWith("image/")) {
            return <FileIcon icon={IMGIcon} />;
        }

        if (fileType === "application/pdf") {
            return <FileIcon icon={PDFIcon} />;
        }

        if (fileType.startsWith("video/")) {
            return <FileIcon icon={VideoIcon} />;
        }

        if (fileType.startsWith("audio/")) {
            return <FileAudio className="w-12 h-12 text-green-500" />;
        }

        if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
            return <FileIcon icon={XLSIcon} />;
        }

        if (fileType.includes("zip") || fileType.includes("compressed")) {
            return <FileIcon icon={ZipIcon} />;
        }

        if (fileType.includes("text")) {
            return <FileIcon icon={TXTIcon} />;
        }

        return <File className="w-6 h-6 text-gray-400" />;
    };

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border">
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
                        <p className="text-gray-500 text-xs">{fileSize}</p>
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

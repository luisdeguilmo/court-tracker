"use client";

import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { router } from "@inertiajs/react";

export default function UploadDropzone({
    fileInputRef: externalRef,
    folderId,
    onSuccess,
}) {
    const internalRef = useRef();
    const inputRef = externalRef ?? internalRef;
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleClick = () => {
        inputRef.current?.click();
    };

    // const handleDrop = () => {
    //     e.preventDefault();
    //     const files = e.dataTransfer.files;
    //     console.log(files);
    // };

    console.log(folderId);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        if (folderId) formData.append("folder_id", folderId);

        setError(null);
        setProcessing(true);

        router.post(route("files.store"), formData, {
            forceFormData: true,
            preserveScroll: true,
            onProgress: (p) => setProgress(p),
            onSuccess: () => {
                setProgress(null);
                setProcessing(false);
                if (inputRef.current) inputRef.current.value = "";
                onSuccess?.();
            },
            onError: (errors) => {
                setError(errors.file ?? "Upload failed.");
                setProcessing(false);
            },
        });
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={(e) => e.preventDefault()}
            // onDrop={handleDrop}
            className="
        flex flex-col items-center justify-center
        w-full h-48 cursor-pointer
        rounded-xl border-2 border-dashed
        border-muted-foreground/30
        bg-muted/30
        text-center
        hover:bg-muted/50
        transition
      "
        >
            <div className="mb-3 rounded-lg bg-background p-3 shadow-sm">
                <Upload className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">
                Drag & drop files or folders here
            </p>

            <p className="text-xs text-muted-foreground">
                or click to browse your computer
            </p>

            <input
                ref={inputRef}
                onChange={handleFileChange}
                type="file"
                multiple
                className="hidden"
            />
        </div>
    );
}

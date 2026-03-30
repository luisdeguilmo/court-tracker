import { useRef } from "react";
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function UploadForm({
    fileInputRef: externalRef,
    folderId = null,
    onSuccess,
}) {
    const internalRef = useRef();
    const fileInputRef = externalRef ?? internalRef;
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

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
                if (fileInputRef.current) fileInputRef.current.value = "";
                onSuccess?.();
            },
            onError: (errors) => {
                setError(errors.file ?? "Upload failed.");
                setProcessing(false);
            },
        });
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                disabled={processing}
            />

            {progress && (
                <div className="mt-2">
                    <progress
                        className="w-full h-1 rounded"
                        value={progress.percentage}
                        max="100"
                    >
                        {progress.percentage}%
                    </progress>
                    <p className="text-xs text-gray-500 mt-1">
                        Uploading… {progress.percentage}%
                    </p>
                </div>
            )}

            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}
import { useEffect, useRef } from "react";

function BoxPreviewModal({ fileId, accessToken, onClose }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const preview = new window.Box.Preview();

        preview.show(fileId, accessToken, {
            container: containerRef.current, // ✅ use ref (BEST)
            showDownload: true,
        });

        return () => {
            preview.hide(); // cleanup
        };
    }, [fileId, accessToken]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white w-[80%] h-[80%] rounded-lg overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-10"
                >
                    ✕
                </button>

                <div
                    ref={containerRef}
                    style={{ height: "100%", width: "100%" }}
                />
            </div>
        </div>
    );
}
// import React from "react";
// import {
//     EllipsisVertical,
//     Folder,
//     FileText,
//     FileImage,
//     FileVideo,
//     FileAudio,
//     FileSpreadsheet,
//     FileArchive,
//     File,
// } from "lucide-react";
// import PDFIcon from "../assets/icons/pdf.png";
// import ZipIcon from "../assets/icons/zip.png";
// import TXTIcon from "../assets/icons/txt.png";
// import XLSIcon from "../assets/icons/xls.png";
// // import PPTXIcon from "../assets/icons/pptx-file.png";
// import IMGIcon from "../assets/icons/image.png";
// import VideoIcon from "../assets/icons/video.png";
// import FolderIcon from "../assets/icons/folder.svg?react";
// import FileIcon from "./ui/file-icon";

// const FileCard = ({ fileName, fileType, fileSize, isFolder = false }) => {
//     const renderFileIcon = () => {
//         if (isFolder) {
//             return <FolderIcon className="w-8 h-8 text-gray-500" />;
//         }

//         if (!fileType) {
//             return <File className="w-8 h-8 text-gray-400" />;
//         }

//         if (fileType.startsWith("image/")) {
//             return <FileIcon icon={IMGIcon} />;
//         }

//         if (fileType === "application/pdf") {
//             return <FileIcon icon={PDFIcon} />;
//         }

//         if (fileType.startsWith("video/")) {
//             return <FileIcon icon={VideoIcon} />;
//         }

//         if (fileType.startsWith("audio/")) {
//             return <FileAudio className="w-12 h-12 text-green-500" />;
//         }

//         if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
//             return <FileIcon icon={XLSIcon} />;
//         }

//         if (fileType.includes("zip") || fileType.includes("compressed")) {
//             return <FileIcon icon={ZipIcon} />;
//         }

//         if (fileType.includes("text")) {
//             return <FileIcon icon={TXTIcon} />;
//         }

//         return <File className="w-6 h-6 text-gray-400" />;
//     };

//     return (
//         <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border">
//             <div className="flex items-center gap-4">
//                 {renderFileIcon()}
//                 <div>
//                     <p
//                         className="text-gray-800 text-sm font-medium truncate max-w-xs"
//                         title={fileName}
//                     >
//                         {fileName}
//                     </p>
//                     {!isFolder && (
//                         <p className="text-gray-500 text-xs">{fileSize}</p>
//                     )}
//                 </div>
//             </div>

//             <button
//                 className="p-2 hover:bg-gray-100 rounded-md transition"
//                 aria-label="More options"
//             >
//                 <EllipsisVertical className="w-5 h-5 text-gray-600" />
//             </button>
//         </div>
//     );
// };

// export default FileCard;


// import { useEffect, useRef, useState } from "react";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Lock, FileText, Download, Image, FileSpreadsheet } from "lucide-react";

// const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
// const OFFICE_EXTS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

// function PdfPreview({ url }) {
//   const canvasRef = useRef(null);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     let cancelled = false;
//     async function render() {
//       try {
//         const pdfjsLib = await import("pdfjs-dist");
//         pdfjsLib.GlobalWorkerOptions.workerSrc =
//           `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
//         const pdf = await pdfjsLib.getDocument(url).promise;
//         const page = await pdf.getPage(1);
//         const viewport = page.getViewport({ scale: 1.5 });
//         const canvas = canvasRef.current;
//         if (!canvas || cancelled) return;
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         await page.render({
//           canvasContext: canvas.getContext("2d"),
//           viewport,
//         }).promise;
//       } catch {
//         if (!cancelled) setError(true);
//       }
//     }
//     render();
//     return () => { cancelled = true; };
//   }, [url]);

//   if (error) return <FallbackIcon icon={<FileText size={20} />} label="PDF" />;
//   return (
//     <canvas
//       ref={canvasRef}
//       className="w-full h-full object-contain"
//     />
//   );
// }

// function FallbackIcon({ icon, label }) {
//   return (
//     <div className="flex flex-col items-center text-gray-400 text-sm">
//       {icon}
//       <span className="mt-1">{label}</span>
//     </div>
//   );
// }

// function FilePreview({ file }) {
//   const ext = file.extension?.toLowerCase();
//   const url = file.download_url;

//   if (file.is_sealed) {
//     return <FallbackIcon icon={<Lock size={20} />} label="Sealed File" />;
//   }
//   if (!url) {
//     return <FallbackIcon icon={<FileText size={20} />} label="No Preview" />;
//   }
//   if (IMAGE_EXTS.includes(ext)) {
//     return (
//       <img
//         src={url}
//         alt={file.name}
//         className="w-full h-full object-cover"
//         loading="lazy"
//         onError={(e) => {
//           e.target.replaceWith(
//             Object.assign(document.createElement("div"), {
//               className: "flex items-center justify-center w-full h-full text-gray-400 text-xs",
//               textContent: "No Preview",
//             })
//           );
//         }}
//       />
//     );
//   }
//   if (ext === "pdf") {
//     return <PdfPreview url={url} />;
//   }
//   if (OFFICE_EXTS.includes(ext)) {
//     const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
//     return (
//       <iframe
//         src={viewerUrl}
//         title={file.name}
//         className="w-full h-full pointer-events-none"
//         loading="lazy"
//       />
//     );
//   }
//   return <FallbackIcon icon={<FileText size={20} />} label={`.${ext}`} />;
// }

// function FileCard({ file }) {
//   const download = (id) => window.open(`/box/download/${id}`, "_blank");

//   return (
//     <Card className="group w-[200px] overflow-hidden border border-gray-200 bg-white transition-all duration-200 hover:border-blue-400 hover:shadow-md">
//       {/* Preview */}
//       <div className="w-full bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
//         <FilePreview file={file} />
//       </div>

//       {/* Content */}
//       <CardContent className="px-4 py-3">
//         <h3 className="font-medium text-gray-800 text-sm line-clamp-1">{file.name}</h3>
//         <p className="text-xs text-gray-400 uppercase mt-1">
//           .{file.extension}
//           {file.is_sealed && (
//             <span className="ml-2 text-red-400 normal-case font-medium">Sealed</span>
//           )}
//         </p>
//         <div className="mt-2 text-xs text-gray-500 space-y-0.5">
//           <p>Type: {file.document_type ?? <span className="text-gray-300">—</span>}</p>
//           <p>Size: {file.size_human}</p>
//           <p>By: {file.uploaded_by}</p>
//         </div>
//       </CardContent>

//       {/* Footer */}
//       <CardFooter className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
//         <span className="text-xs text-gray-400">
//           {file.box_modified_at
//             ? new Date(file.box_modified_at).toLocaleDateString(undefined, {
//                 year: "numeric", month: "short", day: "numeric",
//               })
//             : "—"}
//         </span>
//         {file.is_sealed ? (
//           <span className="text-xs text-gray-300 flex items-center gap-1">
//             <Lock size={12} /> Restricted
//           </span>
//         ) : file.download_url ? (
//           <button
//             onClick={() => download(file.box_file_id)}
//             className="flex items-center gap-1 text-green-600 hover:underline text-xs"
//           >
//             <Download size={14} /> Download
//           </button>
//         ) : (
//           <span className="text-xs text-gray-300">Unavailable</span>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }

// export default FileCard;





// import { useEffect, useRef, useState } from "react";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Lock, FileText, Download } from "lucide-react";
// import * as pdfjsLib from "pdfjs-dist";
// import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// // Set worker once at module level
// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
// const OFFICE_EXTS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

// // ─── Fallback Icon ────────────────────────────────────────────────────────────
// function FallbackIcon({ icon, label }) {
//     return (
//         <div className="flex flex-col items-center text-gray-400 text-sm">
//             {icon}
//             <span className="mt-1">{label}</span>
//         </div>
//     );
// }

// // ─── PDF Preview ──────────────────────────────────────────────────────────────
// function PdfPreview({ url }) {
//     const canvasRef = useRef(null);
//     const [error, setError] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         let cancelled = false;

//         async function render() {
//             try {
//                 console.log("[PdfPreview] Loading PDF from:", url);

//                 const loadingTask = pdfjsLib.getDocument({
//                     url,
//                     // Helps with some CORS scenarios
//                     withCredentials: false,
//                 });

//                 const pdf = await loadingTask.promise;
//                 console.log("[PdfPreview] PDF loaded, pages:", pdf.numPages);

//                 const page = await pdf.getPage(1);
//                 console.log("[PdfPreview] Page 1 loaded");

//                 const canvas = canvasRef.current;
//                 if (!canvas || cancelled) return;

//                 const containerWidth = canvas.parentElement?.clientWidth || 320;
//                 const unscaledViewport = page.getViewport({ scale: 1 });
//                 const scale = containerWidth / unscaledViewport.width;
//                 const viewport = page.getViewport({ scale });

//                 canvas.width = viewport.width;
//                 canvas.height = viewport.height;

//                 await page.render({
//                     canvasContext: canvas.getContext("2d"),
//                     viewport,
//                 }).promise;

//                 console.log("[PdfPreview] Render complete");
//                 if (!cancelled) setLoading(false);
//             } catch (err) {
//                 console.error("[PdfPreview] Render failed:", err);
//                 if (!cancelled) {
//                     setError(true);
//                     setLoading(false);
//                 }
//             }
//         }

//         render();
//         return () => {
//             cancelled = true;
//         };
//     }, [url]);

//     if (error) {
//         return <FallbackIcon icon={<FileText size={20} />} label="PDF" />;
//     }

//     return (
//         <div className="relative w-full h-full flex items-center justify-center">
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading PDF…
//                     </span>
//                 </div>
//             )}
//             <canvas
//                 ref={canvasRef}
//                 className="w-full h-full object-contain"
//                 style={{ display: loading ? "none" : "block" }}
//             />
//         </div>
//     );
// }

// // ─── Lazy PDF Preview (only renders when card is in viewport) ─────────────────
// function LazyPdfPreview({ url }) {
//     const wrapperRef = useRef(null);
//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         const el = wrapperRef.current;
//         if (!el) return;

//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 if (entry.isIntersecting) {
//                     setVisible(true);
//                     observer.disconnect();
//                 }
//             },
//             { threshold: 0.1 }
//         );

//         observer.observe(el);
//         return () => observer.disconnect();
//     }, []);

//     return (
//         <div ref={wrapperRef} className="w-full h-full">
//             {visible ? (
//                 <PdfPreview url={url} />
//             ) : (
//                 <div className="flex items-center justify-center w-full h-full">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading…
//                     </span>
//                 </div>
//             )}
//         </div>
//     );
// }

// // ─── File Preview Router ──────────────────────────────────────────────────────
// function FilePreview({ file }) {
//     const ext = file.extension?.toLowerCase();
//     const url = file.download_url;

//     if (file.is_sealed) {
//         return <FallbackIcon icon={<Lock size={20} />} label="Sealed File" />;
//     }

//     if (!url) {
//         return <FallbackIcon icon={<FileText size={20} />} label="No Preview" />;
//     }

//     if (IMAGE_EXTS.includes(ext)) {
//         return (
//             <img
//                 src={url}
//                 alt={file.name}
//                 className="w-full h-full object-cover"
//                 loading="lazy"
//                 onError={(e) => {
//                     e.currentTarget.style.display = "none";
//                     e.currentTarget.insertAdjacentHTML(
//                         "afterend",
//                         `<div class="flex flex-col items-center text-gray-400 text-sm">
//                             <span>No Preview</span>
//                         </div>`
//                     );
//                 }}
//             />
//         );
//     }

//     if (ext === "pdf") {
//         return <LazyPdfPreview url={url} />;
//     }

//     if (OFFICE_EXTS.includes(ext)) {
//         const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
//         return (
//             <iframe
//                 src={viewerUrl}
//                 title={file.name}
//                 className="w-full h-full pointer-events-none"
//                 loading="lazy"
//             />
//         );
//     }

//     return (
//         <FallbackIcon icon={<FileText size={20} />} label={`.${ext ?? "file"}`} />
//     );
// }

// // ─── File Card ────────────────────────────────────────────────────────────────
// function FileCard({ file }) {
//     const download = (id) => window.open(`/box/download/${id}`, "_blank");

//     return (
//         <Card className="group w-[200px] overflow-hidden border border-gray-200 bg-white transition-all duration-200 hover:border-blue-400 hover:shadow-md">
//             {/* Preview */}
//             <div className="w-full bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
//                 <FilePreview file={file} />
//             </div>

//             {/* Content */}
//             <CardContent className="px-4 py-3">
//                 <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
//                     {file.name}
//                 </h3>
//                 <p className="text-xs text-gray-400 uppercase mt-1">
//                     .{file.extension}
//                     {file.is_sealed && (
//                         <span className="ml-2 text-red-400 normal-case font-medium">
//                             Sealed
//                         </span>
//                     )}
//                 </p>
//                 <div className="mt-2 text-xs text-gray-500 space-y-0.5">
//                     <p>
//                         Type:{" "}
//                         {file.document_type ?? (
//                             <span className="text-gray-300">—</span>
//                         )}
//                     </p>
//                     <p>Size: {file.size_human}</p>
//                     <p>By: {file.uploaded_by}</p>
//                 </div>
//             </CardContent>

//             {/* Footer */}
//             <CardFooter className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
//                 <span className="text-xs text-gray-400">
//                     {file.box_modified_at
//                         ? new Date(file.box_modified_at).toLocaleDateString(
//                               undefined,
//                               {
//                                   year: "numeric",
//                                   month: "short",
//                                   day: "numeric",
//                               }
//                           )
//                         : "—"}
//                 </span>
//                 {file.is_sealed ? (
//                     <span className="text-xs text-gray-300 flex items-center gap-1">
//                         <Lock size={12} /> Restricted
//                     </span>
//                 ) : file.download_url ? (
//                     <button
//                         onClick={() => download(file.box_file_id)}
//                         className="flex items-center gap-1 text-green-600 hover:underline text-xs"
//                     >
//                         <Download size={14} />
//                         Download
//                     </button>
//                 ) : (
//                     <span className="text-xs text-gray-300">Unavailable</span>
//                 )}
//             </CardFooter>
//         </Card>
//     );
// }

// export default FileCard;




// import { useEffect, useRef, useState } from "react";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Lock, FileText, Download } from "lucide-react";
// import * as pdfjsLib from "pdfjs-dist";
// import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// // Set worker once at module level
// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
// const OFFICE_EXTS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

// // ─── Fallback Icon ────────────────────────────────────────────────────────────
// function FallbackIcon({ icon, label }) {
//     return (
//         <div className="flex flex-col items-center text-gray-400 text-sm">
//             {icon}
//             <span className="mt-1">{label}</span>
//         </div>
//     );
// }

// // ─── PDF Preview ──────────────────────────────────────────────────────────────
// function PdfPreview({ url }) {
//     const canvasRef = useRef(null);
//     const [error, setError] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         let cancelled = false;

//         async function render() {
//             try {
//                 console.log("[PdfPreview] Loading PDF from:", url);

//                 const loadingTask = pdfjsLib.getDocument({
//                     url,
//                     // Helps with some CORS scenarios
//                     withCredentials: false,
//                 });

//                 const pdf = await loadingTask.promise;
//                 console.log("[PdfPreview] PDF loaded, pages:", pdf.numPages);

//                 const page = await pdf.getPage(1);
//                 console.log("[PdfPreview] Page 1 loaded");

//                 const canvas = canvasRef.current;
//                 if (!canvas || cancelled) return;

//                 const containerWidth = canvas.parentElement?.clientWidth || 320;
//                 const unscaledViewport = page.getViewport({ scale: 1 });
//                 // Zoom factor: 2.5× makes the content noticeably larger inside the card preview
//                 const scale = (containerWidth / unscaledViewport.width) * 2.5;
//                 const viewport = page.getViewport({ scale });

//                 canvas.width = viewport.width;
//                 canvas.height = viewport.height;

//                 await page.render({
//                     canvasContext: canvas.getContext("2d"),
//                     viewport,
//                 }).promise;

//                 console.log("[PdfPreview] Render complete");
//                 if (!cancelled) setLoading(false);
//             } catch (err) {
//                 console.error("[PdfPreview] Render failed:", err);
//                 if (!cancelled) {
//                     setError(true);
//                     setLoading(false);
//                 }
//             }
//         }

//         render();
//         return () => {
//             cancelled = true;
//         };
//     }, [url]);

//     if (error) {
//         return <FallbackIcon icon={<FileText size={20} />} label="PDF" />;
//     }

//     return (
//         <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading PDF…
//                     </span>
//                 </div>
//             )}
//             <canvas
//                 ref={canvasRef}
//                 className="w-full h-full object-cover"
//                 style={{ display: loading ? "none" : "block" }}
//             />
//         </div>
//     );
// }

// // ─── Lazy PDF Preview (only renders when card is in viewport) ─────────────────
// function LazyPdfPreview({ url }) {
//     const wrapperRef = useRef(null);
//     const [visible, setVisible] = useState(false);

//     useEffect(() => {
//         const el = wrapperRef.current;
//         if (!el) return;

//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 if (entry.isIntersecting) {
//                     setVisible(true);
//                     observer.disconnect();
//                 }
//             },
//             { threshold: 0.1 }
//         );

//         observer.observe(el);
//         return () => observer.disconnect();
//     }, []);

//     return (
//         <div ref={wrapperRef} className="w-full h-full">
//             {visible ? (
//                 <PdfPreview url={url} />
//             ) : (
//                 <div className="flex items-center justify-center w-full h-full">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading…
//                     </span>
//                 </div>
//             )}
//         </div>
//     );
// }

// // ─── File Preview Router ──────────────────────────────────────────────────────
// function FilePreview({ file }) {
//     const ext = file.extension?.toLowerCase();
//     const url = file.download_url;

//     if (file.is_sealed) {
//         return <FallbackIcon icon={<Lock size={20} />} label="Sealed File" />;
//     }

//     if (!url) {
//         return <FallbackIcon icon={<FileText size={20} />} label="No Preview" />;
//     }

//     if (IMAGE_EXTS.includes(ext)) {
//         return (
//             <img
//                 src={url}
//                 alt={file.name}
//                 className="w-full h-full object-cover"
//                 loading="lazy"
//                 onError={(e) => {
//                     e.currentTarget.style.display = "none";
//                     e.currentTarget.insertAdjacentHTML(
//                         "afterend",
//                         `<div class="flex flex-col items-center text-gray-400 text-sm">
//                             <span>No Preview</span>
//                         </div>`
//                     );
//                 }}
//             />
//         );
//     }

//     if (ext === "pdf") {
//         return <LazyPdfPreview url={url} />;
//     }

//     if (OFFICE_EXTS.includes(ext)) {
//         const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
//         return (
//             <iframe
//                 src={viewerUrl}
//                 title={file.name}
//                 className="w-full h-full pointer-events-none"
//                 loading="lazy"
//             />
//         );
//     }

//     return (
//         <FallbackIcon icon={<FileText size={20} />} label={`.${ext ?? "file"}`} />
//     );
// }

// // ─── File Card ────────────────────────────────────────────────────────────────
// function FileCard({ file }) {
//     const download = (id) => window.open(`/box/download/${id}`, "_blank");

//     return (
//         <Card className="group w-[200px] overflow-hidden border border-gray-200 bg-white transition-all duration-200 hover:border-blue-400 hover:shadow-md">
//             {/* Preview */}
//             <div className="w-full bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
//                 <FilePreview file={file} />
//             </div>

//             {/* Content */}
//             <CardContent className="px-4 py-3">
//                 <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
//                     {file.name}
//                 </h3>
//                 <p className="text-xs text-gray-400 uppercase mt-1">
//                     .{file.extension}
//                     {file.is_sealed && (
//                         <span className="ml-2 text-red-400 normal-case font-medium">
//                             Sealed
//                         </span>
//                     )}
//                 </p>
//                 <div className="mt-2 text-xs text-gray-500 space-y-0.5">
//                     <p>
//                         Type:{" "}
//                         {file.document_type ?? (
//                             <span className="text-gray-300">—</span>
//                         )}
//                     </p>
//                     <p>Size: {file.size_human}</p>
//                     <p>By: {file.uploaded_by}</p>
//                 </div>
//             </CardContent>

//             {/* Footer */}
//             <CardFooter className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
//                 <span className="text-xs text-gray-400">
//                     {file.box_modified_at
//                         ? new Date(file.box_modified_at).toLocaleDateString(
//                               undefined,
//                               {
//                                   year: "numeric",
//                                   month: "short",
//                                   day: "numeric",
//                               }
//                           )
//                         : "—"}
//                 </span>
//                 {file.is_sealed ? (
//                     <span className="text-xs text-gray-300 flex items-center gap-1">
//                         <Lock size={12} /> Restricted
//                     </span>
//                 ) : file.download_url ? (
//                     <button
//                         onClick={() => download(file.box_file_id)}
//                         className="flex items-center gap-1 text-green-600 hover:underline text-xs"
//                     >
//                         <Download size={14} />
//                         Download
//                     </button>
//                 ) : (
//                     <span className="text-xs text-gray-300">Unavailable</span>
//                 )}
//             </CardFooter>
//         </Card>
//     );
// }

// export default FileCard;








import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Lock, FileText, Download } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Set worker once at module level
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
const OFFICE_EXTS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

// ─── Fallback Icon ────────────────────────────────────────────────────────────
function FallbackIcon({ icon, label }) {
    return (
        <div className="flex flex-col items-center text-gray-400 text-sm">
            {icon}
            <span className="mt-1">{label}</span>
        </div>
    );
}

// ─── PDF Preview ──────────────────────────────────────────────────────────────
function PdfPreview({ url }) {
    const canvasRef = useRef(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function render() {
            try {
                console.log("[PdfPreview] Loading PDF from:", url);

                const loadingTask = pdfjsLib.getDocument({
                    url,
                    // Helps with some CORS scenarios
                    withCredentials: false,
                });

                const pdf = await loadingTask.promise;
                console.log("[PdfPreview] PDF loaded, pages:", pdf.numPages);

                const page = await pdf.getPage(1);
                console.log("[PdfPreview] Page 1 loaded");

                const canvas = canvasRef.current;
                if (!canvas || cancelled) return;

                const containerWidth = canvas.parentElement?.clientWidth || 320;
                const unscaledViewport = page.getViewport({ scale: 1 });
                // Zoom factor: 2.5× makes the content noticeably larger inside the card preview
                const scale = (containerWidth / unscaledViewport.width) * 2.5;
                const viewport = page.getViewport({ scale });

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: canvas.getContext("2d"),
                    viewport,
                }).promise;

                console.log("[PdfPreview] Render complete");
                if (!cancelled) setLoading(false);
            } catch (err) {
                console.error("[PdfPreview] Render failed:", err);
                if (!cancelled) {
                    setError(true);
                    setLoading(false);
                }
            }
        }

        render();
        return () => {
            cancelled = true;
        };
    }, [url]);

    if (error) {
        return <FallbackIcon icon={<FileText size={20} />} label="PDF" />;
    }

    return (
        <div className="relative w-full h-full overflow-hidden">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-xs text-gray-400 animate-pulse">
                        Loading PDF…
                    </span>
                </div>
            )}
            <canvas
                ref={canvasRef}
                style={{
                    display: loading ? "none" : "block",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "auto",
                }}
            />
        </div>
    );
}

// ─── Lazy PDF Preview (only renders when card is in viewport) ─────────────────
function LazyPdfPreview({ url }) {
    const wrapperRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={wrapperRef} className="w-full h-full">
            {visible ? (
                <PdfPreview url={url} />
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <span className="text-xs text-gray-400 animate-pulse">
                        Loading…
                    </span>
                </div>
            )}
        </div>
    );
}

// ─── File Preview Router ──────────────────────────────────────────────────────
function FilePreview({ file }) {
    const ext = file.extension?.toLowerCase();
    const url = file.download_url;

    if (file.is_sealed) {
        return <FallbackIcon icon={<Lock size={20} />} label="Sealed File" />;
    }

    if (!url) {
        return <FallbackIcon icon={<FileText size={20} />} label="No Preview" />;
    }

    if (IMAGE_EXTS.includes(ext)) {
        return (
            <img
                src={url}
                alt={file.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.insertAdjacentHTML(
                        "afterend",
                        `<div class="flex flex-col items-center text-gray-400 text-sm">
                            <span>No Preview</span>
                        </div>`
                    );
                }}
            />
        );
    }

    if (ext === "pdf") {
        return <LazyPdfPreview url={url} />;
    }

    if (OFFICE_EXTS.includes(ext)) {
        const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
        return (
            <iframe
                src={viewerUrl}
                title={file.name}
                className="w-full h-full pointer-events-none"
                loading="lazy"
            />
        );
    }

    return (
        <FallbackIcon icon={<FileText size={20} />} label={`.${ext ?? "file"}`} />
    );
}

// ─── File Card ────────────────────────────────────────────────────────────────
function FileCard({ file }) {
    const download = (id) => window.open(`/box/download/${id}`, "_blank");

    return (
        <Card className="group overflow-hidden border border-gray-200 bg-white transition-all duration-200 hover:border-blue-400 hover:shadow-md">
            {/* Preview */}
            <div className="w-full bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
                <FilePreview file={file} />
            </div>

            {/* Content */}
            <CardContent className="px-4 py-3">
                <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
                    {file.name}
                </h3>
                <p className="text-xs text-gray-400 uppercase mt-1">
                    .{file.extension}
                    {file.is_sealed && (
                        <span className="ml-2 text-red-400 normal-case font-medium">
                            Sealed
                        </span>
                    )}
                </p>
                <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                    <p>
                        Type:{" "}
                        {file.document_type ?? (
                            <span className="text-gray-300">—</span>
                        )}
                    </p>
                    <p>Size: {file.size_human}</p>
                    <p>By: {file.uploaded_by}</p>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                    {file.box_modified_at
                        ? new Date(file.box_modified_at).toLocaleDateString(
                              undefined,
                              {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                              }
                          )
                        : "—"}
                </span>
                {file.is_sealed ? (
                    <span className="text-xs text-gray-300 flex items-center gap-1">
                        <Lock size={12} /> Restricted
                    </span>
                ) : file.download_url ? (
                    <button
                        onClick={() => download(file.box_file_id)}
                        className="flex items-center gap-1 text-green-600 hover:underline text-xs"
                    >
                        <Download size={14} />
                        Download
                    </button>
                ) : (
                    <span className="text-xs text-gray-300">Unavailable</span>
                )}
            </CardFooter>
        </Card>
    );
}

export default FileCard;

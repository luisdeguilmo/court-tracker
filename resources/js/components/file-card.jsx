// import { useEffect, useRef, useState } from "react";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Lock, FileText, Download } from "lucide-react";
// import * as pdfjsLib from "pdfjs-dist";
// import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
// import { renderAsync } from "docx-preview";
// import ExcelJS from "exceljs";

// // Set worker once at module level
// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

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
//                 const loadingTask = pdfjsLib.getDocument({
//                     url,
//                     withCredentials: false,
//                 });
//                 const pdf = await loadingTask.promise;
//                 const page = await pdf.getPage(1);
//                 const canvas = canvasRef.current;
//                 if (!canvas || cancelled) return;

//                 const containerWidth = canvas.parentElement?.clientWidth || 320;
//                 const unscaledViewport = page.getViewport({ scale: 1 });
//                 const scale = (containerWidth / unscaledViewport.width) * 2.5;
//                 const viewport = page.getViewport({ scale });

//                 canvas.width = viewport.width;
//                 canvas.height = viewport.height;

//                 await page.render({
//                     canvasContext: canvas.getContext("2d"),
//                     viewport,
//                 }).promise;
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

//     if (error)
//         return <FallbackIcon icon={<FileText size={20} />} label="PDF" />;

//     return (
//         <div className="relative w-full h-full overflow-hidden">
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading PDF…
//                     </span>
//                 </div>
//             )}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     display: loading ? "none" : "block",
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "auto",
//                 }}
//             />
//         </div>
//     );
// }

// // ─── Lazy wrapper (only renders when in viewport) ─────────────────────────────
// function LazyPreview({ url, Component }) {
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
//             { threshold: 0.1 },
//         );
//         observer.observe(el);
//         return () => observer.disconnect();
//     }, []);

//     return (
//         <div ref={wrapperRef} className="w-full h-full">
//             {visible ? (
//                 <Component url={url} />
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

// // ─── DOCX Preview ─────────────────────────────────────────────────────────────
// function DocxPreview({ url }) {
//     const containerRef = useRef(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     useEffect(() => {
//         let cancelled = false;

//         async function render() {
//             try {
//                 const res = await fetch(url, { credentials: "include" });
//                 if (!res.ok) throw new Error(`HTTP ${res.status}`);
//                 const arrayBuffer = await res.arrayBuffer();

//                 if (!cancelled && containerRef.current) {
//                     await renderAsync(
//                         arrayBuffer,
//                         containerRef.current,
//                         undefined,
//                         {
//                             className: "docx-preview",
//                             inWrapper: false,
//                             ignoreWidth: false,
//                             ignoreHeight: false,
//                             ignoreFonts: false,
//                             breakPages: false,
//                             useBase64URL: true,
//                             renderHeaders: true,
//                             renderFooters: true,
//                             renderFootnotes: true,
//                         },
//                     );
//                     if (!cancelled) setLoading(false);
//                 }
//             } catch (err) {
//                 console.error("[DocxPreview] Failed:", err);
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

//     if (error)
//         return <FallbackIcon icon={<FileText size={20} />} label="DOCX" />;

//     return (
//         <div className="relative w-full h-full overflow-hidden bg-white">
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading DOCX…
//                     </span>
//                 </div>
//             )}
//             <div
//                 ref={containerRef}
//                 style={{
//                     pointerEvents: "none",
//                     transform: "scale(0.35)",
//                     transformOrigin: "top left",
//                     width: "270%",
//                     height: "270%",
//                     overflow: "hidden",
//                 }}
//             />
//         </div>
//     );
// }

// // ─── Helpers for ExcelJS canvas rendering ────────────────────────────────────

// function excelColorToCss(color, defaultColor = "#000000") {
//     if (!color) return defaultColor;
//     if (color.argb) {
//         const hex = color.argb; // "FFRRGGBB"
//         const a = parseInt(hex.slice(0, 2), 16) / 255;
//         const r = parseInt(hex.slice(2, 4), 16);
//         const g = parseInt(hex.slice(4, 6), 16);
//         const b = parseInt(hex.slice(6, 8), 16);
//         return `rgba(${r},${g},${b},${a})`;
//     }
//     return defaultColor;
// }

// const DEFAULT_COL_PX = 52;
// const DEFAULT_ROW_PX = 16;
// const CHAR_TO_PX = 6.5;

// function colWidthToPx(w) {
//     return w ? Math.round(w * CHAR_TO_PX) : DEFAULT_COL_PX;
// }
// function rowHeightToPx(h) {
//     return h ? Math.round(h * 1.2) : DEFAULT_ROW_PX;
// }

// async function renderWorkbookToCanvas(workbook, canvas) {
//     const worksheet = workbook.worksheets[0];
//     if (!worksheet) return;

//     // ── Merge map ──────────────────────────────────────────────────────────
//     const mergeMap = {};
//     const skipSet = new Set();

//     const merges = worksheet.model?.merges ?? [];
//     for (const rangeStr of merges) {
//         const [start, end] = rangeStr.split(":");
//         if (!end) continue;
//         const sc = worksheet.getCell(start);
//         const ec = worksheet.getCell(end);
//         const r1 = sc.row,
//             c1 = sc.col,
//             r2 = ec.row,
//             c2 = ec.col;
//         mergeMap[`${r1},${c1}`] = { rows: r2 - r1 + 1, cols: c2 - c1 + 1 };
//         for (let r = r1; r <= r2; r++)
//             for (let c = c1; c <= c2; c++)
//                 if (r !== r1 || c !== c1) skipSet.add(`${r},${c}`);
//     }

//     // ── Dimensions ────────────────────────────────────────────────────────
//     const maxRow = Math.min(worksheet.rowCount || 50, 100);
//     const maxCol = Math.min(worksheet.columnCount || 20, 30);

//     const colWidths = [];
//     for (let c = 1; c <= maxCol; c++) {
//         colWidths.push(colWidthToPx(worksheet.getColumn(c).width));
//     }
//     const colX = [0];
//     for (let c = 0; c < maxCol; c++) colX.push(colX[c] + colWidths[c]);

//     const rowHeights = [];
//     for (let r = 1; r <= maxRow; r++) {
//         rowHeights.push(rowHeightToPx(worksheet.getRow(r).height));
//     }
//     const rowY = [0];
//     for (let r = 0; r < maxRow; r++) rowY.push(rowY[r] + rowHeights[r]);

//     const totalW = colX[maxCol];
//     const totalH = rowY[maxRow];

//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = totalW * dpr;
//     canvas.height = totalH * dpr;
//     canvas.style.width = `${totalW}px`;
//     canvas.style.height = `${totalH}px`;

//     const ctx = canvas.getContext("2d");
//     ctx.scale(dpr, dpr);
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(0, 0, totalW, totalH);

//     // ── Grid lines (drawn first, behind cells) ─────────────────────────────
//     ctx.strokeStyle = "#e5e7eb";
//     ctx.lineWidth = 0.5;
//     for (let c = 0; c <= maxCol; c++) {
//         ctx.beginPath();
//         ctx.moveTo(colX[c], 0);
//         ctx.lineTo(colX[c], totalH);
//         ctx.stroke();
//     }
//     for (let r = 0; r <= maxRow; r++) {
//         ctx.beginPath();
//         ctx.moveTo(0, rowY[r]);
//         ctx.lineTo(totalW, rowY[r]);
//         ctx.stroke();
//     }

//     // ── Cells ─────────────────────────────────────────────────────────────
//     for (let r = 1; r <= maxRow; r++) {
//         for (let c = 1; c <= maxCol; c++) {
//             const key = `${r},${c}`;
//             if (skipSet.has(key)) continue;

//             const cell = worksheet.getRow(r).getCell(c);
//             const merge = mergeMap[key];

//             const x = colX[c - 1];
//             const y = rowY[r - 1];
//             const w = merge
//                 ? colX[c - 1 + merge.cols] - colX[c - 1]
//                 : colWidths[c - 1];
//             const h = merge
//                 ? rowY[r - 1 + merge.rows] - rowY[r - 1]
//                 : rowHeights[r - 1];

//             // Fill
//             const fill = cell.fill;
//             if (fill?.type === "pattern" && fill.fgColor) {
//                 const bg = excelColorToCss(fill.fgColor, null);
//                 if (bg) {
//                     ctx.fillStyle = bg;
//                     ctx.fillRect(x, y, w, h);
//                 }
//             }

//             // Borders
//             const border = cell.border || {};
//             const drawBorder = (side, x1, y1, x2, y2) => {
//                 if (!border[side]) return;
//                 ctx.strokeStyle = excelColorToCss(
//                     border[side].color,
//                     "#cccccc",
//                 );
//                 ctx.lineWidth = border[side].style === "thick" ? 2 : 1;
//                 ctx.beginPath();
//                 ctx.moveTo(x1, y1);
//                 ctx.lineTo(x2, y2);
//                 ctx.stroke();
//             };
//             drawBorder("top", x, y, x + w, y);
//             drawBorder("bottom", x, y + h, x + w, y + h);
//             drawBorder("left", x, y, x, y + h);
//             drawBorder("right", x + w, y, x + w, y + h);

//             // Text
//             const rawValue = cell.value;
//             if (rawValue === null || rawValue === undefined) continue;

//             let text = "";
//             if (typeof rawValue === "object" && rawValue?.richText)
//                 text = rawValue.richText.map((rt) => rt.text).join("");
//             else if (
//                 typeof rawValue === "object" &&
//                 rawValue?.result !== undefined
//             )
//                 text = String(rawValue.result);
//             else text = String(rawValue);

//             if (!text) continue;

//             const font = cell.font || {};
//             const fontSize = font.size ? font.size * 0.75 : 7;
//             const fontWeight = font.bold ? "bold" : "normal";
//             const fontStyle = font.italic ? "italic" : "normal";
//             ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px Arial`;
//             ctx.fillStyle = excelColorToCss(font.color, "#000000");

//             const alignment = cell.alignment || {};
//             const hAlign = alignment.horizontal || "left";
//             const vAlign = alignment.vertical || "middle";

//             ctx.textAlign =
//                 hAlign === "center"
//                     ? "center"
//                     : hAlign === "right"
//                       ? "right"
//                       : "left";
//             ctx.textBaseline =
//                 vAlign === "middle"
//                     ? "middle"
//                     : vAlign === "bottom"
//                       ? "bottom"
//                       : "top";

//             const padX = 2;
//             const textX =
//                 hAlign === "center"
//                     ? x + w / 2
//                     : hAlign === "right"
//                       ? x + w - padX
//                       : x + padX;
//             const textY =
//                 vAlign === "middle"
//                     ? y + h / 2
//                     : vAlign === "bottom"
//                       ? y + h - 1
//                       : y + 1;

//             ctx.save();
//             ctx.beginPath();
//             ctx.rect(x, y, w, h);
//             ctx.clip();
//             ctx.fillText(text, textX, textY);
//             ctx.restore();
//         }
//     }
// }

// // ─── XLSX Preview (ExcelJS → Canvas, scaled thumbnail) ───────────────────────
// function XlsxPreview({ url }) {
//     const canvasRef = useRef(null);
//     const wrapperRef = useRef(null);
//     const [error, setError] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         let cancelled = false;

//         async function render() {
//             try {
//                 const res = await fetch(url, { credentials: "include" });
//                 if (!res.ok) throw new Error(`HTTP ${res.status}`);
//                 const arrayBuffer = await res.arrayBuffer();

//                 const workbook = new ExcelJS.Workbook();
//                 await workbook.xlsx.load(arrayBuffer);

//                 if (!cancelled && canvasRef.current) {
//                     await renderWorkbookToCanvas(workbook, canvasRef.current);

//                     // Scale canvas down to fit the card thumbnail
//                     const canvasW =
//                         parseFloat(canvasRef.current.style.width) ||
//                         canvasRef.current.width;
//                     const containerW = wrapperRef.current?.clientWidth || 300;
//                     const scale = containerW / canvasW;
//                     const canvasH =
//                         parseFloat(canvasRef.current.style.height) ||
//                         canvasRef.current.height;

//                     canvasRef.current.style.transform = `scale(${scale})`;
//                     canvasRef.current.style.transformOrigin = "top left";

//                     if (wrapperRef.current) {
//                         wrapperRef.current.style.height = `${canvasH * scale}px`;
//                     }

//                     if (!cancelled) setLoading(false);
//                 }
//             } catch (err) {
//                 console.error("[XlsxPreview] ExcelJS render failed:", err);
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

//     if (error)
//         return <FallbackIcon icon={<FileText size={20} />} label="XLSX" />;

//     return (
//         <div
//             ref={wrapperRef}
//             className="relative w-full overflow-hidden bg-white"
//         >
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading XLSX…
//                     </span>
//                 </div>
//             )}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     display: loading ? "none" : "block",
//                     pointerEvents: "none",
//                 }}
//             />
//         </div>
//     );
// }

// // ─── File Preview Router ──────────────────────────────────────────────────────
// function FilePreview({ file }) {
//     const ext = file.extension?.toLowerCase();
//     const url = file.download_url;

//     if (file.is_sealed)
//         return <FallbackIcon icon={<Lock size={20} />} label="Sealed File" />;
//     if (!url)
//         return (
//             <FallbackIcon icon={<FileText size={20} />} label="No Preview" />
//         );

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
//                         `<div class="flex flex-col items-center text-gray-400 text-sm"><span>No Preview</span></div>`,
//                     );
//                 }}
//             />
//         );
//     }

//     if (ext === "pdf") return <LazyPreview url={url} Component={PdfPreview} />;
//     if (ext === "docx" || ext === "doc")
//         return <LazyPreview url={url} Component={DocxPreview} />;
//     if (ext === "xlsx" || ext === "xls")
//         return <LazyPreview url={url} Component={XlsxPreview} />;
//     if (ext === "pptx" || ext === "ppt")
//         return <FallbackIcon icon={<FileText size={20} />} label={`.${ext}`} />;

//     return (
//         <FallbackIcon
//             icon={<FileText size={20} />}
//             label={`.${ext ?? "file"}`}
//         />
//     );
// }

// // ─── File Card ────────────────────────────────────────────────────────────────
// function FileCard({ file }) {
//     const download = (id) => window.open(`/box/download/${id}`, "_blank");

//     const handleCardClick = () => {
//         if (!file.download_url || file.is_sealed) return;

//         const encoded = encodeURIComponent(file.download_url);

//         if (ext === "xlsx" || ext === "xls") {
//             window.open(
//                 `https://docs.google.com/spreadsheets/d/open?url=${encoded}`,
//                 "_blank",
//             );
//         } else if (ext === "docx" || ext === "doc") {
//             window.open(
//                 `https://docs.google.com/document/d/open?url=${encoded}`,
//                 "_blank",
//             );
//         }
//     };

//     return (
//         <Card
//             onClick={handleCardClick}
//             className="group overflow-hidden border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-blue-400 hover:shadow-md"
//         >
//             <div className="w-full bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
//                 <FilePreview file={file} />
//             </div>

//             <CardContent className="py-3">
//                 <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
//                     {file.name}
//                 </h3>
//                 <p className="text-xs text-gray-400 mt-1">
//                     {/* .{file.extension} */}
//                     <span className="text-xs text-gray-400">
//                         {file.box_modified_at
//                             ? new Date(file.box_modified_at).toLocaleDateString(
//                                   undefined,
//                                   {
//                                       year: "numeric",
//                                       month: "short",
//                                       day: "numeric",
//                                   },
//                               )
//                             : "—"}
//                     </span>
//                     {/* {file.is_sealed && (
//                         <span className="ml-2 text-red-400 normal-case font-medium">
//                             Sealed
//                         </span>
//                     )} */}
//                 </p>
//                 {/* <div className="mt-2 text-xs text-gray-500 space-y-0.5">
//                     <p>
//                         Type:{" "}
//                         {file.document_type ?? (
//                             <span className="text-gray-300">—</span>
//                         )}
//                     </p>
//                     <p>Size: {file.size_human}</p>
//                     <p>By: {file.uploaded_by}</p>
//                 </div> */}
//             </CardContent>

//             <CardFooter className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
//                 <span className="text-xs text-gray-400">
//                     {file.box_modified_at
//                         ? new Date(file.box_modified_at).toLocaleDateString(undefined, {
//                               year: "numeric",
//                               month: "short",
//                               day: "numeric",
//                           })
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
//                         <Download size={14} /> Download
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
// import { renderAsync } from "docx-preview";
// import ExcelJS from "exceljs";

// // Set worker once at module level
// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

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
//                 const loadingTask = pdfjsLib.getDocument({
//                     url,
//                     withCredentials: false,
//                 });
//                 const pdf = await loadingTask.promise;
//                 const page = await pdf.getPage(1);
//                 const canvas = canvasRef.current;
//                 if (!canvas || cancelled) return;

//                 const containerWidth = canvas.parentElement?.clientWidth || 320;
//                 const unscaledViewport = page.getViewport({ scale: 1 });
//                 const scale = (containerWidth / unscaledViewport.width) * 2.5;
//                 const viewport = page.getViewport({ scale });

//                 canvas.width = viewport.width;
//                 canvas.height = viewport.height;

//                 await page.render({
//                     canvasContext: canvas.getContext("2d"),
//                     viewport,
//                 }).promise;
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

//     if (error)
//         return <FallbackIcon icon={<FileText size={20} />} label="PDF" />;

//     return (
//         <div className="relative w-full h-full overflow-hidden">
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading PDF…
//                     </span>
//                 </div>
//             )}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     display: loading ? "none" : "block",
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "auto",
//                 }}
//             />
//         </div>
//     );
// }

// // ─── Lazy wrapper (only renders when in viewport) ─────────────────────────────
// function LazyPreview({ url, Component }) {
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
//             { threshold: 0.1 },
//         );
//         observer.observe(el);
//         return () => observer.disconnect();
//     }, []);

//     return (
//         <div ref={wrapperRef} className="w-full h-full">
//             {visible ? (
//                 <Component url={url} />
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

// // ─── DOCX Preview ─────────────────────────────────────────────────────────────
// function DocxPreview({ url }) {
//     const containerRef = useRef(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     useEffect(() => {
//         let cancelled = false;

//         async function render() {
//             try {
//                 const res = await fetch(url, { credentials: "include" });
//                 if (!res.ok) throw new Error(`HTTP ${res.status}`);
//                 const arrayBuffer = await res.arrayBuffer();

//                 if (!cancelled && containerRef.current) {
//                     await renderAsync(
//                         arrayBuffer,
//                         containerRef.current,
//                         undefined,
//                         {
//                             className: "docx-preview",
//                             inWrapper: false,
//                             ignoreWidth: false,
//                             ignoreHeight: false,
//                             ignoreFonts: false,
//                             breakPages: false,
//                             useBase64URL: true,
//                             renderHeaders: true,
//                             renderFooters: true,
//                             renderFootnotes: true,
//                         },
//                     );
//                     if (!cancelled) setLoading(false);
//                 }
//             } catch (err) {
//                 console.error("[DocxPreview] Failed:", err);
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

//     if (error)
//         return <FallbackIcon icon={<FileText size={20} />} label="DOCX" />;

//     return (
//         <div className="relative w-full h-full overflow-hidden bg-white">
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading DOCX…
//                     </span>
//                 </div>
//             )}
//             <div
//                 ref={containerRef}
//                 style={{
//                     pointerEvents: "none",
//                     transform: "scale(0.35)",
//                     transformOrigin: "top left",
//                     width: "270%",
//                     height: "270%",
//                     overflow: "hidden",
//                 }}
//             />
//         </div>
//     );
// }

// // ─── Helpers for ExcelJS canvas rendering ────────────────────────────────────

// function excelColorToCss(color, defaultColor = "#000000") {
//     if (!color) return defaultColor;
//     if (color.argb) {
//         const hex = color.argb; // "FFRRGGBB"
//         const a = parseInt(hex.slice(0, 2), 16) / 255;
//         const r = parseInt(hex.slice(2, 4), 16);
//         const g = parseInt(hex.slice(4, 6), 16);
//         const b = parseInt(hex.slice(6, 8), 16);
//         return `rgba(${r},${g},${b},${a})`;
//     }
//     return defaultColor;
// }

// const DEFAULT_COL_PX = 52;
// const DEFAULT_ROW_PX = 16;
// const CHAR_TO_PX = 6.5;

// function colWidthToPx(w) {
//     return w ? Math.round(w * CHAR_TO_PX) : DEFAULT_COL_PX;
// }
// function rowHeightToPx(h) {
//     return h ? Math.round(h * 1.2) : DEFAULT_ROW_PX;
// }

// async function renderWorkbookToCanvas(workbook, canvas) {
//     const worksheet = workbook.worksheets[0];
//     if (!worksheet) return;

//     // ── Merge map ──────────────────────────────────────────────────────────
//     const mergeMap = {};
//     const skipSet = new Set();

//     const merges = worksheet.model?.merges ?? [];
//     for (const rangeStr of merges) {
//         const [start, end] = rangeStr.split(":");
//         if (!end) continue;
//         const sc = worksheet.getCell(start);
//         const ec = worksheet.getCell(end);
//         const r1 = sc.row,
//             c1 = sc.col,
//             r2 = ec.row,
//             c2 = ec.col;
//         mergeMap[`${r1},${c1}`] = { rows: r2 - r1 + 1, cols: c2 - c1 + 1 };
//         for (let r = r1; r <= r2; r++)
//             for (let c = c1; c <= c2; c++)
//                 if (r !== r1 || c !== c1) skipSet.add(`${r},${c}`);
//     }

//     // ── Dimensions ────────────────────────────────────────────────────────
//     const maxRow = Math.min(worksheet.rowCount || 50, 100);
//     const maxCol = Math.min(worksheet.columnCount || 20, 30);

//     const colWidths = [];
//     for (let c = 1; c <= maxCol; c++) {
//         colWidths.push(colWidthToPx(worksheet.getColumn(c).width));
//     }
//     const colX = [0];
//     for (let c = 0; c < maxCol; c++) colX.push(colX[c] + colWidths[c]);

//     const rowHeights = [];
//     for (let r = 1; r <= maxRow; r++) {
//         rowHeights.push(rowHeightToPx(worksheet.getRow(r).height));
//     }
//     const rowY = [0];
//     for (let r = 0; r < maxRow; r++) rowY.push(rowY[r] + rowHeights[r]);

//     const totalW = colX[maxCol];
//     const totalH = rowY[maxRow];

//     const dpr = window.devicePixelRatio || 1;
//     canvas.width = totalW * dpr;
//     canvas.height = totalH * dpr;
//     canvas.style.width = `${totalW}px`;
//     canvas.style.height = `${totalH}px`;

//     const ctx = canvas.getContext("2d");
//     ctx.scale(dpr, dpr);
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(0, 0, totalW, totalH);

//     // ── Grid lines (drawn first, behind cells) ─────────────────────────────
//     ctx.strokeStyle = "#e5e7eb";
//     ctx.lineWidth = 0.5;
//     for (let c = 0; c <= maxCol; c++) {
//         ctx.beginPath();
//         ctx.moveTo(colX[c], 0);
//         ctx.lineTo(colX[c], totalH);
//         ctx.stroke();
//     }
//     for (let r = 0; r <= maxRow; r++) {
//         ctx.beginPath();
//         ctx.moveTo(0, rowY[r]);
//         ctx.lineTo(totalW, rowY[r]);
//         ctx.stroke();
//     }

//     // ── Cells ─────────────────────────────────────────────────────────────
//     for (let r = 1; r <= maxRow; r++) {
//         for (let c = 1; c <= maxCol; c++) {
//             const key = `${r},${c}`;
//             if (skipSet.has(key)) continue;

//             const cell = worksheet.getRow(r).getCell(c);
//             const merge = mergeMap[key];

//             const x = colX[c - 1];
//             const y = rowY[r - 1];
//             const w = merge
//                 ? colX[c - 1 + merge.cols] - colX[c - 1]
//                 : colWidths[c - 1];
//             const h = merge
//                 ? rowY[r - 1 + merge.rows] - rowY[r - 1]
//                 : rowHeights[r - 1];

//             // Fill
//             const fill = cell.fill;
//             if (fill?.type === "pattern" && fill.fgColor) {
//                 const bg = excelColorToCss(fill.fgColor, null);
//                 if (bg) {
//                     ctx.fillStyle = bg;
//                     ctx.fillRect(x, y, w, h);
//                 }
//             }

//             // Borders
//             const border = cell.border || {};
//             const drawBorder = (side, x1, y1, x2, y2) => {
//                 if (!border[side]) return;
//                 ctx.strokeStyle = excelColorToCss(
//                     border[side].color,
//                     "#cccccc",
//                 );
//                 ctx.lineWidth = border[side].style === "thick" ? 2 : 1;
//                 ctx.beginPath();
//                 ctx.moveTo(x1, y1);
//                 ctx.lineTo(x2, y2);
//                 ctx.stroke();
//             };
//             drawBorder("top", x, y, x + w, y);
//             drawBorder("bottom", x, y + h, x + w, y + h);
//             drawBorder("left", x, y, x, y + h);
//             drawBorder("right", x + w, y, x + w, y + h);

//             // Text
//             const rawValue = cell.value;
//             if (rawValue === null || rawValue === undefined) continue;

//             let text = "";
//             if (typeof rawValue === "object" && rawValue?.richText)
//                 text = rawValue.richText.map((rt) => rt.text).join("");
//             else if (
//                 typeof rawValue === "object" &&
//                 rawValue?.result !== undefined
//             )
//                 text = String(rawValue.result);
//             else text = String(rawValue);

//             if (!text) continue;

//             const font = cell.font || {};
//             const fontSize = font.size ? font.size * 0.75 : 7;
//             const fontWeight = font.bold ? "bold" : "normal";
//             const fontStyle = font.italic ? "italic" : "normal";
//             ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px Arial`;
//             ctx.fillStyle = excelColorToCss(font.color, "#000000");

//             const alignment = cell.alignment || {};
//             const hAlign = alignment.horizontal || "left";
//             const vAlign = alignment.vertical || "middle";

//             ctx.textAlign =
//                 hAlign === "center"
//                     ? "center"
//                     : hAlign === "right"
//                       ? "right"
//                       : "left";
//             ctx.textBaseline =
//                 vAlign === "middle"
//                     ? "middle"
//                     : vAlign === "bottom"
//                       ? "bottom"
//                       : "top";

//             const padX = 2;
//             const textX =
//                 hAlign === "center"
//                     ? x + w / 2
//                     : hAlign === "right"
//                       ? x + w - padX
//                       : x + padX;
//             const textY =
//                 vAlign === "middle"
//                     ? y + h / 2
//                     : vAlign === "bottom"
//                       ? y + h - 1
//                       : y + 1;

//             ctx.save();
//             ctx.beginPath();
//             ctx.rect(x, y, w, h);
//             ctx.clip();
//             ctx.fillText(text, textX, textY);
//             ctx.restore();
//         }
//     }
// }

// // ─── XLSX Preview (ExcelJS → Canvas, scaled thumbnail) ───────────────────────
// function XlsxPreview({ url }) {
//     const canvasRef = useRef(null);
//     const wrapperRef = useRef(null);
//     const [error, setError] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         let cancelled = false;

//         async function render() {
//             try {
//                 const res = await fetch(url, { credentials: "include" });
//                 if (!res.ok) throw new Error(`HTTP ${res.status}`);
//                 const arrayBuffer = await res.arrayBuffer();

//                 const workbook = new ExcelJS.Workbook();
//                 await workbook.xlsx.load(arrayBuffer);

//                 if (!cancelled && canvasRef.current) {
//                     await renderWorkbookToCanvas(workbook, canvasRef.current);

//                     // Scale canvas down to fit the card thumbnail
//                     const canvasW =
//                         parseFloat(canvasRef.current.style.width) ||
//                         canvasRef.current.width;
//                     const containerW = wrapperRef.current?.clientWidth || 300;
//                     const scale = containerW / canvasW;
//                     const canvasH =
//                         parseFloat(canvasRef.current.style.height) ||
//                         canvasRef.current.height;

//                     canvasRef.current.style.transform = `scale(${scale})`;
//                     canvasRef.current.style.transformOrigin = "top left";

//                     if (wrapperRef.current) {
//                         wrapperRef.current.style.height = `${canvasH * scale}px`;
//                     }

//                     if (!cancelled) setLoading(false);
//                 }
//             } catch (err) {
//                 console.error("[XlsxPreview] ExcelJS render failed:", err);
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

//     if (error)
//         return <FallbackIcon icon={<FileText size={20} />} label="XLSX" />;

//     return (
//         <div
//             ref={wrapperRef}
//             className="relative w-full overflow-hidden bg-white"
//         >
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading XLSX…
//                     </span>
//                 </div>
//             )}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     display: loading ? "none" : "block",
//                     pointerEvents: "none",
//                 }}
//             />
//         </div>
//     );
// }

// // ─── File Preview Router ──────────────────────────────────────────────────────
// function FilePreview({ file }) {
//     const ext = file.extension?.toLowerCase();
//     const url = file.download_url;

//     if (file.is_sealed)
//         return <FallbackIcon icon={<Lock size={20} />} label="Sealed File" />;
//     if (!url)
//         return (
//             <FallbackIcon icon={<FileText size={20} />} label="No Preview" />
//         );

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
//                         `<div class="flex flex-col items-center text-gray-400 text-sm"><span>No Preview</span></div>`,
//                     );
//                 }}
//             />
//         );
//     }

//     if (ext === "pdf") return <LazyPreview url={url} Component={PdfPreview} />;
//     if (ext === "docx" || ext === "doc")
//         return <LazyPreview url={url} Component={DocxPreview} />;
//     if (ext === "xlsx" || ext === "xls")
//         return <LazyPreview url={url} Component={XlsxPreview} />;
//     if (ext === "pptx" || ext === "ppt")
//         return <FallbackIcon icon={<FileText size={20} />} label={`.${ext}`} />;

//     return (
//         <FallbackIcon
//             icon={<FileText size={20} />}
//             label={`.${ext ?? "file"}`}
//         />
//     );
// }

// // ─── File Card ────────────────────────────────────────────────────────────────
// function FileCard({ file }) {
//     const ext = file.extension?.toLowerCase();

//     console.log(file.box_file_id);

//     // const handleClick = () => {
//     //     if (!file.box_file_id || file.is_sealed) return;

//     //     const preview = new Box.Preview();
//     //     preview.show(file.box_file_id, "3nvvT2eVvbSZZpOGuMu8mmEKm3u6PsQu", {
//     //         container: "#box-preview-container",
//     //         showDownload: true,
//     //     });
//     // };

//     const [open, setOpen] = useState(false);

//     useEffect(() => {
//         if (!open) return;

//         const preview = new window.Box.Preview();
//         preview.show(file.box_file_id, "3nvvT2eVvbSZZpOGuMu8mmEKm3u6PsQu", {
//             container: "#box-preview-container",
//         });
//     }, [open]);
//     return (
//         <Card
//             onClick={() => setOpen(true)}
//             className="group overflow-hidden border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-blue-400 hover:shadow-md cursor-pointer"
//         >
//             <div className="w-full bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
//                 <FilePreview file={file} />
//             </div>

//             <CardContent className="py-3">
//                 <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
//                     {file.name}
//                 </h3>
//                 <p className="text-xs text-gray-400 mt-1">
//                     <span className="text-xs text-gray-400">
//                         {file.box_modified_at
//                             ? new Date(file.box_modified_at).toLocaleDateString(
//                                   undefined,
//                                   {
//                                       year: "numeric",
//                                       month: "short",
//                                       day: "numeric",
//                                   },
//                               )
//                             : "—"}
//                     </span>
//                 </p>
//             </CardContent>

//             {open && (
//                 <div id="box-preview-container" style={{ height: "500px" }} />
//             )}
//         </Card>
//     );
// }

// export default FileCard;

// import { useEffect, useRef, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Lock, FileText, X } from "lucide-react";
// import * as pdfjsLib from "pdfjs-dist";
// import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
// import { renderAsync } from "docx-preview";
// import ExcelJS from "exceljs";

// // Set worker once at module level
// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

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
//                 const loadingTask = pdfjsLib.getDocument({
//                     url,
//                     withCredentials: false,
//                 });
//                 const pdf = await loadingTask.promise;
//                 const page = await pdf.getPage(1);
//                 const canvas = canvasRef.current;
//                 if (!canvas || cancelled) return;

//                 const containerWidth = canvas.parentElement?.clientWidth || 320;
//                 const unscaledViewport = page.getViewport({ scale: 1 });
//                 const scale = (containerWidth / unscaledViewport.width) * 2.5;
//                 const viewport = page.getViewport({ scale });

//                 canvas.width = viewport.width;
//                 canvas.height = viewport.height;

//                 await page.render({
//                     canvasContext: canvas.getContext("2d"),
//                     viewport,
//                 }).promise;
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

//     if (error)
//         return <FallbackIcon icon={<FileText size={20} />} label="PDF" />;

//     return (
//         <div className="relative w-full h-full overflow-hidden">
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading PDF…
//                     </span>
//                 </div>
//             )}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     display: loading ? "none" : "block",
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "auto",
//                 }}
//             />
//         </div>
//     );
// }

// // ─── Lazy wrapper ─────────────────────────────────────────────────────────────
// function LazyPreview({ url, Component }) {
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
//             { threshold: 0.1 },
//         );
//         observer.observe(el);
//         return () => observer.disconnect();
//     }, []);

//     return (
//         <div ref={wrapperRef} className="w-full h-full">
//             {visible ? (
//                 <Component url={url} />
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

// // ─── DOCX Preview ─────────────────────────────────────────────────────────────
// function DocxPreview({ url }) {
//     const containerRef = useRef(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     useEffect(() => {
//         let cancelled = false;

//         async function render() {
//             try {
//                 const res = await fetch(url, { credentials: "include" });
//                 if (!res.ok) throw new Error(`HTTP ${res.status}`);
//                 const arrayBuffer = await res.arrayBuffer();

//                 if (!cancelled && containerRef.current) {
//                     await renderAsync(
//                         arrayBuffer,
//                         containerRef.current,
//                         undefined,
//                         {
//                             className: "docx-preview",
//                             inWrapper: false,
//                             ignoreWidth: false,
//                             ignoreHeight: false,
//                             ignoreFonts: false,
//                             breakPages: false,
//                             useBase64URL: true,
//                             renderHeaders: true,
//                             renderFooters: true,
//                             renderFootnotes: true,
//                         },
//                     );
//                     if (!cancelled) setLoading(false);
//                 }
//             } catch (err) {
//                 console.error("[DocxPreview] Failed:", err);
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

//     if (error)
//         return <FallbackIcon icon={<FileText size={20} />} label="DOCX" />;

//     return (
//         <div className="relative w-full h-full overflow-hidden bg-white">
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading DOCX…
//                     </span>
//                 </div>
//             )}
//             <div
//                 ref={containerRef}
//                 style={{
//                     pointerEvents: "none",
//                     transform: "scale(0.35)",
//                     transformOrigin: "top left",
//                     width: "270%",
//                     height: "270%",
//                     overflow: "hidden",
//                 }}
//             />
//         </div>
//     );
// }

// // ─── Helpers for ExcelJS canvas rendering ────────────────────────────────────
// function excelColorToCss(color, defaultColor = "#000000") {
//     if (!color) return defaultColor;
//     if (color.argb) {
//         const hex = color.argb;
//         const a = parseInt(hex.slice(0, 2), 16) / 255;
//         const r = parseInt(hex.slice(2, 4), 16);
//         const g = parseInt(hex.slice(4, 6), 16);
//         const b = parseInt(hex.slice(6, 8), 16);
//         return `rgba(${r},${g},${b},${a})`;
//     }
//     return defaultColor;
// }

// const DEFAULT_COL_PX = 52;
// const DEFAULT_ROW_PX = 16;
// const CHAR_TO_PX = 6.5;

// function colWidthToPx(w) {
//     return w ? Math.round(w * CHAR_TO_PX) : DEFAULT_COL_PX;
// }
// function rowHeightToPx(h) {
//     return h ? Math.round(h * 1.2) : DEFAULT_ROW_PX;
// }

// async function renderWorkbookToCanvas(workbook, canvas) {
//     const worksheet = workbook.worksheets[0];
//     if (!worksheet) return;

//     const mergeMap = {};
//     const skipSet = new Set();
//     const merges = worksheet.model?.merges ?? [];
//     for (const rangeStr of merges) {
//         const [start, end] = rangeStr.split(":");
//         if (!end) continue;
//         const sc = worksheet.getCell(start);
//         const ec = worksheet.getCell(end);
//         const r1 = sc.row,
//             c1 = sc.col,
//             r2 = ec.row,
//             c2 = ec.col;
//         mergeMap[`${r1},${c1}`] = { rows: r2 - r1 + 1, cols: c2 - c1 + 1 };
//         for (let r = r1; r <= r2; r++)
//             for (let c = c1; c <= c2; c++)
//                 if (r !== r1 || c !== c1) skipSet.add(`${r},${c}`);
//     }

//     const maxRow = Math.min(worksheet.rowCount || 50, 100);
//     const maxCol = Math.min(worksheet.columnCount || 20, 30);

//     const colWidths = [];
//     for (let c = 1; c <= maxCol; c++)
//         colWidths.push(colWidthToPx(worksheet.getColumn(c).width));
//     const colX = [0];
//     for (let c = 0; c < maxCol; c++) colX.push(colX[c] + colWidths[c]);

//     const rowHeights = [];
//     for (let r = 1; r <= maxRow; r++)
//         rowHeights.push(rowHeightToPx(worksheet.getRow(r).height));
//     const rowY = [0];
//     for (let r = 0; r < maxRow; r++) rowY.push(rowY[r] + rowHeights[r]);

//     const totalW = colX[maxCol];
//     const totalH = rowY[maxRow];
//     const dpr = window.devicePixelRatio || 1;

//     canvas.width = totalW * dpr;
//     canvas.height = totalH * dpr;
//     canvas.style.width = `${totalW}px`;
//     canvas.style.height = `${totalH}px`;

//     const ctx = canvas.getContext("2d");
//     ctx.scale(dpr, dpr);
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(0, 0, totalW, totalH);

//     ctx.strokeStyle = "#e5e7eb";
//     ctx.lineWidth = 0.5;
//     for (let c = 0; c <= maxCol; c++) {
//         ctx.beginPath();
//         ctx.moveTo(colX[c], 0);
//         ctx.lineTo(colX[c], totalH);
//         ctx.stroke();
//     }
//     for (let r = 0; r <= maxRow; r++) {
//         ctx.beginPath();
//         ctx.moveTo(0, rowY[r]);
//         ctx.lineTo(totalW, rowY[r]);
//         ctx.stroke();
//     }

//     for (let r = 1; r <= maxRow; r++) {
//         for (let c = 1; c <= maxCol; c++) {
//             const key = `${r},${c}`;
//             if (skipSet.has(key)) continue;

//             const cell = worksheet.getRow(r).getCell(c);
//             const merge = mergeMap[key];
//             const x = colX[c - 1];
//             const y = rowY[r - 1];
//             const w = merge
//                 ? colX[c - 1 + merge.cols] - colX[c - 1]
//                 : colWidths[c - 1];
//             const h = merge
//                 ? rowY[r - 1 + merge.rows] - rowY[r - 1]
//                 : rowHeights[r - 1];

//             const fill = cell.fill;
//             if (fill?.type === "pattern" && fill.fgColor) {
//                 const bg = excelColorToCss(fill.fgColor, null);
//                 if (bg) {
//                     ctx.fillStyle = bg;
//                     ctx.fillRect(x, y, w, h);
//                 }
//             }

//             const border = cell.border || {};
//             const drawBorder = (side, x1, y1, x2, y2) => {
//                 if (!border[side]) return;
//                 ctx.strokeStyle = excelColorToCss(
//                     border[side].color,
//                     "#cccccc",
//                 );
//                 ctx.lineWidth = border[side].style === "thick" ? 2 : 1;
//                 ctx.beginPath();
//                 ctx.moveTo(x1, y1);
//                 ctx.lineTo(x2, y2);
//                 ctx.stroke();
//             };
//             drawBorder("top", x, y, x + w, y);
//             drawBorder("bottom", x, y + h, x + w, y + h);
//             drawBorder("left", x, y, x, y + h);
//             drawBorder("right", x + w, y, x + w, y + h);

//             const rawValue = cell.value;
//             if (rawValue === null || rawValue === undefined) continue;

//             let text = "";
//             if (typeof rawValue === "object" && rawValue?.richText)
//                 text = rawValue.richText.map((rt) => rt.text).join("");
//             else if (
//                 typeof rawValue === "object" &&
//                 rawValue?.result !== undefined
//             )
//                 text = String(rawValue.result);
//             else text = String(rawValue);

//             if (!text) continue;

//             const font = cell.font || {};
//             const fontSize = font.size ? font.size * 0.75 : 7;
//             ctx.font = `${font.italic ? "italic" : "normal"} ${font.bold ? "bold" : "normal"} ${fontSize}px Arial`;
//             ctx.fillStyle = excelColorToCss(font.color, "#000000");

//             const alignment = cell.alignment || {};
//             const hAlign = alignment.horizontal || "left";
//             const vAlign = alignment.vertical || "middle";

//             ctx.textAlign =
//                 hAlign === "center"
//                     ? "center"
//                     : hAlign === "right"
//                       ? "right"
//                       : "left";
//             ctx.textBaseline =
//                 vAlign === "middle"
//                     ? "middle"
//                     : vAlign === "bottom"
//                       ? "bottom"
//                       : "top";

//             const padX = 2;
//             const textX =
//                 hAlign === "center"
//                     ? x + w / 2
//                     : hAlign === "right"
//                       ? x + w - padX
//                       : x + padX;
//             const textY =
//                 vAlign === "middle"
//                     ? y + h / 2
//                     : vAlign === "bottom"
//                       ? y + h - 1
//                       : y + 1;

//             ctx.save();
//             ctx.beginPath();
//             ctx.rect(x, y, w, h);
//             ctx.clip();
//             ctx.fillText(text, textX, textY);
//             ctx.restore();
//         }
//     }
// }

// // ─── XLSX Preview ─────────────────────────────────────────────────────────────
// function XlsxPreview({ url }) {
//     const canvasRef = useRef(null);
//     const wrapperRef = useRef(null);
//     const [error, setError] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         let cancelled = false;

//         async function render() {
//             try {
//                 const res = await fetch(url, { credentials: "include" });
//                 if (!res.ok) throw new Error(`HTTP ${res.status}`);
//                 const arrayBuffer = await res.arrayBuffer();

//                 const workbook = new ExcelJS.Workbook();
//                 await workbook.xlsx.load(arrayBuffer);

//                 if (!cancelled && canvasRef.current) {
//                     await renderWorkbookToCanvas(workbook, canvasRef.current);

//                     const canvasW =
//                         parseFloat(canvasRef.current.style.width) ||
//                         canvasRef.current.width;
//                     const containerW = wrapperRef.current?.clientWidth || 300;
//                     const scale = containerW / canvasW;
//                     const canvasH =
//                         parseFloat(canvasRef.current.style.height) ||
//                         canvasRef.current.height;

//                     canvasRef.current.style.transform = `scale(${scale})`;
//                     canvasRef.current.style.transformOrigin = "top left";

//                     if (wrapperRef.current)
//                         wrapperRef.current.style.height = `${canvasH * scale}px`;

//                     if (!cancelled) setLoading(false);
//                 }
//             } catch (err) {
//                 console.error("[XlsxPreview] ExcelJS render failed:", err);
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

//     if (error)
//         return <FallbackIcon icon={<FileText size={20} />} label="XLSX" />;

//     return (
//         <div
//             ref={wrapperRef}
//             className="relative w-full overflow-hidden bg-white"
//         >
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
//                     <span className="text-xs text-gray-400 animate-pulse">
//                         Loading XLSX…
//                     </span>
//                 </div>
//             )}
//             <canvas
//                 ref={canvasRef}
//                 style={{
//                     display: loading ? "none" : "block",
//                     pointerEvents: "none",
//                 }}
//             />
//         </div>
//     );
// }

// // ─── File Preview Router ──────────────────────────────────────────────────────
// function FilePreview({ file }) {
//     const ext = file.extension?.toLowerCase();
//     const url = file.download_url;

//     if (file.is_sealed)
//         return <FallbackIcon icon={<Lock size={20} />} label="Sealed File" />;
//     if (!url)
//         return (
//             <FallbackIcon icon={<FileText size={20} />} label="No Preview" />
//         );

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
//                         `<div class="flex flex-col items-center text-gray-400 text-sm"><span>No Preview</span></div>`,
//                     );
//                 }}
//             />
//         );
//     }

//     if (ext === "pdf") return <LazyPreview url={url} Component={PdfPreview} />;
//     if (ext === "docx" || ext === "doc")
//         return <LazyPreview url={url} Component={DocxPreview} />;
//     if (ext === "xlsx" || ext === "xls")
//         return <LazyPreview url={url} Component={XlsxPreview} />;
//     if (ext === "pptx" || ext === "ppt")
//         return <FallbackIcon icon={<FileText size={20} />} label={`.${ext}`} />;

//     return (
//         <FallbackIcon
//             icon={<FileText size={20} />}
//             label={`.${ext ?? "file"}`}
//         />
//     );
// }

// // ─── Box Preview Modal ────────────────────────────────────────────────────────
// // function BoxPreviewModal({ fileId, accessToken, onClose }) {
// //     const containerRef = useRef(null);

// //     useEffect(() => {
// //         if (!containerRef.current) return;

// //         const preview = new window.Box.Preview();
// //         preview.show(fileId, accessToken, {
// //             container: containerRef.current,
// //             showDownload: true,
// //         });

// //         return () => preview.destroy();
// //     }, [fileId, accessToken]);

// //     return (
// //         <div
// //             className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
// //             onClick={onClose}
// //         >
// //             <div
// //                 className="relative w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
// //                 onClick={(e) => e.stopPropagation()}
// //             >
// //                 <button
// //                     onClick={onClose}
// //                     className="absolute top-3 right-3 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
// //                 >
// //                     <X size={18} className="text-gray-600" />
// //                 </button>
// //                 <div ref={containerRef} className="w-full h-full" />
// //             </div>
// //         </div>
// //     );
// // }

// // function BoxPreviewModal({ fileId, accessToken, onClose }) {
// //     const containerRef = useRef(null);

// //     useEffect(() => {
// //         if (!containerRef.current) return;

// //         const preview = new window.Box.Preview();

// //         // preview.show(fileId, accessToken, {
// //         //     container: containerRef.current, // ✅ use ref (BEST)
// //         //     showDownload: true,
// //         // });

// //         // Test the token directly
// //         const test = async () => {
// //             const test = await fetch(
// //                 `https://api.box.com/2.0/files/${fileId}`,
// //                 {
// //                     headers: { Authorization: `Bearer ${accessToken}` },
// //                 },
// //             );
// //             console.log("Token test:", test.status, await test.json());
// //         };

// //         test();

// //         preview.show(fileId, () => Promise.resolve(accessToken), {
// //             container: containerRef.current,
// //             showDownload: true,
// //         });

// //         return () => {
// //             preview.hide(); // cleanup
// //         };
// //     }, [fileId, accessToken]);

// //     return (
// //         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
// //             <div className="bg-white w-[80%] h-[80%] rounded-lg overflow-hidden relative">
// //                 <button
// //                     onClick={onClose}
// //                     className="absolute top-2 right-2 z-10"
// //                 >
// //                     ✕
// //                 </button>

// //                 <div
// //                     ref={containerRef}
// //                     style={{
// //                         position: "absolute",
// //                         top: 0,
// //                         left: 0,
// //                         right: 0,
// //                         bottom: 0,
// //                     }}
// //                 />
// //             </div>
// //         </div>
// //     );
// // }

// function BoxPreviewModal({ fileId, accessToken, onClose }) {
//     const containerRef = useRef(null);

//     useEffect(() => {
//         if (!containerRef.current) return;

//         const preview = new window.Box.Preview();

//         preview.show(fileId, () => Promise.resolve(accessToken), {
//             container: containerRef.current,
//             showDownload: true,
//         });

//         return () => {
//             try { preview.hide(); } catch (_) {}
//         };
//     }, [fileId, accessToken]);

//     return (
//         <div
//             className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
//             onClick={onClose}
//         >
//             <div
//                 className="bg-white rounded-lg shadow-2xl"
//                 style={{ width: "80vw", height: "80vh", position: "relative" }}
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <button
//                     onClick={onClose}
//                     className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-100"
//                     style={{ zIndex: 9999 }}
//                 >
//                     <X size={18} className="text-gray-600" />
//                 </button>

//                 {/* Box Preview REQUIRES this container to be position:absolute */}
//                 <div
//                     ref={containerRef}
//                     style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         overflow: "hidden",
//                         borderRadius: "0.5rem",
//                     }}
//                 />
//             </div>
//         </div>
//     );
// }

// // ─── File Card ────────────────────────────────────────────────────────────────
// function FileCard({ file, accessToken }) {
//     const [previewOpen, setPreviewOpen] = useState(false);

//     const handleCardClick = () => {
//         if (!file.box_file_id || file.is_sealed) return;

//         setPreviewOpen(true); // ✅ ONLY this
//     };

//     return (
//         <>
//             <Card
//                 onClick={handleCardClick}
//                 className="group overflow-hidden border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-blue-400 hover:shadow-md cursor-pointer"
//             >
//                 <div className="w-full bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
//                     <FilePreview file={file} />
//                 </div>

//                 <CardContent className="py-3">
//                     <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
//                         {file.name}
//                     </h3>
//                     <p className="text-xs text-gray-400 mt-1">
//                         {file.box_modified_at
//                             ? new Date(file.box_modified_at).toLocaleDateString(
//                                   undefined,
//                                   {
//                                       year: "numeric",
//                                       month: "short",
//                                       day: "numeric",
//                                   },
//                               )
//                             : "—"}
//                     </p>
//                 </CardContent>
//             </Card>

//             {/* Box Preview Modal — mounts only when open */}
//             {previewOpen && (
//                 <BoxPreviewModal
//                     fileId={file.box_file_id}
//                     accessToken={"LLtYQBexSYH5Da3g2yFRoiTyGOM5P0Nw"}
//                     onClose={() => setPreviewOpen(false)}
//                 />
//             )}
//         </>
//     );
// }

// export default FileCard;

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, FileText, X, EllipsisVertical } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { renderAsync } from "docx-preview";
import ExcelJS from "exceljs";
import { createPortal } from "react-dom";
// import { X } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

async function fetchFileBuffer(url, accessToken) {
    const res = await fetch(url, {
        credentials: "include",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
        throw new Error(
            `Expected binary but got HTML — check auth/CORS for: ${url}`,
        );
    }
    return res.arrayBuffer();
}

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
function PdfPreview({ url, accessToken }) {
    const canvasRef = useRef(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function render() {
            if (!url) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const probe = await fetch(url, {
                    method: "HEAD",
                    credentials: "include",
                    headers: accessToken
                        ? { Authorization: `Bearer ${accessToken}` }
                        : {},
                });
                const ct = probe.headers.get("content-type") ?? "";
                if (!probe.ok || ct.includes("text/html")) {
                    throw new Error(`PDF URL returned ${probe.status} / ${ct}`);
                }

                const loadingTask = pdfjsLib.getDocument({
                    url,
                    withCredentials: false,
                    httpHeaders: accessToken
                        ? { Authorization: `Bearer ${accessToken}` }
                        : {},
                });
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                const canvas = canvasRef.current;
                if (!canvas || cancelled) return;

                const containerWidth = canvas.parentElement?.clientWidth || 320;
                const unscaledViewport = page.getViewport({ scale: 1 });
                const scale = (containerWidth / unscaledViewport.width) * 2.5;
                const viewport = page.getViewport({ scale });

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: canvas.getContext("2d"),
                    viewport,
                }).promise;

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
    }, [url, accessToken]);

    if (error)
        return <FallbackIcon icon={<FileText size={20} />} label="PDF" />;

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

// ─── Lazy wrapper ─────────────────────────────────────────────────────────────
function LazyPreview({ url, accessToken, Component }) {
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
            { threshold: 0.1 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={wrapperRef} className="w-full h-full">
            {visible ? (
                <Component url={url} accessToken={accessToken} />
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

// ─── DOCX Preview ─────────────────────────────────────────────────────────────
function DocxPreview({ url, accessToken }) {
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function render() {
            if (!url) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                // const res = await fetch(url, {
                //     credentials: "include",
                //     headers: accessToken
                //         ? { Authorization: `Bearer ${accessToken}` }
                //         : {},
                // });
                // if (!res.ok) throw new Error(`HTTP ${res.status}`);
                // const arrayBuffer = await res.arrayBuffer();

                const arrayBuffer = await fetchFileBuffer(url, accessToken);

                if (!cancelled && containerRef.current) {
                    await renderAsync(
                        arrayBuffer,
                        containerRef.current,
                        undefined,
                        {
                            className: "docx-preview",
                            inWrapper: false,
                            ignoreWidth: false,
                            ignoreHeight: false,
                            ignoreFonts: false,
                            breakPages: false,
                            useBase64URL: true,
                            renderHeaders: true,
                            renderFooters: true,
                            renderFootnotes: true,
                        },
                    );
                    if (!cancelled) setLoading(false);
                }
            } catch (err) {
                console.error("[DocxPreview] Failed:", err);
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
    }, [url, accessToken]);

    if (error)
        return <FallbackIcon icon={<FileText size={20} />} label="DOCX" />;

    return (
        <div className="relative w-full h-full overflow-hidden bg-white">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <span className="text-xs text-gray-400 animate-pulse">
                        Loading DOCX…
                    </span>
                </div>
            )}
            <div
                ref={containerRef}
                style={{
                    pointerEvents: "none",
                    transform: "scale(0.35)",
                    transformOrigin: "top left",
                    width: "270%",
                    height: "270%",
                    overflow: "hidden",
                }}
            />
        </div>
    );
}

// ─── Helpers for ExcelJS canvas rendering ────────────────────────────────────
function excelColorToCss(color, defaultColor = "#000000") {
    if (!color) return defaultColor;
    if (color.argb) {
        const hex = color.argb;
        const a = parseInt(hex.slice(0, 2), 16) / 255;
        const r = parseInt(hex.slice(2, 4), 16);
        const g = parseInt(hex.slice(4, 6), 16);
        const b = parseInt(hex.slice(6, 8), 16);
        return `rgba(${r},${g},${b},${a})`;
    }
    return defaultColor;
}

const DEFAULT_COL_PX = 52;
const DEFAULT_ROW_PX = 16;
const CHAR_TO_PX = 6.5;

function colWidthToPx(w) {
    return w ? Math.round(w * CHAR_TO_PX) : DEFAULT_COL_PX;
}
function rowHeightToPx(h) {
    return h ? Math.round(h * 1.2) : DEFAULT_ROW_PX;
}

async function renderWorkbookToCanvas(workbook, canvas) {
    const worksheet = workbook.worksheets[0];
    if (!worksheet) return;

    const mergeMap = {};
    const skipSet = new Set();
    const merges = worksheet.model?.merges ?? [];
    for (const rangeStr of merges) {
        const [start, end] = rangeStr.split(":");
        if (!end) continue;
        const sc = worksheet.getCell(start);
        const ec = worksheet.getCell(end);
        const r1 = sc.row,
            c1 = sc.col,
            r2 = ec.row,
            c2 = ec.col;
        mergeMap[`${r1},${c1}`] = { rows: r2 - r1 + 1, cols: c2 - c1 + 1 };
        for (let r = r1; r <= r2; r++)
            for (let c = c1; c <= c2; c++)
                if (r !== r1 || c !== c1) skipSet.add(`${r},${c}`);
    }

    const maxRow = Math.min(worksheet.rowCount || 50, 100);
    const maxCol = Math.min(worksheet.columnCount || 20, 30);

    const colWidths = [];
    for (let c = 1; c <= maxCol; c++)
        colWidths.push(colWidthToPx(worksheet.getColumn(c).width));
    const colX = [0];
    for (let c = 0; c < maxCol; c++) colX.push(colX[c] + colWidths[c]);

    const rowHeights = [];
    for (let r = 1; r <= maxRow; r++)
        rowHeights.push(rowHeightToPx(worksheet.getRow(r).height));
    const rowY = [0];
    for (let r = 0; r < maxRow; r++) rowY.push(rowY[r] + rowHeights[r]);

    const totalW = colX[maxCol];
    const totalH = rowY[maxRow];
    const dpr = window.devicePixelRatio || 1;

    canvas.width = totalW * dpr;
    canvas.height = totalH * dpr;
    canvas.style.width = `${totalW}px`;
    canvas.style.height = `${totalH}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, totalW, totalH);

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= maxCol; c++) {
        ctx.beginPath();
        ctx.moveTo(colX[c], 0);
        ctx.lineTo(colX[c], totalH);
        ctx.stroke();
    }
    for (let r = 0; r <= maxRow; r++) {
        ctx.beginPath();
        ctx.moveTo(0, rowY[r]);
        ctx.lineTo(totalW, rowY[r]);
        ctx.stroke();
    }

    for (let r = 1; r <= maxRow; r++) {
        for (let c = 1; c <= maxCol; c++) {
            const key = `${r},${c}`;
            if (skipSet.has(key)) continue;

            const cell = worksheet.getRow(r).getCell(c);
            const merge = mergeMap[key];
            const x = colX[c - 1];
            const y = rowY[r - 1];
            const w = merge
                ? colX[c - 1 + merge.cols] - colX[c - 1]
                : colWidths[c - 1];
            const h = merge
                ? rowY[r - 1 + merge.rows] - rowY[r - 1]
                : rowHeights[r - 1];

            const fill = cell.fill;
            if (fill?.type === "pattern" && fill.fgColor) {
                const bg = excelColorToCss(fill.fgColor, null);
                if (bg) {
                    ctx.fillStyle = bg;
                    ctx.fillRect(x, y, w, h);
                }
            }

            const border = cell.border || {};
            const drawBorder = (side, x1, y1, x2, y2) => {
                if (!border[side]) return;
                ctx.strokeStyle = excelColorToCss(
                    border[side].color,
                    "#cccccc",
                );
                ctx.lineWidth = border[side].style === "thick" ? 2 : 1;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            };
            drawBorder("top", x, y, x + w, y);
            drawBorder("bottom", x, y + h, x + w, y + h);
            drawBorder("left", x, y, x, y + h);
            drawBorder("right", x + w, y, x + w, y + h);

            const rawValue = cell.value;
            if (rawValue === null || rawValue === undefined) continue;

            let text = "";
            if (typeof rawValue === "object" && rawValue?.richText)
                text = rawValue.richText.map((rt) => rt.text).join("");
            else if (
                typeof rawValue === "object" &&
                rawValue?.result !== undefined
            )
                text = String(rawValue.result);
            else text = String(rawValue);

            if (!text) continue;

            const font = cell.font || {};
            const fontSize = font.size ? font.size * 0.75 : 7;
            ctx.font = `${font.italic ? "italic" : "normal"} ${font.bold ? "bold" : "normal"} ${fontSize}px Arial`;
            ctx.fillStyle = excelColorToCss(font.color, "#000000");

            const alignment = cell.alignment || {};
            const hAlign = alignment.horizontal || "left";
            const vAlign = alignment.vertical || "middle";

            ctx.textAlign =
                hAlign === "center"
                    ? "center"
                    : hAlign === "right"
                      ? "right"
                      : "left";
            ctx.textBaseline =
                vAlign === "middle"
                    ? "middle"
                    : vAlign === "bottom"
                      ? "bottom"
                      : "top";

            const padX = 2;
            const textX =
                hAlign === "center"
                    ? x + w / 2
                    : hAlign === "right"
                      ? x + w - padX
                      : x + padX;
            const textY =
                vAlign === "middle"
                    ? y + h / 2
                    : vAlign === "bottom"
                      ? y + h - 1
                      : y + 1;

            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.clip();
            ctx.fillText(text, textX, textY);
            ctx.restore();
        }
    }
}

// ─── XLSX Preview ─────────────────────────────────────────────────────────────
function XlsxPreview({ url, accessToken }) {
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function render() {
            if (!url) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(url, {
                    credentials: "include",
                    headers: accessToken
                        ? { Authorization: `Bearer ${accessToken}` }
                        : {},
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const arrayBuffer = await res.arrayBuffer();

                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(arrayBuffer);

                if (!cancelled && canvasRef.current) {
                    await renderWorkbookToCanvas(workbook, canvasRef.current);

                    const canvasW =
                        parseFloat(canvasRef.current.style.width) ||
                        canvasRef.current.width;
                    const containerW = wrapperRef.current?.clientWidth || 300;
                    const scale = containerW / canvasW;
                    const canvasH =
                        parseFloat(canvasRef.current.style.height) ||
                        canvasRef.current.height;

                    canvasRef.current.style.transform = `scale(${scale})`;
                    canvasRef.current.style.transformOrigin = "top left";

                    if (wrapperRef.current)
                        wrapperRef.current.style.height = `${canvasH * scale}px`;

                    if (!cancelled) setLoading(false);
                }
            } catch (err) {
                console.error("[XlsxPreview] ExcelJS render failed:", err);
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
    }, [url, accessToken]);

    if (error)
        return <FallbackIcon icon={<FileText size={20} />} label="XLSX" />;

    return (
        <div
            ref={wrapperRef}
            className="relative w-full overflow-hidden bg-white"
        >
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <span className="text-xs text-gray-400 animate-pulse">
                        Loading XLSX…
                    </span>
                </div>
            )}
            <canvas
                ref={canvasRef}
                style={{
                    display: loading ? "none" : "block",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}

// ─── File Preview Router ──────────────────────────────────────────────────────
function FilePreview({ file, accessToken }) {
    const ext = file.extension?.toLowerCase();
    const url = file.download_url;

    if (file.is_sealed)
        return <FallbackIcon icon={<Lock size={20} />} label="Sealed File" />;
    if (!url)
        return (
            <FallbackIcon icon={<FileText size={20} />} label="No Preview" />
        );

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
                        `<div class="flex flex-col items-center text-gray-400 text-sm"><span>No Preview</span></div>`,
                    );
                }}
            />
        );
    }

    if (ext === "pdf")
        return (
            <LazyPreview
                url={url}
                accessToken={accessToken}
                Component={PdfPreview}
            />
        );
    if (ext === "docx" || ext === "doc")
        return (
            <LazyPreview
                url={url}
                accessToken={accessToken}
                Component={DocxPreview}
            />
        );
    if (ext === "xlsx" || ext === "xls")
        return (
            <LazyPreview
                url={url}
                accessToken={accessToken}
                Component={XlsxPreview}
            />
        );
    if (ext === "pptx" || ext === "ppt")
        return <FallbackIcon icon={<FileText size={20} />} label={`.${ext}`} />;

    return (
        <FallbackIcon
            icon={<FileText size={20} />}
            label={`.${ext ?? "file"}`}
        />
    );
}

// function BoxPreviewModal({ fileId, accessToken, onClose }) {
//     const previewId = useRef(`box-preview-${Date.now()}`).current;

//     // useEffect(() => {
//     //     let preview;

//     //     const init = () => {
//     //         const el = document.getElementById(previewId);
//     //         if (!el || !window.Box) return;

//     //         preview = new window.Box.Preview();

//     //         preview.addListener("error", (err) => {
//     //             console.error("[BoxPreview] error:", err);
//     //         });

//     //         preview.addListener("load", (data) => {
//     //             console.log("[BoxPreview] loaded:", data);
//     //         });

//     //         preview.show(fileId, accessToken, {
//     //             container: `#${previewId}`,
//     //             showDownload: true,
//     //             showPrint: true,
//     //             showAnnotations: true,
//     //             showThumbnails: true, // left sidebar thumbnails
//     //             language: "en-US",

//     //         });
//     //     };

//     //     const timer = setTimeout(init, 100);
//     //     return () => {
//     //         clearTimeout(timer);
//     //         try {
//     //             preview?.hide();
//     //         } catch (_) {}
//     //     };
//     // }, [fileId, accessToken, previewId]);

//     useEffect(() => {
//         let preview;

//         const init = async () => {
//             const el = document.getElementById(previewId);
//             if (!el || !window.Box) return;

//             try {
//                 // fetch short-lived token from backend
//                 const res = await fetch(`/api/box/file-token/${fileId}`);
//                 const data = await res.json();
//                 if (!res.ok)
//                     throw new Error(data.error || "Failed to get token");

//                 preview = new window.Box.Preview();
//                 preview.addListener("error", (err) => console.error(err));
//                 preview.addListener("load", (data) => console.log(data));

//                 console.log(data);

//                 preview.show(fileId, data.accessToken, {
//                     container: `#${previewId}`,
//                     showDownload: true,
//                     showPrint: true,
//                     showAnnotations: true,
//                     showThumbnails: true,
//                     language: "en-US",
//                 });
//             } catch (err) {
//                 console.error("[BoxPreview] token fetch error:", err);
//             }
//         };

//         const timer = setTimeout(init, 100);
//         return () => {
//             clearTimeout(timer);
//             preview?.hide();
//         };
//     }, [fileId, previewId]);

//     return createPortal(
//         <div
//             style={{
//                 position: "fixed",
//                 inset: 0,
//                 background: "rgba(0,0,0,0.6)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 zIndex: 9999,
//             }}
//             onClick={onClose}
//         >
//             <div
//                 onClick={(e) => e.stopPropagation()}
//                 style={{
//                     position: "relative", // wrapper is relative
//                     width: "80vw",
//                     height: "80vh",
//                     background: "white",
//                     borderRadius: "0.5rem",
//                     overflow: "hidden",
//                     boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
//                 }}
//             >
//                 <button
//                     onClick={onClose}
//                     style={{
//                         position: "absolute",
//                         top: "0.5rem",
//                         right: "0.5rem",
//                         zIndex: 9999,
//                         background: "white",
//                         border: "none",
//                         borderRadius: "9999px",
//                         padding: "0.25rem",
//                         cursor: "pointer",
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
//                         marginLeft: "5px",
//                     }}
//                 >
//                     <X size={18} color="#4B5563" />
//                 </button>

//                 {/* ✅ Pure inline styles, no Tailwind/CSS classes that could interfere */}
//                 <div
//                     id={previewId}
//                     style={{
//                         position: "absolute", // must be absolute
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         width: "100%",
//                         height: "100%",
//                     }}
//                 />
//             </div>
//         </div>,
//         document.body, // ✅ Portal: renders outside your component tree
//     );
// }

// function FileCard({ file, accessToken }) {
//     const [previewOpen, setPreviewOpen] = useState(false);

//     const handleCardClick = () => {
//         if (!file.box_file_id || file.is_sealed) return;
//         setPreviewOpen(true);
//     };

//     return (
//         <>
//             <Card
//                 onClick={handleCardClick}
//                 className="group overflow-hidden border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-blue-400 hover:shadow-md cursor-pointer"
//             >
//                 <div className="w-full bg-gray-100 aspect-video flex items-center justify-center overflow-hidden">
//                     <FilePreview file={file} accessToken={accessToken} />
//                 </div>

//                 <CardContent className="py-3">
//                     <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
//                         {file.name}
//                     </h3>
//                     <p className="text-xs text-gray-400 mt-1">
//                         {file.box_modified_at
//                             ? new Date(file.box_modified_at).toLocaleDateString(
//                                   undefined,
//                                   {
//                                       year: "numeric",
//                                       month: "short",
//                                       day: "numeric",
//                                   },
//                               )
//                             : "—"}
//                     </p>
//                 </CardContent>
//             </Card>

//             {previewOpen && (
//                 <BoxPreviewModal
//                     fileId={file.box_file_id}
//                     accessToken={accessToken}
//                     onClose={() => setPreviewOpen(false)}
//                 />
//             )}
//         </>
//     );
// }

function BoxPreviewModal({ fileId, onClose }) {
    const previewId = useRef(`box-preview-${Date.now()}`).current;
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let preview;

        const init = async () => {
            const el = document.getElementById(previewId);
            if (!el || !window.Box) return;

            try {
                // const res = await fetch(`/api/box/file-token/${fileId}`, {
                //     headers: {
                //         Accept: "application/json",
                //         "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"), // Sanctum CSRF
                //     },
                //     credentials: "include",
                // });

                const res = await fetch(`/box/file-token/${fileId}`, {
                    headers: {
                        Accept: "application/json",
                        "X-XSRF-TOKEN": decodeURIComponent(
                            document.cookie
                                .split("; ")
                                .find((row) => row.startsWith("XSRF-TOKEN="))
                                ?.split("=")[1] ?? "",
                        ),
                    },
                    credentials: "include",
                });

                const data = await res.json();

                if (!res.ok)
                    throw new Error(data.error || "Failed to get token");

                preview = new window.Box.Preview();
                preview.addListener("error", (err) => {
                    console.error("[BoxPreview] error:", err);
                    setError("Failed to load preview.");
                });
                preview.addListener("load", () => setLoading(false));

                preview.show(fileId, data.accessToken, {
                    container: `#${previewId}`,
                    showDownload: true,
                    showPrint: true,
                    showAnnotations: true,
                    showThumbnails: true,
                    language: "en-US",
                });
            } catch (err) {
                console.error("[BoxPreview] init error:", err);
                setError("Could not load file preview.");
                setLoading(false);
            }
        };

        const timer = setTimeout(init, 100);
        return () => {
            clearTimeout(timer);
            try {
                preview?.hide();
            } catch (_) {}
        };
    }, [fileId, previewId]);

    return createPortal(
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    width: "80vw",
                    height: "80vh",
                    background: "white",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.4rem",
                        zIndex: 9999,
                        background: "white",
                        border: "none",
                        borderRadius: "9999px",
                        padding: "0.25rem",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                >
                    <X size={18} color="#4B5563" />
                </button>

                {/* Loading state */}
                {loading && !error && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#6B7280",
                        }}
                    >
                        Loading preview...
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#EF4444",
                        }}
                    >
                        {error}
                    </div>
                )}

                <div
                    id={previewId}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: "100%",
                        height: "100%",
                    }}
                />
            </div>
        </div>,
        document.body,
    );
}

// Helper to read CSRF cookie for Sanctum
function getCookie(name) {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="))
        ?.split("=")[1];
}

function FileCard({ file, selectedFile, onClick, onDoubleClick }) {
    // accessToken prop removed
    const [previewOpen, setPreviewOpen] = useState(false);

    // const handleCardClick = () => {
    //     if (!file.box_file_id || file.is_sealed) return;
    //     setPreviewOpen(true);
    // };

    return (
        <>
            <Card
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                className="group overflow-hidden border border-gray-200 bg-gray-50 transition-all duration-200 hover:border-blue-400 hover:shadow-md cursor-pointer"
            >
                <div className="flex items-center justify-between">
                    <div className="w-[80%]">
                        <h3 title={file.name} className="font-medium text-gray-800 text-sm line-clamp-1">
                            {file.name}
                        </h3>
                        <p className="text-xs text-gray-400 mb-1">
                            {file.box_modified_at
                                ? new Date(
                                      file.box_modified_at,
                                  ).toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                  })
                                : "—"}
                        </p>
                    </div>

                    <button className="mb-1">
                        <EllipsisVertical className="w-4 h-4" />
                    </button>
                </div>
                <CardContent className="">
                    <div className="w-full bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                        <FilePreview file={file} />
                    </div>
                </CardContent>
            </Card>

            {previewOpen && (
                <BoxPreviewModal
                    fileId={file.box_file_id}
                    onClose={() => setPreviewOpen(false)}
                />
            )}
        </>
    );
}

export default FileCard;

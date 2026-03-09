import FileCard from "@/components/file-card";
import Toolbar from "@/components/toolbar";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MainLayout from "@/Layouts/MainLayout";

export default function Files(){
    const sampleFiles = [
        {
            fileName: "ProjectProposal.pdf",
            fileType: "application/pdf",
            fileSize: "1.2 MB",
        },
        {
            fileName: "TeamPhoto.jpg",
            fileType: "image/jpeg",
            fileSize: "3.4 MB",
        },
        {
            fileName: "MeetingRecording.mp4",
            fileType: "video/mp4",
            fileSize: "25 MB",
        },
        {
            fileName: "ProjectProposal.pdf",
            fileType: "application/pdf",
            fileSize: "1.2 MB",
            isFolder: true
        },
        {
            fileName: "Budget.xlsx",
            fileType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileSize: "450 KB",
        },
        {
            fileName: "Presentation.pptx",
            fileType:
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            fileSize: "5 MB",
        },
        {
            fileName: "Notes.txt",
            fileType: "text/plain",
            fileSize: "15 KB",
        },
        {
            fileName: "Logo.png",
            fileType: "image/png",
            fileSize: "1.1 MB",
        },
    ];

    return (
        <>
            <Toolbar />

            {/* <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sampleFiles.map((file, index) => (
                    <FileCard
                        key={index}
                        fileName={file.fileName}
                        fileSize={file.fileSize}
                        fileType={file.fileType}
                        isFolder={file?.isFolder}
                    />
                ))}
            </div> */}
        </>
    );
};

Files.layout = (page) => <MainLayout>{page}</MainLayout>;

// export default Files;


// import { useState, useEffect } from "react";
// import { router } from "@inertiajs/react";
// import MainLayout from "@/Layouts/MainLayout";

// const formatSize = (bytes) => {
//     if (!bytes) return "—";
//     if (bytes < 1024) return bytes + " B";
//     if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
//     if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
//     return (bytes / 1073741824).toFixed(1) + " GB";
// };

// const FolderIcon = () => (
//     <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//         <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
//     </svg>
// );

// const FileIcon = () => (
//     <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//         <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
//         <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
//     </svg>
// );

// const ChevronIcon = () => (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//     </svg>
// );

// const HomeIcon = () => (
//     <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//         <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
//         <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.03-.028.061-.056.091-.086L12 5.43z" />
//     </svg>
// );

// export default function Files({ requiresAuth }) {
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "My Drive" }]);
//     const [view, setView] = useState("grid"); // grid or list

//     const currentFolder = breadcrumbs[breadcrumbs.length - 1];

//     const fetchFiles = async (folderId = null) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const url = folderId ? `/api/files?folder=${folderId}` : `/api/files`;
//             const res = await fetch(url);
//             const data = await res.json();
//             console.log("Fetched items:", data);
//             if (!res.ok) throw new Error(data.error || "Failed to load");
//             setItems(data);
//         } catch (e) {
//             setError(e.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!requiresAuth) fetchFiles(currentFolder.id);
//     }, []);

//     const openFolder = (item) => {
//         setBreadcrumbs((prev) => [...prev, { id: item.id, name: item.name }]);
//         fetchFiles(item.id);
//     };

//     const navigateTo = (index) => {
//         const newCrumbs = breadcrumbs.slice(0, index + 1);
//         setBreadcrumbs(newCrumbs);
//         fetchFiles(newCrumbs[newCrumbs.length - 1].id);
//     };

//     const folders = items.filter((i) => i.folder);
//     const files = items.filter((i) => !i.folder);

//     if (requiresAuth) {
//         return (
//             <div style={styles.page}>
//                 <div style={styles.authCard}>
//                     <div style={styles.authIcon}>☁</div>
//                     <h1 style={styles.authTitle}>Connect OneDrive</h1>
//                     <p style={styles.authSubtitle}>Sign in with your Microsoft account to browse your files</p>
//                     <a href="/login" style={styles.authButton}>Sign in with Microsoft</a>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div style={styles.page}>
//             {/* Header */}
//             <div style={styles.header}>
//                 <div style={styles.headerLeft}>
//                     <div style={styles.logo}>⬡</div>
//                     <div>
//                         <h1 style={styles.title}>File Browser</h1>
//                         <p style={styles.subtitle}>OneDrive</p>
//                     </div>
//                 </div>
//                 <div style={styles.viewToggle}>
//                     <button
//                         onClick={() => setView("grid")}
//                         style={{ ...styles.toggleBtn, ...(view === "grid" ? styles.toggleActive : {}) }}
//                     >⊞</button>
//                     <button
//                         onClick={() => setView("list")}
//                         style={{ ...styles.toggleBtn, ...(view === "list" ? styles.toggleActive : {}) }}
//                     >☰</button>
//                 </div>
//             </div>

//             {/* Breadcrumb */}
//             <div style={styles.breadcrumb}>
//                 {breadcrumbs.map((crumb, i) => (
//                     <span key={i} style={styles.breadcrumbItem}>
//                         {i > 0 && <span style={styles.breadcrumbSep}><ChevronIcon /></span>}
//                         <button
//                             onClick={() => navigateTo(i)}
//                             style={{
//                                 ...styles.breadcrumbBtn,
//                                 ...(i === breadcrumbs.length - 1 ? styles.breadcrumbActive : {}),
//                             }}
//                         >
//                             {i === 0 ? <span style={styles.homeIcon}><HomeIcon /></span> : null}
//                             {crumb.name}
//                         </button>
//                     </span>
//                 ))}
//             </div>

//             {/* Content */}
//             <div style={styles.content}>
//                 {loading && (
//                     <div style={styles.centerState}>
//                         <div style={styles.spinner} />
//                         <p style={styles.stateText}>Loading files...</p>
//                     </div>
//                 )}

//                 {error && (
//                     <div style={styles.errorBox}>
//                         <span>⚠ {error}</span>
//                         <button onClick={() => fetchFiles(currentFolder.id)} style={styles.retryBtn}>Retry</button>
//                     </div>
//                 )}

//                 {!loading && !error && items.length === 0 && (
//                     <div style={styles.centerState}>
//                         <p style={styles.stateText}>This folder is empty</p>
//                     </div>
//                 )}

//                 {!loading && !error && items.length > 0 && (
//                     <>
//                         {/* Folders */}
//                         {folders.length > 0 && (
//                             <section style={styles.section}>
//                                 <h2 style={styles.sectionTitle}>Folders <span style={styles.count}>{folders.length}</span></h2>
//                                 <div style={view === "grid" ? styles.grid : styles.list}>
//                                     {folders.map((item) => (
//                                         <button
//                                             key={item.id}
//                                             onClick={() => openFolder(item)}
//                                             style={view === "grid" ? styles.gridCard : styles.listRow}
//                                         >
//                                             <span style={{ ...styles.iconWrap, background: "#fff3cd", color: "#e6a817" }}>
//                                                 <FolderIcon />
//                                             </span>
//                                             <span style={styles.itemName}>{item.name}</span>
//                                             {view === "list" && (
//                                                 <span style={styles.itemMeta}>Folder</span>
//                                             )}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </section>
//                         )}

//                         {/* Files */}
//                         {files.length > 0 && (
//                             <section style={styles.section}>
//                                 <h2 style={styles.sectionTitle}>Files <span style={styles.count}>{files.length}</span></h2>
//                                 <div style={view === "grid" ? styles.grid : styles.list}>
//                                     {files.map((item) => (
//                                         <a
//                                             key={item.id}
//                                             href={item.webUrl}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             style={view === "grid" ? styles.gridCard : styles.listRow}
//                                         >
//                                             <span style={{ ...styles.iconWrap, background: "#e8f4fd", color: "#0078d4" }}>
//                                                 <FileIcon />
//                                             </span>
//                                             <span style={styles.itemName}>{item.name}</span>
//                                             {view === "list" && (
//                                                 <span style={styles.itemMeta}>{formatSize(item.size)}</span>
//                                             )}
//                                         </a>
//                                     ))}
//                                 </div>
//                             </section>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }

// Files.layout = (page) => <MainLayout
// >{page}</MainLayout>;

// const styles = {
//     page: {
//         minHeight: "100vh",
//         background: "#f0f2f5",
//         fontFamily: "'Segoe UI', system-ui, sans-serif",
//         padding: "0",
//     },
//     header: {
//         background: "#fff",
//         borderBottom: "1px solid #e5e7eb",
//         padding: "16px 32px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         position: "sticky",
//         top: 0,
//         zIndex: 10,
//     },
//     headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
//     logo: { fontSize: "28px", color: "#0078d4", lineHeight: 1 },
//     title: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827", letterSpacing: "-0.3px" },
//     subtitle: { margin: 0, fontSize: "12px", color: "#6b7280" },
//     viewToggle: { display: "flex", gap: "4px", background: "#f3f4f6", borderRadius: "8px", padding: "4px" },
//     toggleBtn: {
//         background: "none", border: "none", cursor: "pointer",
//         padding: "6px 10px", borderRadius: "6px", fontSize: "16px", color: "#6b7280",
//     },
//     toggleActive: { background: "#fff", color: "#0078d4", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
//     breadcrumb: {
//         padding: "12px 32px",
//         display: "flex",
//         alignItems: "center",
//         gap: "2px",
//         background: "#fff",
//         borderBottom: "1px solid #f3f4f6",
//     },
//     breadcrumbItem: { display: "flex", alignItems: "center", gap: "2px" },
//     breadcrumbSep: { color: "#d1d5db", display: "flex", alignItems: "center" },
//     breadcrumbBtn: {
//         background: "none", border: "none", cursor: "pointer",
//         padding: "4px 8px", borderRadius: "6px", fontSize: "13px",
//         color: "#6b7280", display: "flex", alignItems: "center", gap: "5px",
//         transition: "background 0.15s",
//     },
//     breadcrumbActive: { color: "#111827", fontWeight: 600, cursor: "default" },
//     homeIcon: { display: "flex", alignItems: "center", color: "#0078d4" },
//     content: { padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" },
//     section: { marginBottom: "32px" },
//     sectionTitle: {
//         fontSize: "13px", fontWeight: 600, color: "#6b7280",
//         textTransform: "uppercase", letterSpacing: "0.05em",
//         margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px",
//     },
//     count: {
//         background: "#e5e7eb", color: "#374151", borderRadius: "999px",
//         padding: "1px 8px", fontSize: "11px", fontWeight: 600,
//     },
//     grid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
//         gap: "12px",
//     },
//     list: { display: "flex", flexDirection: "column", gap: "4px" },
//     gridCard: {
//         background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px",
//         padding: "16px 12px", display: "flex", flexDirection: "column",
//         alignItems: "center", gap: "10px", cursor: "pointer",
//         textDecoration: "none", color: "inherit", transition: "all 0.15s",
//         boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//     },
//     listRow: {
//         background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px",
//         padding: "10px 16px", display: "flex", alignItems: "center",
//         gap: "12px", cursor: "pointer", textDecoration: "none",
//         color: "inherit", transition: "background 0.15s",
//     },
//     iconWrap: {
//         width: "36px", height: "36px", borderRadius: "8px",
//         display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//     },
//     itemName: {
//         fontSize: "13px", fontWeight: 500, color: "#111827",
//         overflow: "hidden", textOverflow: "ellipsis",
//         whiteSpace: "nowrap", maxWidth: "100%", flex: 1,
//     },
//     itemMeta: { fontSize: "12px", color: "#9ca3af", flexShrink: 0 },
//     centerState: {
//         display: "flex", flexDirection: "column",
//         alignItems: "center", justifyContent: "center",
//         padding: "80px 0", gap: "12px",
//     },
//     spinner: {
//         width: "32px", height: "32px", borderRadius: "50%",
//         border: "3px solid #e5e7eb", borderTopColor: "#0078d4",
//         animation: "spin 0.8s linear infinite",
//     },
//     stateText: { color: "#9ca3af", fontSize: "14px", margin: 0 },
//     errorBox: {
//         background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px",
//         padding: "14px 20px", color: "#dc2626", display: "flex",
//         alignItems: "center", justifyContent: "space-between", fontSize: "14px",
//     },
//     retryBtn: {
//         background: "#dc2626", color: "#fff", border: "none",
//         borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "13px",
//     },
//     authCard: {
//         maxWidth: "400px", margin: "120px auto", background: "#fff",
//         borderRadius: "16px", padding: "48px 40px",
//         textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
//         border: "1px solid #e5e7eb",
//     },
//     authIcon: { fontSize: "48px", marginBottom: "16px" },
//     authTitle: { margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#111827" },
//     authSubtitle: { margin: "0 0 28px", color: "#6b7280", fontSize: "14px" },
//     authButton: {
//         display: "inline-block", background: "#0078d4", color: "#fff",
//         padding: "12px 28px", borderRadius: "8px", textDecoration: "none",
//         fontWeight: 600, fontSize: "14px", transition: "background 0.15s",
//     },
// };
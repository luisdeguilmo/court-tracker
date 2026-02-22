import FileCard from "@/components/file-card";
import Toolbar from "@/components/toolbar";
import MainLayout from "@/Layouts/MainLayout";

const Files = () => {
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

            <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sampleFiles.map((file, index) => (
                    <FileCard
                        key={index}
                        fileName={file.fileName}
                        fileSize={file.fileSize}
                        fileType={file.fileType}
                        isFolder={file?.isFolder}
                    />
                ))}
            </div>
        </>
    );
};

Files.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Files;

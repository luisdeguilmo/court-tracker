import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilePlus, FileUp, FolderPlus, FolderUp, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { StandardFolderDialog } from "./standard-folder-dialog";
import CaseFolderDialog from "./case-folder-dialog";
import { can } from "@/utils/permission";
import { usePage } from "@inertiajs/react";
import UploadForm from "./upload-form";
import UploadFileDialog from "./upload-file-dialog";

export function AppDropdown({ parentId }) {
    const [isStandardFolderDialogOpen, setIsStandardFolderDialogOpen] =
        useState(false);
    const [isCaseFolderDialogOpen, setIsCaseFolderDialogOpen] = useState(false);
    const [isUploadFileDialogOpen, setIsUploadFileDialogOpen] = useState(false);
    const [folderId, setFolderId] = useState(null);

    useEffect(() => {
        // Get the query string from the URL
        const queryString = window.location.search; // "?folder_id=34"

        // Parse the query string
        const params = new URLSearchParams(queryString);

        // Get the value of "folder_id"
        const id = params.get("folder_id");
        setFolderId(id);
    }, []);

    const { auth } = usePage().props;
    const fileInputRef = useRef();

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    console.log(folderId);

    const path = window.location.pathname;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2 px-4">
                        <Plus className="w-5 h-5" />
                        New
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        {/* {can("upload documents", auth) && ( */}
                        <>
                            <DropdownMenuItem
                                onClick={() => {
                                    path === "/folders"
                                        ? handleButtonClick()
                                        : setIsUploadFileDialogOpen(true);
                                }}
                                // onClick={handleButtonClick}
                                // onClick={() => setIsUploadFileDialogOpen(true)}
                                className="flex items-center gap-3"
                            >
                                <FileUp className="w-5 h-5" />
                                Upload file
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-3">
                                <FolderUp className="w-5 h-5" />
                                Upload folder
                            </DropdownMenuItem>
                        </>
                        {/* )} */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-3">
                                <FolderPlus className="w-5 h-5" />
                                New folder
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setIsStandardFolderDialogOpen(true)
                                        }
                                    >
                                        Standard folder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setIsCaseFolderDialogOpen(true)
                                        }
                                    >
                                        Case folder
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <UploadFileDialog
                open={isUploadFileDialogOpen}
                setIsOpen={setIsUploadFileDialogOpen}
                fileInputRef={fileInputRef}
                folderId={folderId}
            />

            <StandardFolderDialog
                open={isStandardFolderDialogOpen}
                setIsOpen={setIsStandardFolderDialogOpen}
                parentId={parentId}
            />

            <CaseFolderDialog
                open={isCaseFolderDialogOpen}
                setIsOpen={setIsCaseFolderDialogOpen}
            />

            <UploadForm fileInputRef={fileInputRef} folderId={folderId} />
        </>
    );
}

export default AppDropdown;

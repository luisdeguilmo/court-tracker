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
import { FilePlus, FolderPlus, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { StandardFolderDialog } from "./standard-folder-dialog";
import CaseFolderDialog from "./case-folder-dialog";
import { can } from "@/utils/permission";
import { usePage } from "@inertiajs/react";
import UploadForm from "./upload-form";

export function AppDropdown({ parentId }) {
    const [isStandardFolderDialogOpen, setIsStandardFolderDialogOpen] =
        useState(false);
    const [isCaseFolderDialogOpen, setIsCaseFolderDialogOpen] = useState(false);

    const { auth } = usePage().props;
    const fileInputRef = useRef();

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

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
                        {can("upload documents", auth) && (
                            <>
                                <DropdownMenuItem
                                    onClick={handleButtonClick}
                                    className="flex items-center gap-3"
                                >
                                    <FilePlus className="w-5 h-5" />
                                    Upload file
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-3">
                                    <FilePlus className="w-5 h-5" />
                                    Upload folder
                                </DropdownMenuItem>
                            </>
                        )}
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

            <StandardFolderDialog
                open={isStandardFolderDialogOpen}
                setIsOpen={setIsStandardFolderDialogOpen}
                parentId={parentId}
            />

            <CaseFolderDialog
                open={isCaseFolderDialogOpen}
                setIsOpen={setIsCaseFolderDialogOpen}
            />

            <UploadForm fileInputRef={fileInputRef} folderId={24} />
        </>
    );
}

export default AppDropdown;

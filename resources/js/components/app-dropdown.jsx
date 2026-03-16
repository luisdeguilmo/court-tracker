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
import { useState } from "react";
import { StandardFolderDialog } from "./standard-folder-dialog";
import CaseFolderDialog from "./case-folder-dialog";

export function AppDropdown({ parentId }) {
    const [isStandardFolderDialogOpen, setIsStandardFolderDialogOpen] =
        useState(false);
    const [isCaseFolderDialogOpen, setIsCaseFolderDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="flex items-center gap-2 px-4"
                    >
                        <Plus className="w-5 h-5" />
                        New
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="flex items-center gap-3">
                            <FilePlus className="w-5 h-5" />
                            New file
                        </DropdownMenuItem>
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
        </>
    );
}

export default AppDropdown;

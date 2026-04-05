import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Download,
    EllipsisVertical,
    Eye,
    PenLine,
    Trash2,
    UserPlus,
} from "lucide-react";
import { Separator } from "./ui/separator";

export function FileMenuDropdown({ file, selectedFile, onClick }) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className={`-mr-[7.8px] p-2 rounded-full outline-none border-none focus:ring-0 hover:bg-gray-200 ${selectedFile && selectedFile?.id === file?.id && "bg-gray-100"}`}
                    >
                        <EllipsisVertical className="w-4 h-4 text-gray-700" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        {/* {can("upload documents", auth) && ( */}
                        <DropdownMenuItem
                            onClick={onClick}
                            className="flex items-center gap-3"
                        >
                            <Eye className="w-5 h-5" />
                            Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <>
                            <DropdownMenuItem className="flex items-center gap-3">
                                <Download className="w-5 h-5" />
                                Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="mb-1 flex items-center gap-3">
                                <PenLine className="w-5 h-5" />
                                Rename
                            </DropdownMenuItem>
                        </>
                        <Separator />
                        <DropdownMenuItem className="mt-1 flex items-center gap-3">
                            <UserPlus className="w-5 h-5" />
                            Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="mb-1 flex items-center gap-3">
                            <PenLine className="w-5 h-5" />
                            Change Color
                        </DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem className="mt-1 flex items-center gap-3">
                            <Trash2 className="w-5 h-5" />
                            Move to trash
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default FileMenuDropdown;

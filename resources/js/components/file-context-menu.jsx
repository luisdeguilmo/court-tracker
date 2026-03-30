import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Download, Eye, PenLine, Trash2, UserPlus } from "lucide-react";

export function FileContextMenu({ children, onClick }) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={onClick}>
                    <Eye className="w-5 h-5" />
                    Preview
                    {/* <ContextMenuShortcut>⌘[</ContextMenuShortcut> */}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuGroup>
                    <ContextMenuItem>
                        <Download className="w-5 h-5" />
                        Download
                        {/* <ContextMenuShortcut>⌘[</ContextMenuShortcut> */}
                    </ContextMenuItem>
                    <ContextMenuItem>
                        <PenLine className="w-5 h-5" />
                        Rename
                        {/* <ContextMenuShortcut>⌘]</ContextMenuShortcut> */}
                    </ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuGroup>
                    <ContextMenuItem>
                        <UserPlus className="w-5 h-5" />
                        Share
                        {/* <ContextMenuShortcut>⌘S</ContextMenuShortcut> */}
                    </ContextMenuItem>
                    <ContextMenuItem>
                        <PenLine className="w-5 h-5" />
                        Change Color
                        {/* <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut> */}
                    </ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuGroup>
                    <ContextMenuItem>
                        <Trash2 className="w-5 h-5" />
                        Move to trash
                        {/* <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut> */}
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    );
}

export default FileContextMenu;

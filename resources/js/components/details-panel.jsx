// import {
//     Sheet,
//     SheetContent,
//     SheetHeader,
//     SheetTitle,
// } from "@/components/ui/sheet";

// const DetailsPanel = ({ isOpen, setIsOpen }) => {
//     return (
//         <Sheet open={isOpen} onOpenChange={setIsOpen}>
//             <SheetContent side="right">
//                 <SheetHeader>
//                     <SheetTitle>Folder Details</SheetTitle>
//                 </SheetHeader>
//                 {/* your metadata here */}
//             </SheetContent>
//         </Sheet>
//     );
// };

// export default DetailsPanel;

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lock, PenLine, Plus, X } from "lucide-react";

export default function FileDetailsPanel({ item, isFolder, onClose }) {
    console.log(item);

    return (
        <div className="top-4 right-0">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {/* <Folder size={18} className="text-amber-500" /> */}
                    {isFolder ? (
                        <span className="font-semibold text-sm">
                            {item.folder_type?.id === 1
                                ? item.name
                                : (item.case_title ?? item.name)}
                        </span>
                    ) : (
                        <span className="font-semibold text-sm">
                            {item.name}
                        </span>
                    )}
                </div>
                <button onClick={() => onClose(false)}>
                    <X size={16} className="text-gray-400" />
                </button>
            </div>
            {/* rest of your panel content */}
            <p className="text-sm text-muted-foreground mb-4">
                Add a description
            </p>
            <Separator className="mb-4" />

            {/* Has access */}
            <p className="text-sm font-medium mb-3">Has access</p>
            <Avatar className="mb-2">
                <AvatarFallback className="bg-blue-600 text-white">
                    {/* <UserIcon size={16} /> */}
                </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                <Lock size={12} /> This item is not shared
            </div>
            <p className="text-sm text-blue-600 cursor-pointer mb-4">
                Manage access
            </p>
            <Separator className="mb-4" />

            {/* Activity */}
            <p className="text-sm font-medium mb-1">Activity</p>
            <p className="text-xs text-muted-foreground mb-3">Last month</p>

            {/* {file?.activity.map((item, i) => (
                <div
                    key={i}
                    className="bg-muted rounded-lg p-3 flex gap-3 mb-2"
                >
                    <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                        {item.type === "edit" ? (
                            <PenLine size={13} className="text-blue-600" />
                        ) : (
                            <Plus size={13} className="text-blue-600" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                            {item.date}
                        </p>
                    </div>
                </div>
            ))} */}

            <Separator className="my-4" />

            <p className="text-sm font-medium mb-1">Folder Details</p>

            {!isFolder && (
                <>
                    {" "}
                    <p className="text-xs font-medium mt-3 text-gray-800">
                        Type
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                        {item.extension}
                    </p>
                    <p className="text-xs font-medium mt-3 text-gray-800">
                        Size
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                        {item.size_human}
                    </p>
                    <p className="text-xs font-medium mt-3 text-gray-800">
                        Storage used
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                        {item.size_human}
                    </p>
                </>
            )}

            <p className="text-xs font-medium mt-3 text-gray-800">Owner</p>
            <p className="text-xs text-muted-foreground mb-3">{item.owner}</p>

            <p className="text-xs font-medium mt-3 text-gray-800">Modified</p>
            <p className="text-xs text-muted-foreground mb-3">
                {" "}
                {item.updated_at
                    ? new Date(item.updated_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                      })
                    : "—"}
            </p>

            <p className="text-xs font-medium mt-3 text-gray-800">Opened</p>
            <p className="text-xs text-muted-foreground mb-3">
                {" "}
                {item.created_at
                    ? new Date(item.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                      })
                    : "—"}
            </p>

            <p className="text-xs font-medium mt-3 text-gray-800">Created</p>
            <p className="text-xs text-muted-foreground mb-3">
                {item.created_at
                    ? new Date(item.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                      })
                    : "—"}
            </p>

            <p className="text-sm text-blue-600 text-center cursor-pointer">
                More details
            </p>
        </div>
    );
}

// export default function FileDetailsPanel({ open, onClose, file }) {
//   return (
//     <Sheet open={open} onOpenChange={onClose}>
//       <SheetContent side="right" className="w-[280px] sm:w-[320px] overflow-y-auto">

//         <SheetHeader className="flex-row items-center gap-2 space-y-0 pb-4">
//           {/* <FolderIcon className="text-amber-500" /> */}
//           <SheetTitle>{file?.name}</SheetTitle>
//         </SheetHeader>

//       </SheetContent>
//     </Sheet>
//   )
// }

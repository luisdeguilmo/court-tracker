import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { router, useForm } from "@inertiajs/react";
import UploadTabs from "./upload-tabs";
import UploadDropzone from "./upload-drop-zone";
import UploadForm from "./upload-form";
import { Upload } from "lucide-react";
import { useState } from "react";

export function UploadFileDialog({ open, setIsOpen, fileInputRef, folderId }) {
    const [tab, setTab] = useState("my_computer");
    // const { data, setData, post, processing, errors } = useForm({
    //     name: "",
    //     parent_id: parentId,
    // });

    const handleSubmit = (e) => {
        // e.preventDefault();
        // post("/folders", {
        //     onSuccess: () => {
        //         setIsOpen(false);
        //     },
        // });
        // console.log(parentId);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    console.log(folderId);

    return (
        <>
            <Dialog open={open} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogTitle>Upload file</DialogTitle>
                    <DialogDescription className={"-mt-4"}>
                        Files added here become part of your organization's
                        official records.
                    </DialogDescription>
                    <UploadTabs setTab={setTab} />

                    {/* <div onClick={handleButtonClick}>
                        <div className="mb-3 rounded-lg bg-background p-3 shadow-sm">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <p className="text-sm font-medium">
                            Drag & drop files or folders here
                        </p>

                        <p className="text-xs text-muted-foreground">
                            or click to browse your computer
                        </p>
                    </div>

                    <UploadForm
                        fileInputRef={fileInputRef}
                        folderId={folderId}
                    /> */}

                    {tab === "my_computer" ? (
                        <UploadDropzone
                            fileInputRef={fileInputRef}
                            folderId={folderId}
                        />
                    ) : (
                        <div>My Drive</div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Upload to Records</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <UploadForm fileInputRef={fileInputRef} folderId={folderId} />
        </>
    );
}

export default UploadFileDialog;

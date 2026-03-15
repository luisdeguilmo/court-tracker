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

export function StandardFolderDialog({ open, setIsOpen }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("jsjdbjddf");

        post("/folders", {
            onSuccess: () => {
                setIsOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>New folder</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Folder name</Label>
                            <Input
                                id="name-1"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                // defaultValue="Pedro Duarte"
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default StandardFolderDialog;

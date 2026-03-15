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

export function CaseFolderDialog({ open, setIsOpen }) {
    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <form>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>New folder</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Case title</Label>
                            <Input
                                id="name-1"
                                name="name"
                                // defaultValue="Pedro Duarte"
                            />
                            <Label htmlFor="name-1">Case number</Label>
                            <Input
                                id="name-1"
                                name="name"
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
                </DialogContent>
            </form>
        </Dialog>
    );
}

export default CaseFolderDialog;

import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import DataTable from "@/components/users-table";
import { columns } from "../../constant/user-table-columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddUserDialog from "@/components/add-user-dialog";
import SearchBar from "@/components/search-bar";

export default function UsersIndex() {
    const { users } = usePage().props;
    const [open, setOpen] = useState(false);

    return (
        <div>
            <h1>Users</h1>

            <div className="mt-6 mb-2 flex items-center justify-between">
                <SearchBar />
                <Button onClick={() => setOpen(true)}>
                    {" "}
                    <Plus className="w-5 h-5" /> Add User
                </Button>
            </div>

            <DataTable columns={columns} data={users.data} />

            <AddUserDialog open={open} setIsOpen={setOpen} />
        </div>
    );
}

UsersIndex.layout = (page) => <MainLayout>{page}</MainLayout>;

export const columns = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div
                className={`w-fit px-3 py-1 rounded ${row.original.status === "active" ? "bg-green-600" : "bg-red-600"} text-white`}
            >
                {row.original.status
                    .charAt(0)
                    .toUpperCase()
                    .concat(row.original.status.substring(1))}
            </div>
        ),
    },
    {
        accessorKey: "roles",
        header: () => <div className="ml-12">Role</div>,
        cell: ({ row }) => <div className="ml-12">{row.original.roles}</div>,
    },
    {
        accessorKey: "permissions_length",
        header: "Permissions",
    },
    {
        id: "actions", // note: use id since no accessorKey
        header: () => <div className="text-right mr-10">Actions</div>,
        cell: ({ row }) => {
            const user = row.original;

            const handleEdit = () => {
                // // Navigate to edit page or open modal
                // // Example using Inertia:
                // Inertia.visit(`/users/${user.id}/edit`);
            };

            const handleDelete = () => {
                // if (!confirm(`Are you sure you want to delete ${user.name}?`))
                //     return;
                // fetch(`/users/${user.id}`, {
                //     method: "DELETE",
                //     headers: {
                //         "Content-Type": "application/json",
                //         "X-CSRF-TOKEN": document.querySelector(
                //             'meta[name="csrf-token"]',
                //         ).content,
                //     },
                // }).then(() => {
                //     window.location.reload(); // Or Inertia.visit("/users") for SPA feel
                // });
            };

            return (
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={handleEdit}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            );
        },
    },
];

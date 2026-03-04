import { Link } from "@inertiajs/react";

export default function Index({ items, currentFolder }) {
    return (
        <div style={{ padding: 20 }}>
            <h1>My Box Files</h1>

            {items.length === 0 && <p>No files found.</p>}

            {items.map((item) => (
                <div key={item.id}>
                    {item.type === "folder" ? (
                        <Link href={`/box/files/${item.id}`}>
                            📁 {item.name}
                        </Link>
                    ) : (
                        <span>📄 {item.name}</span>
                    )}
                </div>
            ))}
        </div>
    );
}

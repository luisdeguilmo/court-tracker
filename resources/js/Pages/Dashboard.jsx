import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MainLayout from "@/Layouts/MainLayout";

export default function Dashboard() {
    return (
        <>
            {/* header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        > */}
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = page => <AuthenticatedLayout>{page}</AuthenticatedLayout>;


// import MainLayout from "@/Layouts/MainLayout";

// const Dashboard = () => {
//     return <h1>Dashboard</h1>;
// };

// Dashboard.layout = page => <MainLayout>{page}</MainLayout>;

// export default Dashboard;
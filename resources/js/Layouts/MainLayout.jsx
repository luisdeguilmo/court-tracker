import AppSideBar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { usePage } from "@inertiajs/react";

const MainLayout = ({ children }) => {
    const path = window.location.pathname;

    const user = usePage().props.auth.user;

    console.log(user);

    return (
        <SidebarProvider>
            <div className="flex w-full h-screen overflow-hidden">
                <AppSideBar />
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <Header />
                    <div
                        className={`px-10 py-6 flex-1 ${path === "/folders" || path === "/records" ? "overflow-y-hidden" : "overflow-y-scroll"}`}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;

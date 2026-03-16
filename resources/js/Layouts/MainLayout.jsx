import AppSideBar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";

const MainLayout = ({ children }) => {
    return (
        <SidebarProvider>
            <div className="flex w-full h-screen overflow-hidden">
                <AppSideBar />
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <Header />
                    <div className="px-10 py-6 flex-1 overflow-y-scroll">
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;
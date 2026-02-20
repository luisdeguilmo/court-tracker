import AppSideBar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Head } from "@inertiajs/react";

const MainLayout = ({ children }) => {
    return (
        <>
            <SidebarProvider>
                {/* <Head title={"Layout"} /> */}
                {/* <div className="flex flex-col"></div> */}
                <div className="flex">
                    <AppSideBar />

                    <div className="flex flex-grow overflow-hidden">
                        <div
                            className="w-full px-4 py-8 overflow-hidden overflow-y-auto md:p-12"
                            scroll-region="true"
                        >
                            {/* <FlashMessages /> */}
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </>
    );
};

export default MainLayout;

import AppSideBar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Head } from "@inertiajs/react";

const MainLayout = ({ children }) => {
    return (
        <>
            <SidebarProvider>
                {/* <Head title={"Layout"} /> */}
                {/* <div className="flex flex-col"></div> */}
                <div className="w-full flex">
                    <AppSideBar />

                    <div className="w-full flex flex-col overflow-hidden">
                        <Header />
                        <div
                            className="px-10 py-6 overflow-hidden overflow-y-auto"
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

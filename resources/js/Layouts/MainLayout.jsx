// // import AppSideBar from "@/components/app-sidebar";
// // import Header from "@/components/header";
// // import { SidebarProvider } from "@/components/ui/sidebar";
// // import { Head } from "@inertiajs/react";

// // const MainLayout = ({ children }) => {
// //     return (
// //         <>
// //             <SidebarProvider>
// //                 {/* <Head title={"Layout"} /> */}
// //                 {/* <div className="flex flex-col"></div> */}
// //                 <div className="w-full flex">
// //                     <AppSideBar />

// //                     <div className="w-full flex flex-col overflow-hidden">
// //                         <div>
// //                             <Header />
// //                         </div>
// //                         <div
// //                             className="px-10 py-6 border overflow-hidden overflow-y-auto"
// //                             scroll-region="true"
// //                         >
// //                             {/* <FlashMessages /> */}
// //                             {children}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </SidebarProvider>
// //         </>
// //     );
// // };

// // export default MainLayout;

// import AppSideBar from "@/components/app-sidebar";
// import Header from "@/components/header";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"; // 👈 import SidebarInset

// const MainLayout = ({ children }) => {
//     return (
//         <SidebarProvider>
//             <div className="w-full">
//                 <div className="block">
//                     <AppSideBar />
//                 </div>

//                 <div className="w-full">
//                     <SidebarInset>
//                         <div>
//                             <Header />
//                             <div className="px-10 py-6 overflow-hidden overflow-y-auto">
//                                 {children}
//                             </div>
//                         </div>
//                     </SidebarInset>
//                 </div>
//             </div>

//             {/* <div className="flex flex-row">
//                 <div className="border w-11 h-screen">

//                 </div>
//                 <div className="border w-11 bg-red-400 h-screen">

//                 </div>
//                 <div>
//                     <Header />
//                     <div className="px-10 py-6 overflow-hidden overflow-y-auto">
//                         {children}
//                     </div>
//                 </div>
//             </div> */}
//         </SidebarProvider>
//     );
// };

// export default MainLayout;

import AppSideBar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Head, usePage } from "@inertiajs/react";

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
                            className="px-10 pb-6 pt-20 overflow-hidden overflow-y-auto"
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

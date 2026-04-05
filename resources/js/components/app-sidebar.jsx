import {
    BookText,
    ChevronsUpDown,
    Folder,
    LayoutDashboard,
    Settings,
    Trash,
    Trash2,
    Users,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar";
import { Link } from "@inertiajs/react";

const menu_items = [
    {
        title: "Dashboard",
        link: "dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Records",
        link: "records.index",
        icon: Folder,
    },
    {
        title: "My Drive",
        link: "folders.index",
        icon: BookText,
    },
    {
        title: "Users",
        link: "users.index",
        icon: Users,
    },
    // {
    //     title: "Trash",
    //     link: "settings",
    //     icon: Trash2,
    // },
];

const AppSideBar = () => {
    const path = window.location.pathname;

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarContent className={""}>
                <SidebarHeader className="text-lg text-center font-bold px-4 py-2">
                    Case Tracker
                </SidebarHeader>
                <SidebarMenu>
                    {menu_items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                className={`p-4 text-gray-900 hover:bg-gray-100 ${path === item.url && "bg-gray-100"}`}
                                asChild
                            >
                                <Link
                                    href={route(item.link)}
                                    className="flex items-center gap-2"
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span>
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>

                 {/* <SidebarFooter>
                <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://i.pravatar.cc/40"
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col text-sm">
                            <span className="font-medium">shadcn</span>
                            <span className="text-muted-foreground text-xs">
                                m@example.com
                            </span>
                        </div>
                    </div>
                    <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                </div>
            </SidebarFooter> */}
            </SidebarContent>

        </Sidebar>
    );
};

export default AppSideBar;

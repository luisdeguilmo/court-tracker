import {
    BookText,
    ChevronsUpDown,
    Folder,
    LayoutDashboard,
    Settings,
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

const menu_items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Folders",
        url: "/folders",
        icon: Folder,
    },
    {
        title: "Files",
        url: "/box/files",
        icon: BookText,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

const AppSideBar = () => {
    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader className="text-lg font-semibold px-4 py-2">
                RTC 1
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {menu_items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton className={"px-6"} asChild>
                                <a
                                    href={item.url}
                                    className="flex items-center gap-2"
                                >
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-gray-900">
                                        {item.title}
                                    </span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            {/* 👇 Footer Section */}
            <SidebarFooter>
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
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSideBar;

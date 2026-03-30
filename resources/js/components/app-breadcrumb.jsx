import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";

const AppBreadCrumb = ({ current, breadcrumbs, currentFolder, onNavigate }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList className={"text-[15px]"}>
                <BreadcrumbItem>
                    <BreadcrumbLink
                        onClick={() => onNavigate(null)}
                        style={{ cursor: "pointer" }}
                    >
                        <h1 className="text-black text-lg">{current}</h1>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbs.map((crumb) => (
                    <>
                        <BreadcrumbSeparator key={`sep-${crumb.id}`} />
                        <BreadcrumbItem key={crumb.id}>
                            <BreadcrumbLink
                                onClick={() => onNavigate(crumb)}
                                style={{ cursor: "pointer" }}
                            >
                                {crumb.name}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                ))}

                {currentFolder && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {currentFolder.name}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default AppBreadCrumb;

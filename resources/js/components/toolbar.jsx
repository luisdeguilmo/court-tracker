import AppBreadCrumb from "./app-breadcrumb";
import SwitchLayout from "./switch-layout";

const Toolbar = () => {
    return (
        <div className="py-2.5">
            <div className="flex justify-between items-center">
                <AppBreadCrumb />

                <SwitchLayout />
            </div>
        </div>
    );
};

export default Toolbar;

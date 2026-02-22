import SearchBar from "./search-bar";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
    return (
        <header className="px-4 py-2.5 flex justify-between items-center">
            <SidebarTrigger />
            <SearchBar />
        </header>
    );
};

export default Header;
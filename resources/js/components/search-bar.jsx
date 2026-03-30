import { Search } from "lucide-react";

const SearchBar = () => {
    return (
        <div className="px-4 py-1.5 ml-3.5 rounded-md flex items-center gap-4 border">
            <Search className="w-4 h-4 text-gray-600" />
            <input type="text" placeholder="Search files..." className="outline-none" />
        </div>
    );
};

export default SearchBar;
import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const SwitchLayout = ({ layout, onSetLayout }) => {
    return (
        <div className="border rounded-md">
            <ToggleGroup type="single">
                <ToggleGroupItem
                    onClick={() => onSetLayout("list")}
                    value="list"
                    title="List layout"
                    className={`border-r ${layout === "list" && "bg-gray-100"}`}
                >
                    <List className="w-4 h-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                    onClick={() => onSetLayout("grid")}
                    value="grid"
                    title="Grid layout"
                    className={`${layout === "grid" && "bg-gray-100"}`}
                >
                    <LayoutGrid className="w-4 h-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export default SwitchLayout;

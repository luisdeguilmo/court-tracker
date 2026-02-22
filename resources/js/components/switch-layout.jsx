import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const SwitchLayout = () => {
    return (
        <div className="border rounded-md">
            <ToggleGroup type="single">
                <ToggleGroupItem value="a" title="List layout" className={'border-r'}>
                    <List className="w-4 h-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="b" title="Grid layout">
                    <LayoutGrid className="w-4 h-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};

export default SwitchLayout;

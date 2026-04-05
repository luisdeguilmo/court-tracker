import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function UploadTabs({ setTab }) {
    return (
        <Tabs defaultValue="computer" className="w-full">
            <TabsList className="bg-transparent rounded-none p-0">
                <TabsTrigger
                    onClick={() => setTab('my_computer')}
                    value="computer"
                    className="
            rounded-none shadow-none border-b-2 border-transparent
            data-[state=active]:border-b-gray-800
            data-[state=active]:shadow-none
          "
                >
                    From my computer
                </TabsTrigger>

                <TabsTrigger
                    onClick={() => setTab('my_drive')}
                    value="drive"
                    className="
            rounded-none shadow-none border-b-2 border-transparent
            data-[state=active]:border-b-gray-800
            data-[state=active]:shadow-none
          "
                >
                    From My Drive
                </TabsTrigger>
            </TabsList>

            <TabsContent value="computer">
                {/* Content for computer */}
            </TabsContent>

            <TabsContent value="drive">{/* Content for drive */}</TabsContent>
        </Tabs>
    );
}

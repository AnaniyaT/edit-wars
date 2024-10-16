import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import Editor from "@/components/editor.tsx";

function EditorPage() {
    return (
        <div
            className="
                w-full h-full bg-white flex flex-col max-w-default mx-auto rounded-2xl
                border overflow-hidden
             "
        >
            <input
                className="
                    px-8 py-6 border-b text-2xl font-bold text-gray-700 focus:outline-none
                   "
                defaultValue={"Untitled Document"}
            />
            <ScrollArea className="h-full">
                <Editor />
            </ScrollArea>
        </div>
    )
}

export default EditorPage;
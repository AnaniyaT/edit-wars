import DocumentList from "@/components/document-list";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import Doc from "@/lib/models/document";
  
import { FaPlus } from "react-icons/fa";

import { ScrollArea } from "@/components/ui/scroll-area";

const documents: Doc[] = [
    {
        id: "1",
        title: "Document 1",
        description: "Document 1 Description",
    },
    {
        id: "2",
        title: "Document 2",
        description: "Document 2 Description",
    },
    {
        id: "3",
        title: "Document 3",
        description: "Document 3 Description",
    },
    {
        id: "4",
        title: "Document 4",
        description: "Document 4 Description",
    },
    {
        id: "5",
        title: "Document 5",
        description: "Document 5 Description",
    },
    {
        id: "6",
        title: "Document 6",
        description: "Document 6 Description",
    },
    {
        id: "7",
        title: "Document 7",
        description: "Document 7 Description",
    },
    {
        id: "8",
        title: "Document 8",
        description: "Document 8 Description",
    },
    {
        id: "9",
        title: "Document 9",
        description: "Document 9 Description",
    },
    {
        id: "10",
        title: "Document 10",
        description: "Document 10 Description",
    },
    {
        id: "11",
        title: "Document 11",
        description: "Document 11 Description",
    },
    {
        id: "12",
        title: "Document 12",
        description: "Document 12 Description",
    },
    {
        id: "13",
        title: "Document 13",
        description: "Document 13 Description",
    },
    {
        id: "14",
        title: "Document 14",
        description: "Document 14 Description",
    },
    {
        id: "15",
        title: "Document 15",
        description: "Document 15 Description",
    },
    {
        id: "16",
        title: "Document 16",
        description: "Document 16 Description",
    },
    {
        id: "17",
        title: "Document 17",
        description: "Document 17 Description",
    },
    {
        id: "18",
        title: "Document 18",
        description: "Document 18 Description",
    },
    {
        id: "19",
        title: "Document 19",
        description: "Document 19 Description",
    },
    {
        id: "20",
        title: "Document 20",
        description: "Document 20 Description",
    },
    {
        id: "21",
        title: "Document 21",
        description: "Document 21 Description",
    },
    {
        id: "22",
        title: "Document 22",
        description: "Document 22 Description",
    },
    {
        id: "23",
        title: "Document 23",
        description: "Document 23 Description",
    },
    {
        id: "24",
        title: "Document 24",
        description: "Document 24 Description",
    }
]


function DashboardPage() {
    return (
        <div className="w-full h-full bg-white flex flex-col max-w-default mx-auto rounded-2xl border">
            <h1 className="px-8 py-6 border-b text-2xl font-bold text-gray-700">
                Documents
            </h1>
            <ScrollArea className="h-full">
                <div className="w-full h-[calc(100%-5rem)] flex flex-col px-2 md:px-8 py-8">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipContent className="bg-gray-600">
                                Create a new document
                            </TooltipContent>
                            <TooltipTrigger className="w-min">
                                <div 
                                    className="
                                        w-min cursor-pointer hover:bg-gray-100 active:scale-95 transition-transform
                                        rounded-xl border-[1.5px]
                                    "
                                >
                                    <div className="p-16 flex flex-col gap-2 items-center justify-center">
                                        <FaPlus className="w-10 h-10 text-gray-500" />
                                    </div>
                                </div>
                            </TooltipTrigger>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="mt-4 px-2 h-[calc(100%-10.5rem-3px)] flex-col">
                        <h2 className="text-lg text-gray-600 border-b py-4">
                            Recent Documents
                        </h2>
                        <DocumentList className="h-[calc(100%-3.75rem)]" documents={documents} />
                    </div>
                </div>
            </ScrollArea>
            
        </div>
    )
}

export default DashboardPage;
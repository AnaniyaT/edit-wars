import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
Tooltip,
TooltipContent,
TooltipProvider,
TooltipTrigger,
} from "@/components/ui/tooltip"

import Doc from "@/lib/models/document";
import { BsThreeDotsVertical } from "react-icons/bs";

interface DocumentListProps {
    documents: Doc[];
    className?: string;
}

function DocumentList(props: DocumentListProps) {
    return (
        <div className="my-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.documents.map((doc) => (
                <DocumentItem key={doc.id} {...doc} />
            ))}
        </div>
    )
}

function DocumentItem(props: Doc) {
    return (
        <Card 
            key={props.id} 
            className="
                shadow-none hover:bg-gray-50 cursor-pointer active:scale-95
                transition-transform duration-100 ease-in-out
                "
            >
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle>{props.title}</CardTitle>
                    <CardDescription>{props.description}</CardDescription>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild className="">
                            <button className="p-1 rounded-full hover:bg-gray-100">
                                <BsThreeDotsVertical />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Options</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Quos blanditiis aspernatur sapiente non magnam id, magni optio, 
                    officia nobis enim sequi cupiditate nam, eum beatae mollitia 
                    deserunt fuga explicabo rerum.
                </p>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-gray-500">Created 2 days ago</p>
            </CardFooter>
        </Card>
    )
}

export default DocumentList;
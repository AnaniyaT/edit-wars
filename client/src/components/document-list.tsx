import {
    Card,
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

import { DocumentInfo } from "@/lib/models/document.ts";
import { BsThreeDotsVertical } from "react-icons/bs";

import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
import {useNavigate} from "react-router-dom";

TimeAgo.addLocale(en);

interface DocumentListProps {
    documents: DocumentInfo[];
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

function DocumentItem(props: DocumentInfo) {
    const navigate = useNavigate();
    const timeAgo = new TimeAgo("en-US");
    const onClick = () => {
        navigate({ pathname: "/editor", search: `?d=${props.id}` });
    }
    return (
        <Card 
            key={props.id}
            onClick={onClick}
            className="
                shadow-none hover:bg-gray-50 cursor-pointer active:scale-95
                transition-transform duration-100 ease-in-out
                "
            >
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle>{props.title}</CardTitle>
                    <CardDescription>{props.ownerId}</CardDescription>
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
            <CardFooter>
                <p className="text-sm text-gray-500">Created {timeAgo.format(props.createdAt)}</p>
            </CardFooter>
        </Card>
    )
}

export default DocumentList;
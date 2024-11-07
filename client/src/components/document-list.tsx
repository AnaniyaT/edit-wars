import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


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
import userGetUser from "@/hooks/use-get-user.ts";

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
    const { user } = userGetUser(props.ownerId);
    const timeAgo = new TimeAgo("en-US");
    const onClick = () => {
        navigate({ pathname: "/editor", search: `?d=${props.id}` });
    }
    const onOptionsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }
    return (
        <Card 
            key={props.id}
            onClick={onClick}
            className="
                shadow-none hover:bg-gray-50 cursor-pointer
                "
            >
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle>{props.title}</CardTitle>
                    <CardDescription>{user ? user.username : "Unknown user"}</CardDescription>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild className="">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button onClick={onOptionsClick} className="p-2 -mt-6 rounded-full hover:bg-gray-100">
                                        <BsThreeDotsVertical />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[8rem] p-0">
                                    <button
                                        onClick={onOptionsClick}
                                        className="w-full text-left px-4 py-4 hover:bg-gray-100 active:scale-95 transition-transform"
                                    >
                                        Delete
                                    </button>
                                </PopoverContent>
                            </Popover>
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
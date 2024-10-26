import useFetch from "@/hooks/use-fetch.ts";
import { DocumentInfo } from "@/lib/models/document.ts";
import Config from "@/lib/config.ts";
import {useEffect} from "react";
import {useToast} from "@/hooks/use-toast.ts";
import {useNavigate} from "react-router-dom";

function useGetDocuments() {
    const url = `${Config.formattedBaseUrl()}/documents`;
    const transformResponse = (res: any) => {
        if (!res) return [];
        return res.map((doc: any) => DocumentInfo.fromJson(doc))
    };
    const { loading, success, isError, error, data } = useFetch<DocumentInfo[]>(url, true, transformResponse);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (isError) {
            toast({ title: "Error", description: error?.message, variant: "destructive" });
            if ((error as any)?.status_code === 401) {
                navigate("/auth");
            }
        }
    }, [isError]);

    return { loading, success, documents: data };
}

export default useGetDocuments;
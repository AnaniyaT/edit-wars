
import useFetch from "@/hooks/use-fetch.ts";
import { DocumentInfo } from "@/lib/models/document.ts";
import Config from "@/lib/config.ts";
import {useEffect} from "react";
import {useToast} from "@/hooks/use-toast.ts";
import {useNavigate} from "react-router-dom";

function useCreateDocument() {
    const url = `${Config.formattedBaseUrl()}/documents`;
    const transformResponse = (res: any) => {
        return DocumentInfo.fromJson(res);
    };
    const { query, loading, success, isError, error, data } = useFetch<DocumentInfo>(url, false, transformResponse);
    const navigate = useNavigate();
    const { toast } = useToast();

    const create = (title: string) => {
        return query({
            method: "POST",
            body: JSON.stringify({ title })
        });
    }

    useEffect(() => {
        if (isError) {
            toast({ title: "Error", description: error?.message, variant: "destructive" });
            if ((error as any)?.status_code === 401) {
                navigate("/auth");
            }
        }

        if (success) {
            navigate(`/editor?d=${data!.id}`);
        }
    }, [isError, success]);

    return { create , loading, success, document: data };
}

export default useCreateDocument;
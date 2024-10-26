import {useEffect, useState} from "react";

type FetchOptions = RequestInit

function useFetch<T>(url: string, fetchInitially?: boolean, transformResponse?: (resposne: any) => T) {
    const [loading, setIsLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<Error>()
    const [data, setData] = useState<T>()

    const query = async (fetchOptions?: FetchOptions ): Promise<T | undefined> => {
        setIsLoading(true);
        if (!fetchOptions) {
            fetchOptions = {
                headers: {
                    Authorization: `Basic ${localStorage.getItem("auth_token")}`
                }
            }
        } else {
            fetchOptions.headers = {
                ...fetchOptions.headers,
                Authorization: `Basic ${localStorage.getItem("auth_token")}`
            }
        }
        try {
            const response = await fetch(url, fetchOptions);
            if (!response.ok) {
                console.log("bruv")
                throw new Error((await response.json()).message);
            }
            const json = await response.json();
            setSuccess(true);
            const obj = !!transformResponse ? transformResponse(json) : json;
            setData(obj);
            setIsError(false);
            setIsLoading(false)
            return obj;
        } catch (e) {
            console.log("error caught")
            setSuccess(false);
            setIsLoading(false);
            setIsError(true);
            setError(e as Error);
        }
    }

    useEffect(() => {
        if (!!fetchInitially) {
            query();
        }
    }, []);

    return { query, loading, data, success, isError, error }
}

export default useFetch;
import { useEffect, useState } from "react";

export const useFetcher = async (url: string) => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (!url) throw new Error("URL to fetch is missing.");
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: abortController.signal });
        const fetchedData = await response.json();
        setData(fetchedData ?? {});
      } catch (error: any) {
        if (error.name === "AbortError") {
          // That's fine and expected
        } else {
          throw error;
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return data;
};

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { config } from "../config";

interface APIResult<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

/**
 * API hook for GET
 */
export function useGet<R>(
  path: string,
  urlParams?: { [key: string]: unknown },
): APIResult<R> & { fetch: (params?: { [key: string]: unknown }) => void } {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [params, setParams] = useState<{ [key: string]: unknown }>(urlParams || {});

  // just a var that we increment for refetch
  const [refetchVar, setRefetchVar] = useState<number>(0);

  function fetch(params?: { [key: string]: unknown }) {
    if (params) setParams(params);
    else {
      // force useEffect
      setRefetchVar((e) => {
        return e + 1;
      });
    }
  }

  useEffect(() => {
    const main = async () => {
      setData(null);
      setLoading(true);
      setError(null);
      try {
        const response = await axios({
          method: "GET",
          params,
          url: `${config.api_path}${path}`,
          responseType: "json",
        });
        setData(response.data as R);
      } catch (e) {
        setError(e as AxiosError);
      } finally {
        setLoading(false);
      }
    };
    main();
  }, [path, params, refetchVar]);

  return { loading, error, data, fetch };
}

export function useLazyGet<R>(path: string): APIResult<R> & { fetch: (params?: { [key: string]: unknown }) => void } {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  async function fetch(params?: { [key: string]: unknown }): Promise<R> {
    setData(null);
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        method: "GET",
        params,
        url: `${config.api_path}${path}`,
        responseType: "json",
      });
      setData(response.data as R);
      return response.data as R;
    } catch (e) {
      setError(e as AxiosError);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, fetch };
}

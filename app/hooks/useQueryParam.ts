"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useQueryParam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setQueryParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const getQueryParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);

  return { setQueryParam, getQueryParam };
}

import { useLoading } from "@/components/LoadingContext";

export function useFetchWithLoading() {
  const { startLoading, stopLoading } = useLoading();

  return async (input: RequestInfo, init?: RequestInit) => {
    startLoading();
    try {
      const res = await fetch(input, init);
      return res;
    } finally {
      stopLoading();
    }
  };
}

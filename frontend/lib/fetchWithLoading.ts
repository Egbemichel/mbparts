import { useCallback } from "react";

/**
 * Usage: Call this hook inside your component, then use fetchWithLoading for async requests.
 * Example:
 *   const fetchWithLoading = useFetchWithLoading();
 *   await fetchWithLoading(() => fetch(...));
 */
export function useFetchWithLoading() {
  return useCallback(
    async <T>(fetcher: () => Promise<T>): Promise<T> => {
      // If you want to show a loading indicator, handle it with local state in your component.
      const result = await fetcher();
      return result;
    },
    []
  );
}

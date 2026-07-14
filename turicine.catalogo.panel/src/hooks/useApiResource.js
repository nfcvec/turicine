import { useCallback, useEffect, useState } from "react";

// Centralizes the read pattern for any backend resource:
// - fetches on mount (fresh data every time the component mounts)
// - aborts the in-flight request on unmount
// - exposes refetch() for manual refresh controls and post-mutation reloads
//
// The caller MUST pass a stable `fetcher` (wrap it in useCallback), e.g.
//   const fetcher = useCallback((signal) => listMovies(signal), []);
//   const { data, loading, error, refetch } = useApiResource(fetcher);
export function useApiResource(fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(
    (signal) => {
      setLoading(true);
      setError(null);
      return fetcher(signal)
        .then((result) => {
          setData(result);
          return result;
        })
        .catch((err) => {
          if (err.name !== "AbortError") setError(err.message);
        })
        .finally(() => setLoading(false));
    },
    [fetcher],
  );

  useEffect(() => {
    const controller = new AbortController();
    refetch(controller.signal);
    return () => controller.abort();
  }, [refetch]);

  return { data, loading, error, refetch };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import {
  getFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  type Feedback,
} from "../api/feedbacks";

export function useFeedbacks(initialPage = 1, limit = 10) { 
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const fetchFeedbacks = useCallback(
    async (reset = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const currentPage = reset ? 1 : page;
        const data = await getFeedbacks(currentPage, limit, search);
        const items = data.items || [];

        setFeedbacks((prev) => {
          const combined = reset ? items : [...prev, ...items];

          // Remove duplicados pelo idfeedback
          const uniqueMap = new Map<string, Feedback>();
          combined.forEach(f => uniqueMap.set(f.idfeedback, f));

          return Array.from(uniqueMap.values());
        });

        setHasMore(items.length === limit);
      } catch (err: any) {
        console.error("Erro ao buscar feedbacks:", err);
        setError(err?.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, loading]
  );

  // Sempre que muda a página, carrega os próximos
  useEffect(() => {
    fetchFeedbacks(page === 1);
  }, [page, fetchFeedbacks]);

  const handleSearch = useMemo(
    () =>
      debounce((text: string) => {
        setSearch(text);
        setPage(1);
        setHasMore(true);
        fetchFeedbacks(true);
      }, 500),
    [fetchFeedbacks]
  );

  useEffect(() => {
    return () => handleSearch.cancel();
  }, [handleSearch]);

  return {
    feedbacks,
    loading,
    error,
    page,
    setPage,
    hasMore,
    fetchFeedbacks,
    handleSearch,
  };
}

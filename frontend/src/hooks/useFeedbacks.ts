/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { getFeedbacks } from "../api/feedback";
import debounce from "lodash.debounce";

export function useFeedbacks(initialPage = 1, limit = 5) {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true); 
  const fetchData = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;
      setLoading(true);
      setError("");
      try {
        const res = await getFeedbacks(page, limit, search);
        const items = res.data.items || [];

        if (reset) {
          setFeedbacks(items);
          setHasMore(items.length === limit);
        } else {
          setFeedbacks((prev) => [...prev, ...items]);
          setHasMore(items.length === limit);
        }
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os feedbacks.");
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, hasMore]
  );

  const handleSearch = useCallback(
    debounce((text: string) => {
      setSearch(text);
      setPage(1);
      setHasMore(true);
      fetchData(true);
    }, 500),
    [fetchData]
  );

  useEffect(() => {
    fetchData(page === 1); 
  }, [fetchData, page]);

  return { feedbacks, loading, page, setPage, search, handleSearch, error, fetchData, hasMore };
}

import { useState, useEffect, useCallback } from "react";
import { getFeedbacks } from "../api/feedback";
import debounce from "lodash.debounce";

export function useFeedbacks(initialPage = 1, limit = 10) {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getFeedbacks(page, limit, search);
      setFeedbacks(res.data.items || []);
    } catch (err) {
      console.log(err);
      setError("Não foi possível carregar os feedbacks.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

 
  const handleSearch = useCallback(
    debounce((text: string) => {
      setSearch(text);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { feedbacks, loading, page, setPage, search, handleSearch, error, fetchData };
}

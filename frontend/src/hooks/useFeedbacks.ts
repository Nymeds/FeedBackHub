/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import {
  getFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  type Feedback,
} from "../api/feedback";

export function useFeedbacks(initialPage = 1, limit = 5) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);

  // Busca feedbacks
  const fetchFeedbacks = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getFeedbacks(page, limit, search);
        const items = data.items || [];

        if (reset) {
          setFeedbacks(items);
        } else {
          setFeedbacks((prev) => [...prev, ...items]);
        }

        setHasMore(items.length === limit);
      } catch (err: any) {
        console.error("Erro ao buscar feedbacks:", err);
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, hasMore]
  );

  // Busca inicial / página alterada
  useEffect(() => {
    fetchFeedbacks(page === 1);
  }, [fetchFeedbacks, page]);

  // Debounce para busca
  const handleSearch = useMemo(
    () =>
      debounce((text: string) => {
        setSearch(text);
        setPage(1);
        setHasMore(true);
        fetchFeedbacks(true);
      }, 500),
    [fetchFeedbacks, setPage]
  );

  // Adiciona feedback
  const addFeedback = async (data: Partial<Feedback>) => {
    try {
      const newFeedback = await createFeedback(data);
      setFeedbacks((prev) => [...prev, newFeedback]);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
      throw err;
    }
  };

  // Edita feedback
  const editFeedback = async (idfeedback: string | undefined, data: Partial<Feedback>) => {
    if (!idfeedback) throw new Error("ID do feedback é inválido");
    try {
      const updated = await updateFeedback(idfeedback, data);
      setFeedbacks((prev) =>
        prev.map((f) => (f.idfeedback === idfeedback ? updated : f))
      );
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
      throw err;
    }
  };

  // Remove feedback
  const removeFeedback = async (idfeedback: string | undefined) => {
    if (!idfeedback) throw new Error("ID do feedback é inválido");
    try {
      await deleteFeedback(idfeedback);
      setFeedbacks((prev) => prev.filter((f) => f.idfeedback !== idfeedback));
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
      throw err;
    }
  };

  return {
    feedbacks,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    hasMore,
    fetchFeedbacks,
    handleSearch,
    addFeedback,
    editFeedback,
    removeFeedback,
  };
}

/* src/hooks/useFeedbacks.ts */
import { useState, useEffect, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import { getFeedbacks, type Feedback } from "../api/feedbacks";

export function useFeedbacks(initialPage = 1, limit = 10) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);

  // fetchFeedbacks(reset?: boolean)
  const fetchFeedbacks = useCallback(
    async (reset = false) => {
      // se já estiver carregando e não for reset, evita concorrência
      if (loading && !reset) return;

      setLoading(true);
      setError(null);

      try {
        const pageToLoad = reset ? 1 : page;
        // getFeedbacks retorna res.data (com { items: Feedback[] })
        const data = await getFeedbacks(pageToLoad, limit, search);
        const items = data?.items ?? [];

        setFeedbacks(prev => {
          const combined = reset ? items : [...prev, ...items];
          // Remove duplicados por idfeedback, mantendo a primeira ocorrência
          const map = new Map<string, Feedback>();
          for (const f of combined) {
            if (!map.has(f.idfeedback)) map.set(f.idfeedback, f);
          }
          return Array.from(map.values());
        });

        setHasMore(items.length === limit);
        if (reset) setPage(1);
      } catch (err: any) {
        console.error("Erro ao buscar feedbacks:", err);
        setError(err?.message ?? "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, loading]
  );

  // Quando a página muda (p.ex. setPage foi chamado), busca aquela página
  useEffect(() => {
    fetchFeedbacks(); // busca sem reset (page atual)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Busca debounced
  const handleSearch = useMemo(
    () =>
      debounce((text: string) => {
        setSearch(text);
        setHasMore(true);
        fetchFeedbacks(true); // reset
      }, 500),
    [fetchFeedbacks]
  );

  useEffect(() => {
    return () => handleSearch.cancel();
  }, [handleSearch]);

  // expõe fetchFeedbacks para ser chamado externamente (pass true para reset)
  return {
    feedbacks,
    loading,
    error,
    page,
    setPage,
    hasMore,
    fetchFeedbacks, // signature: (reset?: boolean) => Promise<void>
    handleSearch,
  };
}

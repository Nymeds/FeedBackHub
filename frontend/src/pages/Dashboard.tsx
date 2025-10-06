import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { Search } from "lucide-react";
import Card from "../components/baseComponents/card";
import FeedbackCard from "../components/buildedComponents/FeedbacksCard";
import AppHeader from "../components/buildedComponents/Header";
import { useFeedbacks } from "../hooks/useFeedbacks";

export function Dashboard() {
  const navigate = useNavigate();

  const {
    feedbacks,
    loading,
    error,
    page,
    setPage,
    handleSearch,
    fetchFeedbacks,
  } = useFeedbacks(1, 5); 

  const [listMaxHeight, setListMaxHeight] = useState<number>(400);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcula altura máxima da lista
  const calculateMaxHeight = useCallback(() => {
    const headerHeight = 64;
    const searchHeight = 120;
    const footerHeight = 80;
    const reduction = 100;
    const padding = 12;
    const maxHeight =
      window.innerHeight -
      headerHeight -
      searchHeight -
      footerHeight -
      padding -
      reduction;
    setListMaxHeight(maxHeight);
  }, []);

  useEffect(() => {
    calculateMaxHeight();
    window.addEventListener("resize", calculateMaxHeight);
    return () => window.removeEventListener("resize", calculateMaxHeight);
  }, [calculateMaxHeight]);

  // Debounce para busca
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      handleSearch(value);
      setPage(1);
      if (value.trim() === "") {
        fetchFeedbacks(true); // reset
      }
    }, 500),
    [handleSearch, setPage, fetchFeedbacks]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setPage((prev) => prev + 1);
    }
  }, [loading, setPage]);

  // Ordena por createdAt decrescente
  const sortedFeedbacks = [...feedbacks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen flex flex-col bg-background-primary p-4 sm:p-6 md:p-8">
      {/* Header */}
      <AppHeader title="Feedbacks" />

      {/* Topo com busca */}
      <Card className="mb-6 p-4 sm:p-6 w-full max-w-5xl md:max-w-6xl mx-auto flex flex-col items-center gap-4">
        <div className="relative w-full max-w-3xl">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500"
            size={22}
          />
          <input
            type="text"
            placeholder="Buscar feedback..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="peer w-full pl-12 pr-4 py-3 sm:py-3.5 text-gray-800 bg-white border border-gray-300 rounded-xl shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 
                      placeholder-gray-400 text-base sm:text-lg hover:border-gray-400"
          />
        </div>
      </Card>

      {/* Lista de Feedbacks */}
      <main className="flex-1 flex justify-center">
        <Card
          className="w-full max-w-5xl md:max-w-6xl mx-auto p-4 sm:p-6 flex flex-col border border-border-primary bg-background-quaternary shadow-sm flex-1"
        >
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && sortedFeedbacks.length === 0 && (
            <p className="text-gray-500 text-center">Nenhum feedback encontrado.</p>
          )}

          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto flex flex-col gap-4 mt-4 pr-2"
            style={{ maxHeight: `${listMaxHeight}px` }}
          >
            {sortedFeedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback.idfeedback}
                feedback={feedback}
                onClick={() => navigate(`/details/${feedback.idfeedback}`)}
              />
            ))}

            {loading && (
              <p className="text-gray-500 text-center mt-2">Carregando mais feedbacks...</p>
            )}

            {!loading && feedbacks.length > 0 && feedbacks.length < page * 5 && (
              <p className="text-gray-400 text-center mt-2">Fim da lista</p>
            )}
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-6 flex justify-center">
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => navigate("/feedback")}
        >
          Novo Feedback
        </button>
      </footer>
    </div>
  );
}

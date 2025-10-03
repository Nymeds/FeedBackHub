import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/baseComponents/card";
import FeedbackCard from "../components/buildedComponents/FeedbacksCard";
import AppHeader from "../components/buildedComponents/Header";
import { useFeedbacks } from "../hooks/useFeedbacks";

export function Dashboard() {
  const { feedbacks, loading, error, page, setPage, handleSearch } = useFeedbacks(1, 5);
  const navigate = useNavigate();
  const [listMaxHeight, setListMaxHeight] = useState(400);

  const calculateMaxHeight = () => {
    const headerHeight = 64;
    const searchHeight = 120;
    const footerHeight = 80;
    const reduction = 100;
    const padding = 12;
    const maxHeight = window.innerHeight - headerHeight - searchHeight - footerHeight - padding - reduction;
    setListMaxHeight(maxHeight);
  };

  useEffect(() => {
    calculateMaxHeight();
    window.addEventListener("resize", calculateMaxHeight);
    return () => window.removeEventListener("resize", calculateMaxHeight);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background-primary p-4 sm:p-6 md:p-8">
      <AppHeader title="Dashboard" />

      {/* Busca */}
      <Card className="mb-6 p-4 sm:p-6 w-full max-w-5xl md:max-w-6xl mx-auto flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Buscar feedback..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base sm:text-lg"
        />
      </Card>

      {/* Lista */}
      <main className="flex-1 flex justify-center">
        <Card className="w-full max-w-5xl md:max-w-6xl mx-auto p-4 sm:p-6 flex flex-col border border-border-primary bg-background-quaternary shadow-sm flex-1">
          {loading && <p className="text-gray-500 text-center">Carregando feedbacks...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && feedbacks.length === 0 && <p className="text-gray-500 text-center">Nenhum feedback encontrado.</p>}

          <div className="flex-1 overflow-y-auto flex flex-col gap-4 mt-4 pr-2" style={{ maxHeight: `${listMaxHeight}px` }}>
            {feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback.idfeedback}
                titulo={feedback.titulo}
                descricao={feedback.descricao}
                categoria={feedback.categoria}
                status={feedback.status}
                commentsCount={feedback.commentsCount || 0}
                createdAt={feedback.createdAt}
                onClick={() => navigate(`/details/${feedback.idfeedback}`)}
                className="line-clamp-2"
              />
            ))}
          </div>

          {/* Paginação */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-700">Página {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={feedbacks.length < 5} // desabilita se menos que pageSize
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </Card>
      </main>

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

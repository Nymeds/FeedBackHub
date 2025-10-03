import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/baseComponents/card";
import FeedbackCard from "../components/buildedComponents/FeedbacksCard";
import { useFeedbacks } from "../hooks/useFeedbacks";
import AppHeader from "../components/buildedComponents/Header";

export function Dashboard() {
  const { feedbacks, loading, error, fetchData, handleSearch } = useFeedbacks();
  const navigate = useNavigate();

  const [listMaxHeight, setListMaxHeight] = useState<number>(400);


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
    fetchData();
    calculateMaxHeight();
    window.addEventListener("resize", calculateMaxHeight);
    return () => window.removeEventListener("resize", calculateMaxHeight);
  }, [fetchData]);

  return (
    <div className="min-h-screen flex flex-col bg-background-primary p-6">
      {/* Header */}
      <AppHeader title="Dashboard" />

      {/* Topo com busca */}
      <Card className="mb-6 p-6 w-full max-w-6xl mx-auto flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Buscar feedback..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-6 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
        />
      </Card>

      {/* Lista de Feedbacks */}
      <main className="flex-1 flex justify-center">
        <Card className="w-full max-w-6xl mx-auto p-6 flex flex-col border border-border-primary bg-background-quaternary shadow-sm flex-1">
          {/* Mensagens */}
          {loading && <p className="text-gray-500 text-center">Carregando feedbacks...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && feedbacks.length === 0 && <p className="text-gray-500 text-center">Nenhum feedback encontrado.</p>}

          {/* Lista scrollable */}
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-4 mt-4 pr-2"
            style={{ maxHeight: `${listMaxHeight}px` }}
          >
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
              />
            ))}
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

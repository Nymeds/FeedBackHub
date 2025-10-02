import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/baseComponents/card";
import FeedbackCard from "../components/buildedComponents/FeedbacksCard";
import { useFeedbacks } from "../hooks/useFeedbacks";

export function Dashboard() {
  const { feedbacks, loading, error, fetchData, handleSearch } = useFeedbacks();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen flex flex-col bg-background-primary p-6">
      {/* Topo com título e busca */}
      <Card className="mb-6 p-6 w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <input
          type="text"
          placeholder="Buscar feedback..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        />
      </Card>

      {/* Lista de Feedbacks */}
      <main className="flex-1 flex justify-center">
        <Card className="w-full max-w-4xl p-6 flex flex-col border border-border-primary bg-background-quaternary shadow-sm">
          {/* Mensagens */}
          {loading && <p className="text-gray-500 text-center">Carregando feedbacks...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && feedbacks.length === 0 && <p className="text-gray-500 text-center">Nenhum feedback encontrado.</p>}

          {/* Scrollable list */}
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-4 mt-4 pr-2"
            style={{ maxHeight: 'calc(100vh - 300px)' }} // Ajusta altura de scroll
          >
            {feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback.idfeedback}
                titulo={feedback.titulo}
                descricao={feedback.descricao}
                categoria={feedback.categoria}
                status={feedback.status}
                autor={feedback.autor || "Anônimo"}
                commentsCount={feedback.commentsCount || 0}
                createdAt={feedback.createdAt}
                onClick={() => navigate(`/details/${feedback.idfeedback}`)} // Redireciona para detalhes
              />
            ))}
          </div>
        </Card>
      </main>

   
      <footer className="mt-6 flex justify-center">
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => navigate("/feedback")} // Agora leva para a tela de criação
        >
          Novo Feedback
        </button>
      </footer>

    </div>
  );
}

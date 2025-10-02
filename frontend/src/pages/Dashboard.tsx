import React, { useEffect, useState } from "react";
import Card from "../components/baseComponents/card";
import FeedbackCard from "../components/buildedComponents/FeedbacksCard";
import { useFeedbacks } from "../hooks/useFeedbacks";
import FeedbackCardDetailsModal from "../components/buildedComponents/FeedbackCardDetailsModal"; // modal que criamos

export function Dashboard() {
  const { feedbacks, loading, error, fetchData, handleSearch } = useFeedbacks();
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null); // feedback selecionado
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (feedback: any) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFeedback(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-primary p-6">
      {/* Topo com título e busca */}
      <Card>
        <header className="mb-6 text-center flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <input
            type="text"
            placeholder="Buscar feedback..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          />
        </header>
      </Card>

      {/* Lista de feedbacks */}
      <main className="flex-1 flex justify-center mt-4">
        <Card className="w-full max-w-4xl p-6 flex flex-col border border-border-primary bg-background-quaternary">
          {loading && <p className="text-gray-500 text-center">Carregando feedbacks...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && feedbacks.length === 0 && (
            <p className="text-gray-500 text-center">Nenhum feedback encontrado.</p>
          )}

          {/* Lista de Feedbacks com scroll limitado */}
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-4 mt-4"
            style={{ maxHeight: "calc(100vh - 220px)" }}
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
                onClick={() => openModal(feedback)}
              />
            ))}
          </div>
        </Card>
      </main>

      {/* Botão fixo no rodapé */}
      <footer className="mt-6 flex justify-center">
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          onClick={() => console.log("Novo feedback")}
        >
          Novo Feedback
        </button>
      </footer>

      {/* Modal de detalhes do feedback */}
      {isModalOpen && selectedFeedback && (
        <FeedbackCardDetailsModal feedback={selectedFeedback} onClose={closeModal} />
      )}
    </div>
  );
}

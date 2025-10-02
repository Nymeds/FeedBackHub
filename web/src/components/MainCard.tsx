import React from "react";
import { useFeedbacks } from "../hooks/useFeedbacks";
import FeedbackCard from "./FeedbackCardProps";

export default function MainCard() {
  const { feedbacks, loading, error } = useFeedbacks();

  return (
    <main className="fp-main fp-card-inner overflow-y-auto" role="main" aria-label="Conteúdo principal">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Feedbacks Recentes</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum feedback encontrado</p>
        ) : (
          <div className="flex flex-col gap-4">
            {feedbacks.map((fb) => (
              <FeedbackCard
                key={fb.idfeedback}
                titulo={fb.titulo}
                descricao={fb.descricao}
                categoria={fb.categoria}
                status={fb.status}
                autor={fb.autor || "Anônimo"}
                commentsCount={fb.commentsCount || 0}
                createdAt={fb.createdAt}
                onClick={() => window.location.href = `/feedback/${fb.idfeedback}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
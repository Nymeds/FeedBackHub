import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFeedbacks } from "../hooks/useFeedbacks";
import FeedbackCard from "../components/FeedbackCardProps";

export default function FeedbackList() {
  const navigate = useNavigate();
  const { feedbacks, loading, handleSearch, error, fetchData } = useFeedbacks();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Feedbacks</h1>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Buscar feedback..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-8 text-red-600">{error}</div>
        )}

        {/* Empty */}
        {!loading && !error && feedbacks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum feedback encontrado
          </div>
        )}

        {/* Feedback List */}
        {!loading && !error && feedbacks.length > 0 && (
          <div className="space-y-4">
            {feedbacks.map((item) => (
              <FeedbackCard
                key={item.idfeedback}
                titulo={item.titulo}
                descricao={item.descricao}
                categoria={item.categoria}
                status={item.status}
                autor={item.autor || "Anônimo"}
                commentsCount={item.commentsCount || 0}
                createdAt={item.createdAt}
                onClick={() => navigate(`/feedback/${item.idfeedback}`)}
              />
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => navigate("/feedback/new")}
          className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center text-2xl"
        >
          +
        </button>
      </div>
    </div>
  );
}
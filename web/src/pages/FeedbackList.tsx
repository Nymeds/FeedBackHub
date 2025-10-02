import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Card from "../components/Card";
import FeedbackCard from "../components/FeedbackCard";
import SearchInput from "../components/SearchInput";
import { useFeedbacks } from "../hooks/useFeedbacks";

export default function FeedbackList() {
  const navigate = useNavigate();
  const { feedbacks, loading, error } = useFeedbacks();
  const [search, setSearch] = useState("");

  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.titulo.toLowerCase().includes(search.toLowerCase()) ||
      feedback.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente sutil */}
      
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-8">
        <div className="container mx-auto px-6 pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                FeedbackHub
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie seus feedbacks de forma simples e eficiente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-6 -mt-4">
        <div className="max-w-4xl mx-auto">
          {/* Barra de pesquisa destacada */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Pesquisar feedbacks por título ou descrição..."
                className="border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Card principal de feedbacks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header do card */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Feedbacks Recentes
                </h2>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                  {filteredFeedbacks.length} {filteredFeedbacks.length === 1 ? 'feedback' : 'feedbacks'}
                </span>
              </div>
            </div>

            {/* Lista de feedbacks com scroll */}
            <div
              className="p-6"
              style={{
                maxHeight: "calc(100vh - 400px)",
                minHeight: "400px",
                overflowY: "auto",
              }}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
                  <p className="text-gray-500">Carregando feedbacks...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              ) : filteredFeedbacks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <p className="text-gray-600 font-medium mb-1">Nenhum feedback encontrado</p>
                  <p className="text-gray-500 text-sm">Tente ajustar sua pesquisa ou crie um novo feedback</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredFeedbacks.map((feedback) => (
                    <FeedbackCard
                      key={feedback.idfeedback}
                      titulo={feedback.titulo}
                      descricao={feedback.descricao}
                      categoria={feedback.categoria}
                      status={feedback.status}
                      autor={feedback.autor}
                      commentsCount={feedback.commentsCount || 0}
                      createdAt={feedback.createdAt}
                      onClick={() => navigate(`/feedback/${feedback.idfeedback}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botão de ação */}
          <div className="mt-6 mb-12">
            <button
              onClick={() => navigate("/feedback/new")}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-xl">✨</span>
                Criar Novo Feedback
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
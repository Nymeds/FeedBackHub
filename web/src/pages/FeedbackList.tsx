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
    <div className="min-h-screen bg-background-primary text-label font-sans flex flex-col">
      {/* Header no topo */}
      <div className="container mx-auto p-6">
        <Card className="bg-background-quaternary border border-border-primary">
          <Header
            title="FeedbackHub"
            subtitle="Gerencie seus feedbacks de forma simples e eficiente"
          />
        </Card>
      </div>

      {/* Card de lista de feedbacks */}
      <div className="container mx-auto px-6 flex-1">
        <Card className="bg-background-quaternary border border-border-primary p-6 mt-6">
          {/* Barra de pesquisa */}
          <div className="mb-4">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar feedbacks..."
              className="w-full"
            />
          </div>

          {/* Lista de feedbacks com altura limitada */}
          <div
            className="grid gap-4"
            style={{
              maxHeight: "min(60vh, 600px)",
              overflowY: "auto",
              paddingRight: 8,
            }}
          >
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-9 w-9 border-4 border-t-4 border-purple-600 rounded-full" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="text-center py-8 text-label-accent">
                Nenhum feedback encontrado
              </div>
            ) : (
              filteredFeedbacks.map((feedback) => (
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
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Card de ação: criar novo feedback */}
      <div className="container mx-auto px-6 mt-6 mb-8">
        <Card className="bg-background-quaternary border border-border-primary p-6 flex justify-center">
          <div className="w-full max-w-sm">
            <p className="text-center text-label-accent mb-4">
              Tem algo novo para compartilhar?
            </p>
            <button
              onClick={() => navigate("/feedback/new")}
              className="w-full py-3 rounded-lg font-medium bg-accent-brand hover:bg-accent-brand-dark text-white shadow-lg transition"
              aria-label="Criar novo feedback"
            >
              Criar novo feedback
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

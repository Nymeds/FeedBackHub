import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import CardContainer from "../components/CardContainer";
import FeedbackCard from "../components/FeedbackCard";
import SearchInput from "../components/SearchInput";
import BottomButton from "../components/BottomButton";
import { useFeedbacks } from "../hooks/useFeedbacks";
import FeedbackForm from "../components/FeedbackForm";

export default function FeedbackListScreen() {
  const navigate = useNavigate();
  const { feedbacks, loading, error } = useFeedbacks();
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);

  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.titulo.toLowerCase().includes(search.toLowerCase()) ||
      f.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <Header totalFeedbacks={feedbacks.length} />

        {/* Card de pesquisa */}
        <CardContainer>
          <div className="flex gap-4 items-center">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar feedbacks..."
            />
            <button
              onClick={() => setOpenForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              + Novo Feedback
            </button>
          </div>
        </CardContainer>

        {/* Lista de Feedbacks */}
        <CardContainer title="Todos os Feedbacks" className="mt-6">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : filteredFeedbacks.length === 0 ? (
              <p>Nenhum feedback encontrado</p>
            ) : (
              filteredFeedbacks.map((f) => (
                <FeedbackCard
                  key={f.idfeedback}
                  {...f}
                  onClick={() => navigate(`/feedback/${f.idfeedback}`)}
                />
              ))
            )}
          </div>
        </CardContainer>

        {/* Formulário de Criação */}
        {openForm && (
          <CardContainer title="Criar Feedback" className="mt-6">
            <FeedbackForm
              onSubmit={() => setOpenForm(false)}
              onCancel={() => setOpenForm(false)}
            />
          </CardContainer>
        )}

        {/* Botão flutuante para abrir formulário */}
        {!openForm && (
          <BottomButton
            title="+ Criar Feedback"
            onClick={() => setOpenForm(true)}
          />
        )}
      </div>
    </div>
  );
}

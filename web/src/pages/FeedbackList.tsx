import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Card from "../components/Card";
import FeedbackCard from "../components/FeedbackCard";
import SearchInput from "../components/SearchInput";
import BottomButton from "../components/BottomButton";
import { useFeedbacks } from "../hooks/useFeedbacks";

export default function FeedbackList() {
  const navigate = useNavigate();
  const { feedbacks = [], loading, handleSearch } = useFeedbacks();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-6">
        {/* Main card */}
        <Card className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Todos os feedbacks</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">Gerencie e visualize os feedbacks publicados</p>
            </div>

            <div className="w-full sm:w-72">
              <SearchInput onChange={(e) => handleSearch?.(e.target.value)} placeholder="Pesquisar feedbacks..." />
            </div>
          </div>

          <div className="mt-4 border-t border-transparent dark:border-slate-700 pt-4">
            <div className="space-y-3 max-h-[64vh] overflow-auto pr-2">
              {loading ? (
                <div className="py-16 text-center text-sm text-slate-500">Carregando...</div>
              ) : feedbacks.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">Nenhum feedback encontrado</div>
              ) : (
                feedbacks.map((f: any) => (
                  <FeedbackCard
                    key={f.idfeedback || f.id}
                    titulo={f.titulo}
                    descricao={f.descricao}
                    categoria={f.categoria}
                    status={f.status}
                    autor={f.autor || f.usuario || "—"}
                    commentsCount={f._count?.comments ?? f.commentsCount ?? 0}
                    createdAt={f.createdAt}
                    onClick={() => navigate(`/feedback/${f.idfeedback || f.id}`)}
                  />
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Action card */}
        <Card className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Tem algo novo para compartilhar?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">Crie um novo feedback e abra a discussão</p>
          </div>
          <div className="w-full sm:w-auto">
            <BottomButton title="Criar novo feedback" onClick={() => navigate("/feedback/new")} />
          </div>
        </Card>
      </main>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedbackById } from "../api/feedback";
import { useComments } from "../hooks/useComments";
import CommentCard from "../components/buildedComponents/CommentCard";
import CommentForm from "../components/buildedComponents/CommentForm";
import { useToast } from "../context/ToastProvider";
import AppHeader from "../components/buildedComponents/Header";

export default function FeedbackDetailPage() {
  const { showToast } = useToast();
  const { idfeedback } = useParams<{ idfeedback: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { comments, addComment, editComment, removeComment } = useComments(idfeedback || "");

  // Carrega o feedback
  useEffect(() => {
    if (!idfeedback) return;

    const loadFeedback = async () => {
      setLoading(true);
      try {
        const res = await getFeedbackById(idfeedback);
        setFeedback(res.data);
      } catch (err) {
        console.error(err);
        showToast("Erro ao carregar feedback");
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idfeedback]);

  const handleEdit = () => {
    if (!feedback) return;
    navigate(`/feedback/${feedback.idfeedback}`);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Carregando feedback...</p>;
  if (!feedback) return <p className="text-center mt-10 text-red-500">Feedback não encontrado.</p>;

  const createdAt = new Date(feedback.createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const updatedAt = new Date(feedback.updatedAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header sem delete */}
      <AppHeader title={feedback.titulo} onBack={() => navigate(-1)} onEdit={handleEdit} />

      {/* Card do Feedback */}
      <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow p-6 flex flex-col gap-6 mt-4">
        {/* Categoria e Status */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-gray-200 px-4 py-2 rounded-lg">
            <p className="text-xs font-semibold text-gray-500">Categoria</p>
            <p className="text-sm font-medium text-gray-700">{feedback.categoria}</p>
          </div>
          <div className="bg-gray-200 px-4 py-2 rounded-lg">
            <p className="text-xs font-semibold text-gray-500">Status</p>
            <p className="text-sm font-medium text-gray-700">{feedback.status}</p>
          </div>
        </div>

        {/* Descrição */}
        <p className="text-gray-700">{feedback.descricao}</p>
        <p className="text-xs text-gray-500">
          Criado em: {createdAt} | Atualizado em: {updatedAt}
        </p>

        {/* Comentários */}
        <h2 className="text-lg font-semibold mt-4 text-gray-800">Comentários ({comments.length})</h2>
        <div className="flex flex-col gap-3 mt-2 max-h-96 overflow-y-auto">
          {comments.length > 0 ? (
            comments.map((c) => (
              <CommentCard
                key={c.idcomment}
                comment={c}
                idfeedback={feedback.idfeedback}
                onEdit={editComment}
                onDelete={removeComment}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">Nenhum comentário ainda.</p>
          )}
        </div>

        {/* Formulário de comentário */}
        <CommentForm onAddComment={addComment} />
      </div>
    </div>
  );
}

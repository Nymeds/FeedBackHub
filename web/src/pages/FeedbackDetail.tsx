/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedbackById } from "../api/feedbacks";
import { useComments } from "../hooks/useComments";
import CommentCard from "../components/CommentCard";
import { useToast } from "../context/ToastContext";

export default function FeedbackDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { comments, addComment, editComment, removeComment } = useComments(id!);
  const [autor, setAutor] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      try {
        const res = await getFeedbackById(id!);
        setFeedback(res.data);
      } catch (err) {
        showToast("Erro ao carregar feedback");
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conteudo.trim()) return;

    setSubmitting(true);
    try {
      await addComment(conteudo, autor);
      setAutor("");
      setConteudo("");
      showToast("Comentário publicado!", "success");
    } catch (err: any) {
      if (err?.details) {
        showToast(err.details.map((d: any) => `${d.field}: ${d.message}`).join("\n"));
      } else {
        showToast(err?.message || "Erro ao publicar comentário");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Feedback não encontrado</p>
      </div>
    );
  }

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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Voltar
          </button>
          <button
            onClick={() => navigate(`/feedback/edit/${id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Editar
          </button>
        </div>

        {/* Feedback Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{feedback.titulo}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Categoria</p>
              <p className="font-semibold text-gray-800">{feedback.categoria}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <p className="font-semibold text-gray-800">{feedback.status}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Descrição</p>
            <p className="text-gray-700 mb-4">{feedback.descricao}</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>Criado em: {createdAt}</span>
              <span>•</span>
              <span>Atualizado em: {updatedAt}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Comentários ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <input
              type="text"
              placeholder="Seu nome (opcional)"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Digite seu comentário..."
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              required
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Publicando..." : "Publicar"}
            </button>
          </form>

          {/* Comments List */}
          <div>
            {comments.map((comment) => (
              <CommentCard
                key={comment.idcomment}
                comment={comment}
                idfeedback={id!}
                onEdit={editComment}
                onDelete={removeComment}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useComments } from "../../hooks/useComments";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./SchemaComments"; // Validação do form
import CommentCard from "./CommentCard";
import AppInput from "./Appinput";
import { XIcon } from "lucide-react";

interface FeedbackCardDetailsModalProps {
  feedback: {
    idfeedback: string;
    titulo: string;
    categoria: string;
    status: string;
    descricao: string;
    createdAt: string;
    updatedAt: string;
  };
  onClose: () => void;
}

export default function FeedbackCardDetailsModal({
  feedback,
  onClose,
}: FeedbackCardDetailsModalProps) {
  const { comments, addComment, editComment, removeComment } = useComments(feedback.idfeedback);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset, setError } = useForm({
    defaultValues: { autor: "", conteudo: "" },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await addComment(data.conteudo, data.autor);
      reset();
    } catch (err: any) {
      console.error("Erro ao criar comentário:", err);
      if (err?.details) {
        err.details.forEach((d: any) => {
          setError(d.field as "autor" | "conteudo", { type: "manual", message: d.message });
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">{feedback.titulo}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Informações do feedback */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-500">Categoria</p>
              <p className="text-gray-800">{feedback.categoria}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Status</p>
              <p className="text-gray-800">{feedback.status}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500">Descrição</p>
            <p className="text-gray-800">{feedback.descricao}</p>
            <p className="text-xs text-gray-400 mt-2">
              Criado em: {formatDate(feedback.createdAt)} | Atualizado em: {formatDate(feedback.updatedAt)}
            </p>
          </div>

          {/* Lista de comentários */}
          <div className="flex flex-col gap-2">
            {comments.map((c) => (
              <CommentCard
                key={c.idcomment}
                comment={c}
                idfeedback={feedback.idfeedback}
                onEdit={editComment}
                onDelete={removeComment}
              />
            ))}
          </div>
        </div>

        {/* Footer: novo comentário */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t flex flex-col gap-2">
          <AppInput control={control} name="autor" placeholder="Autor" />
          <AppInput control={control} name="conteudo" placeholder="Digite seu comentário..." multiline />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
          >
            {submitting ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </div>
  );
}

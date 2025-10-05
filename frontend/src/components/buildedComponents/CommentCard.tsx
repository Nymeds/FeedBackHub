/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { Comment } from "../../api/comments";
import { useToast } from "../../context/ToastProvider";
import ErrorToast from "./ToastCard";
import { Check, X, Edit, Trash2 } from "lucide-react";

interface CommentCardProps {
  comment: Comment;
  idfeedback: string;
  onEdit: (idcomment: string, texto: string) => Promise<any>;
  onDelete: (idcomment: string) => Promise<any>;
}

export default function CommentCard({ comment, onEdit, onDelete }: CommentCardProps) {
  const formattedDate = new Date(comment.createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [textUpdate, setTextUpdate] = useState(comment.conteudo);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();

const handleSave = async () => {
  if (!textUpdate.trim()) {
    showToast("Mensagem não pode estar vazia");
    return;
  }

  setSaving(true);
  try {
    await onEdit(comment.idcomment, textUpdate);
    setIsEditing(false);
  } catch (err: any) {
    if (err.details?.length > 0) {
      showToast(err.details.map((d: any) => `${d.field}: ${d.message}`).join("\n"));
    } else {
      showToast(err.message || "Erro desconhecido");
    }
  } finally {
    setSaving(false);
  }
};


  const handleCancel = () => {
    setTextUpdate(comment.conteudo);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Deseja realmente deletar este comentário?")) return;
    setDeleting(true);
    try {
      await onDelete(comment.idcomment);
    } catch (err: any) {
      if (err.details?.length > 0) {
        showToast(err.details.map((d: any) => `${d.field}: ${d.message}`).join("\n"));
      } else {
        showToast(err.message || "Erro desconhecido");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-2">
  <div className="flex justify-between items-center mb-2">
    {/* Autor truncado */}
    <span
      className="font-bold text-sm truncate"
      style={{ maxWidth: "100px" }} // autor não passa de ~10 caracteres
      title={comment.autor} // mostra o nome completo ao passar o mouse
    >
      {comment.autor || "Anônimo"}
    </span>
    <span className="text-gray-500 text-xs ml-2">
      - {formattedDate}
    </span>

    <div className="flex gap-2 ml-auto">
      {isEditing ? (
        <>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-green-600 hover:text-green-800"
          >
            {saving ? "..." : <Check size={18} />}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="text-red-600 hover:text-red-800"
          >
            <X size={18} />
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-800"
          >
            {deleting ? "..." : <Trash2 size={18} />}
          </button>
        </>
      )}
    </div>
  </div>

  {/* Comentário com limite de largura e quebra automática */}
  {isEditing ? (
    <textarea
      className="w-full border rounded p-2 text-sm"
      value={textUpdate}
      onChange={(e) => setTextUpdate(e.target.value)}
      rows={3}
      disabled={saving}
    />
  ) : (
    <p
      className="text-gray-700 text-sm break-words"
      style={{ maxWidth: "40ch", whiteSpace: "pre-wrap" }}
    >
      {comment.conteudo}
    </p>
  )}

  {errorMessage && <ErrorToast message={errorMessage} onHide={() => setErrorMessage("")} />}
</div>

  );
}
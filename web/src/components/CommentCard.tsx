/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useToast } from "../context/ToastContext";

interface Comment {
  idcomment: string;
  autor?: string;
  conteudo: string;
  createdAt: string;
}

interface Props {
  comment: Comment;
  idfeedback: string;
  onEdit: (idcomment: string, conteudo: string) => Promise<any>;
  onDelete: (idcomment: string) => Promise<any>;
}

export default function CommentCard({ comment, idfeedback, onEdit, onDelete }: Props) {
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
  const { showToast } = useToast();

  const handleSave = async () => {
    if (!textUpdate.trim()) return;
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
    <div className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">
          {comment.autor || "Anônimo"} - {formattedDate}
        </span>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-green-600 hover:text-green-700 disabled:opacity-50"
              >
                {saving ? "..." : "✓"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                ✎
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {deleting ? "..." : "🗑"}
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={textUpdate}
          onChange={(e) => setTextUpdate(e.target.value)}
          disabled={saving}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      ) : (
        <p className="text-sm text-gray-600">{comment.conteudo}</p>
      )}
    </div>
  );
}

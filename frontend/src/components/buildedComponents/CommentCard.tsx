/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import  type {Comment } from "../../api/comments";

interface CommentCardProps {
  comment: Comment;
  idfeedback: string;
  onEdit: (idcomment: string, conteudo: string) => Promise<any>;
  onDelete: (idcomment: string) => Promise<any>;
}

export default function CommentCard({ comment, onEdit, onDelete }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [textUpdate, setTextUpdate] = useState(comment.conteudo);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formattedDate = new Date(comment.createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSave = async () => {
    if (!textUpdate.trim()) return;
    setSaving(true);
    try {
      await onEdit(comment.idcomment, textUpdate);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTextUpdate(comment.conteudo);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Deseja realmente deletar este comentário?")) return;
    setDeleting(true);
    try {
      await onDelete(comment.idcomment);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{comment.autor || "Anônimo"}</span>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      {isEditing ? (
        <>
          <textarea
            className="w-full border rounded px-2 py-1 mb-2"
            value={textUpdate}
            onChange={(e) => setTextUpdate(e.target.value)}
            disabled={saving}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-800 mb-2">{comment.conteudo}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 text-sm hover:underline disabled:opacity-50"
            >
              {deleting ? "Deletando..." : "Deletar"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

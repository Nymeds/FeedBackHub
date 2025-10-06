/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "../baseComponents/button"; 
import { useToast } from "../../context/ToastProvider";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

export default function AppHeader({ title, onBack, onEdit, onDelete }: AppHeaderProps) {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!onDelete) return;
    const confirmDelete = window.confirm("Deseja realmente deletar este feedback?");
    if (!confirmDelete) return;
  
    try {
      setDeleting(true);
      await onDelete();
      showToast("Feedback deletado com sucesso!");
      navigate("/");
    } catch (err: any) {
      showToast(err?.message || "Erro ao deletar feedback");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto p-4 mb-6 bg-white rounded-xl shadow-md border border-gray-200">
      {/* Botão voltar */}
      {onBack ? (
        <button
          onClick={onBack}
          className="text-blue-600 font-semibold hover:bg-blue-50 px-3 py-1 rounded transition"
        >
          &larr; Voltar
        </button>
      ) : (
        <div className="w-20" /> 
      )}

      {/* Título */}
        <h1
        className="text-2xl font-bold text-gray-800 text-center flex-1 truncate"
        style={{ maxWidth: "500px" }}
        title={title} 
             >
        {title}
        </h1>

      {/* Botões editar / deletar */}
      <div className="flex gap-2 w-36 justify-end">
        {onEdit && (
          <Button
            onClick={onEdit}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-1 rounded transition"
          >
            Editar
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className={`bg-red-100 hover:bg-red-200 text-red-600 font-medium px-4 py-1 rounded transition ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {deleting ? "Deletando..." : "Deletar"}
          </Button>
        )}
      </div>
    </div>
  );
}

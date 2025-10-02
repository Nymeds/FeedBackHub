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
    <div className="flex items-center justify-between w-full p-4 border-b border-gray-300">
      {/* Botão voltar */}
      {onBack ? (
        <button
          onClick={onBack}
          className="text-blue-600 font-semibold hover:underline"
        >
          &larr; Voltar
        </button>
      ) : (
        <div className="w-20" /> // espaço para alinhar o título
      )}

      {/* Título */}
      <h1 className="text-xl font-bold text-center flex-1">{title}</h1>

      {/* Botões editar / deletar */}
      <div className="flex gap-2 w-20 justify-end">
        {onEdit && (
          <Button
            onClick={onEdit}
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Editar
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className={`text-red-600 font-medium ${deleting ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
          >
            {deleting ? "Deletando..." : "Deletar"}
          </Button>
        )}
      </div>
    </div>
  );
}

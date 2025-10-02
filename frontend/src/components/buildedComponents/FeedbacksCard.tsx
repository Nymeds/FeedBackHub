import React from "react";
import { CheckIcon, Calendar } from "lucide-react";

interface FeedbackCardProps {
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  autor: string;
  commentsCount: number;
  createdAt: string;
  onClick?: () => void;
}

const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export default function FeedbackCard({
  titulo,
  descricao,
  categoria,
  status,
  autor,
  commentsCount,
  createdAt,
  onClick,
}: FeedbackCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onClick={onClick}
      className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md cursor-pointer transition"
    >
      {/* Topo */}
      <div className="flex justify-between mb-2">
        <span className="font-bold text-blue-600 truncate max-w-[70%]">{truncateText(categoria, 15)}</span>
        <span className="font-bold text-green-600 truncate max-w-[30%] text-right capitalize">{truncateText(status.replace("_", " "), 12)}</span>
      </div>

      {/* Meio */}
      <div className="mb-2">
        <div className="text-gray-600 font-semibold text-sm">{truncateText(autor, 18)}</div>
        <div className="font-bold text-lg">{truncateText(titulo, 30)}</div>
        <div className="text-gray-800 text-sm">{truncateText(descricao, 80)}</div>
      </div>

      {/* Rodapé */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <CheckIcon size={16} />
          <span>{commentsCount}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <Calendar size={16} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

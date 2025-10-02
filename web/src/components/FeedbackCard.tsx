import type { HTMLAttributes } from "react";
import { FaComment, FaCalendarAlt, FaUser } from "react-icons/fa";

interface FeedbackCardProps extends HTMLAttributes<HTMLDivElement> {
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
  className,
  onClick,
  ...props
}: FeedbackCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Status configuration
  const statusConfig = {
    open: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      label: "Aberto"
    },
    closed: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      dot: "bg-gray-400",
      label: "Fechado"
    },
    in_progress: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
      label: "Em Andamento"
    }
  };

  const statusKey = status.toLowerCase() as keyof typeof statusConfig;
  const statusStyle = statusConfig[statusKey] || statusConfig.open;

  return (
    <div
      className={`group bg-white border border-gray-200 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-indigo-300 hover:shadow-md ${className || ""}`}
      onClick={onClick}
      {...props}
    >
      {/* Header: Categoria e Status */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-100">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          {truncateText(categoria, 20)}
        </span>
        
        <span className={`inline-flex items-center gap-1.5 ${statusStyle.bg} ${statusStyle.text} text-xs font-semibold px-3 py-1.5 rounded-lg border ${statusStyle.border}`}>
          <span className={`w-1.5 h-1.5 ${statusStyle.dot} rounded-full`}></span>
          {statusStyle.label}
        </span>
      </div>

      {/* Título */}
      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors">
        {titulo}
      </h3>

      {/* Descrição */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {descricao}
      </p>

      {/* Footer: Metadata */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <FaUser className="text-gray-400" size={12} />
            <span className="font-medium">{truncateText(autor, 15)}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <FaComment className="text-gray-400" size={12} />
            <span className="font-medium">{commentsCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <FaCalendarAlt className="text-gray-400" size={12} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
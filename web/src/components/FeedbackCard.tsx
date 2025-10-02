import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { FaComment, FaCalendarAlt } from "react-icons/fa";

const cardVariants = tv({
  base: "rounded-2xl shadow-md p-4 transition-all hover:shadow-lg border cursor-pointer",
  variants: {
    variant: {
      default: "bg-white border-gray-200 text-gray-900",
    },
    size: {
      sm: "p-3 text-sm",
      md: "p-4 text-base",
      lg: "p-6 text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface FeedbackCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  autor: string;
  commentsCount: number;
  createdAt: string;
  onClick?: () => void;
}

// Função de truncamento
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
  variant,
  size,
  className,
  onClick,
  ...props
}: FeedbackCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Definir cor do status dinamicamente
  const statusColor = (() => {
    switch (status.toLowerCase()) {
      case "open":
        return "text-green-600";
      case "closed":
        return "text-red-600";
      case "in_progress":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  })();

  return (
    <div
      className={cardVariants({ variant, size, className })}
      onClick={onClick}
      {...props}
    >
      {/* Topo: Categoria e Status */}
      <div className="flex justify-between mb-2">
        <span className="font-bold text-blue-600 max-w-[70%]">
          {truncateText(categoria, 15)}
        </span>
        <span className={`font-bold capitalize max-w-[30%] text-right ${statusColor}`}>
          {truncateText(status.replace("_", " "), 12)}
        </span>
      </div>

      {/* Meio: Autor, Título e Descrição */}
      <div className="mb-2">
        <p className="text-gray-500 font-semibold mb-1">{truncateText(autor, 18)}</p>
        <h3 className="font-bold text-lg mb-1">{truncateText(titulo, 30)}</h3>
        <p className="text-gray-700 text-sm">{truncateText(descricao, 80)}</p>
      </div>

      {/* Rodapé: Comentários e Data */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-1">
          <FaComment className="text-gray-500" />
          <span className="text-gray-500 text-sm">{commentsCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCalendarAlt className="text-gray-500" />
          <span className="text-gray-500 text-sm">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

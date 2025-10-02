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
      className="cursor-pointer border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-all hover:border-blue-300"
    >
      {/* Top: Categoria e Status */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
          {categoria}
        </span>
        <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold capitalize">
          {status.replace("_", " ")}
        </span>
      </div>

      {/* Middle: Título e Descrição */}
      <div className="mb-3">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{titulo}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{descricao}</p>
      </div>

      {/* Bottom: Autor, Comentários e Data */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <span className="font-medium">
          por {autor}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            💬 {commentsCount}
          </span>
          <span className="flex items-center gap-1">
            📅 {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
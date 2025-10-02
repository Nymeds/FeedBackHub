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
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{titulo}</h3>
        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{descricao}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          {categoria} • por {autor}
        </span>
        <span>
          💬 {commentsCount} | 📅 {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

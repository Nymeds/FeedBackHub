import React from "react";
import { FaRegCommentDots, FaCalendarAlt, FaUser } from "react-icons/fa";

interface Props {
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  autor?: string;
  commentsCount?: number;
  createdAt?: string;
  onClick?: () => void;
}

const truncate = (s = "", n = 180) => (s.length > n ? s.slice(0, n) + "…" : s);

export default function FeedbackCard({
  titulo,
  descricao,
  categoria,
  status,
  autor = "—",
  commentsCount = 0,
  createdAt,
  onClick,
}: Props) {
  const date = createdAt ? new Date(createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "";

  return (
    <article
      onClick={onClick}
      className="cursor-pointer w-full rounded-lg border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:shadow-lg transition-shadow flex gap-4 items-start"
    >
      {/* Left: badge */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-100">
          {categoria.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Middle: main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white truncate">{titulo}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {truncate(descricao)}
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
              {status}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <FaUser /> <span className="text-slate-600 dark:text-slate-300">{autor}</span>
            </span>

            <span className="flex items-center gap-2">
              <FaRegCommentDots /> <span>{commentsCount}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
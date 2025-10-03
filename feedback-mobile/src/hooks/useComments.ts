/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { getComments, createComment, updateComment, deleteComment } from "../api/comments";
import type { Comment } from "../api/comments";

export function useComments(idfeedback: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca comentários
  const fetchComments = useCallback(async () => {
    if (!idfeedback) return; // Proteção extra
    setLoading(true);
    setError(null);
    try {
      const data = await getComments(idfeedback);
      // Em React Native não precisa de `.items` se o backend já retornar array
      setComments(data.items || []);
    } catch (err: any) {
      console.error("Erro ao buscar comentários:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [idfeedback]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Adiciona comentário
  const addComment = async (conteudo: string, autor?: string) => {
    try {
      const newComment = await createComment(idfeedback, { conteudo, autor });
      setComments((prev) => [...prev, newComment]);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
      throw err;
    }
  };

  // Edita comentário
  const editComment = async (idcomment: string | undefined, conteudo: string) => {
    if (!idcomment) throw new Error("ID do comentário é inválido");
    try {
      const updated = await updateComment(idcomment, { conteudo });
      setComments((prev) =>
        prev.map((c) => (c.idcomment === idcomment ? updated : c))
      );
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
      throw err;
    }
  };

  // Remove comentário
  const removeComment = async (idcomment: string | undefined) => {
    if (!idcomment) throw new Error("ID do comentário é inválido");
    try {
      await deleteComment(idcomment);
      setComments((prev) => prev.filter((c) => c.idcomment !== idcomment));
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
      throw err;
    }
  };

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    editComment,
    removeComment,
  };
}

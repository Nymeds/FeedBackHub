/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { getComments, createComment, deleteComment, updateComment, type Comment } from "../api/comments";

export function useComments(idfeedback: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchComments = useCallback(async () => {
    if (!idfeedback) return;
    setLoading(true);
    setError("");
    try {
      const res = await getComments(idfeedback);
      setComments(res.items || []);
    } catch (err: any) {
      console.log(err);
      setError("Não foi possível carregar os comentários.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [idfeedback]);

  const addComment = useCallback(
    async (conteudo: string, autor?: string) => {
      try {
        const newComment = await createComment(idfeedback, { conteudo, autor });
        setComments((prev) => [newComment, ...prev]);
        return newComment;
      } catch (err: any) {
        console.log("Erro ao criar comentário:", err);
        throw err;
      }
    },
    [idfeedback]
  );

  const editComment = useCallback(
    async (idcomment: string, conteudo: string) => {
      try {
        const updated = await updateComment(idcomment, { conteudo });
        setComments((prev) => prev.map((c) => (c.idcomment === idcomment ? updated : c)));
        return updated;
      } catch (err: any) {
        console.log("Erro ao atualizar comentário:", err);
        throw err;
      }
    },
    []
  );

  const removeComment = useCallback(
    async (idcomment: string) => {
      try {
        await deleteComment(idcomment);
        setComments((prev) => prev.filter((c) => c.idcomment !== idcomment));
      } catch (err: any) {
        console.log("Erro ao deletar comentário:", err);
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    fetchComments().catch(() => {});
  }, [fetchComments]);

  return { comments, loading, error, fetchComments, addComment, editComment, removeComment };
}
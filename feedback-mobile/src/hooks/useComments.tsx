import { useState, useEffect, useCallback } from "react";
import { getComments, createComment, deleteComment, updateComment, Comment } from "../api/comments";

export function useComments(idfeedback: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    if (!idfeedback) return;
    setLoading(true);
    setError("");
    try {
      const res = await getComments(idfeedback);
      setComments(res.items || []);
    } catch (err) {
      console.log(err);
      setError("Não foi possível carregar os comentários.");
    } finally {
      setLoading(false);
    }
  }, [idfeedback]);

  const addComment = useCallback(
    async (texto: string, autor?: string) => {
      try {
        const newComment = await createComment(idfeedback, { texto, autor });
        setComments((prev) => [newComment, ...prev]); 
      } catch (err) {
        console.log(err);
        throw new Error("Erro ao criar comentário");
      }
    },
    [idfeedback]
  );

  const editComment = useCallback(async (idcomment: string, texto: string) => {
    try {
      const updated = await updateComment(idcomment, { texto });
      setComments((prev) => prev.map((c) => (c.idcomment === idcomment ? updated : c)));
    } catch (err) {
      console.log(err);
      throw new Error("Erro ao atualizar comentário");
    }
  }, []);

  const removeComment = useCallback(async (idcomment: string) => {
    try {
      await deleteComment(idcomment);
      setComments((prev) => prev.filter((c) => c.idcomment !== idcomment));
    } catch (err) {
      console.log(err);
      throw new Error("Erro ao deletar comentário");
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, fetchComments, addComment, editComment, removeComment };
}

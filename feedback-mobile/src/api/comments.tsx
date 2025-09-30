import { api } from "./api";

export type Comment = {
  idcomment: string;
  idfeedback: string;
  autor?: string;
  conteudo: string;
  createdAt: string;
  updatedAt: string;
};

// Buscar comentários de um feedback
export async function getComments(idfeedback: string) {
  const res = await api.get<{ items: Comment[] }>(`/feedbacks/${idfeedback}/comments`);
  return res.data;
}

// Criar comentário
export async function createComment(idfeedback: string, data: { conteudo: string; autor?: string }) {
  const res = await api.post<Comment>(`/feedbacks/${idfeedback}/comments`, data);
  return res.data;
}

// Atualizar comentário
export async function updateComment(idcomment: string, data: { texto: string }) {
  const res = await api.put<Comment>(`/comments/${idcomment}`, data);
  return res.data;
}

// Deletar comentário
export async function deleteComment(idcomment: string) {
  await api.delete(`/comments/${idcomment}`);
}

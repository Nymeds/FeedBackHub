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
  try {
    const res = await api.get<{ items: Comment[] }>(`/feedbacks/${idfeedback}/comments`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error) {
      throw err.response.data.error; // Propaga o erro do backend
    }
    throw { code: "UNKNOWN_ERROR", message: "Erro desconhecido" };
  }
}

// Criar comentário
export async function createComment(idfeedback: string, data: { conteudo: string; autor?: string }) {
  try {
    const res = await api.post<Comment>(`/feedbacks/${idfeedback}/comments`, data);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error) {
      throw err.response.data.error;
    }
    throw { code: "UNKNOWN_ERROR", message: "Erro desconhecido" };
  }
}

// Atualizar comentário
export async function updateComment(idcomment: string, data: { conteudo: string }) {
  try {
    const res = await api.put<Comment>(`/comments/${idcomment}`, data);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error) {
      throw err.response.data.error;
    }
    throw { code: "UNKNOWN_ERROR", message: "Erro desconhecido" };
  }
}

// Deletar comentário
export async function deleteComment(idcomment: string) {
  try {
    await api.delete(`/comments/${idcomment}`);
  } catch (err: any) {
    if (err.response?.data?.error) {
      throw err.response.data.error;
    }
    throw { code: "UNKNOWN_ERROR", message: "Erro desconhecido" };
  }
}

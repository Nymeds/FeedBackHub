/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "./api";

export type Feedback = {
 
  idfeedback: string;
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
};

// Buscar lista de feedbacks
export async function getFeedbacks(page = 1, limit = 10, q = "") {
  try {
    const res = await api.get<{ items: Feedback[] }>(`/feedbacks`, {
      params: { _page: page, _limit: limit, q },
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error) {
      throw err.response.data.error;
    }
    throw { code: "UNKNOWN_ERROR", message: "Erro desconhecido" };
  }
}

// Buscar feedback por ID
export async function getFeedbackById(id: string) {
  try {
    const res = await api.get<Feedback>(`/feedbacks/${id}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error) {
      throw err.response.data.error;
    }
    throw { code: "UNKNOWN_ERROR", message: "Erro desconhecido" };
  }
}

// Criar feedback
export async function createFeedback(data: Partial<Feedback>) {
  try {
    const res = await api.post<Feedback>(`/feedbacks`, data);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error) {
      throw err.response.data.error;
    }
    throw { code: "UNKNOWN_ERROR", message: "Erro desconhecido" };
  }
}

// Atualizar feedback
export async function updateFeedback(id: string, data: Partial<Feedback>) {
  try {
    const res = await api.put<Feedback>(`/feedbacks/${id}`, data);
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.error) {
      throw err.response.data.error;
    }
    throw { code: "UNKNOWN_ERROR", message: "Erro desconhecido" };
  }
}

// Deletar feedback
export async function deleteFeedback(id: string) {
  try {
    await api.delete(`/feedbacks/${id}`);
  } catch (err: any) {
    if (err.response?.data?.error) {
      throw err.response.data.error;
    }
    throw { code: "UNKNOWN_ERROR", message: "Erro desconhecido" };
  }
}

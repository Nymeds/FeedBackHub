import { api } from "./api";

export const getFeedbacks = (page = 1, limit = 10, q = "") =>
  api.get(`/feedbacks`, { params: { _page: page, _limit: limit, q } });

export const getFeedbackById = (id: string) =>
  api.get(`/feedbacks/${id}`);

export const createFeedback = (data: any) =>
  api.post(`/feedbacks`, data);

export const updateFeedback = (id: string, data: any) =>
  api.put(`/feedbacks/${id}`, data);

export const deleteFeedback = (id: string) =>
  api.delete(`/feedbacks/${id}`);

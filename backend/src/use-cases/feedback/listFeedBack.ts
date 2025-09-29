import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";

export interface ListFeedbacksParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

export class ListFeedbacksUseCase {
  constructor(private repo: FeedbacksPrismaRepository) {}

  /**
   * Retorna: { items: [...], page, pageSize, total }
   * Cada item já tem commentsCount (implementado no repositório).
   */
  async execute(params: ListFeedbacksParams) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const q = params.q;

    // repo.findAll espera { page, pageSize, q } e retorna o formato paginado
    const result = await this.repo.findAll({ page, pageSize, q });
    return result;
  }
}

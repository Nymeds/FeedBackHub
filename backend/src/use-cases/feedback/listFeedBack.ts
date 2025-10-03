import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";

export interface ListFeedbacksParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

export class ListFeedbacksUseCase {
  constructor(private repo: FeedbacksPrismaRepository) {}

 
  async execute(params: ListFeedbacksParams) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const q = params.q;

    
    const result = await this.repo.findAll({ page, pageSize, q });
    return result;
  }
}

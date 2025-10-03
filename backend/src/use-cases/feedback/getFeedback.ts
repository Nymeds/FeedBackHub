import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";

export class GetFeedbackUseCase {
  constructor(private repo: FeedbacksPrismaRepository) {}


  async execute(id: string) {
    const feedback = await this.repo.findById(id);
    if (!feedback) return null;

   
    return feedback;
  }
}

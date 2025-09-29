import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";

export class DeleteFeedbackUseCase {
  constructor(private repo: FeedbacksPrismaRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

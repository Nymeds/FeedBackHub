import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";

export class GetFeedbackUseCase {
  constructor(private repo: FeedbacksPrismaRepository) {}

  /**
   * Retorna o feedback com campo `comments` (array).
   * Se não encontrado, retorna null.
   */
  async execute(id: string) {
    const feedback = await this.repo.findById(id);
    if (!feedback) return null;

    // repo.findById já inclui comments (array) — retornamos tal qual (detalhe do recurso)
    return feedback;
  }
}

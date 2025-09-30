import { z } from "zod";
import { CommentsPrismaRepository } from "../../repositories/prisma/comments-prisma-repository";
import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";

export class CreateCommentUseCase {
  constructor(
    private commentsRepo = new CommentsPrismaRepository(),
    private feedbacksRepo = new FeedbacksPrismaRepository()
  ) {}

  async execute(idfeedback: string, payload: unknown) {
    // Validação 
    const schema = z.object({
      autor: z.string().min(2, "O autor deve ter pelo menos 2 caracteres"),
      conteudo: z.string().min(5, "O conteúdo deve ter pelo menos 5 caracteres"),
    });

    const validated = schema.parse(payload);

    // Verifica se feedback existe , se n retorna um erro
    const feedback = await this.feedbacksRepo.findById(idfeedback);
    if (!feedback) {
      const err: any = new Error("Feedback não encontrado");
      err.code = "NOT_FOUND";
      throw err;
    }

    return this.commentsRepo.create(idfeedback, validated);
  }
}

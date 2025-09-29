import { z, ZodError } from "zod";
import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";

const schema = z.object({
  titulo: z.string().min(3).optional(),
  descricao: z.string().min(10).optional(),
  categoria: z.enum(["UI", "UX", "Feature", "Bug", "Performance", "Other"]).optional(),
  status: z.enum(["suggestion", "planned", "in_progress", "done"]).optional(),
});

export class UpdateFeedbackUseCase {
  constructor(private feedbackRepository: FeedbacksPrismaRepository) {}

  async execute(idfeedback: string, data: unknown) {
    const validated = schema.parse(data);

    // Rejeita payload vazio
    if (Object.keys(validated).length === 0) {
      throw new ZodError([
        {
          code: "custom",
          path: [],
          message: "É necessário enviar ao menos um campo para atualizar",
        } as any,
      ]);
    }

   
    const updated = await this.feedbackRepository.update(idfeedback, validated);
    return updated;
  }
}

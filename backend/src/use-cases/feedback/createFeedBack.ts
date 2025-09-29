import { z } from "zod";
import { Feedback } from "@prisma/client";
import { FeedbacksPrismaRepository, CreateFeedbackDTO } from "../../repositories/prisma/feedbacks-prisma-repository";

const createFeedbackSchema = z.object({
  titulo: z.string().min(3, "mínimo 3 caracteres"),
  descricao: z.string().min(10, "mínimo 10 caracteres"),
  categoria: z.enum(["UI","UX","Feature","Bug","Performance","Other"]),
  status: z.enum(["suggestion","planned","in_progress","done"]).optional(),
});

type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;

export class CreateFeedbackUseCase {
  constructor(private repo: FeedbacksPrismaRepository) {}

  async execute(payload: unknown): Promise<Feedback> {
    // valida e lança ZodError se inválido
    const parsed = createFeedbackSchema.parse(payload) as CreateFeedbackInput;

    // aplica default de negócio
    const data: CreateFeedbackDTO = {
      titulo: parsed.titulo,
      descricao: parsed.descricao,
      categoria: parsed.categoria,
      status: parsed.status ?? "suggestion",
    };

    // cria via repositório (Prisma cuidará de id e timestamps)
    const created = await this.repo.create(data);
    return created;
  }
}

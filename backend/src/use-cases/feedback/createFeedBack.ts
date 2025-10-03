import { z } from "zod";
import { Feedback } from "@prisma/client";
import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";

export class CreateFeedbackUseCase {
  constructor(private feedbacksRepo = new FeedbacksPrismaRepository()) {}

  async execute(payload: unknown): Promise<Feedback> {
    
    const schema = z.object({
      titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
      descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
      categoria: z.enum(["UI","UX","Feature","Bug","Performance","Other"]),
      status: z.enum(["suggestion","planned","in_progress","done"]).optional(),
      comments: z.number().default(0),
    });

   
    const validated = schema.parse(payload);

    
    const data = {
      titulo: validated.titulo,
      descricao: validated.descricao,
      categoria: validated.categoria,
      status: validated.status ?? "suggestion",
    };

    
    return this.feedbacksRepo.create(data);
  }
}

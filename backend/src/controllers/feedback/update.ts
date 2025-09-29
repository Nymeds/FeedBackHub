// src/controllers/feedbacks/update.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { UpdateFeedbackUseCase } from "../../use-cases/feedback/updateFeedBack";
import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";

type Body = {
  titulo?: string;
  descricao?: string;
  categoria?: "UI" | "UX" | "Feature" | "Bug" | "Performance" | "Other";
  status?: "suggestion" | "planned" | "in_progress" | "done";
};

type Params = { idfeedback: string };

export async function updateFeedbackController(
  request: FastifyRequest<{ Params: Params; Body: Body }>,
  reply: FastifyReply
) {
  const { idfeedback } = request.params;
  const data = request.body;

  const feedbackRepo = new FeedbacksPrismaRepository();
  const updateUseCase = new UpdateFeedbackUseCase(feedbackRepo);

  try {
    const updatedFeedback = await updateUseCase.execute(idfeedback, data);

    
    return reply.status(200).send(updatedFeedback);
  } catch (err: any) {
    // Validação Zod
    if (err instanceof ZodError) {
      const details = err.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return reply.status(400).send({
        error: { code: "VALIDATION_ERROR", message: "Dados inválidos", details },
      });
    }

    // Prisma: registro não encontrado
    if (err?.code === "P2025") {
      return reply.status(404).send({
        error: { code: "NOT_FOUND", message: "Feedback não encontrado", details: [] },
      });
    }

    // Outros erros
    request.log?.error?.(err);
    return reply.status(500).send({
      error: { code: "INTERNAL_SERVER_ERROR", message: "Erro inesperado", details: [] },
    });
  }
}

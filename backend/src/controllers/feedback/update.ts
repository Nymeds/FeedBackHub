import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { UpdateFeedbackUseCase } from "../../use-cases/feedback/updateFeedBack";
import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";
import { formatValidationError, formatNotFound, formatInternalError } from "../../utils/errors";

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

  const repo = new FeedbacksPrismaRepository();
  const useCase = new UpdateFeedbackUseCase(repo);

  try {
    const updated = await useCase.execute(idfeedback, data);
    return reply.status(200).send(updated);
  } catch (err: any) {
    if (err instanceof ZodError) {
      const details = err.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return reply.status(400).send(formatValidationError(details));
    }

    if (err?.code === "P2025") {
      return reply.status(404).send(formatNotFound());
    }

    return reply.status(500).send(formatInternalError());
  }
}

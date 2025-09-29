import { FastifyRequest, FastifyReply } from "fastify";
import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";
import { DeleteFeedbackUseCase } from "../../use-cases/feedback/deleteFeedback";
import { formatNotFound } from "../../utils/errors";

const repo = new FeedbacksPrismaRepository();
const useCase = new DeleteFeedbackUseCase(repo);

export async function deleteFeedbackController(request: FastifyRequest, reply: FastifyReply) {
  const { idfeedback } = request.params as any;
  try {
    await useCase.execute(idfeedback);
    return reply.status(204).send();
  } catch (err: any) {
    if (err?.code === "P2025") return reply.status(404).send(formatNotFound("Feedback"));
    return reply.status(500).send({ error: { code: "INTERNAL", message: "Erro inesperado", details: [] } });
  }
}

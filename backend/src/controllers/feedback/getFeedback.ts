import { FastifyRequest, FastifyReply } from "fastify";
import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";
import { GetFeedbackUseCase } from "../../use-cases/feedback/getFeedback";
import { formatNotFound, formatInternalError } from "../../utils/errors";

export async function getFeedbackController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { idfeedback } = request.params as any;
    const repo = new FeedbacksPrismaRepository();
    const useCase = new GetFeedbackUseCase(repo);

    const found = await useCase.execute(idfeedback);
    if (!found) return reply.status(404).send(formatNotFound());
    return reply.send(found);
  } catch (err) {
    return reply.status(500).send(formatInternalError());
  }
}

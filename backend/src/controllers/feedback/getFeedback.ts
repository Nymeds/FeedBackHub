import { FastifyRequest, FastifyReply } from "fastify";
import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";
import { GetFeedbackUseCase } from "../../use-cases/feedback/getFeedback";
import { formatNotFound } from "../../utils/errors";

const repo = new FeedbacksPrismaRepository();
const useCase = new GetFeedbackUseCase(repo);

export async function getFeedbackController(request: FastifyRequest, reply: FastifyReply) {
  const { idfeedback } = request.params as any;
  const found = await useCase.execute(idfeedback);
  if (!found) return reply.status(404).send(formatNotFound("Feedback"));
  return reply.send(found);
}

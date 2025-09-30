import { FastifyReply, FastifyRequest } from "fastify";
import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";
import { CreateFeedbackUseCase } from "../../use-cases/feedback/createFeedBack";
import { formatValidationError, formatInternalError } from "../../utils/errors";

const repo = new FeedbacksPrismaRepository();
const useCase = new CreateFeedbackUseCase(repo);

export async function createFeedbackController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const created = await useCase.execute(request.body);
    return reply.status(201).send(created);
  } catch (err: any) {
    if (err?.issues) {
      const details = err.issues.map((i: any) => ({
        field: i.path?.[0],
        message: i.message,
      }));
      return reply.status(400).send(formatValidationError(details));
    }
    return reply.status(500).send(formatInternalError());
  }
}

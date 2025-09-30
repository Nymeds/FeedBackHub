import { FastifyRequest, FastifyReply } from "fastify";
import { FeedbacksPrismaRepository } from "../../repositories/prisma/feedbacks-prisma-repository";
import { ListFeedbacksUseCase } from "../../use-cases/feedback/listFeedBack";
import { formatInternalError } from "../../utils/errors";

export async function listFeedbacksController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { _page, _limit, q } = request.query as any;
    const page = Number(_page) || 1;
    const pageSize = Number(_limit) || 10;

    const repo = new FeedbacksPrismaRepository();
    const useCase = new ListFeedbacksUseCase(repo);

    const result = await useCase.execute({ page, pageSize, q });
    return reply.send(result);
  } catch (err) {
    return reply.status(500).send(formatInternalError());
  }
}

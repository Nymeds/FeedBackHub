import { FastifyRequest, FastifyReply } from "fastify";
import { ListCommentsUseCase } from "../../use-cases/comments/listComments";

interface RequestParams {
  idfeedback: string;
}

interface RequestQuery {
  page?: number;
  pageSize?: number;
}

export async function listCommentController(
  request: FastifyRequest<{ Params: RequestParams; Querystring: RequestQuery }>,
  reply: FastifyReply
) {
  const { idfeedback } = request.params;
  const { page, pageSize } = request.query;

  const useCase = new ListCommentsUseCase();
  const comments = await useCase.execute({ idfeedback, page, pageSize });

  return reply.status(200).send(comments);
}

import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCommentUseCase } from "../../use-cases/comments/deleteComment";
import { formatNotFound, formatInternalError } from "../../utils/errors";

interface RequestParams {
  idcomment: string;
}

export async function deleteCommentController(
  request: FastifyRequest<{ Params: RequestParams }>,
  reply: FastifyReply
) {
  try {
    const { idcomment } = request.params;
    const useCase = new DeleteCommentUseCase();

    await useCase.execute(idcomment);

    return reply.status(204).send();
  } catch (err: any) {
    if (err.code === "NOT_FOUND") {
      return reply.status(404).send(formatNotFound());
    }
    return reply.status(500).send(formatInternalError());
  }
}

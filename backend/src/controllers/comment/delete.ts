import { FastifyRequest, FastifyReply } from "fastify";
import { DeleteCommentUseCase } from "../../use-cases/comments/deleteComment";

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
    return reply.status(500).send({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro inesperado",
      },
    });
  }
}

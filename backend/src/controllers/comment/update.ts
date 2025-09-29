import { FastifyRequest, FastifyReply } from "fastify";
import { UpdateCommentUseCase } from "../../use-cases/comments/updateComment";

interface RequestBody {
  autor?: string;
  conteudo?: string;
}

interface RequestParams {
  idcomment: string;
}

export async function updateCommentController(
  request: FastifyRequest<{ Params: RequestParams; Body: RequestBody }>,
  reply: FastifyReply
) {
  try {
    const { idcomment } = request.params;
    const data = request.body;

    const useCase = new UpdateCommentUseCase();
    const updated = await useCase.execute(idcomment, data);

    return reply.status(200).send(updated);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Dados inválidos",
          details: err.errors.map((e: any) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
      });
    }

    return reply.status(500).send({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro inesperado",
      },
    });
  }
}

import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCommentUseCase } from "../../use-cases/comments/createComment";

interface RequestBody {
  autor: string;
  conteudo: string;
}

interface RequestParams {
  idfeedback: string;
}

export async function createCommentController(
  request: FastifyRequest<{ Params: RequestParams; Body: RequestBody }>,
  reply: FastifyReply
) {
  try {
    const { idfeedback } = request.params;
    const data = request.body;

    const useCase = new CreateCommentUseCase();
    const comment = await useCase.execute(idfeedback, data);

    return reply.status(201).send(comment);
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

    if (err.code === "NOT_FOUND") {
      return reply.status(404).send({ error: { code: "NOT_FOUND", message: err.message } });
    }

    return reply.status(500).send({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro inesperado",
      },
    });
  }
}

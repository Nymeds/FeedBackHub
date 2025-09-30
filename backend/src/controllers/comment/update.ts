import { FastifyRequest, FastifyReply } from "fastify";
import { UpdateCommentUseCase } from "../../use-cases/comments/updateComment";
import { formatValidationError, formatNotFound, formatInternalError } from "../../utils/errors";

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
    // Validação 
    if (err.name === "ZodError" && Array.isArray(err.issues)) {
      const details = err.issues.map((e: any) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return reply.status(400).send(formatValidationError(details));
    }

    // Comentário não encontrado
    if (err.code === "NOT_FOUND") {
      return reply.status(404).send(formatNotFound());
    }

    // Erro inesperado
    console.error(err);
    return reply.status(500).send(formatInternalError());
  }
}

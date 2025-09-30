import { FastifyRequest, FastifyReply } from "fastify";
import { CreateCommentUseCase } from "../../use-cases/comments/createComment";
import { formatValidationError, formatNotFound, formatInternalError } from "../../utils/errors";

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
    // Validação
    if (err.name === "ZodError" && Array.isArray(err.issues)) {
      const details = err.issues.map((i: any) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return reply.status(400).send(formatValidationError(details));
    }

   
    if (err.code === "NOT_FOUND") {
      return reply.status(404).send(formatNotFound());
    }

    // Qualquer outro 
    console.error(err);
    return reply.status(500).send(formatInternalError());
  }
}

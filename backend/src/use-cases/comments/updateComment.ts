import { z, ZodError } from "zod";
import { CommentsPrismaRepository } from "../../repositories/prisma/comments-prisma-repository";

export class UpdateCommentUseCase {
  constructor(private commentsRepo = new CommentsPrismaRepository()) {}

  async execute(idcomment: string, payload: unknown) {
    // Validação interna
    const schema = z.object({
      autor: z.string().min(3).optional(),
      conteudo: z.string().min(5).optional(),
    });

    const validated = schema.parse(payload);

    if (Object.keys(validated).length === 0) {
      const err = new ZodError([
        {
          code: "custom",
          path: [],
          message: "É necessário enviar pelo menos um campo para atualizar",
        } as any,
      ]);
      throw err;
    }

    return this.commentsRepo.update(idcomment, validated);
  }
}

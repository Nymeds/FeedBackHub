import { z, ZodError } from "zod";
import { CommentsPrismaRepository } from "../../repositories/prisma/comments-prisma-repository";
import { Prisma } from "@prisma/client";

export class UpdateCommentUseCase {
  constructor(private commentsRepo = new CommentsPrismaRepository()) {}

  async execute(idcomment: string, payload: unknown) {
    const schema = z.object({
      autor: z.string().min(2, { message: "O autor deve ter pelo menos 2 caracteres" }).optional(),
      conteudo: z.string().min(5, { message: "O conteúdo deve ter pelo menos 5 caracteres" }).optional(),
    });

    const validated = schema.parse(payload);

    if (Object.keys(validated).length === 0) {
      throw new ZodError([
        {
          code: "custom",
          path: [],
          message: "É necessário enviar pelo menos um campo para atualizar",
        } as any,
      ]);
    }

    try {
      return await this.commentsRepo.update(idcomment, validated);
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        const e: any = new Error("Comentário não encontrado");
        e.code = "NOT_FOUND";
        throw e;
      }
      throw err; 
    }
  }
}

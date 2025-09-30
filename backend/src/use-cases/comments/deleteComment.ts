import { CommentsPrismaRepository } from "../../repositories/prisma/comments-prisma-repository";
import { Prisma } from "@prisma/client";

export class DeleteCommentUseCase {
  constructor(private commentsRepo = new CommentsPrismaRepository()) {}

  async execute(idcomment: string) {
    try {
      await this.commentsRepo.delete(idcomment);
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

import { CommentsPrismaRepository } from "../../repositories/prisma/comments-prisma-repository";

export class DeleteCommentUseCase {
  constructor(private commentsRepo = new CommentsPrismaRepository()) {}

  async execute(idcomment: string) {
    await this.commentsRepo.delete(idcomment);
  }
}

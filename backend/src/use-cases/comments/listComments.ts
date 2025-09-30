import { CommentsPrismaRepository } from "../../repositories/prisma/comments-prisma-repository";
//Validação
interface Input {
  idfeedback: string;
  page?: number;
  pageSize?: number;
}

export class ListCommentsUseCase {
  constructor(private commentsRepo = new CommentsPrismaRepository()) {}

  async execute({ idfeedback, page = 1, pageSize = 10 }: Input) {
    return this.commentsRepo.findAll({ idfeedback, page, pageSize });
  }
}

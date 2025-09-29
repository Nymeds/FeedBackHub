import { prisma } from "../../utils/prismaClient";
import { Comment } from "@prisma/client";

export interface CreateCommentDTO {
  autor: string;
  conteudo: string;
}

export class CommentsPrismaRepository {
  // CREATE
  async create(idfeedback: string, data: CreateCommentDTO): Promise<Comment> {
    const now = new Date().toISOString();
    return prisma.comment.create({
      data: {
        ...data,
        idfeedback,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // LIST + PAGINAÇÃO por feedback
  async findAll(params: { idfeedback: string; page?: number; pageSize?: number }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [total, items] = await Promise.all([
      prisma.comment.count({ where: { idfeedback: params.idfeedback } }),
      prisma.comment.findMany({
        where: { idfeedback: params.idfeedback },
        orderBy: { createdAt: "asc" },
        skip,
        take: pageSize,
      }),
    ]);

    return {
      items,
      page,
      pageSize,
      total,
    };
  }

  // GET BY ID
  async findById(idcomment: string) {
    return prisma.comment.findUnique({ where: { idcomment } });
  }

  // UPDATE
  async update(idcomment: string, data: Partial<CreateCommentDTO>) {
    return prisma.comment.update({
      where: { idcomment },
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  // DELETE
  async delete(idcomment: string) {
    await prisma.comment.delete({ where: { idcomment } });
  }
}

import { prisma } from "../../utils/prismaClient";
import { Feedback } from "@prisma/client";

export interface CreateFeedbackDTO {
  titulo: string;
  descricao: string;
  categoria: "UI" | "UX" | "Feature" | "Bug" | "Performance" | "Other";
  status?: "suggestion" | "planned" | "in_progress" | "done";
}

export class FeedbacksPrismaRepository {
  // CREATE
  async create(data: CreateFeedbackDTO): Promise<Feedback> {
    const now = new Date().toISOString();
    return prisma.feedback.create({
      data: {
        ...data,
        status: data.status ?? "suggestion",
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // LIST + PAGINAÇÃO + BUSCA + COMMENTS COUNT
  async findAll(params: { page?: number; pageSize?: number; q?: string }) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const skip = (page - 1) * pageSize;

  const where = params.q
    ? {
        OR: [
          { titulo: { contains: params.q } },
          { descricao: { contains: params.q } },
        ],
      }
    : {};

  const [total, items] = await Promise.all([
    prisma.feedback.count({ where }),
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { _count: { select: { comments: true } } },
    }),
  ]);

  const mapped = items.map((f) => ({
    idfeedback: f.idfeedback,
    titulo: f.titulo,
    descricao: f.descricao,
    categoria: f.categoria,
    status: f.status,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
    commentsCount: f._count?.comments ?? 0,
  }));

  return {
    items: mapped,
    page,
    pageSize,
    total,
  };
}


  // GET BY ID
  async findById(id: string) {
    const feedback = await prisma.feedback.findUnique({
      where: { idfeedback: id },
      include: { _count: { select: { comments: true } } },
    });

    if (!feedback) return null;

    return {
      idfeedback: feedback.idfeedback,
      titulo: feedback.titulo,
      descricao: feedback.descricao,
      categoria: feedback.categoria,
      status: feedback.status,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
      commentsCount: feedback._count?.comments ?? 0,
    };
  }

// UPDATE
async update(id: string, data: Partial<CreateFeedbackDTO>) {
  const feedback = await prisma.feedback.update({
    where: { idfeedback: id },
    data: {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    include: { _count: { select: { comments: true } } }, 
  });

  return {
    idfeedback: feedback.idfeedback,
    titulo: feedback.titulo,
    descricao: feedback.descricao,
    categoria: feedback.categoria,
    status: feedback.status,
    createdAt: feedback.createdAt,
    updatedAt: feedback.updatedAt,
    commentsCount: feedback._count?.comments ?? 0,
  };
}


  // DELETE
  async delete(id: string) {
    await prisma.feedback.delete({ where: { idfeedback: id } });
  }
}

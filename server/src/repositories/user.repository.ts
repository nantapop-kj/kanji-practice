import { prisma } from "../config/prisma.js";
import type { User } from "../generated/prisma/client.js";
import type { PublicUser } from "../types/auth.js";
import type { PaginationQuery } from "../types/pagination.js";

export const userRepository = {
  getPage: ({ page, pageSize }: PaginationQuery): Promise<[PublicUser[], number]> =>
    prisma.$transaction([
      prisma.user.findMany({
        omit: { passwordHash: true },
        orderBy: [{ name: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count(),
    ]),

  getByEmail: (email: string): Promise<User | null> => prisma.user.findUnique({ where: { email } }),

  getById: (id: string): Promise<User | null> => prisma.user.findUnique({ where: { id } }),

  create: (data: { email: string; passwordHash: string; name: string }): Promise<User> =>
    prisma.user.create({
      data: { ...data, createdBy: data.name, updatedBy: data.name },
    }),
};

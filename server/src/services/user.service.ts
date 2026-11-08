import { userRepository } from "../repositories/user.repository.js";
import type { PublicUser } from "../types/auth.js";
import type { Paginated, PaginationQuery } from "../types/pagination.js";
import { toPaginated } from "../utils/pagination.js";

export const userService = {
  async getAll(pagination: PaginationQuery): Promise<Paginated<PublicUser>> {
    const [users, total] = await userRepository.getAll(pagination);

    return toPaginated(users, total, pagination);
  },
};

import type { Request, Response } from "express";
import { userService } from "../services/user.service.js";
import type { PublicUser } from "../types/auth.js";
import type { Paginated } from "../types/pagination.js";
import { parsePaginationQuery } from "../utils/pagination.js";

export const userController = {
  async getAll(req: Request, res: Response<Paginated<PublicUser>>): Promise<void> {
    const users = await userService.getAll(parsePaginationQuery(req.query));

    res.json(users);
  },
};

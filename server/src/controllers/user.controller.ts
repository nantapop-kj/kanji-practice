import type { Request, Response } from "express";
import { LogEvent } from "../constants/log.js";
import { userService } from "../services/user.service.js";
import type { PublicUser } from "../types/auth.js";
import type { Paginated } from "../types/pagination.js";
import { logFailure } from "../utils/log.js";
import { parsePaginationQuery } from "../utils/pagination.js";

export const userController = {
  async getAll(req: Request, res: Response<Paginated<PublicUser>>): Promise<void> {
    try {
      const query = parsePaginationQuery(req.query);
      const users = await userService.getAll(query);
      req.log.info("Users listed", {
        event: LogEvent.UserList,
        userId: req.user?.id,
        page: query.page,
        pageSize: query.pageSize,
      });

      res.json(users);
    } catch (err) {
      throw logFailure(req, LogEvent.UserListFailed, "List users failed", err);
    }
  },
};

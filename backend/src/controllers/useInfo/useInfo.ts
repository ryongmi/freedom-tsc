import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as MENU from "../../models/menu";
import { tryCatchControllerHandler } from "../../middleware/try-catch";

export const getMenus = tryCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const menu = await MENU.getUserMenus(req);

    res.send({
      menu,
    });
  }
);
export const getAdminMenus = tryCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const menu = await MENU.getAdminMenus(req);

    res.send({
      menu,
    });
  }
);

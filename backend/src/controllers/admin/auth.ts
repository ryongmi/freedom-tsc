import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";
import * as AUTH from "../../models/auth";
import * as COMBO from "../../models/combo";

export const getManageAuth = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const auth = await AUTH.getAuths(req);
    const comboType = await COMBO.getComboComCd(req, "LEVEL_CONDITION_TYPE");

    res.send({
      auth: auth,
      comboType: comboType,
    });
  }
);

export const postManageAuth = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    await AUTH.updatedAuth(req);

    res.send({ message: "정상처리." });
  }
);

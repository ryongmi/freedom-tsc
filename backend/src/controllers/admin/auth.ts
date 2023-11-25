import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { tryCatchControllerHandler } from "../../middleware/try-catch";
import * as AUTH from "../../models/auth";
import * as COMBO from "../../models/combo";
import * as COUNT from "../../models/count";

export const getManageAuth = tryCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const comboPerPage = await COMBO.getComboPerPage(req);
    const auth = await AUTH.getAuths(req);
    const totalCount = await COUNT.getAuths(req);
    const comboType = await COMBO.getComboComCd(req, "LEVEL_CONDITION_TYPE");
    const comboUseFlag = await COMBO.getComboComCd(req, "USE_FLAG");

    res.status(200).send({
      auth,
      totalCount,
      comboType,
      comboUseFlag,
      comboPerPage,
    });
  }
);

export const postManageAuth = tryCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount: number = await AUTH.updatedAuth(req);

    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const patchManageAuth = tryCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount: number = await AUTH.deletedAuth(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 삭제되었습니다.` });
  }
);

export const getManageAuthLevelCondition = tryCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const comboPerPage = await COMBO.getComboPerPage(req);
    const auth = await AUTH.getAuthLevelCondition(req);
    const totalCount = await COUNT.getAuthLevelCondition(req);

    res.status(200).send({
      auth,
      totalCount,
      comboPerPage,
    });
  }
);

export const postManageAuthLevelCondition = tryCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount: number = await AUTH.updatedAuthLevelCondition(req);

    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

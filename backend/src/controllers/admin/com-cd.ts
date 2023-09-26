import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as COM_CD from "../../models/com-cd";
import * as COUNT from "../../models/count";
import * as COMBO from "../../models/combo";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getManageComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const mainComCd = await COM_CD.getMainComCd(req);
    const totalCount = await COUNT.getMainComCd(req);
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");

    return res.send({
      mainComCd,
      totalCount,
      comboPerPage,
    });
  }
);

export const getDetailComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const detailComCd = await COM_CD.getDetailComCd(req);
    const totalCount = await COUNT.getDetailComCd(req);
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");
    const comboUseFlag = await COMBO.getComboComCd(req, "USE_FLAG");

    return res.send({
      detailComCd,
      totalCount,
      comboPerPage,
      comboUseFlag,
    });
  }
);

export const postManageComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await COM_CD.createdComCd(req);
    return res.send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const deleteManageComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await COM_CD.deletedComCd(req);
    return res.send({ message: `${rowCount}건 정상적으로 삭제되었습니다.` });
  }
);

export const deleteDetailComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await COM_CD.deletedDetailComCd(req);
    return res.send({ message: `${rowCount}건 정상적으로 삭제되었습니다.` });
  }
);
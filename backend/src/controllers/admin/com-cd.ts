import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as COM_CD from "../../models/com-cd";
import * as COUNT from "../../models/count";
import * as COMBO from "../../models/combo";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getManageComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const comboPerPage = await COMBO.getComboPerPage(req);
    const comCd = await COM_CD.getMainComCd(req);
    const totalCount = await COUNT.getMainComCd(req);
    const comboComCdOption = await COMBO.getComboComCd(req, "COMCD_OPTION");

    res.status(200).send({
      comCd,
      totalCount,
      comboPerPage,
      comboComCdOption,
    });
  }
);

export const getDetailComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const comboPerPage = await COMBO.getComboPerPage(req);
    const detailComCd = await COM_CD.getDetailComCd(req);
    const totalCount = await COUNT.getDetailComCd(req);
    const comboUseFlag = await COMBO.getComboComCd(req, "USE_FLAG");
    const comboComCdOption = await COMBO.getComboComCd(req, "COMCD_OPTION");

    res.status(200).send({
      detailComCd,
      totalCount,
      comboPerPage,
      comboUseFlag,
      comboComCdOption,
    });
  }
);

export const postManageComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount = await COM_CD.createdComCd(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const postDetailComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount = await COM_CD.createdDetailComCd(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const deleteManageComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount = await COM_CD.deletedComCd(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 삭제되었습니다.` });
  }
);

export const deleteDetailComCd = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount = await COM_CD.deletedDetailComCd(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 삭제되었습니다.` });
  }
);

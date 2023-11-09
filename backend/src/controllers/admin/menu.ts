import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as MENU from "../../models/menu";
import * as BRACKET from "../../models/bracket";
import * as COUNT from "../../models/count";
import * as COMBO from "../../models/combo";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getManageMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }
    const comboPerPage = await COMBO.getComboPerPage(req);
    const menu = await MENU.getTopMenu(req);
    const totalCount = await COUNT.getTopMenu(req);
    const comboAdminFlag = await COMBO.getComboComCd(req, "ADMIN_FLAG");
    const comboUseFlag = await COMBO.getComboComCd(req, "USE_FLAG");

    res.status(200).send({
      menu,
      totalCount,
      comboPerPage,
      comboAdminFlag,
      comboUseFlag,
    });
  }
);

export const getDetailMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }
    const comboPerPage = await COMBO.getComboPerPage(req);
    const menu = await MENU.getDetailMenu(req);
    const totalCount = await COUNT.getDetailMenu(req);
    const comboAuth = await COMBO.getComboAuth(req);
    const comboUseFlag = await COMBO.getComboComCd(req, "USE_FLAG");
    const comboType = await COMBO.getComboComCd(req, "MENU_TYPE");

    res.status(200).send({
      menu,
      totalCount,
      comboPerPage,
      comboAuth,
      comboUseFlag,
      comboType,
      adminFlag: req.body.adminFlag,
    });
  }
);

export const postManageMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount: number = await MENU.createdMenu(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const postDetailMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount: number = await MENU.createdDetailMenu(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const patchManageMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount: number = await MENU.deletedMenu(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 삭제되었습니다.` });
  }
);

export const patchDetailMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount: number = await MENU.deletedDetailMenu(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 삭제되었습니다.` });
  }
);

export const getManageBracket = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }
    const comboPerPage = await COMBO.getComboPerPage(req);
    const bracket = await BRACKET.getBrackets(req);
    const totalCount = await COUNT.getBrackets(req);
    const comboUseFlag = await COMBO.getComboComCd(req, "USE_FLAG");

    res.status(200).send({
      bracket,
      comboPerPage,
      totalCount,
      comboUseFlag,
    });
  }
);

export const postManageBracket = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount: number = await BRACKET.createdBracket(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const patchManageBracket = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount: number = await BRACKET.deletedBracket(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 삭제되었습니다.` });
  }
);

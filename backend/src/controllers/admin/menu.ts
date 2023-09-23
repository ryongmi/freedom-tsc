import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as MENU from "../../models/menu";
import * as BRACKET from "../../models/bracket";
import * as COUNT from "../../models/count";
import * as COMBO from "../../models/combo";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getManageMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }
    const menu = await MENU.getTopMenu(req);
    const totalCount = await COUNT.getTopMenu(req);
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");
    const comboUseFlag = await COMBO.getComboComCd(req, "USE_FLAG");

    return res.send({
      menu,
      totalCount,
      comboPerPage,
      comboUseFlag,
    });
  }
);

export const getDetailMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }
    const menu = await MENU.getDetailMenu(req);
    const totalCount = await COUNT.getDetailMenu(req);
    const comboAuth = await COMBO.getComboAuth(req);
    const comboUseFlag = await COMBO.getComboComCd(req, "USE_FLAG");
    const comboType = await COMBO.getComboComCd(req, "MENU_TYPE");
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");

    return res.send({
      menu,
      totalCount,
      comboAuth,
      comboPerPage,
      comboUseFlag,
      comboType,
    });
  }
);

export const postManageMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await MENU.createdMenu(req);
    return res.send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const postDetailMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await MENU.createdDetailMenu(req);
    return res.send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const patchManageMenu = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await MENU.deletedMenu(req);
    return res.send({ message: `${rowCount}건 정상적으로 삭제되었습니다.` });
  }
);

export const getManageBracket = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const bracket = await BRACKET.getBrackets(req);

    return res.send({
      bracket,
    });
  }
);

export const postManageBracket = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const delBracket = req.body.delBracket;
    const bracket = req.body.bracket;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    let rowCount: number = 0;
    if (bracket.length > 0) {
      rowCount += await BRACKET.createdBracket(req);
    }

    if (delBracket.length > 0) {
      rowCount += await BRACKET.deletedBracket(req);
    }

    return res.send({ message: `${rowCount}건 정상적으로 처리되었습니다.` });
  }
);

import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as USER from "../../models/user";
import * as COUNT from "../../models/count";
import * as COMBO from "../../models/combo";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getManageUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await USER.getUsers(req);
    const totalCount = await COUNT.getUsers(req);
    const comboAuth = await COMBO.getComboAuth(req);
    const comboAuthAll = await COMBO.getComboAuthAll(req);
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");

    return res.send({
      users,
      totalCount,
      comboAuth,
      comboAuthAll,
      comboPerPage,
    });
  }
);

export const patchManageUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await USER.updatedUser(req);
    return res.send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const getManageWarnUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await USER.getWarnUsers(req);
    const totalCount = await COUNT.getWarnUsers(req);
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");

    return res.status(200).send({
      users,
      totalCount,
      comboPerPage,
    });
  }
);

export const getManageWarnContent = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const contents = await USER.getWarnContents(req);
    const totalCount = await COUNT.getWarnContents(req);
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");

    return res.send({
      contents,
      totalCount,
      comboPerPage,
    });
  }
);

export const postWarnUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await USER.createdWarnUser(req);
    return res.send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const patchUnWarnUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await USER.updatedUnWarnUser(req);
    return res.send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const getManageBanUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await USER.getBanUsers(req);
    const totalCount = await COUNT.getBanUsers(req);
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");

    return res.send({
      users,
      totalCount,
      comboPerPage,
    });
  }
);

export const getManageBanContent = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const contents = await USER.getBanContents(req);
    const totalCount = await COUNT.getBanContents(req);
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");

    return res.send({
      contents,
      totalCount,
      comboPerPage,
    });
  }
);

export const postBanUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await USER.createdBanUser(req);
    return res.send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const patchUnBanUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const rowCount = await USER.updatedUnBanUser(req);
    return res.send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

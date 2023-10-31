import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as USER from "../../models/user";
import * as COUNT from "../../models/count";
import * as COMBO from "../../models/combo";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getManageUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const comboPerPage = await COMBO.getComboPerPage(req);
    const user = await USER.getUsers(req);
    const totalCount = await COUNT.getUsers(req);
    const comboAuth = await COMBO.getComboAuth(req);
    const comboUserStatus = await COMBO.getComboComCd(req, "USER_STATUS");
    const comboUserOption = await COMBO.getComboComCd(req, "USER_OPTION");

    res.status(200).send({
      user,
      totalCount,
      comboPerPage,
      comboAuth,
      comboUserStatus,
      comboUserOption,
    });
  }
);

export const patchManageUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount = await USER.updatedUser(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 저장되었습니다.` });
  }
);

export const getManageWarnUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const comboPerPage = await COMBO.getComboPerPage(req);
    const user = await USER.getWarnUsers(req);
    const totalCount = await COUNT.getWarnUsers(req);
    const comboUserOption = await COMBO.getComboComCd(req, "USER_OPTION");

    res.status(200).send({
      user,
      totalCount,
      comboPerPage,
      comboUserOption,
    });
  }
);

export const getManageWarnContent = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const comboPerPage = await COMBO.getComboPerPage(req);
    const contents = await USER.getWarnContents(req);
    const totalCount = await COUNT.getWarnContents(req);

    res.status(200).send({
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
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount = await USER.createdWarnUser(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 경고처리 되었습니다.` });
  }
);

export const patchUnWarnUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount = await USER.updatedUnWarnUser(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 경고해제 되었습니다.` });
  }
);

export const getManageBanUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const comboPerPage = await COMBO.getComboPerPage(req);
    const user = await USER.getBanUsers(req);
    const totalCount = await COUNT.getBanUsers(req);
    const comboUserOption = await COMBO.getComboComCd(req, "USER_OPTION");

    res.status(200).send({
      user,
      totalCount,
      comboPerPage,
      comboUserOption,
    });
  }
);

export const getManageBanContent = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const comboPerPage = await COMBO.getComboPerPage(req);
    const contents = await USER.getBanContents(req);
    const totalCount = await COUNT.getBanContents(req);

    res.status(200).send({
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
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount = await USER.createdBanUser(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 밴 되었습니다.` });
  }
);

export const patchUnBanUser = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount = await USER.updatedUnBanUser(req);
    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 밴해제 되었습니다.` });
  }
);

import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as POST from "../../models/post";
import * as COMMNET from "../../models/commnet";
import * as MENU from "../../models/menu";
import * as COUNT from "../../models/count";
import * as COMBO from "../../models/combo";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getPostAll = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const comboPerPage = await COMBO.getComboPerPage(req);
    const post = await POST.getPostAll(req);
    const totalCount = await COUNT.getPostAll(req);
    const comboDateOption = await COMBO.getComboComCd(req, "DATE_OPTION");
    const comboPostOption = await COMBO.getComboComCd(req, "POST_OPTION");

    res.send({
      post,
      totalCount,
      comboPerPage,
      comboDateOption,
      comboPostOption,
    });
  }
);

export const getPostAllContent = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const post = await POST.getPostAllContent(req);
    const comments = await COMMNET.getComments(req);
    const commentCount = await COUNT.getComments(req);
    const comboBracket = await COMBO.getComboBracket(req);
    const comboMenu = await COMBO.getComboMenu(req);
    const comboNoticeOption = await COMBO.getComboComCd(req, "NOTICE_OPTION");

    await POST.updatePostView(req);

    res.send({
      post,
      comments,
      commentCount,
      comboBracket,
      comboMenu,
      comboNoticeOption,
      menuAuth: req.menuAuth,
    });
  }
);

export const getPost = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const comboPerPage = await COMBO.getComboPerPage(req);
    const post = await POST.getPosts(req);
    const menu = await MENU.getMenu(req, req.params.menuId);
    const totalCount = await COUNT.getPosts(req);
    const comboMenu = await COMBO.getComboMenu(req);
    const comboBracket = await COMBO.getComboBracket(req);
    const comboDateOption = await COMBO.getComboComCd(req, "DATE_OPTION");
    const comboPostOption = await COMBO.getComboComCd(req, "POST_OPTION");

    res.send({
      post,
      menuName: menu.menuName,
      totalCount,
      comboMenu,
      comboBracket,
      comboPerPage,
      comboDateOption,
      comboPostOption,
      menuAuth: req.menuAuth,
    });
  }
);

export const getPostContent = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const post = await POST.getPostContent(req);
    const comments = await COMMNET.getComments(req);
    const commentCount = await COUNT.getComments(req);
    const comboBracket = await COMBO.getComboBracket(req);
    const comboMenu = await COMBO.getComboMenu(req);
    const comboNoticeOption = await COMBO.getComboComCd(req, "NOTICE_OPTION");

    await POST.updatePostView(req);

    res.send({
      post,
      comments,
      commentCount,
      comboBracket,
      comboMenu,
      comboNoticeOption,
      menuAuth: req.menuAuth,
    });
  }
);

export const getPostEdit = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const post = await POST.getPostEdit(req);
    const comboBracket = await COMBO.getComboBracket(req);
    const comboMenu = await COMBO.getComboMenu(req);
    const comboNoticeOption = await COMBO.getComboComCd(req, "NOTICE_OPTION");

    res.send({
      post,
      comboBracket,
      comboMenu,
      comboNoticeOption,
    });
  }
);

export const postCreatePost = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    await POST.createdPost(req);

    res.status(200).send({ message: "정상적으로 저장되었습니다." });
  }
);

export const patchPost = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    const rowCount: number = await POST.deletedPost(req);

    res
      .status(200)
      .send({ message: `${rowCount}건 정상적으로 삭제되었습니다.` });
  }
);

export const patchChangeNotice = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    await POST.updateNotice(req);

    res.status(200).send({ message: "정상적으로 저장되었습니다." });
  }
);

export const patchMovePost = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    await POST.updateMenuId(req);

    res.status(200).send({ message: "정상적으로 저장되었습니다." });
  }
);

import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as POST from "../../models/post";
import * as COMMNET from "../../models/commnet";
import * as COMBO from "../../models/combo";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getPostAll = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    //const totalCount = await USER.getTotalUserCount(req, "");
    const posts = await POST.getPostAll(req);
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");

    return res.send({
      //totalCount: totalCount,
      posts,
      comboPerPage,
    });
  }
);

export const getPost = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    //const totalCount = await USER.getTotalUserCount(req, "");
    const post = await POST.getPost(req);
    const comments = await COMMNET.getComments(req);

    return res.send({
      //totalCount: totalCount,
      post,
      comments,
    });
  }
);

export const getPosts = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const menuId = req.params.menuId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    //const totalCount = await USER.getTotalUserCount(req, "");
    const posts = await POST.getPosts(req);
    const comboBracket = await COMBO.getComboBracket(req, menuId);
    const comboPerPage = await COMBO.getComboComCd(req, "PER_PAGE");

    return res.send({
      //totalCount: totalCount,
      posts,
      comboBracket,
      comboPerPage,
    });
  }
);

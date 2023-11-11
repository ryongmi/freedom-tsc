import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as POST from "../../models/post";
import * as COMMNET from "../../models/commnet";
import * as MENU from "../../models/menu";
import * as COUNT from "../../models/count";
import * as COMBO from "../../models/combo";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getComment = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const comments = await COMMNET.getComments(req);

    return res.send({
      comments,
    });
  }
);

export const postComment = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    await COMMNET.createdComment(req);

    res.status(200).send({ message: "정상적으로 저장되었습니다." });
  }
);

export const patchComment = tyrCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    await COMMNET.deletedComment(req);

    res.status(200).send({ message: "정상적으로 삭제되었습니다." });
  }
);

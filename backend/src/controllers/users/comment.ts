import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import * as COMMNET from "../../models/commnet";
import * as COUNT from "../../models/count";
import { tryCatchControllerHandler } from "../../middleware/try-catch";

export const getComment = tryCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ message: errors.array()[0].msg });
    }

    const comments = await COMMNET.getComments(req);
    const commentCount = await COUNT.getComments(req);

    return res.send({
      comments,
      commentCount,
    });
  }
);

export const postComment = tryCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    await COMMNET.createdComment(req);

    res.status(200).send({ message: "정상적으로 저장되었습니다." });
  }
);

export const patchComment = tryCatchControllerHandler(
  async (req: Request, res: Response, _: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }

    await COMMNET.deletedComment(req);

    res.status(200).send({ message: "정상적으로 삭제되었습니다." });
  }
);

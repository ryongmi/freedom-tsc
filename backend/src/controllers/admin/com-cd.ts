import { validationResult } from "express-validator";
import { RequestHandler } from "express";
import COM_CD from "../../models/combo";

export const getManageComCd: RequestHandler = async (req, res, next) => {
  try {
    const mainComCd = await COM_CD.getMainComCd(req);

    return res.send({
      mainComCd,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

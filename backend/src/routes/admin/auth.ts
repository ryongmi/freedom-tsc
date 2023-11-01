import { Router, Request } from "express";
import { ExpressValidator, Meta } from "express-validator";

import * as authController from "../../controllers/admin/auth";

import * as AUTH from "../../models/auth";
import * as COM_CD from "../../models/com-cd";

const { body, param } = new ExpressValidator({
  isAuthID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;

    const auth = await AUTH.getAuth(req, value);
    if (!auth) {
      return Promise.reject("존재하지 않는 권한입니다.");
    }
  },
  isUseFlag: async (value: string, meta: Meta) => {
    const req = meta.req as Request;
    const comcd = await COM_CD.getComCd(req, "USE_FLAG", value);
    if (!comcd) {
      return Promise.reject("존재하지 않는 코드입니다.");
    }
  },
  isType: async (value: string, meta: Meta) => {
    const req = meta.req as Request;
    const comcd = await COM_CD.getComCd(req, "LEVEL_CONDITION_TYPE", value);
    if (!comcd) {
      return Promise.reject("존재하지 않는 코드입니다.");
    }
  },
});
const router = Router();

router.get("/manageAuth", authController.getManageAuth);
router.post(
  "/manageAuth",
  [
    body("auth").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("auth.*.authId", "권한 ID가 비정상적입니다.")
      .isNumeric()
      .optional({ nullable: true })
      .isAuthID(),
    body("auth.*.authName", "등급명이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 15 })
      .trim(),
    body("auth.*.explanation", "설명이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 30 })
      .trim(),
    body("auth.*.type", "등업방식이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isType()
      .trim(),
    body("auth.*.useFlag", "사용유무가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isUseFlag()
      .trim(),
  ],
  authController.postManageAuth
);

router.patch(
  "/manageAuth",
  [
    body("auth").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("auth.*.authId", "권한 ID가 비정상적입니다.").isNumeric().isAuthID(),
  ],
  authController.patchManageAuth
);

router.get(
  "/manageAuthLevelCondition",
  authController.getManageAuthLevelCondition
);
router.post(
  "/manageAuthLevelCondition",
  [
    body("auth").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("auth.*.authId", "권한 ID가 비정상적입니다.")
      .isNumeric()
      .optional({ nullable: true })
      .isAuthID(),
    body("auth.*.post", "게시글수가 비정상적입니다.")
      .isNumeric()
      .isLength({ min: 1, max: 99999 }),
    body("auth.*.comment", "댓글수가 비정상적입니다.")
      .isNumeric()
      .isLength({ min: 1, max: 99999 }),
    body("auth.*.visit", "방문횟수가 비정상적입니다.")
      .isNumeric()
      .isLength({ min: 1, max: 99999 }),
    body("auth.*.period", "가입기간이 비정상적입니다.")
      .isNumeric()
      .isLength({ min: 1, max: 99999 }),
  ],
  authController.postManageAuthLevelCondition
);

export default router;

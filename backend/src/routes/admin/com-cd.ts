import { Router, Request } from "express";
import * as comCdController from "../../controllers/admin/com-cd";
import * as COM_CD from "../../models/com-cd";

const router = Router();

import { ExpressValidator, Meta } from "express-validator";
const { body, param } = new ExpressValidator({
  isComID: async (value: string, meta: Meta) => {
    const req = meta.req as Request;
    const comCd = await COM_CD.getComCd(req, value, 0);
    if (!comCd) {
      return Promise.reject("존재하지 않는 코드입니다.");
    }
  },
  isUseFlag: async (value: string, meta: Meta) => {
    const req = meta.req as Request;
    const comcd = await COM_CD.getComCd(req, "USE_FLAG", value);
    if (!comcd) {
      return Promise.reject("존재하지 않는 코드입니다.");
    }
  },
});

router.get("/manageComCd", comCdController.getManageComCd);
router.get(
  "/manageComCd/:comId",
  param("comId").isComID(),
  comCdController.getDetailComCd
);

router.post(
  "/manageComCd",
  [
    body("comCd").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("comCd.*.comId", "코드 ID가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 25 })
      .trim(),
    body("comCd.*.name", "이름이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 30 })
      .trim(),
  ],
  comCdController.postManageComCd
);
router.post(
  "/detailComCd",
  [
    body("comCd").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("comCd.*.value", "값이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 30 })
      .trim(),
    body("comCd.*.name", "이름이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 30 })
      .trim(),
    body("comCd.*.useFlag", "사용유무가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isUseFlag()
      .trim(),
    body("comCd.*.sort", "정렬순서가 비정상적입니다.").isNumeric().notEmpty(),
    body("comId", "코드 ID가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isComID()
      .trim(),
  ],
  comCdController.postDetailComCd
);

router.patch(
  "/manageComCd",
  [
    body("comCd").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("comCd.*.comId", "코드 ID가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 25 })
      .isComID()
      .trim(),
  ],
  comCdController.deleteManageComCd
);
router.patch(
  "/detailComCd",
  [
    body("comCd").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("comCd.*.value", "값이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 30 })
      .trim(),
    body("comId", "코드 ID가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isComID()
      .trim(),
  ],
  comCdController.deleteDetailComCd
);

export default router;

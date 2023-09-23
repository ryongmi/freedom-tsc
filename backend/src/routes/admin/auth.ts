import { Router, Request } from "express";
import * as authController from "../../controllers/admin/auth";
import * as AUTH from "../../models/auth";
import { check, body, Meta } from "express-validator";

const router = Router();

router.get("/manageAuth", authController.getManageAuth);
router.post(
  "/manageAuth",
  [
    body("auth").custom((auths: Array<{ authId: number }>, meta: Meta) => {
      if (auths.length < 1) {
        return Promise.reject("데이터가 없습니다.");
      }

      const req = meta.req as Request;
      auths.forEach(async (element) => {
        const auth = await AUTH.getAuth(req, element.authId);
        if (!auth) {
          return Promise.reject("존재하지 않는 권한입니다.");
        }
      });
    }),
  ],
  authController.postManageAuth
);

export default router;

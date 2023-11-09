import { Router, Request } from "express";
import * as commentController from "../../controllers/users/comment";
import * as MENU from "../../models/menu";

const router = Router();

import { ExpressValidator, Meta } from "express-validator";
const { body, param } = new ExpressValidator({
  isMenuID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const menu = await MENU.getMenu(req, value);
    if (!menu) {
      return Promise.reject("존재하지 않는 메뉴입니다.");
    }
  },
  isPostID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const menu = await MENU.getMenu(req, value);
    if (!menu) {
      return Promise.reject("존재하지 않는 메뉴입니다.");
    }
  },
});

router.get("/", commentController.getComment);
router.post("/createdComment", commentController.postCreatedComment);

export default router;

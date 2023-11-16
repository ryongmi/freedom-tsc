import { Router, Request } from "express";
import * as postController from "../../controllers/users/post";
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

router.get("/", postController.getPostAll);
router.get(
  "/:menuId/:postId",
  param("menuId").isMenuID(),
  postController.getPostAllContent
);

export default router;

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
router.patch("/", postController.patchPost);

router.get("/edit", postController.getPostEdit);
router.post("/edit", postController.postCreatePost);

router.get("/:menuId", param("menuId").isMenuID(), postController.getPost);

router.get(
  "/:menuId/:postId",
  param("menuId").isMenuID(),
  postController.getPostContent
);

router.patch("/changeNotice", postController.patchChangeNotice);

export default router;

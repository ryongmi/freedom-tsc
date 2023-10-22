import { Router } from "express";
import * as userStateController from "../../controllers/auth/userState";

const router = Router();

router.get("/login", userStateController.getLogin);
router.get("/userInfo", userStateController.getUserInfo);
router.delete("/logout", userStateController.deleteLogout);

export default router;

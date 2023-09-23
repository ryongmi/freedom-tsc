import { Router } from "express";
import * as authController from "../../controllers/auth/login";

const router = Router();

router.get("/login", authController.getLogin);

export default router;

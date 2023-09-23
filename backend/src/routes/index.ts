import { Router } from "express";
import adminRoutes from "./admin/index";
import postRoutes from "./post/post";
import loginRoutes from "./auth/login";
// import signupRoutes from "./auth/signup";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/post", postRoutes);
router.use("/login", loginRoutes);
// router.use("/signup", signupRoutes);

export default router;

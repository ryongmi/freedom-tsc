import { Router } from "express";
import adminRoutes from "./admin/index";
import postRoutes from "./post/post";
import userStateRoutes from "./auth/userState";
// import signupRoutes from "./auth/signup";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/post", postRoutes);
router.use("/userState", userStateRoutes);
// router.use("/signup", signupRoutes);

export default router;

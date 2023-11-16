import { Router } from "express";
import adminRoutes from "./admin/index";
import userStateRoutes from "./auth/userState";
import useInfoRoutes from "./useInfo/useInfo";
import postRoutes from "./users/post";
import postAllRoutes from "./users/postAll";
import commentRoutes from "./users/comment";
// import signupRoutes from "./auth/signup";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/userState", userStateRoutes);
router.use("/useInfo", useInfoRoutes);
router.use("/post", postRoutes);
router.use("/postAll", postAllRoutes);
router.use("/comment", commentRoutes);
// router.use("/signup", signupRoutes);

export default router;

import { Router } from "express";
import adminRoutes from "./admin/index";
import userStateRoutes from "./auth/userState";
import useInfoRoutes from "./useInfo/useInfo";
import postRoutes from "./users/post";
import postAllRoutes from "./users/postAll";
import commentRoutes from "./users/comment";
import { adminCheck } from "../middleware/is-auth";

const router = Router();

router.use("/admin", adminCheck, adminRoutes);

/**
 * @swagger
 * tags:
 *   name: 유저 상태 및 정보
 *   description: 유저 상태 및 정보 관련 API
 */
router.use("/userState", userStateRoutes);

/**
 * @swagger
 * tags:
 *   name: 각종 필수 정보
 *   description: 각종 필수 정보 관련 API
 */
router.use("/useInfo", useInfoRoutes);

/**
 * @swagger
 * tags:
 *   name: 게시글
 *   description: 게시글 관련 API
 */
router.use("/post", postRoutes);

/**
 * @swagger
 * tags:
 *   name: 전체게시글
 *   description: 전체게시글 관련 API
 */
router.use("/postAll", postAllRoutes);

/**
 * @swagger
 * tags:
 *   name: 댓글
 *   description: 댓글 관련 API
 */
router.use("/comment", commentRoutes);
// router.use("/signup", signupRoutes);

export default router;

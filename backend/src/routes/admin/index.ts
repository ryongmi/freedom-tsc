import { Router } from "express";
import comCdRoutes from "./com-cd";
import authRoutes from "./auth";
import menuRoutes from "./menu";
import userRoutes from "./user";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: 권한
 *   description: 권한 관리 페이지
 */
router.use("/auth", authRoutes);

/**
 * @swagger
 * tags:
 *   name: 메뉴
 *   description: 메뉴 관리 페이지
 */
router.use("/menu", menuRoutes);

/**
 * @swagger
 * tags:
 *   name: 유저
 *   description: 유저 관리 페이지
 */
router.use("/user", userRoutes);

/**
 * @swagger
 * tags:
 *   name: 공통코드
 *   description: 공통코드 관리 페이지
 */
router.use("/com-cd", comCdRoutes);

export default router;

import { Router } from "express";
const router = Router();

import comCdRoutes from "./com-cd";

/**
 * @swagger
 * tags:
 *   name: 공통코드
 *   description: 공통코드 관리 페이지
 */
router.use("/com-cd", comCdRoutes);

export default router;

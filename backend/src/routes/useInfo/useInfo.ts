import { Router } from "express";
import * as useInfoController from "../../controllers/useInfo/useInfo";

const router = Router();

router.get("/getMenu/:adminFlag", useInfoController.getMenus);

export default router;

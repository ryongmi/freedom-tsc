import { Router } from "express";
import * as useInfoController from "../../controllers/useInfo/useInfo";

const router = Router();

router.get("/getMenu", useInfoController.getMenus);
router.get("/getAdminMenu", useInfoController.getAdminMenus);

export default router;

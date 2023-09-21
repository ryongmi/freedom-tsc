import { Router, Request } from "express";
import * as comCdController from "../../controllers/admin/com-cd";

const router = Router();

// const COM_CD = require("../../models/com-cd");

// import { ExpressValidator } from "express-validator";
// const { body, param } = new ExpressValidator({
//   isComID: async (value, { req: Request }) => {
//     const comCd = await COM_CD.getComCd(req, value, 0);
//     if (!comCd) {
//       return Promise.reject("존재하지 않는 코드입니다.");
//     }
//   },
// });

router.get("/manageComCd", comCdController.getManageComCd);

export default router;

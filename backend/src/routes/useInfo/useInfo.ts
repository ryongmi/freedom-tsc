import { Router } from "express";
import * as useInfoController from "../../controllers/useInfo/useInfo";

const router = Router();

/**
 * @swagger
 * paths:
 *  /api/useInfo/getMenu:
 *    get:
 *      summary: "사용자 메뉴 조회"
 *      description: "사용자 페이지에서 사용할 메뉴 정보 가져오기"
 *      tags: [각종 필수 정보]
 *      responses:
 *        "200":
 *          description: 사용자 메뉴 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    menu:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "MENU_ID": 1,
 *                              "MENU_NAME": "공지사항",
 *                              "TOP_MENU_ID": null,
 *                              "POST_AUTH_ID": null,
 *                              "COMMENT_AUTH_ID": null,
 *                              "READ_AUTH_ID": null,
 *                              "TYPE": null,
 *                              "URL": null
 *                            },
 *                            {
 *                              "MENU_ID": 4,
 *                              "MENU_NAME": "카페 공지사항",
 *                              "TOP_MENU_ID": 6,
 *                              "POST_AUTH_ID": 1,
 *                              "COMMENT_AUTH_ID": 10,
 *                              "READ_AUTH_ID": null,
 *                              "TYPE": "POST",
 *                              "URL": "/post/13"
 *                             }
 *                           ]
 *        "500":
 *          description: 서버에러 발생
 */
router.get("/getMenu", useInfoController.getMenus);

/**
 * @swagger
 * paths:
 *  /api/useInfo/getAdminMenu:
 *    get:
 *      summary: "관리자 메뉴 조회"
 *      description: "관리자 페이지에서 사용할 메뉴 정보 가져오기"
 *      tags: [각종 필수 정보]
 *      responses:
 *        "200":
 *          description: 관리자 메뉴 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    menu:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "MENU_ID": 1,
 *                              "MENU_NAME": "유저",
 *                              "TOP_MENU_ID": null,
 *                              "URL": null
 *                            },
 *                            {
 *                              "MENU_ID": 5,
 *                              "MENU_NAME": "유저관리",
 *                              "TOP_MENU_ID": 1,
 *                              "URL": "/admin/manageUser"
 *                             }
 *                           ]
 *        "500":
 *          description: 서버에러 발생
 */
router.get("/getAdminMenu", useInfoController.getAdminMenus);

export default router;

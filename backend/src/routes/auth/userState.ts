import { Router } from "express";
import * as userStateController from "../../controllers/auth/userState";

const router = Router();

/**
 * @swagger
 * paths:
 *  /api/userState/login:
 *    get:
 *      summary: "유저 로그인"
 *      description: "트위치 API에서 해당 유저의 정보를 받아와 세션 저장"
 *      tags: [유저 상태 및 정보]
 *      responses:
 *        "200":
 *          description: 정상적으로 로그인되어 홈으로 이동
 *        "500":
 *          description: 벤 유저이거나 서버에러가 발생하여 로그인불가
 */
router.get("/login", userStateController.getLogin);

/**
 * @swagger
 * paths:
 *  /api/userState/userInfo:
 *    get:
 *      summary: "유저 정보 받아오기"
 *      description: "세션에 저장된 유저 ID를 가지고 DB에서 정보조회 및 전달"
 *      tags: [유저 상태 및 정보]
 *      responses:
 *        "200":
 *          description: 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                example:
 *                    {
 *                       "displayName": "유저닉네임",
 *                       "userLoginId": "test",
 *                       "profileImgUrl": "https://static-cdn.jtvnw.net/jtv_user_pictures/73dc3c51-0972-4bfc-a6f0-d040e390d1f5-profile_image-300x300.png",
 *                       "broadcasterType": "제휴",
 *                       "isLoggedIn": true,
 *                       "adminFlag": "Y",
 *                    }
 *        "500":
 *          description: 벤 유저이거나 서버에러가 발생하여 로그아웃처리 및 홈으로 이동
 */
router.get("/userInfo", userStateController.getUserInfo);

/**
 * @swagger
 * paths:
 *  /api/userState/logout:
 *    get:
 *      summary: "유저 로그아웃"
 *      description: "로그인 유저 로그아웃 처리"
 *      tags: [유저 상태 및 정보]
 *      responses:
 *        "200":
 *          description: 유저 세션 삭제 및 홈으로 이동
 *        "500":
 *          description: 벤 유저이거나 서버에러가 발생하여 로그인불가
 */
router.delete("/logout", userStateController.deleteLogout);

export default router;

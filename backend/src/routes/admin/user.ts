import { Router, Request } from "express";
import * as userController from "../../controllers/admin/user";
import * as USER from "../../models/user";
import * as AUTH from "../../models/auth";

const router = Router();

import { ExpressValidator, Meta } from "express-validator";
const { body, param } = new ExpressValidator({
  isUserID: async (value: string, meta: Meta) => {
    const req = meta.req as Request;
    const user = await USER.getUser(req, value);
    if (!user) {
      return Promise.reject("존재하지 않는 유저입니다.");
    }
  },
  isWarnID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const count = await USER.getWarn(req, value);
    if (count < 1) {
      return Promise.reject("존재하지 않는 경고입니다.");
    }
  },
  isBanID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const count = await USER.getBan(req, value);
    if (count < 1) {
      return Promise.reject("존재하지 않는 벤입니다.");
    }
  },
  isAuthID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const auth = await AUTH.getAuth(req, value);
    if (!auth) {
      return Promise.reject("존재하지 않는 권한입니다.");
    }
  },
});

/**
 * @swagger
 * paths:
 *  /api/admin/user/manageUser:
 *    get:
 *      summary: "전체 유저 관리"
 *      description: "요청 경로에 값을 담아 서버에 보낸다."
 *      tags: [유저]
 *      parameters:
 *        - in: query
 *          name: page
 *          required: false
 *          description: 현재 페이지
 *          schema:
 *            type: string
 *        - in: query
 *          name: perPage
 *          required: false
 *          description: 페이지 로우 수
 *          schema:
 *            type: string
 *        - in: query
 *          name: userAuthId
 *          required: false
 *          description: 특정 유저 권한 조회
 *          schema:
 *            type: int
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "USER_ID": "test3",
 *                              "USER_LOGIN_ID": "test",
 *                              "USER_NAME": "테스트(test)",
 *                              "AUTH_ID": 9,
 *                              "TWITCH_TYPE": "일반 사용자",
 *                              "BROADCASTER_TYPE": "시청자",
 *                              "CREATED_AT": "2023년07월14일 04시36분50초",
 *                              "LAST_LOGIN_AT": "2023년08월12일 13시08분33초",
 *                              "VISIT": 1285,
 *                              "POST": 150,
 *                              "COMMENT": 15,
 *                              "UPDATED_AT": "2023년08월12일 13시08분33초",
 *                              "UPDATED_USER": "테스트",
 *                              "USER_STATUS": "벤"
 *                            },
 *                            {
 *                              "USER_ID": "test4",
 *                              "USER_LOGIN_ID": "test2",
 *                              "USER_NAME": "테스트2(test2)",
 *                              "AUTH_ID": 5,
 *                              "TWITCH_TYPE": "CEO",
 *                              "BROADCASTER_TYPE": "제휴스트리머",
 *                              "CREATED_AT": "2023년07월14일 04시36분50초",
 *                              "LAST_LOGIN_AT": "2023년08월12일 13시08분33초",
 *                              "VISIT": 185,
 *                              "POST": 50,
 *                              "COMMENT": 0,
 *                              "UPDATED_AT": null,
 *                              "UPDATED_USER": null,
 *                              "USER_STATUS": "정상"
 *                             },
 *                             {
 *                               "USER_ID": "test5",
 *                               "USER_LOGIN_ID": "test3",
 *                               "USER_NAME": "테스트3(test3)",
 *                               "AUTH_ID": 5,
 *                               "TWITCH_TYPE": "CEO",
 *                               "BROADCASTER_TYPE": "파트너스트리머",
 *                               "CREATED_AT": "2023년07월14일 04시36분50초",
 *                               "LAST_LOGIN_AT": "2023년08월12일 13시08분33초",
 *                               "VISIT": 0,
 *                               "POST": 0,
 *                               "COMMENT": 0,
 *                               "UPDATED_AT": null,
 *                               "UPDATED_USER": null,
 *                               "USER_STATUS": "경고"
 *                              }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 5
 *                    comboAuth:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": 1, "label": "운영자" },
 *                            { "value": 2, "label": "??" }
 *                          ]
 *                    comboAuthAll:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": null, "label": "전체멤버" },
 *                            { "value": 1,    "label": "운영자" },
 *                            { "value": 2,    "label": "??" }
 *                          ]
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "10", "label": "10" },
 *                            { "value": "15", "label": "15" }
 *                          ]
 */
router.get("/manageUser", userController.getManageUser);

/**
 * @swagger
 * /api/admin/user/manageUser:
 *   patch:
 *    summary: "유저 수정"
 *    description: "유저 권한 수정"
 *    tags: [유저]
 *    requestBody:
 *      description: 유저 권한 수정
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: object
 *                description: "변경할 유저 ID, 권한 ID"
 *                example:
 *                    [
 *                       {
 *                          "userId": "test3",
 *                          "authId": 9
 *                       },
 *                       {
 *                          "userId": "test4",
 *                          "authId": 3
 *                       }
 *                    ]
 *    responses:
 *      "200":
 *        description: 정상 수행 - 수정한 유저수만큼 메시지 보냄
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "3건 정상적으로 저장되었습니다."
 *      "400":
 *        description: 유효성 검사 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "데이터가 없습니다."
 *      "500":
 *        description: 서버 에러
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "서버에서 에러가 발생하였습니다. ( 추후 수정 가능성 있음 )"
 */
router.patch(
  "/manageUser",
  [
    body("user").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("user.*.userId", "유저 ID가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 15 })
      .trim()
      .isUserID(),
    body("user.*.authId", "유저 권한이 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .trim()
      .isAuthID(),
  ],
  userController.patchManageUser
);

/**
 * @swagger
 * paths:
 *  /api/admin/user/manageWarnUser:
 *    get:
 *      summary: "경고 유저 관리"
 *      description: "요청 경로에 값을 담아 서버에 보낸다."
 *      tags: [유저]
 *      parameters:
 *        - in: query
 *          name: page
 *          required: false
 *          description: 현재 페이지
 *          schema:
 *            type: string
 *        - in: query
 *          name: perPage
 *          required: false
 *          description: 페이지 로우 수
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: 전체 경고 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "USER_ID": "test3",
 *                              "USER_NAME": "테스트(test)",
 *                              "AUTH_NAME": "일반 멤버",
 *                              "TWITCH_TYPE": "일반 사용자",
 *                              "BROADCASTER_TYPE": "시청자",
 *                              "WARN_COUNT": "1(3)번",
 *                              "CREATED_AT": "2023년08월12일 13시08분33초",
 *                              "CREATED_USER": "테스트"
 *                            },
 *                            {
 *                              "USER_ID": "test4",
 *                              "USER_NAME": "테스트2(test2)",
 *                              "AUTH_NAME": "일반 멤버",
 *                              "TWITCH_TYPE": "CEO",
 *                              "BROADCASTER_TYPE": "제휴스트리머",
 *                              "WARN_COUNT": "1(1)번",
 *                              "CREATED_AT": "2023년08월12일 13시08분33초",
 *                              "CREATED_USER": "테스트"
 *                             }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 5
 *                    comboAuth:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": 1, "label": "운영자" },
 *                            { "value": 2, "label": "??" }
 *                          ]
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "10", "label": "10" },
 *                            { "value": "15", "label": "15" }
 *                          ]
 */
router.get("/manageWarnUser", userController.getManageWarnUser);

/**
 * @swagger
 * paths:
 *  /api/admin/user/manageWarnUser/{user_id}:
 *    get:
 *      summary: "경고 유저 사유 조회"
 *      description: "요청 경로에 값을 담아 서버에 보낸다."
 *      tags: [유저]
 *      parameters:
 *        - in: path
 *          name: user_id
 *          required: true
 *          description: 유저 아이디
 *          schema:
 *            type: string
 *        - in: query
 *          name: page
 *          required: false
 *          description: 현재 페이지
 *          schema:
 *            type: string
 *        - in: query
 *          name: perPage
 *          required: false
 *          description: 페이지 로우 수
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: 특정 유저 경고 사유 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    contents:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "WARN_ID": 2,
 *                              "USER_ID": "test333",
 *                              "USER_NAME": "테스트(test)",
 *                              "POST_URL": "-",
 *                              "WARN_REASON": "그냥",
 *                              "CREATED_AT": "2023년07월14일 04시36분50초",
 *                              "CREATED_USER": "테스트2",
 *                              "UN_WARN_AT": null,
 *                              "UN_WARN_USER": null
 *                            },
 *                            {
 *                              "WARN_ID": 5,
 *                              "USER_ID": "test333",
 *                              "USER_NAME": "테스트(test)",
 *                              "POST_URL": "-",
 *                              "WARN_REASON": "그냥",
 *                              "CREATED_AT": "2023년07월14일 04시36분50초",
 *                              "CREATED_USER": "테스트2",
 *                              "UN_WARN_AT": "2023년08월14일 09시55분40초",
 *                              "UN_WARN_USER": "테스트3"
 *                             }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "10", "label": "10" },
 *                            { "value": "15", "label": "15" }
 *                          ]
 */
router.get(
  "/manageWarnUser/:userId",
  param("userId").isUserID(),
  userController.getManageWarnContent
);

/**
 * @swagger
 * /api/admin/user/warnUser:
 *   post:
 *    summary: "유저 경고"
 *    description: "유저 경고주기"
 *    tags: [유저]
 *    requestBody:
 *      description: 유저 경고주기
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: object
 *                description: "유저 경고 관련 데이터"
 *                example:
 *                    [
 *                       {
 *                          "userId": "test3",
 *                          "postUrl": "http://~~",
 *                          "warnReason": "test3"
 *                       },
 *                       {
 *                          "userId": "test4",
 *                          "postUrl": null,
 *                          "warnReason": "사유 테스트"
 *                       }
 *                    ]
 *    responses:
 *      "200":
 *        description: 정상 수행 - 경고한 유저수만큼 메시지 보냄
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "3건 정상적으로 저장되었습니다."
 *      "400":
 *        description: 유효성 검사 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "데이터가 없습니다."
 *      "500":
 *        description: 서버 에러
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "서버에서 에러가 발생하였습니다. ( 추후 수정 가능성 있음 )"
 */
router.post(
  "/warnUser",
  [
    body("user").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("user.*.userId", "유저 ID가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 15 })
      .trim()
      .isUserID(),
    body("user.*.postUrl", "Url이 비정상적입니다.")
      .isString()
      .notEmpty()
      .trim(),
    body("user.*.warnReason", "사유가 비정상적입니다.")
      .isString()
      .notEmpty()
      .trim(),
  ],
  userController.postWarnUser
);

/**
 * @swagger
 * /api/admin/user/unWarnUser:
 *   patch:
 *    summary: "유저 경고해제"
 *    description: "유저 기존 경고해제"
 *    tags: [유저]
 *    requestBody:
 *      description: 유저 기존 경고해제
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: object
 *                description: "경고 ID"
 *                example:
 *                    [
 *                       {
 *                          "warnId": 2
 *                       },
 *                       {
 *                          "warnId": 5
 *                       }
 *                    ]
 *    responses:
 *      "200":
 *        description: 정상 수행 - 경고해제한 유저수만큼 메시지 보냄
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "3건 정상적으로 저장되었습니다."
 *      "400":
 *        description: 유효성 검사 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "데이터가 없습니다."
 *      "500":
 *        description: 서버 에러
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "서버에서 에러가 발생하였습니다. ( 추후 수정 가능성 있음 )"
 */
router.patch(
  "/unWarnUser",
  [
    body("warn").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("warn.*.warnId", "경고 ID가 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .trim()
      .isWarnID(),
  ],
  userController.patchUnWarnUser
);

/**
 * @swagger
 * paths:
 *  /api/admin/user/manageBanUser:
 *    get:
 *      summary: "벤 유저 관리"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [유저]
 *      parameters:
 *        - in: query
 *          name: page
 *          required: false
 *          description: 현재 페이지
 *          schema:
 *            type: string
 *        - in: query
 *          name: perPage
 *          required: false
 *          description: 페이지 로우 수
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: 전체 벤 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "USER_ID": "test3",
 *                              "USER_NAME": "테스트(test)",
 *                              "AUTH_NAME": "일반 멤버",
 *                              "TWITCH_TYPE": "일반 사용자",
 *                              "BROADCASTER_TYPE": "시청자",
 *                              "BAN_COUNT": "1(3)번",
 *                              "CREATED_AT": "2023년08월12일 13시08분33초",
 *                              "CREATED_USER": "테스트"
 *                            },
 *                            {
 *                              "USER_ID": "test4",
 *                              "USER_NAME": "테스트2(test2)",
 *                              "AUTH_NAME": "일반 멤버",
 *                              "TWITCH_TYPE": "CEO",
 *                              "BROADCASTER_TYPE": "제휴스트리머",
 *                              "BAN_COUNT": "1(1)번",
 *                              "CREATED_AT": "2023년08월12일 13시08분33초",
 *                              "CREATED_USER": "테스트"
 *                             }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 5
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "10", "label": "10" },
 *                            { "value": "15", "label": "15" }
 *                          ]
 */
router.get("/manageBanUser", userController.getManageBanUser);

/**
 * @swagger
 * paths:
 *  /api/admin/user/manageBanUser/{user_id}:
 *    get:
 *      summary: "벤 유저 사유 조회"
 *      description: "요청 경로에 값을 담아 서버에 보낸다."
 *      tags: [유저]
 *      parameters:
 *        - in: path
 *          name: user_id
 *          required: true
 *          description: 유저 아이디
 *          schema:
 *            type: string
 *        - in: query
 *          name: page
 *          required: false
 *          description: 현재 페이지
 *          schema:
 *            type: string
 *        - in: query
 *          name: perPage
 *          required: false
 *          description: 페이지 로우 수
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: 특정 유저 벤 사유 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    contents:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "BAN_ID": 2,
 *                              "USER_ID": "test333",
 *                              "USER_NAME": "테스트(test)",
 *                              "POST_URL": "-",
 *                              "BAN_REASON": "그냥",
 *                              "CREATED_AT": "2023년07월14일 04시36분50초",
 *                              "CREATED_USER": "테스트2",
 *                              "UN_BAN_AT": null,
 *                              "UN_BAN_USER": null
 *                            },
 *                            {
 *                              "BAN_ID": 5,
 *                              "USER_ID": "test333",
 *                              "USER_NAME": "테스트(test)",
 *                              "POST_URL": "-",
 *                              "BAN_REASON": "그냥",
 *                              "CREATED_AT": "2023년07월14일 04시36분50초",
 *                              "CREATED_USER": "테스트2",
 *                              "UN_BAN_AT": "2023년08월14일 09시55분40초",
 *                              "UN_BAN_USER": "테스트3"
 *                             }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "10", "label": "10" },
 *                            { "value": "15", "label": "15" }
 *                          ]
 */
router.get(
  "/manageBanUser/:userId",
  param("userId").isUserID(),
  userController.getManageBanContent
);

/**
 * @swagger
 * /api/admin/user/banUser:
 *   patch:
 *    summary: "유저 벤"
 *    description: "유저 벤하기"
 *    tags: [유저]
 *    requestBody:
 *      description: 유저 벤하기
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: object
 *                description: "경고 ID"
 *                example:
 *                    [
 *                       {
 *                          "userId": "test333",
 *                          "postUrl": "http://~~",
 *                          "banReason": null,
 *                       },
 *                       {
 *                          "userId": "test444",
 *                          "postUrl": null,
 *                          "banReason": "벤 사유",
 *                       }
 *                    ]
 *    responses:
 *      "200":
 *        description: 정상 수행 - 벤한 유저수만큼 메시지 보냄
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "3건 정상적으로 저장되었습니다."
 *      "400":
 *        description: 유효성 검사 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "데이터가 없습니다."
 *      "500":
 *        description: 서버 에러
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "서버에서 에러가 발생하였습니다. ( 추후 수정 가능성 있음 )"
 */
router.post(
  "/banUser",
  [
    body("user").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("user.*.userId", "유저 ID가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 15 })
      .trim()
      .isUserID(),
    body("user.*.postUrl", "Url이 비정상적입니다.")
      .isString()
      .notEmpty()
      .trim(),
    body("user.*.banReason", "사유가 비정상적입니다.")
      .isString()
      .notEmpty()
      .trim(),
  ],
  userController.postBanUser
);

/**
 * @swagger
 * /api/admin/user/unBanUser:
 *   patch:
 *    summary: "유저 벤해제"
 *    description: "유저 기존 벤해제"
 *    tags: [유저]
 *    requestBody:
 *      description: 유저 기존 벤해제
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: object
 *                description: "벤 ID"
 *                example:
 *                    [
 *                       {
 *                          "banId": 2
 *                       },
 *                       {
 *                          "banId": 5
 *                       }
 *                    ]
 *    responses:
 *      "200":
 *        description: 정상 수행 - 벤해제한 건수만큼 메시지 보냄
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "1건 정상적으로 저장되었습니다."
 *      "400":
 *        description: 유효성 검사 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "데이터가 없습니다."
 *      "500":
 *        description: 서버 에러
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "서버에서 에러가 발생하였습니다. ( 추후 수정 가능성 있음 )"
 */
router.patch(
  "/unBanUser",
  [
    body("ban").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("ban.*.banId", "벤 ID가 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .trim()
      .isBanID(),
  ],
  userController.patchUnBanUser
);

export default router;

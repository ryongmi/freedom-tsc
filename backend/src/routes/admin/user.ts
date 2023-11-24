import { Router, Request } from "express";
import * as userController from "../../controllers/admin/user";
import * as USER from "../../models/user";
import * as AUTH from "../../models/auth";

const router = Router();

import { ExpressValidator, Meta } from "express-validator";
const { body, param } = new ExpressValidator({
  isUserID: async (value: number, meta: Meta) => {
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
 *          required: true
 *          description: 현재 페이지
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: 1
 *              summary: 기본값
 *        - in: query
 *          name: perPage
 *          required: false
 *          description: 페이지 로우 수
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "null"
 *              summary: 기본값
 *        - in: query
 *          name: userOption
 *          required: false
 *          description: 아이디, 별명 옵션 값
 *          schema:
 *            type: string
 *        - in: query
 *          name: userOptionValue
 *          required: false
 *          description: 아이디, 별명 검색 값
 *          schema:
 *            type: string
 *        - in: query
 *          name: userAuthId
 *          required: true
 *          description: 권한
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "ALL"
 *              summary: 기본값
 *        - in: query
 *          name: userStatus
 *          required: true
 *          description: 상태
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "ALL"
 *              summary: 기본값
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
 *                              "key": 143095116,
 *                              "userId": 143095116,
 *                              "userName": "테스트(test)",
 *                              "authId": 1,
 *                              "twitchType": "일반 사용자",
 *                              "broadcasterType": "시청자",
 *                              "createdAt": "2023.10.22 01.31.23",
 *                              "lastLoginAt": "2023.11.22 01.31.23",
 *                              "visit": 1285,
 *                              "post": 150,
 *                              "comment": 15,
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "userStatus": "정상",
 *                              "status": "S"
 *                            },
 *                            {
 *                              "key": 13213,
 *                              "userId": 13213,
 *                              "userName": "테스트2(test2)",
 *                              "authId": 1,
 *                              "twitchType": "일반 사용자",
 *                              "broadcasterType": "제휴",
 *                              "createdAt": "2023.10.22 01.31.23",
 *                              "lastLoginAt": "2023.11.22 01.31.23",
 *                              "visit": 1285,
 *                              "post": 150,
 *                              "comment": 15,
 *                              "updatedAt": "2023.10.31 07.02.01",
 *                              "updatedUser": "테스트",
 *                              "userStatus": "경고",
 *                              "status": "S"
 *                            }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboAuth:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": 1, "label": "운영자" },
 *                            { "value": 2, "label": "??" }
 *                          ]
 *                    comboUserStatus:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "S", "label": "정상" },
 *                            { "value": "W", "label": "경고" },
 *                            { "value": "B", "label": "밴" }
 *                          ]
 *                    comboUserOption:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "ID",   "label": "아이디" },
 *                            { "value": "NAME", "label": "별명" }
 *                          ]
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [ "10", "15", "30", "50", "100" ]
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
 *      description: 선택한 유저 권한 수정
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
    body("user.*.userId", "유저 ID가 비정상적입니다.").isNumeric().isUserID(),
    body("user.*.authId", "유저 권한이 비정상적입니다.").isNumeric().isAuthID(),
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
 *          required: true
 *          description: 현재 페이지
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: 1
 *              summary: 기본값
 *        - in: query
 *          name: perPage
 *          required: false
 *          description: 페이지 로우 수
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "null"
 *              summary: 기본값
 *        - in: query
 *          name: userOption
 *          required: false
 *          description: 아이디, 별명 옵션 값
 *          schema:
 *            type: string
 *        - in: query
 *          name: userOptionValue
 *          required: false
 *          description: 아이디, 별명 검색 값
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
 *                              "key": 13213,
 *                              "userId": 13213,
 *                              "userName": "테스트(test)",
 *                              "authName": "일반 멤버",
 *                              "twitchType": "일반 사용자",
 *                              "broadcasterType": "시청자",
 *                              "warnCount": "1(1)번",
 *                              "createdAt": "2023.10.31 07.02.01",
 *                              "createdUser": "운영자"
 *                            },
 *                            {
 *                              "key": 13313,
 *                              "userId": 13313,
 *                              "userName": "테스트2(test2)",
 *                              "authName": "일반 멤버",
 *                              "twitchType": "일반 사용자",
 *                              "broadcasterType": "시청자",
 *                              "warnCount": "1(3)번",
 *                              "createdAt": "2023.11.31 07.02.01",
 *                              "createdUser": "운영자"
 *                            }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboUserOption:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "ID",   "label": "아이디" },
 *                            { "value": "NAME", "label": "별명" }
 *                          ]
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [ "10", "15", "30", "50", "100" ]
 */
router.get("/manageWarnUser", userController.getManageWarnUser);

/**
 * @swagger
 * paths:
 *  /api/admin/user/manageWarnUser/{userid}:
 *    get:
 *      summary: "경고 유저 사유 조회"
 *      description: "요청 경로에 값을 담아 서버에 보낸다."
 *      tags: [유저]
 *      parameters:
 *        - in: path
 *          name: userid
 *          required: true
 *          description: 유저 아이디
 *          schema:
 *            type: string
 *        - in: query
 *          name: page
 *          required: true
 *          description: 현재 페이지
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: 1
 *              summary: 기본값
 *        - in: query
 *          name: perPage
 *          required: false
 *          description: 페이지 로우 수
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "null"
 *              summary: 기본값
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
 *                              "key": 2,
 *                              "warnId": 2,
 *                              "userId": "test333",
 *                              "userName": "테스트(test)",
 *                              "postUrl": "",
 *                              "warnReason": "경고사유",
 *                              "createdAt": "2023.10.31 07.02.01",
 *                              "createdUser": "운영자",
 *                              "unWarnAt": null,
 *                              "unWarnUser": null
 *                            },
 *                            {
 *                              "key": 4,
 *                              "warnId": 4,
 *                              "userId": "test444",
 *                              "userName": "테스트4(test4)",
 *                              "postUrl": "",
 *                              "warnReason": "경고사유",
 *                              "createdAt": "2023.11.31 07.02.01",
 *                              "createdUser": "운영자",
 *                              "unWarnAt": "2023.12.31 07.02.01",
 *                              "unWarnUser": "운영자"
 *                            }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [ "10", "15", "30", "50", "100" ]
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
 *    description: "선택한 유저 경고주기"
 *    tags: [유저]
 *    requestBody:
 *      description: 선택한 유저 경고주기
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: object
 *                description: "경고할 유저 ID"
 *                example:
 *                    [
 *                       {
 *                          "userId": 1231232
 *                       },
 *                       {
 *                          "userId": 413412321
 *                       }
 *                    ]
 *              postUrl:
 *                type: string
 *                description: "경고 원인 게시글 URL"
 *                example: "http://~~"
 *              warnReason:
 *                type: object
 *                description: "경고 사유"
 *                example: "사유 테스트"
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
 *                    "2건 정상적으로 경고처리 되었습니다."
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
    body("user.*.userId", "유저 ID가 비정상적입니다.").isNumeric().isUserID(),
    body("postUrl", "Url이 비정상적입니다.")
      .isURL()
      .optional({ nullable: true, checkFalsy: true })
      .trim(),
    body("warnReason", "사유가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 100 })
      .trim(),
  ],
  userController.postWarnUser
);

/**
 * @swagger
 * /api/admin/user/unWarnUser:
 *   patch:
 *    summary: "유저 경고해제"
 *    description: "선택한 유저 기존 경고해제"
 *    tags: [유저]
 *    requestBody:
 *      description: 선택한 유저 기존 경고해제
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              warn:
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
 *              userId:
 *                type: int
 *                description: "경고해제할 유저 ID"
 *                example: 1231412
 *    responses:
 *      "200":
 *        description: 정상 수행 - 경고해제한 건수만큼 메시지 보냄
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "3건 정상적으로 경고해제 되었습니다."
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
    body("warn.*.warnId", "경고 ID가 비정상적입니다.").isNumeric().isWarnID(),
    body("userId", "유저 ID가 비정상적입니다.").isNumeric().isUserID(),
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
 *          required: true
 *          description: 현재 페이지
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: 1
 *              summary: 기본값
 *        - in: query
 *          name: perPage
 *          required: false
 *          description: 페이지 로우 수
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "null"
 *              summary: 기본값
 *        - in: query
 *          name: userOption
 *          required: false
 *          description: 아이디, 별명 옵션 값
 *          schema:
 *            type: string
 *        - in: query
 *          name: userOptionValue
 *          required: false
 *          description: 아이디, 별명 검색 값
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
 *                              "key": 123452,
 *                              "userId": 123452,
 *                              "userName": "테스트(test)",
 *                              "authName": "일반 멤버",
 *                              "twitchType": "일반 사용자",
 *                              "broadcasterType": "시청자",
 *                              "banCount": "1(3)번",
 *                              "createdAt": "2023.10.31 07.02.01",
 *                              "createdUser": "운영자"
 *                            },
 *                            {
 *                              "key": 312321,
 *                              "userId": 312321,
 *                              "userName": "테스트4(test4)",
 *                              "authName": "일반 멤버",
 *                              "twitchType": "일반 사용자",
 *                              "broadcasterType": "시청자",
 *                              "banCount": "4(3)번",
 *                              "createdAt": "2023.11.31 07.02.01",
 *                              "createdUser": "운영자"
 *                            }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [ "10", "15", "30", "50", "100" ]
 *                    comboUserOption:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "ID",   "label": "아이디" },
 *                            { "value": "NAME", "label": "별명" }
 *                          ]
 */
router.get("/manageBanUser", userController.getManageBanUser);

/**
 * @swagger
 * paths:
 *  /api/admin/user/manageBanUser/{userid}:
 *    get:
 *      summary: "벤 유저 사유 조회"
 *      description: "요청 경로에 값을 담아 서버에 보낸다."
 *      tags: [유저]
 *      parameters:
 *        - in: path
 *          name: userid
 *          required: true
 *          description: 유저 아이디
 *          schema:
 *            type: string
 *        - in: query
 *          name: page
 *          required: true
 *          description: 현재 페이지
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: 1
 *              summary: 기본값
 *        - in: query
 *          name: perPage
 *          required: false
 *          description: 페이지 로우 수
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "null"
 *              summary: 기본값
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
 *                              "key": 2,
 *                              "banId": 2,
 *                              "userId": "test333",
 *                              "userName": "테스트(test)",
 *                              "postUrl": "",
 *                              "banReason": "벤사유",
 *                              "createdAt": "2023.10.22 01.31.23",
 *                              "createdUser": "운영자",
 *                              "unBanAt": null,
 *                              "unBanUser": null
 *                            },
 *                            {
 *                              "key": 4,
 *                              "banId": 4,
 *                              "userId": "test444",
 *                              "userName": "테스트4(test4)",
 *                              "postUrl": "",
 *                              "banReason": "벤사유",
 *                              "createdAt": "2023.11.23 01.31.23",
 *                              "createdUser": "운영자",
 *                              "unBanAt": "2023.12.22 01.31.23",
 *                              "unBanUser": "운영자"
 *                            },
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [ "10", "15", "30", "50", "100" ]
 */
router.get(
  "/manageBanUser/:userId",
  param("userId").isNumeric().isUserID(),
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
 *                description: "밴할 유저 ID"
 *                example:
 *                    [
 *                       {
 *                          "userId": 12312443
 *                       },
 *                       {
 *                          "userId": 12312312
 *                       }
 *                    ]
 *              postUrl:
 *                type: string
 *                description: "밴 원인 게시글 URL"
 *                example: "http://~~"
 *              banReason:
 *                type: object
 *                description: "벤 사유"
 *                example: "사유 테스트"
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
 *                    "2건 정상적으로 밴 되었습니다."
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
    body("user.*.userId", "유저 ID가 비정상적입니다.").isNumeric().isUserID(),
    body("postUrl", "Url이 비정상적입니다.")
      .isURL()
      .optional({ nullable: true, checkFalsy: true })
      .trim(),
    body("banReason", "사유가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 100 })
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
 *              ban:
 *                type: object
 *                description: "밴 ID"
 *                example:
 *                    [
 *                       {
 *                          "banId": 2
 *                       },
 *                       {
 *                          "banId": 5
 *                       }
 *                    ]
 *              userId:
 *                type: int
 *                description: "밴해제할 유저 ID"
 *                example: 123123
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
 *                    "2건 정상적으로 밴해제 되었습니다."
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
    body("ban.*.banId", "벤 ID가 비정상적입니다.").isNumeric().isBanID(),
  ],
  userController.patchUnBanUser
);

export default router;

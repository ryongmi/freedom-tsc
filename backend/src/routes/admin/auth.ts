import { Router, Request } from "express";
import { ExpressValidator, Meta } from "express-validator";

import * as authController from "../../controllers/admin/auth";

import * as AUTH from "../../models/auth";
import * as COM_CD from "../../models/com-cd";

const { body, param } = new ExpressValidator({
  isAuthID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;

    const auth = await AUTH.getAuth(req, value);
    if (!auth) {
      return Promise.reject("존재하지 않는 권한입니다.");
    }
  },
  isUseFlag: async (value: string, meta: Meta) => {
    const req = meta.req as Request;
    const comcd = await COM_CD.getComCd(req, "USE_FLAG", value);
    if (!comcd) {
      return Promise.reject("존재하지 않는 코드입니다.");
    }
  },
  isType: async (value: string, meta: Meta) => {
    const req = meta.req as Request;
    const comcd = await COM_CD.getComCd(req, "LEVEL_CONDITION_TYPE", value);
    if (!comcd) {
      return Promise.reject("존재하지 않는 코드입니다.");
    }
  },
});
const router = Router();

/**
 * @swagger
 * paths:
 *  /api/admin/auth/manageAuth:
 *    get:
 *      summary: "권한 조회"
 *      description: "모든 권한 조회"
 *      tags: [권한]
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
 *          name: authName
 *          required: false
 *          description: 등급명
 *          schema:
 *            type: string
 *        - in: query
 *          name: useFlag
 *          required: false
 *          description: 사용유무
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "ALL"
 *              summary: 기본값
 *      responses:
 *        "200":
 *          description: 모든 권한 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    auth:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "key": 5,
 *                              "authId": 5,
 *                              "authName": "일반 멤버",
 *                              "explanation": "-",
 *                              "type": "NONE",
 *                              "useFlag": "Y",
 *                              "createdAt": "2023.11.01 10.17.03",
 *                              "createdUser": "관리자",
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "status": "S"
 *                            },
 *                            {
 *                              "key": 6,
 *                              "authId": 6,
 *                              "authName": "중급 멤버",
 *                              "explanation": "-",
 *                              "type": "NONE",
 *                              "useFlag": "N",
 *                              "createdAt": "2023.11.01 10.17.03",
 *                              "createdUser": "관리자",
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "status": "S"
 *                            },
 *                            {
 *                              "key": 7,
 *                              "authId": 7,
 *                              "authName": "상급 멤버",
 *                              "explanation": "-",
 *                              "type": "NONE",
 *                              "useFlag": "Y",
 *                              "createdAt": "2023.11.01 10.17.03",
 *                              "createdUser": "관리자",
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "status": "S"
 *                            }
 *                          ]
 *                    totalCount:
 *                      type: int
 *                      example: 3
 *                    comboType:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "NONE", "label": "설정 안함" },
 *                            { "value": "AUTO", "label": "자동 등업" },
 *                            { "value": "APPLY", "label": "등업 게시판" }
 *                          ]
 *                    comboUseFlag:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "Y", "label": "사용" },
 *                            { "value": "N", "label": "미사용" }
 *                          ]
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [ "10", "15", "30", "50", "100"]
 */
router.get("/manageAuth", authController.getManageAuth);

/**
 * @swagger
 * /api/admin/auth/manageAuth:
 *   post:
 *    summary: "권한 저장"
 *    description: "선택한 권한 저장 및 수정"
 *    tags: [권한]
 *    requestBody:
 *      description: 선택한 권한 저장 및 수정
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              auth:
 *                type: object
 *                description: "권한 관련 데이터"
 *                example:
 *                     [
 *                       {
 *                          "authId": null,
 *                          "authName": "일반멤버",
 *                          "explanation": "멤버 설명",
 *                          "type": "NONE",
 *                          "useFlag": "Y"
 *                       },
 *                       {
 *                          "authId": 15,
 *                          "authName": "중급멤버",
 *                          "explanation": "멤버 설명",
 *                          "type": "AUTO",
 *                          "useFlag": "N"
 *                       }
 *                     ]
 *    responses:
 *      "200":
 *        description: 정상 수행
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "2건 정상적으로 저장되었습니다."
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
  "/manageAuth",
  [
    body("auth").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("auth.*.authId", "권한 ID가 비정상적입니다.")
      .isNumeric()
      .optional({ nullable: true })
      .isAuthID(),
    body("auth.*.authName", "등급명이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 15 })
      .trim(),
    body("auth.*.explanation", "설명이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 30 })
      .trim(),
    body("auth.*.type", "등업방식이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isType()
      .trim(),
    body("auth.*.useFlag", "사용유무가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isUseFlag()
      .trim(),
  ],
  authController.postManageAuth
);

/**
 * @swagger
 * /api/admin/auth/manageAuth:
 *   patch:
 *    summary: "권한 삭제"
 *    description: 선택한 권한 삭제
 *    tags: [권한]
 *    requestBody:
 *      description: 선택한 권한 삭제
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              auth:
 *                type: object
 *                description: "삭제할 권한 ID"
 *                example:
 *                    [
 *                       {
 *                          "authId": 3
 *                       },
 *                       {
 *                          "authId": 5
 *                       }
 *                    ]
 *    responses:
 *      "200":
 *        description: 정상 수행
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "2건 정상적으로 삭제되었습니다."
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
  "/manageAuth",
  [
    body("auth").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("auth.*.authId", "권한 ID가 비정상적입니다.").isNumeric().isAuthID(),
  ],
  authController.patchManageAuth
);

/**
 * @swagger
 * paths:
 *  /api/admin/auth/manageAuthLevelCondition:
 *    get:
 *      summary: "권한 등급 조건"
 *      description: "등업방식을 설정한 권한들의 조건 조회"
 *      tags: [권한]
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
 *          name: authName
 *          required: false
 *          description: 등급명
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: 등업방식을 설정한 권한들의 조건 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    auth:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "key": 5,
 *                              "authId": 5,
 *                              "authName": "일반 멤버",
 *                              "post": 0,
 *                              "comment": 0,
 *                              "visit": 0,
 *                              "period": 0,
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "status": "S"
 *                            },
 *                            {
 *                              "key": 8,
 *                              "authId": 8,
 *                              "authName": "중급 멤버",
 *                              "post": 5,
 *                              "comment": 340,
 *                              "visit": 120,
 *                              "period": 50,
 *                              "updatedAt": "2023.11.01 15.10.37",
 *                              "updatedUser": "관리자",
 *                              "status": "S"
 *                            }
 *                          ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [ "10", "15", "30", "50", "100"]
 */
router.get(
  "/manageAuthLevelCondition",
  authController.getManageAuthLevelCondition
);

/**
 * @swagger
 * /api/admin/auth/manageAuthLevelCondition:
 *   post:
 *    summary: "권한 등급 조건 저장"
 *    description: "선택한 권한 등급 조건 저장 및 수정"
 *    tags: [권한]
 *    requestBody:
 *      description: 선택한 권한 등급 조건 저장 및 수정
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              auth:
 *                type: object
 *                description: "권한 등급 조건 관련 데이터"
 *                example:
 *                     [
 *                       {
 *                          "authId": 2,
 *                          "post": 5423,
 *                          "comment": 4321,
 *                          "visit": 4321,
 *                          "period": 122
 *                       },
 *                       {
 *                          "authId": 5,
 *                          "post": 43,
 *                          "comment": 350,
 *                          "visit": 0,
 *                          "period": 0
 *                       }
 *                     ]
 *    responses:
 *      "200":
 *        description: 정상 수행
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "2건 정상적으로 저장되었습니다."
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
  "/manageAuthLevelCondition",
  [
    body("auth").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("auth.*.authId", "권한 ID가 비정상적입니다.").isNumeric().isAuthID(),
    body("auth.*.post", "게시글수가 비정상적입니다.")
      .isNumeric()
      .isLength({ min: 0, max: 99999 }),
    body("auth.*.comment", "댓글수가 비정상적입니다.")
      .isNumeric()
      .isLength({ min: 0, max: 99999 }),
    body("auth.*.visit", "방문횟수가 비정상적입니다.")
      .isNumeric()
      .isLength({ min: 0, max: 99999 }),
    body("auth.*.period", "가입기간이 비정상적입니다.")
      .isNumeric()
      .isLength({ min: 0, max: 99999 }),
  ],
  authController.postManageAuthLevelCondition
);

export default router;

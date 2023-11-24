import { Router, Request } from "express";
import * as menuController from "../../controllers/admin/menu";
import * as COM_CD from "../../models/com-cd";
import * as MENU from "../../models/menu";
import * as AUTH from "../../models/auth";
import * as BRACKET from "../../models/bracket";

const router = Router();

import { ExpressValidator, Meta } from "express-validator";
const { body, param } = new ExpressValidator({
  isMenuID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const menu = await MENU.getMenu(req, value);
    if (!menu) {
      return Promise.reject("존재하지 않는 메뉴입니다.");
    }
    req.body.adminFlag = menu.ADMIN_FLAG;
  },
  isAuthID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;

    if (value !== 99999) {
      const auth = await AUTH.getAuth(req, value);
      if (!auth) {
        return Promise.reject("존재하지 않는 권한입니다.");
      }
    }
  },
  isMenuType: async (value: string, meta: Meta) => {
    const req = meta.req as Request;

    const comcd = await COM_CD.getComCd(req, "MENU_TYPE", value);
    if (!comcd) {
      return Promise.reject("존재하지 않는 코드입니다.");
    }
  },
  isUseFlag: async (value: string, meta: Meta) => {
    const req = meta.req as Request;
    const comcd = await COM_CD.getComCd(req, "USE_FLAG", value);
    if (!comcd) {
      return Promise.reject("존재하지 않는 코드입니다.");
    }
  },
  isAdminFlag: async (value: string, meta: Meta) => {
    const req = meta.req as Request;
    const comcd = await COM_CD.getComCd(req, "ADMIN_FLAG", value);
    if (!comcd) {
      return Promise.reject("존재하지 않는 코드입니다.");
    }
  },
  isBracketID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const bracket = await BRACKET.getBracket(req, value);
    if (!bracket) {
      return Promise.reject("존재하지 않는 말머리입니다.");
    }
  },
});

/**
 * @swagger
 * paths:
 *  /api/admin/menu/manageMenu:
 *    get:
 *      summary: "메뉴 관리"
 *      description: "요청 경로에 값을 담아 서버에 보낸다."
 *      tags: [메뉴]
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
 *          name: menuName
 *          required: false
 *          description: 메뉴명
 *          schema:
 *            type: string
 *        - in: query
 *          name: adminFalg
 *          required: true
 *          description: 페이지타입
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "ALL"
 *              summary: 기본값
 *        - in: query
 *          name: useFlag
 *          required: true
 *          description: 사용유무
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "ALL"
 *              summary: 기본값
 *      responses:
 *        "200":
 *          description: 부모 메뉴 정보
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
 *                              "key": 2,
 *                              "menuId": 2,
 *                              "menuName": "test333",
 *                              "createdAt": "2023.11.02 13.19.05",
 *                              "createdUser": "테스트2",
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "adminFlag": "Y",
 *                              "useFlag": "Y",
 *                              "sort": 2,
 *                              "status": "S"
 *                            },
 *                            {
 *                              "key": 5,
 *                              "menuId": 5,
 *                              "menuName": "test333",
 *                              "createdAt": "2023.11.05 13.19.05",
 *                              "createdUser": "테스트",
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "adminFlag": "N",
 *                              "useFlag": "Y",
 *                              "sort": 3,
 *                              "status": "S"
 *                            }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [ "10", "15", "30", "50", "100" ]
 *                    comboAdminFlag:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "Y", "label": "관리자 페이지" },
 *                            { "value": "N", "label": "사용자 페이지" }
 *                          ]
 *                    comboUseFlag:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "Y", "label": "사용" },
 *                            { "value": "N", "label": "미사용" }
 *                          ]
 */
router.get("/manageMenu", menuController.getManageMenu);

/**
 * @swagger
 * paths:
 *  /api/admin/menu/detailMenu/{topMenuId}:
 *    get:
 *      summary: "상세 메뉴 관리"
 *      description: "요청 경로에 값을 담아 서버에 보낸다."
 *      tags: [메뉴]
 *      parameters:
 *        - in: path
 *          name: topMenuId
 *          required: true
 *          description: 부모 메뉴 아이디
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
 *        - in: query
 *          name: menuName
 *          required: false
 *          description: 메뉴명
 *          schema:
 *            type: string
 *        - in: query
 *          name: type
 *          required: true
 *          description: 유형
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "ALL"
 *              summary: 기본값
 *        - in: query
 *          name: useFlag
 *          required: true
 *          description: 사용유무
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "ALL"
 *              summary: 기본값
 *      responses:
 *        "200":
 *          description: 특정 부모의 자식 메뉴 조회
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
 *                              "key": 2,
 *                              "menuId": 2,
 *                              "menuName": "test333",
 *                              "postAuthId": 3,
 *                              "commentAuthId": 5,
 *                              "readAuthId": 2,
 *                              "createdAt": "2023.11.02 13.28.47",
 *                              "createdUser": "테스트2",
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "url": null,
 *                              "useFlag": "Y",
 *                              "type": "POST",
 *                              "sort": 2,
 *                              "status": "S",
 *                            },
 *                            {
 *                              "key": 2,
 *                              "menuId": 2,
 *                              "menuName": "test333",
 *                              "postAuthId": 3,
 *                              "commentAuthId": 5,
 *                              "readAuthId": 2,
 *                              "createdAt": "2023.11.02 13.28.47",
 *                              "createdUser": "테스트",
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "url": "/admin/manageMenu",
 *                              "useFlag": "Y",
 *                              "type": null,
 *                              "sort": 2,
 *                              "status": "S",
 *                            }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [ "10", "15", "30", "50", "100" ]
 *                    comboAuth:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": 1, "label": "운영자" },
 *                            { "value": 2, "label": "???" }
 *                          ]
 *                    comboUseFlag:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "Y", "label": "사용" },
 *                            { "value": "N", "label": "미사용" }
 *                          ]
 *                    comboType:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "POST", "label": "게시글" },
 *                            { "value": "POHTO", "label": "사진" }
 *                          ]
 *                    adminFlag:
 *                      type: string
 *                      example: "N"
 */
router.get(
  "/detailMenu/:topMenuId",
  param("topMenuId").isNumeric().isMenuID(),
  menuController.getDetailMenu
);

/**
 * @swagger
 * /api/admin/menu/manageMenu:
 *   post:
 *    summary: "부모 메뉴 저장"
 *    description: "선택한 부모 메뉴 저장 및 변경"
 *    tags: [메뉴]
 *    requestBody:
 *      description: 선택한 부모 메뉴 저장 및 변경
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              menu:
 *                type: object
 *                description: "메뉴 관련 데이터"
 *                example:
 *                    [
 *                       {
 *                          "menuId": null,
 *                          "menuName": "테스트22",
 *                          "adminFlag": "Y",
 *                          "useFlag": "Y",
 *                          "sort": 5
 *                       },
 *                       {
 *                          "menuId": 4,
 *                          "menuName": "테스트",
 *                          "adminFlag": "N",
 *                          "useFlag": "N",
 *                          "sort": 3
 *                       }
 *                    ]
 *    responses:
 *      "200":
 *        description: 정상 수행 - 저장한 메뉴 수만큼 메시지 보냄
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
  "/manageMenu",
  [
    body("menu").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("menu.*.menuId", "코드 ID가 비정상적입니다.")
      .isNumeric()
      .optional({ nullable: true })
      .isMenuID(),
    body("menu.*.menuName", "메뉴이름이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 30 })
      .trim(),
    body("menu.*.useFlag", "사용유무가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isUseFlag()
      .trim(),
    body("menu.*.adminFlag", "페이지유형이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isAdminFlag()
      .trim(),
    body("menu.*.sort", "정렬순서가 비정상적입니다.")
      .isNumeric()
      .isLength({ min: 1, max: 999 })
      .notEmpty(),
  ],
  menuController.postManageMenu
);

/**
 * @swagger
 * /api/admin/menu/detailMenu:
 *   post:
 *    summary: "자식 메뉴 저장"
 *    description: "선택한 자식 메뉴 저장 및 변경"
 *    tags: [메뉴]
 *    requestBody:
 *      description: 선택한 자식 메뉴 저장 및 변경
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              menu:
 *                type: object
 *                description: "메뉴 관련 데이터"
 *                example:
 *                    [
 *                       {
 *                          "menuId": null,
 *                          "menuName": "테스트22",
 *                          "postAuthId": 2,
 *                          "commentAuthId": 6,
 *                          "readAuthId": 5,
 *                          "url": null,
 *                          "useFlag": "Y",
 *                          "sort": 5,
 *                          "type": "POST"
 *                       },
 *                       {
 *                          "menuId": 3,
 *                          "menuName": "테스트22",
 *                          "postAuthId": 2,
 *                          "commentAuthId": 6,
 *                          "readAuthId": 5,
 *                          "url": "/admin/test",
 *                          "useFlag": "N",
 *                          "sort": 7,
 *                          "type": null
 *                       }
 *                    ]
 *              topMenuId:
 *                type: string
 *                description: "상위 메뉴 ID"
 *                example: "6"
 *    responses:
 *      "200":
 *        description: 정상 수행 - 저장한 메뉴 수만큼 메시지 보냄
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
  "/detailMenu",
  [
    body("menu").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("menu.*.menuId", "메뉴 ID가 비정상적입니다.")
      .isNumeric()
      .optional({ nullable: true })
      .isMenuID(),
    body("menu.*.menuName", "메뉴이름이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 30 })
      .trim(),
    body("menu.*.postAuthId", "게시글 권한이 비정상적입니다.")
      .isNumeric()
      .isAuthID(),
    body("menu.*.commentAuthId", "댓글 권한이 비정상적입니다.")
      .isNumeric()
      .isAuthID(),
    body("menu.*.readAuthId", "읽기 권한이 비정상적입니다.")
      .isNumeric()
      .isAuthID(),
    body("menu.*.url", "URL가 비정상적입니다.")
      .isString()
      .optional({ nullable: true, checkFalsy: true }),
    body("menu.*.type", "타입이 비정상적입니다.")
      .isString()
      .optional({ nullable: true, checkFalsy: true })
      .isMenuType(),
    body("menu.*.useFlag", "사용유무가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isUseFlag()
      .trim(),
    body("menu.*.sort", "정렬순서가 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .isLength({ min: 1, max: 999 }),
    body("topMenuId", "상위 메뉴 ID가 비정상적입니다.").isNumeric().isMenuID(),
  ],
  menuController.postDetailMenu
);

/**
 * @swagger
 * /api/admin/menu/manageMenu:
 *   patch:
 *    summary: "메뉴 삭제"
 *    description: 메뉴 삭제
 *    tags: [메뉴]
 *    requestBody:
 *      description: 메뉴 삭제
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              menu:
 *                type: object
 *                description: "삭제할 메뉴 ID"
 *                example:
 *                    [
 *                       {
 *                          "menuId": 3
 *                       },
 *                       {
 *                          "menuId": 5
 *                       }
 *                    ]
 *    responses:
 *      "200":
 *        description: 정상 수행 - 삭제한 메뉴수만큼 메시지 보냄
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "3건 정상적으로 삭제되었습니다."
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
  "/manageMenu",
  [
    body("menu").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("menu.*.menuId", "코드 ID가 비정상적입니다.").isNumeric().isMenuID(),
  ],
  menuController.patchManageMenu
);

/**
 * @swagger
 * /api/admin/menu/detailMenu:
 *   patch:
 *    summary: "중메뉴 삭제"
 *    description: 중메뉴 삭제
 *    tags: [메뉴]
 *    requestBody:
 *      description: 중메뉴 삭제
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              menu:
 *                type: object
 *                description: "삭제할 메뉴 ID"
 *                example:
 *                    [
 *                       {
 *                          "menuId": 3
 *                       },
 *                       {
 *                          "menuId": 5
 *                       }
 *                    ]
 *    responses:
 *      "200":
 *        description: 정상 수행 - 삭제한 메뉴수만큼 메시지 보냄
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example:
 *                    "3건 정상적으로 삭제되었습니다."
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
  "/detailMenu",
  [
    body("menu").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("menu.*.menuId", "코드 ID가 비정상적입니다.").isNumeric().isMenuID(),
  ],
  menuController.patchDetailMenu
);

/**
 * @swagger
 * paths:
 *  /api/admin/menu/manageBracket/{menuId}:
 *    get:
 *      summary: "말머리 관리"
 *      description: "요청 경로에 값을 담아 서버에 보낸다."
 *      tags: [메뉴]
 *      parameters:
 *        - in: path
 *          name: menuId
 *          required: true
 *          description: 해당 말머리 메뉴 아이디
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
 *        - in: query
 *          name: bracketName
 *          required: false
 *          description: 말머리명
 *          schema:
 *            type: string
 *        - in: query
 *          name: useFlag
 *          required: true
 *          description: 사용유무
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "ALL"
 *              summary: 기본값
 *      responses:
 *        "200":
 *          description: 특정 메뉴의 말머리 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    bracket:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "key": 2,
 *                              "bracketId": 2,
 *                              "content": "클립",
 *                              "createdAt": "2023.11.05 18.56.33",
 *                              "createdUser": "테스트232",
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "useFlag": "Y",
 *                              "sort": 1,
 *                              "menuId": 13,
 *                              "topMenuId": 14,
 *                              "status": "S"
 *                            },
 *                            {
 *                              "key": 4,
 *                              "bracketId": 4,
 *                              "content": "클립2",
 *                              "createdAt": "2023.11.15 18.56.33",
 *                              "createdUser": "테스트2",
 *                              "updatedAt": null,
 *                              "updatedUser": null,
 *                              "useFlag": "N",
 *                              "sort": 2,
 *                              "menuId": 13,
 *                              "topMenuId": 14,
 *                              "status": "S"
 *                            }
 *                           ]
 *                    totalCount:
 *                      type: int
 *                      example: 2
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [ "10", "15", "30", "50", "100" ]
 *                    comboUseFlag:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "Y", "label": "사용" },
 *                            { "value": "N", "label": "미사용" }
 *                          ]
 */
router.get(
  "/manageBracket/:menuId",
  param("menuId").isNumeric().isMenuID(),
  menuController.getManageBracket
);

/**
 * @swagger
 * /api/admin/menu/manageBracket:
 *   post:
 *    summary: "말머리 저장"
 *    description: "말머리 저장 및 수정"
 *    tags: [메뉴]
 *    requestBody:
 *      description: 말머리 저장 및 수정
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              bracket:
 *                type: object
 *                description: "저장할 말머리 데이터"
 *                example:
 *                    [
 *                       {
 *                          "bracketId": null,
 *                          "content": "테스트22",
 *                          "sort": 3,
 *                          "useFlag": "Y",
 *                          "menuId": 3,
 *                          "topMenuId": 3
 *                       },
 *                       {
 *                          "bracketId": 3,
 *                          "content": "테스트32",
 *                          "sort": 4,
 *                          "useFlag": "N",
 *                          "menuId": 3,
 *                          "topMenuId": 3
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
  "/manageBracket",
  [
    body("bracket").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("bracket.*.bracketId", "말머리 ID가 비정상적입니다.")
      .isNumeric()
      .optional({ nullable: true })
      .isBracketID(),
    body("bracket.*.menuId", "메뉴 ID가 비정상적입니다.")
      .isNumeric()
      .isMenuID(),
    body("bracket.*.topMenuId", "상위 메뉴 ID가 비정상적입니다.")
      .isNumeric()
      .isMenuID(),
    body("menu.*.content", "말머리명이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 50 })
      .trim(),
    body("menu.*.useFlag", "사용유무가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isUseFlag()
      .trim(),
    body("menu.*.sort", "정렬순서가 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .isLength({ min: 1, max: 999 }),
  ],
  menuController.postManageBracket
);

/**
 * @swagger
 * /api/admin/menu/manageBracket:
 *   patch:
 *    summary: "말머리 삭제"
 *    description: "말머리 삭제"
 *    tags: [메뉴]
 *    requestBody:
 *      description: 말머리 삭제
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              bracket:
 *                type: object
 *                description: "삭제할 말머리 ID"
 *                example:
 *                    [
 *                       {
 *                          "bracketId": 5
 *                       },
 *                       {
 *                          "bracketId": 3,
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
 *                    "3건 정상적으로 삭제되었습니다."
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
  "/manageBracket",
  [
    body("bracket").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("bracket.*.bracketId", "말머리 ID가 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .isBracketID(),
  ],
  menuController.patchManageBracket
);

export default router;

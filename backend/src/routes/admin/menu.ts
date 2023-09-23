import { Router, Request } from "express";
import * as menuController from "../../controllers/admin/menu";
import * as COM_CD from "../../models/com-cd";
import * as MENU from "../../models/menu";
import * as AUTH from "../../models/auth";

const router = Router();

import { ExpressValidator, Meta } from "express-validator";
const { body, param } = new ExpressValidator({
  isMenuID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const menu = await MENU.getMenu(req, value);
    if (!menu) {
      return Promise.reject("존재하지 않는 메뉴입니다.");
    }
  },
  isAuthID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const auth = await AUTH.getAuth(req, value);
    if (!auth) {
      return Promise.reject("존재하지 않는 권한입니다.");
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
 *                              "MENU_ID": 2,
 *                              "MENU_NAME": "test333",
 *                              "CREATED_AT": "2023년07월14일 04시36분50초",
 *                              "CREATED_USER": "테스트2",
 *                              "UPDATED_AT": null,
 *                              "UPDATED_USER": null,
 *                              "USE_FLAG": "Y",
 *                              "SORT": 2
 *                            },
 *                            {
 *                              "MENU_ID": 5,
 *                              "MENU_NAME": "test333",
 *                              "CREATED_AT": "2023년07월14일 04시36분50초",
 *                              "CREATED_USER": "테스트2",
 *                              "UPDATED_AT": "2023년08월14일 09시55분40초",
 *                              "UPDATED_USER": "테스트3",
 *                              "USE_FLAG": "N",
 *                              "SORT": 5
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
 *  /api/admin/menu/manageMenu/{topMenuId}:
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
 *                              "MENU_ID": 2,
 *                              "MENU_NAME": "test333",
 *                              "POST_AUTH_ID": 3,
 *                              "COMMENT_AUTH_ID": 5,
 *                              "READ_AUTH_ID": 2,
 *                              "CREATED_AT": "2023년07월14일 04시36분50초",
 *                              "CREATED_USER": "테스트2",
 *                              "UPDATED_AT": null,
 *                              "UPDATED_USER": null,
 *                              "TYPE": "POST",
 *                              "USE_FLAG": "Y",
 *                              "SORT": 2
 *                            },
 *                            {
 *                              "MENU_ID": 5,
 *                              "MENU_NAME": "test343",
 *                              "POST_AUTH_ID": 2,
 *                              "COMMENT_AUTH_ID": 5,
 *                              "READ_AUTH_ID": 7,
 *                              "CREATED_AT": "2023년07월14일 04시36분50초",
 *                              "CREATED_USER": "테스트2",
 *                              "UPDATED_AT": "2023년08월14일 09시55분40초",
 *                              "UPDATED_USER": "테스트3",
 *                              "TYPE": "PHOTO",
 *                              "USE_FLAG": "N",
 *                              "SORT": 5
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
 */
router.get(
  "/manageMenu/:topMenuId",
  param("topMenuId").isMenuID(),
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
 *                          "useFlag": "Y",
 *                          "sort": 5
 *                       },
 *                       {
 *                          "menuId": 4,
 *                          "menuName": "테스트",
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
      .custom(async (value, { req }) => {
        if (value && typeof value !== "number") {
          return Promise.reject("메뉴 ID가 비정상적입니다.");
        }
      })
      .trim(),
    body("menu.*.menuName", "메뉴이름이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 20 })
      .trim(),
    body("menu.*.useFlag", "사용유무가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isUseFlag()
      .trim(),
    body("menu.*.sort", "정렬순서가 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .trim(),
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
 *                          "topMenuId": 5,
 *                          "postAuthId": 2,
 *                          "commentAuthId": 6,
 *                          "readAuthId": 5,
 *                          "useFlag": "Y",
 *                          "sort": 5,
 *                          "type": "POST"
 *                       },
 *                       {
 *                          "menuId": 3,
 *                          "menuName": "테스트22",
 *                          "topMenuId": 5,
 *                          "postAuthId": 2,
 *                          "commentAuthId": 6,
 *                          "readAuthId": 5,
 *                          "useFlag": "N",
 *                          "sort": 7,
 *                          "type": "PHOTO"
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
  "/detailMenu",
  [
    body("menu").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("menu.*.menuId", "코드 ID가 비정상적입니다.")
      .custom(async (value, { req }) => {
        if (value && typeof value !== "number") {
          return Promise.reject("메뉴 ID가 비정상적입니다.");
        }
      })
      .trim(),
    body("menu.*.menuName", "메뉴이름이 비정상적입니다.")
      .isString()
      .notEmpty()
      .isLength({ min: 1, max: 20 })
      .trim(),
    body("menu.*.topMenuId", "상위메뉴가 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .isMenuID()
      .trim(),
    body("menu.*.postAuthId", "게시글 권한이 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .isAuthID()
      .trim(),
    body("menu.*.commentAuthId", "댓글 권한이 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .isAuthID()
      .trim(),
    body("menu.*.readAuthId", "읽기 권한이 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .isAuthID()
      .trim(),
    body("menu.*.type", "타입이 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .isMenuType()
      .trim(),
    body("menu.*.useFlag", "사용유무가 비정상적입니다.")
      .isString()
      .notEmpty()
      .isUseFlag()
      .trim(),
    body("menu.*.sort", "정렬순서가 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .trim(),
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
  "/manageMenu",
  [
    body("menu").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
    body("menu.*.menuId", "코드 ID가 비정상적입니다.")
      .isNumeric()
      .notEmpty()
      .trim()
      .isMenuID(),
  ],
  menuController.patchManageMenu
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
 *          description: 특정 부모의 자식 메뉴 조회
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
 *                              "BRACKET_ID": 2,
 *                              "CONTENT": "test333",
 *                              "SORT": 3
 *                            },
 *                            {
 *                              "BRACKET_ID": 5,
 *                              "CONTENT": "test343",
 *                              "SORT": 2
 *                             }
 *                           ]
 */
router.get(
  "/manageBracket/:menuId",
  param("menuId").isMenuID(),
  menuController.getManageBracket
);

/**
 * @swagger
 * /api/admin/menu/manageBracket:
 *   post:
 *    summary: "말머리 저장 및 삭제"
 *    description: "말머리 저장 및 삭제"
 *    tags: [메뉴]
 *    requestBody:
 *      description: 말머리 저장 및 삭제
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
 *                          "sort": 5
 *                       },
 *                       {
 *                          "bracketId": 3,
 *                          "content": "테스트32",
 *                          "sort": 5
 *                       }
 *                    ]
 *              delBracket:
 *                type: object
 *                description: "삭제할 말머리 데이터"
 *                example:
 *                    [
 *                       {
 *                          "bracketId": 5
 *                       },
 *                       {
 *                          "bracketId": 3
 *                       }
 *                    ]
 *              menuId:
 *                type: string
 *                description: "해당 말머리가 사용되는 메뉴ID"
 *                example:
 *                    "5"
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
 *                    "정상적으로 저장되었습니다."
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
    body("bracket").custom(async (value, { req }) => {
      if (value.length < 1) {
        return Promise.reject("데이터가 없습니다.");
      }
    }),
    body("delBracket").custom(async (value, { req }) => {
      if (value.length < 1) {
        return Promise.reject("데이터가 없습니다.");
      }
    }),
  ],
  menuController.postManageBracket
);

export default router;

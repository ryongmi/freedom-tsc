import { Router, Request } from "express";
import { sesstionCheck, menuAuthCheck } from "../../middleware/is-auth";
import * as postController from "../../controllers/users/post";
import * as MENU from "../../models/menu";
import * as POST from "../../models/post";
import * as BRACKET from "../../models/bracket";
import * as COM_CD from "../../models/com-cd";

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
  isPostID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const post = await POST.getPost(req, value);
    if (!post) {
      return Promise.reject("존재하지 않는 게시글입니다.");
    }
  },
  isBracketID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const bracket = await BRACKET.getBracket(req, value);
    if (!bracket) {
      return Promise.reject("존재하지 않는 말머리입니다.");
    }
  },
  isNotice: async (value: string, meta: Meta) => {
    const req = meta.req as Request;

    const comcd = await COM_CD.getComCd(req, "NOTICE_OPTION", value);
    if (!comcd) {
      return Promise.reject("존재하지 않는 코드입니다.");
    }
  },
});

/**
 * @swagger
 * /api/post:
 *   patch:
 *    summary: "게시글 삭제"
 *    description: 게시글 삭제
 *    tags: [게시글]
 *    requestBody:
 *      description: 삭제할 메뉴ID 및 게시글ID
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              post:
 *                type: object
 *                example:
 *                    [
 *                       {
 *                          "menuId": 13,
 *                          "postId": 3
 *                       },
 *                       {
 *                          "menuId": 1,
 *                          "postId": 5
 *                       }
 *                    ]
 *    responses:
 *      "200":
 *        description: 정상 수행 - 삭제한 게시글수만큼 메시지 보냄
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
  "/",
  body("post").isArray({ min: 1 }).withMessage("데이터가 없습니다."),
  body("post.*.menuId", "메뉴 ID가 비정상적입니다.").isNumeric().isMenuID(),
  body("post.*.postId", "게시글 ID가 비정상적입니다.").isNumeric().isPostID(),
  sesstionCheck,
  postController.patchPost
);

/**
 * @swagger
 * paths:
 *  /api/post/edit:
 *    get:
 *      summary: "글쓰기 및 수정"
 *      description: "글쓰기 및 수정 - 쿼리값이 없다면 글쓰기로 판단"
 *      tags: [게시글]
 *      parameters:
 *        - in: query
 *          name: menuId
 *          required: false
 *          description: 메뉴 ID
 *          schema:
 *            type: string
 *        - in: query
 *          name: postId
 *          required: false
 *          description: 게시글 ID
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: 게시글 정보 및 기타 정보들
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    post:
 *                      type: object
 *                      example:
 *                            {
 *                              "postId": 2,
 *                              "menuId": "test333",
 *                              "title": "ㅅㄷㄴㅅㅇㄴ",
 *                              "content": "<p>test</p>",
 *                              "bracketId": null,
 *                              "notice": null
 *                            }
 *                    comboBracket:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "value": 2,
 *                              "label": "test333",
 *                              "menuId": 15
 *                             }
 *                          ]
 *                    comboMenu:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": 13, "label": "카페 공지사항" },
 *                            { "value": 15, "label": "자유게시판" }
 *                          ]
 *                    comboNoticeOption:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "ALL", "label": "전체 공지" },
 *                            { "value": "POST", "label": "게시판 공지" },
 *                            { "value": "MUST_READ", "label": "필독 공지" }
 *                          ]
 */
router.get("/edit", postController.getPostEdit);

/**
 * @swagger
 * /api/post/edit:
 *   post:
 *    summary: "게시글 저장"
 *    description: "게시글 저장 및 수정"
 *    tags: [게시글]
 *    requestBody:
 *      description: 게시글 저장 및 수정
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              post:
 *                type: object
 *                description: "게시글 관련 데이터"
 *                example:
 *                       {
 *                          "postId": null,
 *                          "menuId": 13,
 *                          "title": "게시글 제목",
 *                          "content": "<p>내용</p>",
 *                          "bracketId": null,
 *                          "notice": null
 *                       }
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
  "/edit",
  body("post").isObject().notEmpty().withMessage("데이터가 없습니다."),
  body("post.postId", "코드 ID가 비정상적입니다.")
    .isNumeric()
    .optional({ nullable: true })
    .isPostID(),
  body("post.menuId", "코드 ID가 비정상적입니다.").isNumeric().isMenuID(),
  body("post.title", "게시글 제목이 비정상적입니다.")
    .isString()
    .notEmpty()
    .isLength({ min: 1, max: 50 })
    .trim(),
  body("post.content", "내용이 비정상적입니다.").isString().notEmpty().trim(),
  body("post.bracketId", "말머리가 비정상적입니다.")
    .isNumeric()
    .optional({ nullable: true })
    .isBracketID(),
  body("post.notice", "공지가 비정상적입니다.")
    .isString()
    .optional({ nullable: true })
    .isNotice(),
  sesstionCheck,
  postController.postCreatePost
);

/**
 * @swagger
 * /api/post/changeNotice:
 *   patch:
 *    summary: "공지사항 등록 및 수정"
 *    description: 선택한 게시글 공지사항 등록 및 수정
 *    tags: [게시글]
 *    requestBody:
 *      description: 게시글, 메뉴 ID 및 공지값
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              menuId:
 *                type: int
 *                example: 12
 *              postId:
 *                type: int
 *                example: 15
 *              notice:
 *                type: string
 *                example: null
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
router.patch(
  "/changeNotice",
  body("menuId", "코드 ID가 비정상적입니다.").isNumeric().isMenuID(),
  body("postId", "코드 ID가 비정상적입니다.").isNumeric().isPostID(),
  body("notice", "공지가 비정상적입니다.")
    .isString()
    .optional({ nullable: true })
    .isNotice(),
  sesstionCheck,
  postController.patchChangeNotice
);

/**
 * @swagger
 * /api/post/movePost:
 *   patch:
 *    summary: "게시글 이동"
 *    description: 선택한 게시글 다른 메뉴로 이동 - 해당 게시글에 작성된 댓글도 함께 이동
 *    tags: [게시글]
 *    requestBody:
 *      description: 선택한 게시글 ID
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              post:
 *                type: object
 *                example:
 *                          [
 *                            {
 *                              "menuId": 2,
 *                              "postId": 13,
 *                              "changeMenu": 5,
 *                              "changeBracket": null
 *                            },
 *                            {
 *                              "menuId": 2,
 *                              "postId": 15,
 *                              "changeMenu": 5,
 *                              "changeBracket": null
 *                            }
 *                           ]
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
router.patch(
  "/movePost",
  body("post").isObject().notEmpty().withMessage("데이터가 없습니다."),
  body("post.*.menuId", "코드 ID가 비정상적입니다.").isNumeric().isMenuID(),
  body("post.*.postId", "코드 ID가 비정상적입니다.").isNumeric().isPostID(),
  body("post.*.changeMenu", "변경메뉴ID가 비정상적입니다.")
    .isNumeric()
    .isMenuID(),
  body("post.*.changeBracket", "변경말머리ID가 비정상적입니다.")
    .isNumeric()
    .optional({ nullable: true })
    .isBracketID(),
  sesstionCheck,
  postController.patchMovePost
);

/**
 * @swagger
 * paths:
 *  /api/post/{menuId}:
 *    get:
 *      summary: "게시글 조회"
 *      description: "해당 메뉴에 해당하는 게시글 조회"
 *      tags: [게시글]
 *      parameters:
 *        - in: path
 *          name: menuId
 *          required: true
 *          description: 해당 메뉴 ID
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
 *          name: bracketId
 *          required: false
 *          description: 말머리
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "null"
 *              summary: 기본값
 *        - in: query
 *          name: dateValue
 *          required: false
 *          description: 기간 조회 값
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value:
 *              summary: 기본값
 *        - in: query
 *          name: dateOption
 *          required: false
 *          description: 기간 조회 옵션
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "ALL"
 *              summary: 기본값
 *        - in: query
 *          name: postValue
 *          required: false
 *          description: 게시글 조회 값
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value:
 *              summary: 기본값
 *        - in: query
 *          name: postOption
 *          required: false
 *          description: 게시글 조회 옵션 값
 *          schema:
 *            type: string
 *          examples:
 *            Sample:
 *              value: "TITLE"
 *              summary: 기본값
 *      responses:
 *        "200":
 *          description: 특정 메뉴의 게시글 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    post:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "key": 10,
 *                              "postId": 10,
 *                              "menuId": 13,
 *                              "bracket": null,
 *                              "title": "게시글 제목",
 *                              "commentCount": 2,
 *                              "createdAt": "2023.11.13",
 *                              "createdUser": "작성자",
 *                              "view": "84"
 *                            },
 *                            {
 *                              "key": 5,
 *                              "postId": 5,
 *                              "menuId": 13,
 *                              "bracket": "클립",
 *                              "title": "게시글 제목2",
 *                              "commentCount": 5,
 *                              "createdAt": "2023.11.11",
 *                              "createdUser": "작성자2",
 *                              "view": "14"
 *                            }
 *                           ]
 *                    menuName:
 *                      type: string
 *                      example: "카페 공지사항"
 *                    totalCount:
 *                      type: int
 *                      example: 3
 *                    comboPerPage:
 *                      type: object
 *                      example:
 *                          [
 *                            "10",
 *                            "15",
 *                            "30",
 *                            "50",
 *                            "100",
 *                          ]
 *                    comboMenu:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": 1, "label": "카페 공지사항" },
 *                            { "value": 2, "label": "자유게시판" }
 *                          ]
 *                    comboBracket:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": 7,  "label": "클립",   "menuId": 7 },
 *                            { "value": 14, "label": "말머리", "menuId": 13 }
 *                          ]
 *                    comboDateOption:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "ALL", "label": "전체기간" },
 *                            { "value": "DAY", "label": "1일" },
 *                            { "value": "WEEK", "label": "1주" },
 *                            { "value": "MONTH", "label": "1개월" },
 *                            { "value": "HALF_YEAR", "label": "6개월" },
 *                            { "value": "YEAR", "label": "1년" }
 *                          ]
 *                    comboPostOption:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "TITLE", "label": "제목" },
 *                            { "value": "POST_WRITER", "label": "글작성자" }
 *                          ]
 *                    menuAuth:
 *                      type: object
 *                      example:
 *                            { "post": "N", "comment": "N" }
 */
router.get(
  "/:menuId",
  param("menuId").isNumeric().isMenuID(),
  menuAuthCheck,
  postController.getPost
);

/**
 * @swagger
 * paths:
 *  /api/post/{menuId}/{postId}:
 *    get:
 *      summary: "게시물 조회"
 *      description: "특정 게시물을 조회"
 *      tags: [게시글]
 *      parameters:
 *        - in: path
 *          name: menuId
 *          required: true
 *          description: 해당 메뉴 ID
 *          schema:
 *            type: string
 *        - in: path
 *          name: postId
 *          required: true
 *          description: 해당 게시글 ID
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: 특정 게시물 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    post:
 *                      type: object
 *                      example:
 *                            {
 *                              "postId": 10,
 *                              "menuId": 13,
 *                              "bracket": null,
 *                              "bracketId": null,
 *                              "menuName": "카페 공지사항",
 *                              "authName": "운영자",
 *                              "title": "게시글 제목",
 *                              "content": "<p>게시글 내용</p>",
 *                              "createdAt": "2023.11.13 23.01.55",
 *                              "createdUser": "작성자",
 *                              "profileImgUrl": "https://static-cdn.jtvnw.net/jtv_user_pictures/73dc3c51-0972-4bfc-a6f0-d040e390d1f5-profile_image-300x300.png",
 *                              "writer": "TRUE",
 *                              "notice": null,
 *                              "prevMenuId": null,
 *                              "prevPostId": null,
 *                              "nextMenuId": 13,
 *                              "nextPostId": 5,
 *                            }
 *                    comments:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "commentId": 10,
 *                              "content": "댓글내용",
 *                              "profileImg": "https://static-cdn.jtvnw.net/jtv_user_pictures/73dc3c51-0972-4bfc-a6f0-d040e390d1f5-profile_image-300x300.png",
 *                              "createdAt": "2023.11.14 15.49.44",
 *                              "createdUser": "작성자",
 *                              "topCommentId": null,
 *                              "topUserName": null,
 *                              "deletedAt": null,
 *                              "writer": "FALSE",
 *                              "childCount": 0
 *                            },
 *                            {
 *                              "commentId": 15,
 *                              "content": "댓글내용",
 *                              "profileImg": null,
 *                              "createdAt": "2023.11.17 15.49.44",
 *                              "createdUser": "작성자",
 *                              "topCommentId": null,
 *                              "topUserName": null,
 *                              "deletedAt": "2023-11-14T07:41:37.000Z",
 *                              "writer": "FALSE",
 *                              "childCount": 1
 *                            },
 *                            {
 *                              "commentId": 23,
 *                              "content": "댓글내용",
 *                              "profileImg": null,
 *                              "createdAt": "2023.11.17 15.49.44",
 *                              "createdUser": "작성자",
 *                              "topCommentId": 15,
 *                              "topUserName": "댓글 작성자",
 *                              "deletedAt": null,
 *                              "writer": "TRUE",
 *                              "childCount": 0
 *                            }
 *                           ]
 *                    commentCount:
 *                      type: int
 *                      example: 3
 *                    comboMenu:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": 1, "label": "카페 공지사항" },
 *                            { "value": 2, "label": "자유게시판" }
 *                          ]
 *                    comboBracket:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": 7,  "label": "클립",   "menuId": 7 },
 *                            { "value": 14, "label": "말머리", "menuId": 13 }
 *                          ]
 *                    comboNoticeOption:
 *                      type: object
 *                      example:
 *                          [
 *                            { "value": "ALL", "label": "전체 공지" },
 *                            { "value": "POST", "label": "게시판 공지" },
 *                            { "value": "MUST_READ", "label": "필독 공지" }
 *                          ]
 *                    menuAuth:
 *                      type: object
 *                      example:
 *                            { "post": "N", "comment": "N" }
 */
router.get(
  "/:menuId/:postId",
  param("menuId").isMenuID(),
  param("postId").isPostID(),
  menuAuthCheck,
  postController.getPostContent
);

export default router;

import { Router, Request } from "express";
import * as postController from "../../controllers/users/post";
import * as MENU from "../../models/menu";
import * as POST from "../../models/post";
import { menuAuthCheck } from "../../middleware/is-auth";

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
});

/**
 * @swagger
 * paths:
 *  /api/postAll:
 *    get:
 *      summary: "전체게시글 조회"
 *      description: "메뉴에 상관없이 전체게시글 조회"
 *      tags: [전체게시글]
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
 *          description: 전체 메뉴의 게시글 조회
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
 *                              "menuName": "카페 공지사항",
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
 *                              "menuName": "자유게시판",
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
 *                    totalCount:
 *                      type: int
 *                      example: 2
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
 */
router.get("/", postController.getPostAll);

/**
 * @swagger
 * paths:
 *  /api/postAll/{menuId}/{postId}:
 *    get:
 *      summary: "게시물 조회"
 *      description: "특정 게시물을 조회"
 *      tags: [전체게시글]
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
 *                              "createdAt": "2023.11.15 15.49.44",
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
 *                            { "value": 7,  "label": "클립",   "menuId": 11 },
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
  postController.getPostAllContent
);

export default router;

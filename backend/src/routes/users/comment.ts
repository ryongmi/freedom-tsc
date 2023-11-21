import { Router, Request } from "express";
import * as commentController from "../../controllers/users/comment";
import * as MENU from "../../models/menu";
import * as POST from "../../models/post";
import * as COMMENT from "../../models/commnet";
import { sesstionCheck } from "../../middleware/is-auth";

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
  isCommentID: async (value: number, meta: Meta) => {
    const req = meta.req as Request;
    const comment = await COMMENT.getComment(req, value);
    if (!comment) {
      return Promise.reject("존재하지 않는 댓글입니다.");
    }
  },
});

/**
 * @swagger
 * paths:
 *  /api/comment/{menuId}/{postId}:
 *    get:
 *      summary: "댓글 조회"
 *      description: "특정 게시물의 댓글 조회"
 *      tags: [댓글]
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
 *          description: 특정 게시물의 댓글 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    comments:
 *                      type: object
 *                      example:
 *                          [
 *                            {
 *                              "commentId": 10,
 *                              "content": "댓글내용",
 *                              "createdAt": "2023.11.14 15.49.44",
 *                              "createdUser": "작성자",
 *                              "profileImg": "https://static-cdn.jtvnw.net/jtv_user_pictures/73dc3c51-0972-4bfc-a6f0-d040e390d1f5-profile_image-300x300.png",
 *                              "topCommentId": null,
 *                              "topUserName": null,
 *                              "deletedAt": null,
 *                              "writer": "FALSE",
 *                              "childCount": 0
 *                            },
 *                            {
 *                              "commentId": 15,
 *                              "content": "댓글내용",
 *                              "createdAt": "2023.11.17 15.49.44",
 *                              "createdUser": "작성자",
 *                              "profileImg": null,
 *                              "topCommentId": null,
 *                              "topUserName": null,
 *                              "deletedAt": "2023-11-14T07:41:37.000Z",
 *                              "writer": "FALSE",
 *                              "childCount": 1
 *                            },
 *                            {
 *                              "commentId": 23,
 *                              "content": "댓글내용",
 *                              "createdAt": "2023.11.15 15.49.44",
 *                              "createdUser": "작성자",
 *                              "profileImg": null,
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
 */
router.get("/:menuId/:postId", commentController.getComment);

/**
 * @swagger
 * /api/comment/createdComment:
 *   post:
 *    summary: "댓글 저장"
 *    description: "댓글 저장 및 수정"
 *    tags: [댓글]
 *    requestBody:
 *      description: 댓글 저장 및 수정
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              comment:
 *                type: object
 *                description: "댓글 관련 데이터"
 *                example:
 *                       {
 *                          "commentId": null,
 *                          "postId": 14,
 *                          "menuId": 13,
 *                          "content": "내용",
 *                          "topCommentId": null
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
  "/createdComment",
  body("comment").isObject().notEmpty().withMessage("데이터가 없습니다."),
  body("comment.commentId", "코드 ID가 비정상적입니다.")
    .isNumeric()
    .optional({ nullable: true })
    .isCommentID(),
  body("comment.postId", "코드 ID가 비정상적입니다.").isNumeric().isPostID(),
  body("comment.menuId", "코드 ID가 비정상적입니다.").isNumeric().isMenuID(),
  body("comment.content", "내용이 비정상적입니다.")
    .isString()
    .isLength({ min: 1, max: 3000 })
    .trim(),
  body("comment.topCommentId", "상위 댓글ID가 비정상적입니다.")
    .isNumeric()
    .optional({ nullable: true })
    .isCommentID(),
  sesstionCheck,
  commentController.postComment
);

/**
 * @swagger
 * /api/comment:
 *   patch:
 *    summary: "댓글 삭제"
 *    description: 해당 댓글 삭제
 *    tags: [댓글]
 *    requestBody:
 *      description: 삭제할 댓글ID
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              comment:
 *                type: int
 *                example: 23
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
 *                    "정상적으로 삭제되었습니다."
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
  body("comment").isNumeric().notEmpty().withMessage("데이터가 없습니다."),
  sesstionCheck,
  commentController.patchComment
);

export default router;

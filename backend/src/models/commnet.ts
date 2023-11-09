import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";
import { Comment } from "../interface/comment";

export const getComments = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId || req.query.menuId;
    const postId = req.params.postId || req.query.postId;

    const sql =
      `WITH RECURSIVE CTE AS (` +
      ` SELECT` +
      `     COMMENT_ID` +
      `   , CONTENT` +
      `   , CREATED_AT` +
      `   , CREATED_USER` +
      `   , TOP_COMMENT_ID` +
      `   , '........................' AS TOP_USER_ID` +
      `   , COMMENT_ID AS lvl` +
      `   FROM comment` +
      `  WHERE MENU_ID = ${menuId}` +
      `    AND POST_ID = ${postId}` +
      `    AND TOP_COMMENT_ID IS NULL` +
      `    AND DELETED_AT IS NULL` +
      ` UNION ALL` +
      ` SELECT` +
      `     C.COMMENT_ID` +
      `   , C.CONTENT` +
      `   , C.CREATED_AT` +
      `   , C.CREATED_USER` +
      `   , C.TOP_COMMENT_ID` +
      `   , CT.CREATED_USER AS TOP_USER_ID` +
      `   , CT.lvl AS lvl` +
      // `   , CONCAT(CT.lvl, ',', C.COMMENT_ID) lvl` +
      `   FROM comment C` +
      `  INNER JOIN CTE CT` +
      `     ON C.MENU_ID        = ${menuId}` +
      `    AND C.POST_ID        = ${postId}` +
      `    AND C.TOP_COMMENT_ID = CT.COMMENT_ID` +
      `    AND C.DELETED_AT IS NULL` +
      ` )` +
      ` SELECT ` +
      `     COMMENT_ID AS commentId` +
      `   , CONTENT AS content` +
      `   , GET_DATE_FORMAT(CTE.CREATED_AT) AS createdAt` +
      `   , U.DISPLAY_NAME AS createdUser` +
      `   , U.PROFILE_IMAGE_URL AS profileImg` +
      `   , TOP_COMMENT_ID AS topCommentId` +
      `   , CU.DISPLAY_NAME AS topUserName` +
      `   FROM CTE` +
      `  INNER JOIN user U ` +
      `     ON CTE.CREATED_USER = U.USER_ID` +
      `   LEFT JOIN user CU ` +
      `     ON CTE.TOP_USER_ID = CU.USER_ID` +
      `  ORDER BY lvl, commentId`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getComments"
);

export const createdComment = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const comment: Comment = req.body.comment;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 13213;

    try {
      const commentId = comment.commentId;
      const menuId = Number(comment.menuId);
      const postId = Number(comment.postId);
      const topCommentId = comment.topCommentId;
      const content = comment.content;

      const sql: string =
        `INSERT INTO comment` +
        `(` +
        `   COMMENT_ID` +
        ` , MENU_ID` +
        ` , POST_ID` +
        ` , TOP_COMMENT_ID` +
        ` , CONTENT` +
        ` , CREATED_USER` +
        `)` +
        `VALUES` +
        `(` +
        `    ${commentId}` +
        ` ,  ${menuId}` +
        ` ,  ${postId}` +
        ` ,  ${topCommentId}` +
        ` , '${content}'` +
        ` ,  ${adminUserId}` +
        `)` +
        `ON DUPLICATE KEY UPDATE` +
        `   CONTENT         = '${content}'` +
        ` , UPDATED_AT      =  now()` +
        ` , UPDATED_USER    =  ${adminUserId}`;

      await conn.query(sql);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  "createdMenu"
);

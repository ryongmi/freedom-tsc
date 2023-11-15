import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";
import { Comment } from "../interface/comment";

export const getComments = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId;
    const postId = req.params.postId;
    // const adminUserId: number = req.session.user!.userId;

    const sql =
      `WITH RECURSIVE CTE AS (` +
      ` SELECT` +
      `     C.COMMENT_ID` +
      `   , C.CONTENT` +
      `   , C.CREATED_AT` +
      `   , C.CREATED_USER` +
      `   , C.TOP_COMMENT_ID` +
      `   , '........................' AS TOP_USER_ID` +
      `   , C.DELETED_AT` +
      `   , COUNT(TC.COMMENT_ID) AS childCount` +
      `   , C.COMMENT_ID AS lvl` +
      `   FROM comment C` +
      `   LEFT JOIN comment TC` +
      `     ON C.COMMENT_ID = TC.TOP_COMMENT_ID` +
      `    AND TC.DELETED_AT IS NULL` +
      `  WHERE C.MENU_ID = ${menuId}` +
      `    AND C.POST_ID = ${postId}` +
      `    AND C.TOP_COMMENT_ID IS NULL` +
      // `    AND DELETED_AT IS NULL` +
      `  GROUP BY C.COMMENT_ID ` +
      ` UNION ALL` +
      ` SELECT` +
      `     C.COMMENT_ID` +
      `   , C.CONTENT` +
      `   , C.CREATED_AT` +
      `   , C.CREATED_USER` +
      `   , C.TOP_COMMENT_ID` +
      `   , CT.CREATED_USER AS TOP_USER_ID` +
      `   , C.DELETED_AT` +
      `   , 0 AS childCount` +
      `   , CT.lvl AS lvl` +
      // `   , CONCAT(CT.lvl, ',', C.COMMENT_ID) lvl` +
      `   FROM comment C` +
      `  INNER JOIN CTE CT` +
      `     ON C.TOP_COMMENT_ID = CT.COMMENT_ID` +
      `  WHERE C.MENU_ID = ${menuId}` +
      `    AND C.POST_ID = ${postId}` +
      // `    AND C.DELETED_AT IS NULL` +
      ` )` +
      ` SELECT ` +
      `     CTE.COMMENT_ID AS commentId` +
      `   , CTE.CONTENT AS content` +
      `   , GET_DATE_FORMAT(CTE.CREATED_AT) AS createdAt` +
      `   , U.DISPLAY_NAME AS createdUser` +
      `   , U.PROFILE_IMAGE_URL AS profileImg` +
      `   , TOP_COMMENT_ID AS topCommentId` +
      `   , CU.DISPLAY_NAME AS topUserName` +
      `   , CTE.DELETED_AT AS deletedAt` +
      `   , IF(P.CREATED_USER = CTE.CREATED_USER, 'TRUE', 'FALSE') AS writer` +
      `   , childCount` +
      `   FROM CTE` +
      `  INNER JOIN post P ` +
      `     ON P.MENU_ID = ${menuId}` +
      `    AND P.POST_ID = ${postId}` +
      `  INNER JOIN user U ` +
      `     ON CTE.CREATED_USER = U.USER_ID` +
      `   LEFT JOIN user CU ` +
      `     ON CTE.TOP_USER_ID = CU.USER_ID` +
      `  WHERE CTE.DELETED_AT IS NULL` +
      `     OR (` +
      `          CTE.DELETED_AT IS NOT NULL` +
      `          AND childCount != 0` +
      `         )` +
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
  "createdComment"
);

export const deletedComment = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const commentId: number = req.body.comment;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 131312;

    try {
      const sql = `UPDATE comment SET DELETED_AT = now(), DELETED_USER = ${adminUserId} WHERE COMMENT_ID = ${commentId}`;

      await conn.query(sql);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  "deletedComment"
);

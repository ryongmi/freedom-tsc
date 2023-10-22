import { Request } from "express";
import * as db from "../util/database";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";

let conn: mysql.PoolConnection;

export const getComments = tyrCatchModelHandler(
  async (req: Request) => {
    const menuId = req.params.menuId;
    const postId = req.params.postId;

    const sql =
      `WITH RECURSIVE CTE AS (` +
      ` SELECT` +
      `     COMMENT_ID` +
      `   , MENU_ID` +
      `   , POST_ID` +
      `   , CONTENT` +
      `   , CREATED_AT` +
      `   , CREATED_USER` +
      `   , TOP_COMMENT_ID` +
      `   , CAST(COMMENT_ID as CHAR(100)) lvl` +
      `   FROM comment` +
      `  WHERE MENU_ID = ${menuId}` +
      `    AND POST_ID = ${postId}` +
      `    AND TOP_COMMENT_ID IS NULL` +
      `    AND DELETED_AT IS NULL` +
      ` UNION ALL` +
      ` SELECT` +
      `     C.COMMENT_ID` +
      `   , C.MENU_ID` +
      `   , C.POST_ID` +
      `   , C.CONTENT` +
      `   , C.CREATED_AT` +
      `   , C.CREATED_USER` +
      `   , C.TOP_COMMENT_ID` +
      `   , CONCAT(CT.lvl, ',', C.COMMENT_ID) lvl` +
      `   FROM comment C` +
      `  INNER JOIN CTE CT` +
      `     ON C.MENU_ID        = ${menuId}` +
      `    AND C.POST_ID        = ${postId}` +
      `    AND C.TOP_COMMENT_ID = CT.COMMENT_ID` +
      `    AND C.DELETED_AT IS NULL` +
      ` )` +
      ` SELECT ` +
      `     COMMENT_ID` +
      `   , MENU_ID` +
      `   , POST_ID` +
      `   , CONTENT` +
      `   , GET_DATE_FORMAT(CREATED_AT) AS CREATED_AT` +
      `   , GET_USER_NAME(CREATED_USER) AS CREATED_USER` +
      `   , TOP_COMMENT_ID` +
      `   FROM CTE` +
      `  ORDER BY lvl`;

    conn = await db.getConnection();
    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "getComments",
  conn!
);

import { Request } from "express";
import mysql from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";

export const getPostAll = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    let currentPage: number = 1;
    let perPage: number = 15;

    if (req.query.page && typeof req.query.page === "number")
      currentPage = req.query.page;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    let sql =
      ` SELECT` +
      `     P.POST_ID` +
      `   , P.MENU_ID` +
      `   , M.MENU_NAME` +
      `   , B.CONTENT` +
      `   , P.TITLE` +
      `   , COUNT(COMMENT_ID) AS COMMENT_COUNT` +
      `   , GET_DATE_FORMAT(P.CREATED_AT) AS CREATED_AT` +
      `   , GET_USER_NAME(P.CREATED_USER) AS CREATED_USER` +
      `   FROM post P` +
      `  INNER JOIN menu M` +
      `     ON P.MENU_ID    = M.MENU_ID` +
      `    AND P.DELETED_AT IS NULL` +
      `   LEFT JOIN bracket B` +
      `     ON P.MENU_ID    = B.MENU_ID` +
      `    AND P.BRACKET_ID = B.BRACKET_ID` +
      `    AND P.DELETED_AT IS NULL` +
      `   LEFT JOIN comment C` +
      `     ON P.MENU_ID = C.MENU_ID` +
      `    AND P.POST_ID = C.POST_ID` +
      `    AND C.DELETED_AT IS NULL`;

    if (userOption === "ID")
      sql += ` WHERE U.USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
    else if (userOption === "NAME")
      sql += ` WHERE U.DISPLAY_NAME LIKE '%${userOptionValue}%'`;

    sql +=
      `  GROUP BY P.POST_ID, P.MENU_ID, B.CONTENT, P.TITLE` +
      `  ORDER BY P.POST_ID DESC`;

    sql += ` LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query(sql);
    return rows;
  },
  "getPostAll"
);

export const getPosts = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId;
    const bracketId = req.query.bracketId;
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    let currentPage: number = 1;
    let perPage: number = 15;

    if (req.query.page && typeof req.query.page === "number")
      currentPage = req.query.page;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    let sql =
      ` SELECT` +
      `     P.POST_ID` +
      `   , P.MENU_ID` +
      `   , B.CONTENT` +
      `   , P.TITLE` +
      `   , COUNT(COMMENT_ID) AS COMMENT_COUNT` +
      `   , GET_DATE_FORMAT(P.CREATED_AT) AS CREATED_AT` +
      `   , GET_USER_NAME(P.CREATED_USER) AS CREATED_USER` +
      `   FROM post P` +
      `   LEFT JOIN bracket B` +
      `     ON P.MENU_ID    = B.MENU_ID` +
      `    AND P.BRACKET_ID = B.BRACKET_ID` +
      `   LEFT JOIN comment C` +
      `     ON P.MENU_ID = C.MENU_ID` +
      `    AND P.POST_ID = C.POST_ID` +
      `    AND C.DELETED_AT IS NOT NULL` +
      `  WHERE P.MENU_ID = ${menuId}` +
      `    AND P.DELETED_AT IS NOT NULL`;

    if (!bracketId) {
      sql += ` AND P.BRACKET_ID = ${bracketId}`;
    }

    if (userOption === "ID")
      sql += ` AND U.USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
    else if (userOption === "NAME")
      sql += ` AND U.DISPLAY_NAME LIKE '%${userOptionValue}%'`;

    sql +=
      `  GROUP BY P.POST_ID, P.MENU_ID, B.CONTENT, P.TITLE` +
      `  ORDER BY P.POST_ID DESC`;

    sql += ` LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query(sql);
    return rows;
  },
  "getPosts"
);

export const getPost = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId;
    const postId = req.params.postId;

    const sql =
      ` SELECT` +
      `     P.POST_ID` +
      `   , P.MENU_ID` +
      `   , M.MENU_NAME` +
      `   , B.CONTENT AS BRACKET_NAME` +
      `   , P.TITLE` +
      `   , COUNT(COMMENT_ID) AS COMMENT_COUNT` +
      `   , GET_DATE_FORMAT(P.CREATED_AT) AS CREATED_AT` +
      `   , GET_USER_NAME(P.CREATED_USER) AS CREATED_USER` +
      `   FROM post P` +
      `  INNER JOIN menu M` +
      `     ON P.MENU_ID = M.MENU_ID` +
      `    AND M.DELETED_AT IS NULL` +
      `   LEFT JOIN bracket B` +
      `     ON P.MENU_ID    = B.MENU_ID` +
      `    AND P.BRACKET_ID = B.BRACKET_ID` +
      `   LEFT JOIN comment C` +
      `     ON P.MENU_ID = C.MENU_ID` +
      `    AND P.POST_ID = C.POST_ID` +
      `    AND C.DELETED_AT IS NULL` +
      `  WHERE P.POST_ID = ${postId}` +
      `    AND P.MENU_ID = ${menuId}` +
      `    AND P.DELETED_AT IS NULL`;

    const [rows] = await conn.query(sql);
    return rows;
  },
  "getPost"
);

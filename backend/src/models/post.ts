import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";
import { Post } from "../interface/post";

export const getPostAll = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);

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

export const getPost = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId;
    const bracketId = req.query.bracketId;
    const dateValue = req.query.dateValue?.toString() || "";
    const dateOption = req.query.dateOption;
    const postValue = req.query.postValue;
    const postOption = req.query.postOption;
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);

    let sql =
      ` SELECT` +
      `     P.POST_ID AS postId` +
      `   , P.MENU_ID AS menuId` +
      `   , B.CONTENT AS bracket` +
      `   , P.TITLE AS title` +
      `   , COUNT(COMMENT_ID) AS commentCount` +
      `   , FN_POST_DATE_FORMAT(P.CREATED_AT) AS createdAt` +
      `   , U.DISPLAY_NAME AS createdUser` +
      `   FROM post P` +
      `   LEFT JOIN bracket B` +
      `     ON P.MENU_ID    = B.MENU_ID` +
      `    AND P.BRACKET_ID = B.BRACKET_ID` +
      `   LEFT JOIN comment C` +
      `     ON P.MENU_ID = C.MENU_ID` +
      `    AND P.POST_ID = C.POST_ID` +
      `    AND C.DELETED_AT IS NULL` +
      `   LEFT JOIN user U` +
      `     ON U.USER_ID = P.CREATED_USER` +
      `  WHERE P.MENU_ID = ${menuId}` +
      `    AND P.DELETED_AT IS NULL`;

    if (bracketId) {
      sql += ` AND P.BRACKET_ID = ${bracketId}`;
    }

    if (dateOption !== "ALL") {
      if (dateOption === "기간지정") {
        const rangeDate = dateValue.split(",");
        sql += ` AND P.CREATED_AT BETWEEN '${rangeDate[0]}' AND '${rangeDate[1]} 23:59:59'`;
      } else {
        const nowDate = new Date();
        const endYear = nowDate.getFullYear();
        const endMonth = (nowDate.getMonth() + 1).toString().padStart(2, "0");
        const endDay = nowDate.getDate().toString().padStart(2, "0");
        let startYear, startMonth, startDay;

        switch (dateOption) {
          case "DAY":
            nowDate.setDate(nowDate.getDate() - 1);
            break;
          case "WEEK":
            nowDate.setDate(nowDate.getDate() - 7);
            break;
          case "MONTH":
            nowDate.setMonth(nowDate.getMonth() - 1);
            break;
          case "HALF_YEAR":
            nowDate.setMonth(nowDate.getMonth() - 6);
            break;
          case "YEAR":
            nowDate.setFullYear(nowDate.getFullYear() - 1);
            break;
          default:
            break;
        }

        startYear = nowDate.getFullYear();
        startMonth = (nowDate.getMonth() + 1).toString().padStart(2, "0");
        startDay = nowDate.getDate().toString().padStart(2, "0");

        sql += ` AND P.CREATED_AT BETWEEN '${startYear}-${startMonth}-${startDay}' AND '${endYear}-${endMonth}-${endDay} 23:59:59'`;
      }
    }

    if (postValue !== "") {
      if (postOption === "TITLE") {
        sql += ` AND P.TITLE LIKE '%${postValue}%'`;
      } else if (postOption === "POST_WRITER") {
        sql += ` AND U.DISPLAY_NAME LIKE '%${postValue}%'`;
      }
    }

    sql +=
      `  GROUP BY P.POST_ID, P.MENU_ID, B.CONTENT, P.TITLE` +
      `  ORDER BY P.POST_ID DESC`;

    sql += ` LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query(sql);
    return rows;
  },
  "getPost"
);

export const getPostContent = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId;
    const postId = req.params.postId;

    const sql =
      ` SELECT` +
      `     P.POST_ID AS postId` +
      `   , P.MENU_ID AS menuId` +
      `   , M.MENU_NAME AS menuName` +
      `   , A.AUTH_NAME AS authName` +
      `   , B.CONTENT AS bracket` +
      `   , P.TITLE AS title` +
      `   , P.CONTENT AS content` +
      `   , GET_DATE_FORMAT(P.CREATED_AT) AS createdAt` +
      `   , U.DISPLAY_NAME AS createdUser` +
      `   , U.PROFILE_IMAGE_URL AS profileImgUrl` +
      `   , COM.NAME AS nocite` +
      `   FROM post P` +
      `  INNER JOIN menu M` +
      `     ON P.MENU_ID = M.MENU_ID` +
      `    AND M.DELETED_AT IS NULL` +
      `  INNER JOIN user U` +
      `     ON P.CREATED_USER = U.USER_ID` +
      `  INNER JOIN auth A` +
      `     ON U.AUTH_ID = A.AUTH_ID` +
      `    AND A.USE_FLAG = 'Y'` +
      `    AND A.DELETED_AT IS NULL` +
      `   LEFT JOIN bracket B` +
      `     ON P.MENU_ID    = B.MENU_ID` +
      `    AND P.BRACKET_ID = B.BRACKET_ID` +
      `    AND B.USE_FLAG = 'Y'` +
      `    AND B.DELETED_AT IS NULL` +
      `   LEFT JOIN comcd COM` +
      `     ON COM.COM_ID = 'NOTICE_OPTION'` +
      `    AND P.NOTICE = COM.VALUE` +
      `  WHERE P.POST_ID = ${postId}` +
      `    AND P.MENU_ID = ${menuId}` +
      `    AND P.DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "getPostContent"
);

export const getPostEdit = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.query.menuId;
    const postId = req.query.postId;

    const sql =
      ` SELECT` +
      `     POST_ID AS postId` +
      `   , MENU_ID AS menuId` +
      `   , TITLE AS title` +
      `   , CONTENT AS content` +
      `   , BRACKET_ID AS bracketId` +
      `   , NOTICE AS notice` +
      `   FROM post` +
      `  WHERE MENU_ID = ${menuId}` +
      `    AND POST_ID = ${postId}` +
      `    AND DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "getPostEdit"
);

export const createdPost = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const post: Post = req.body.post;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 51513;

    try {
      const postId = post.postId;
      const menuId = post.menuId;
      const title = post.title;
      const content = post.content;
      const bracketId = post.bracketId;
      const notice = post.notice;

      const sql: string =
        `INSERT INTO post` +
        `(` +
        `   POST_ID` +
        ` , MENU_ID` +
        ` , TITLE` +
        ` , CONTENT` +
        ` , BRACKET_ID` +
        ` , NOTICE` +
        ` , CREATED_USER` +
        `)` +
        `VALUES` +
        `(` +
        `    ${postId}` +
        ` ,  ${menuId}` +
        ` , '${title}'` +
        ` , '${content}'` +
        ` ,  ${bracketId}` +
        ` ,  ${notice === null ? null : `'${notice}'`}` +
        ` ,  ${adminUserId}` +
        `)` +
        `ON DUPLICATE KEY UPDATE` +
        `   MENU_ID        =  ${menuId}` +
        ` , TITLE          = '${title}'` +
        ` , CONTENT        = '${content}'` +
        ` , BRACKET_ID     =  ${bracketId}` +
        ` , NOTICE         =  ${notice === null ? null : `'${notice}'`}` +
        ` , UPDATED_AT     =  now()` +
        ` , UPDATED_USER   =  ${adminUserId}`;

      await conn.query(sql);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  "createdPost"
);

import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";
import { Post, PostContent, PostMove } from "../interface/post";

export const getPostAll = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const dateValue = req.query.dateValue?.toString() || "";
    const dateOption = req.query.dateOption;
    const postValue = req.query.postValue;
    const postOption = req.query.postOption;
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);

    let sql =
      ` SELECT` +
      `     P.POST_ID AS 'key'` +
      `   , M.MENU_NAME AS menuName` +
      `   , P.POST_ID AS postId` +
      `   , P.MENU_ID AS menuId` +
      `   , B.CONTENT AS bracket` +
      `   , P.TITLE AS title` +
      `   , COUNT(C.COMMENT_ID) AS commentCount` +
      `   , FN_POST_DATE_FORMAT(P.CREATED_AT) AS createdAt` +
      `   , U.DISPLAY_NAME AS createdUser` +
      `   , FN_POST_VIEW_FORMAT(P.VIEW) AS view` +
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
      `  INNER JOIN MENU M` +
      `     ON P.MENU_ID = M.MENU_ID` +
      `  WHERE P.DELETED_AT IS NULL`;

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
  "getPostAll"
);

export const getPostAllContent = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const postId = req.params.postId;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 13213;
    // const adminUserId: number | null = null;

    let sql =
      ` SELECT` +
      `   R.POST_ID AS postId` +
      ` , R.MENU_ID AS menuId` +
      ` , R.BRACKET_ID AS bracketId` +
      ` , R.MENU_NAME AS menuName` +
      ` , R.AUTH_NAME AS authName` +
      ` , R.bracket AS bracket` +
      ` , R.TITLE AS title` +
      ` , R.content AS content` +
      ` , GET_DATE_FORMAT(R.CREATED_AT) AS createdAt` +
      ` , R.DISPLAY_NAME AS createdUser` +
      ` , R.PROFILE_IMAGE_URL AS profileImgUrl` +
      ` , IF(R.CREATED_USER = ${adminUserId}, 'TRUE', 'FALSE') AS writer` +
      ` , R.NOTICE AS notice` +
      ` , R.prevMenuId` +
      ` , R.prevPostId` +
      ` , R.nextMenuId` +
      ` , R.nextPostId` +
      `    FROM (` +
      `       SELECT` +
      `           P.POST_ID` +
      `         , P.MENU_ID` +
      `         , B.BRACKET_ID` +
      `         , M.MENU_NAME` +
      `         , A.AUTH_NAME` +
      `         , B.CONTENT AS bracket` +
      `         , P.TITLE` +
      `         , P.CONTENT AS content` +
      `         , P.CREATED_AT` +
      `         , U.DISPLAY_NAME` +
      `         , U.PROFILE_IMAGE_URL` +
      `         , P.NOTICE` +
      `         , P.CREATED_USER` +
      `         , LAG(P.MENU_ID) OVER(ORDER BY P.POST_ID DESC) AS prevMenuId` +
      `         , LAG(P.POST_ID) OVER(ORDER BY P.POST_ID DESC) AS prevPostId` +
      `         , LEAD(P.MENU_ID) OVER(ORDER BY P.POST_ID DESC) AS nextMenuId` +
      `         , LEAD(P.POST_ID) OVER(ORDER BY P.POST_ID DESC) AS nextPostId` +
      `         FROM post P` +
      `        INNER JOIN menu M` +
      `           ON P.MENU_ID = M.MENU_ID` +
      `          AND M.DELETED_AT IS NULL` +
      `        INNER JOIN user U` +
      `           ON P.CREATED_USER = U.USER_ID` +
      `        INNER JOIN auth A` +
      `           ON U.AUTH_ID = A.AUTH_ID` +
      `          AND A.USE_FLAG = 'Y'` +
      `          AND A.DELETED_AT IS NULL` +
      `         LEFT JOIN bracket B` +
      `           ON P.MENU_ID    = B.MENU_ID` +
      `          AND P.BRACKET_ID = B.BRACKET_ID` +
      `          AND B.USE_FLAG = 'Y'` +
      `          AND B.DELETED_AT IS NULL` +
      `        WHERE P.DELETED_AT IS NULL`;

    sql += `  ) R WHERE R.POST_ID = ${postId}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "getPostAllContent"
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
      `     P.POST_ID AS 'key'` +
      `   , P.POST_ID AS postId` +
      `   , P.MENU_ID AS menuId` +
      `   , B.CONTENT AS bracket` +
      `   , P.TITLE AS title` +
      `   , COUNT(C.COMMENT_ID) AS commentCount` +
      `   , FN_POST_DATE_FORMAT(P.CREATED_AT) AS createdAt` +
      `   , U.DISPLAY_NAME AS createdUser` +
      `   , FN_POST_VIEW_FORMAT(P.VIEW) AS view` +
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

    if (bracketId !== "null") {
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
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 13213;

    let sql =
      ` SELECT` +
      `   R.POST_ID AS postId` +
      ` , R.MENU_ID AS menuId` +
      ` , R.BRACKET_ID AS bracketId` +
      ` , R.MENU_NAME AS menuName` +
      ` , R.AUTH_NAME AS authName` +
      ` , R.bracket AS bracket` +
      ` , R.TITLE AS title` +
      ` , R.content AS content` +
      ` , GET_DATE_FORMAT(R.CREATED_AT) AS createdAt` +
      ` , R.DISPLAY_NAME AS createdUser` +
      ` , R.PROFILE_IMAGE_URL AS profileImgUrl` +
      ` , IF(R.CREATED_USER = ${adminUserId}, 'TRUE', 'FALSE') AS writer` +
      ` , R.NOTICE AS notice` +
      ` , R.prevMenuId` +
      ` , R.prevPostId` +
      ` , R.nextMenuId` +
      ` , R.nextPostId` +
      `    FROM (` +
      `       SELECT` +
      `           P.POST_ID` +
      `         , P.MENU_ID` +
      `         , B.BRACKET_ID` +
      `         , M.MENU_NAME` +
      `         , A.AUTH_NAME` +
      `         , B.CONTENT AS bracket` +
      `         , P.TITLE` +
      `         , P.CONTENT AS content` +
      `         , P.CREATED_AT` +
      `         , U.DISPLAY_NAME` +
      `         , U.PROFILE_IMAGE_URL` +
      `         , P.NOTICE` +
      `         , P.CREATED_USER` +
      `         , LAG(P.MENU_ID) OVER(ORDER BY P.POST_ID DESC) AS prevMenuId` +
      `         , LAG(P.POST_ID) OVER(ORDER BY P.POST_ID DESC) AS prevPostId` +
      `         , LEAD(P.MENU_ID) OVER(ORDER BY P.POST_ID DESC) AS nextMenuId` +
      `         , LEAD(P.POST_ID) OVER(ORDER BY P.POST_ID DESC) AS nextPostId` +
      `         FROM post P` +
      `        INNER JOIN menu M` +
      `           ON P.MENU_ID = M.MENU_ID` +
      `          AND M.DELETED_AT IS NULL` +
      `        INNER JOIN user U` +
      `           ON P.CREATED_USER = U.USER_ID` +
      `        INNER JOIN auth A` +
      `           ON U.AUTH_ID = A.AUTH_ID` +
      `          AND A.USE_FLAG = 'Y'` +
      `          AND A.DELETED_AT IS NULL` +
      `         LEFT JOIN bracket B` +
      `           ON P.MENU_ID    = B.MENU_ID` +
      `          AND P.BRACKET_ID = B.BRACKET_ID` +
      `          AND B.USE_FLAG = 'Y'` +
      `          AND B.DELETED_AT IS NULL` +
      `        WHERE P.DELETED_AT IS NULL` +
      `          AND P.MENU_ID = ${menuId}`;
    sql += `  ) R WHERE R.POST_ID = ${postId}`;

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
    const post: PostContent = req.body.post;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 13213;

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

export const updateNotice = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId: number = req.body.menuId;
    const postId: number = req.body.postId;
    const notice: string | null = req.body.notice;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 131312;

    try {
      const sql =
        `UPDATE post ` +
        `   SET NOTICE = ${notice ? `'${notice}'` : notice}` +
        `     , UPDATED_AT = now()` +
        `     , UPDATED_USER = ${adminUserId}` +
        ` WHERE MENU_ID = ${menuId}` +
        `   AND POST_ID = ${postId}`;

      await conn.query(sql);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  "updateNotice"
);

export const updateMenuId = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryPost: Array<PostMove> = req.body.post;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 131312;

    let sql;
    try {
      await conn.beginTransaction();

      aryPost.forEach(async (post) => {
        const menuId = post.menuId;
        const postId = post.postId;
        const changeMenu = post.changeMenu;
        const changeBracket = post.changeBracket;

        sql =
          `UPDATE post ` +
          `   SET MENU_ID      = ${changeMenu}` +
          `     , BRACKET_ID   = ${changeBracket}` +
          `     , UPDATED_AT   = now()` +
          `     , UPDATED_USER = ${adminUserId}` +
          ` WHERE MENU_ID = ${menuId}` +
          `   AND POST_ID = ${postId}`;

        await conn.query(sql);

        sql =
          `UPDATE comment ` +
          `   SET MENU_ID      = ${changeMenu}` +
          `     , UPDATED_AT   = now()` +
          `     , UPDATED_USER = ${adminUserId}` +
          ` WHERE MENU_ID = ${menuId}` +
          `   AND POST_ID = ${postId}`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryPost.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "updateMenuId"
);

export const deletedPost = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryPost: Array<Post> = req.body.post;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 131312;

    try {
      await conn.beginTransaction();

      aryPost.forEach(async (post) => {
        const menuId = post.menuId;
        const postId = post.postId;

        const sql = `UPDATE post SET DELETED_AT = now(), DELETED_USER = ${adminUserId} WHERE MENU_ID = ${menuId} AND POST_ID = ${postId}`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryPost.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "deletedPost"
);

export const updatePostView = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId;
    const postId = req.params.postId;

    try {
      const sql =
        `UPDATE post ` +
        `   SET VIEW = VIEW + 1` +
        ` WHERE MENU_ID = ${menuId}` +
        `   AND POST_ID = ${postId}`;

      await conn.query(sql);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  "updatePostView"
);

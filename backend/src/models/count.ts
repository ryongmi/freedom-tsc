import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tryCatchModelHandler } from "../middleware/try-catch";

// ************************** USER ************************** //
export const getUser = tryCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, userId: number) => {
    const sql =
      ` SELECT` +
      `     COUNT(USER_ID) AS totalCount` +
      `   FROM user U` +
      `  WHERE U.USER_ID = ${userId}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getUser"
);

export const getUsers = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userOption: string = req.query.userOption?.toString() ?? "";
    const userOptionValue: string = req.query.userOptionValue?.toString() ?? "";
    const userAuthId: string = req.query.userAuthId?.toString() ?? "ALL";
    const userStatus: string = req.query.userStatus?.toString() ?? "ALL";

    let sql =
      ` SELECT` +
      `     COUNT(USER_ID) AS totalCount` +
      `   FROM user` +
      `  WHERE 1=1`;

    if (userAuthId !== "ALL") {
      sql += ` AND AUTH_ID = ${userAuthId}`;
    }

    if (userAuthId !== "ALL") {
      sql += ` AND USER_STATUS = '${userStatus}'`;
    }

    if (userOptionValue !== "") {
      if (userOption === "ID")
        sql += ` AND USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
      else if (userOption === "NAME")
        sql += ` AND DISPLAY_NAME LIKE '%${userOptionValue}%'`;
    }

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getUsers"
);

export const getWarnUsers = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userOption: string = req.query.userOption?.toString() ?? "";
    const userOptionValue: string = req.query.userOptionValue?.toString() ?? "";

    let sql =
      ` SELECT` +
      `     COUNT(WARN_ID) AS totalCount` +
      `   FROM user U ` +
      `  INNER JOIN warn W` +
      `     ON U.USER_ID = W.USER_ID` +
      `    AND W.UN_WARN_AT IS NULL` +
      `  WHERE U.USER_STATUS = "W"`;

    if (userOptionValue !== "") {
      if (userOption === "ID")
        sql += ` AND U.USER_LOGIN_ID LIKE "%${userOptionValue}%"`;
      else if (userOption === "NAME")
        sql += ` AND U.DISPLAY_NAME LIKE "%${userOptionValue}%"`;
    }

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getWarnUsers"
);

export const getWarnContents = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userId: number = Number(req.params.userId);

    const sql =
      ` SELECT` +
      `     COUNT(WARN_ID) AS totalCount` +
      `   FROM warn` +
      `  WHERE USER_ID = ${userId}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getWarnContents"
);

export const getBanUsers = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userOption: string = req.query.userOption?.toString() ?? "";
    const userOptionValue: string = req.query.userOptionValue?.toString() ?? "";

    let sql =
      ` SELECT` +
      `     COUNT(BAN_ID) AS totalCount` +
      `   FROM ban B` +
      `  INNER JOIN user U` +
      `     ON B.USER_ID = U.USER_ID` +
      `    AND B.UN_BAN_AT IS NULL`;

    if (userOptionValue !== "") {
      if (userOption === "ID")
        sql += ` AND U.USER_LOGIN_ID LIKE "%${userOptionValue}%"`;
      else if (userOption === "NAME")
        sql += ` AND U.DISPLAY_NAME LIKE "%${userOptionValue}%"`;
    }

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getBanUsers"
);

export const getBanContents = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userId: number = Number(req.params.userId);

    const sql =
      ` SELECT` +
      `     COUNT(BAN_ID) AS totalCount` +
      `   FROM ban B` +
      `  WHERE USER_ID = ${userId}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getBanContents"
);

// ************************** MENU ************************** //
export const getTopMenu = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuName: string = req.query.menuName?.toString() ?? "";
    const adminFalg: string = req.query.adminFalg?.toString() ?? "ALL";
    const useFlag: string = req.query.useFlag?.toString() ?? "ALL";

    let sql: string =
      ` SELECT` +
      `   COUNT(MENU_ID) AS totalCount` +
      // `   (COUNT(MENU_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM menu` +
      `  WHERE TOP_MENU_ID IS NULL` +
      `    AND DELETED_AT IS NULL`;

    if (menuName !== "") {
      sql += ` AND MENU_NAME LIKE '%${menuName}%'`;
    }
    if (adminFalg !== "ALL") {
      sql += ` AND ADMIN_FLAG = '${adminFalg}'`;
    }
    if (useFlag !== "ALL") {
      sql += ` AND USE_FLAG = '${useFlag}'`;
    }

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getTopMenu"
);

export const getDetailMenu = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const topMenuId: number = Number(req.params.topMenuId);
    const menuName: string = req.query.menuName?.toString() ?? "";
    const type: string = req.query.type?.toString() ?? "ALL";
    const useFlag: string = req.query.useFlag?.toString() ?? "ALL";

    let sql: string =
      ` SELECT` +
      `   COUNT(MENU_ID) AS totalCount` +
      // `   (COUNT(MENU_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM menu` +
      `  WHERE TOP_MENU_ID = ${topMenuId}` +
      `    AND DELETED_AT IS NULL`;

    if (menuName !== "") {
      sql += ` AND MENU_NAME LIKE '$${menuName}$'`;
    }
    if (type !== "ALL") {
      sql += ` AND ADMIN_FLAG = '${type}'`;
    }
    if (useFlag !== "ALL") {
      sql += ` AND USE_FLAG = '${useFlag}'`;
    }

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getDetailMenu"
);

export const getBrackets = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId: number = Number(req.params.menuId);
    const bracketName: string = req.query.bracketName?.toString() ?? "";
    const useFlag: string = req.query.useFlag?.toString() ?? "ALL";

    let sql: string =
      ` SELECT` +
      `   COUNT(BRACKET_ID) AS totalCount` +
      `   FROM bracket` +
      `  WHERE MENU_ID = ${menuId}` +
      `    AND DELETED_AT IS NULL`;

    if (bracketName !== "") {
      sql += ` AND CONTENT LIKE '%${bracketName}%'`;
    }
    if (useFlag !== "ALL") {
      sql += ` AND USE_FLAG = '${useFlag}'`;
    }

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getBrackets"
);

// ************************** COM-CD ************************** //
export const getMainComCd = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const comcdOption: string = req.query.comcdOption?.toString() ?? "";
    const comcdOptionValue: string =
      req.query.comcdOptionValue?.toString() ?? "";

    let sql: string =
      ` SELECT` +
      `   COUNT(COM_ID) AS totalCount` +
      `   FROM comcd` +
      `  WHERE VALUE = '0'` +
      `    AND DELETED_AT IS NULL`;

    if (comcdOptionValue !== "") {
      if (comcdOption === "ID")
        sql += ` AND COM_ID LIKE '%${comcdOptionValue}%'`;
      else if (comcdOption === "NAME")
        sql += ` AND NAME LIKE '%${comcdOptionValue}%'`;
    }

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getMainComCd"
);

export const getDetailComCd = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const comId: string = req.params.comId;
    const comcdOption: string = req.query.comcdOption?.toString() ?? "";
    const comcdOptionValue: string =
      req.query.comcdOptionValue?.toString() ?? "";
    const useFlag: string = req.query.useFlag?.toString() ?? "ALL";

    let sql: string =
      ` SELECT` +
      `   COUNT(COM_ID) AS totalCount` +
      `   FROM comcd` +
      `  WHERE COM_ID = '${comId}'` +
      `    AND VALUE != '0'` +
      `    AND DELETED_AT IS NULL`;

    if (useFlag !== "ALL") {
      sql += ` AND USE_FLAG = '${useFlag}'`;
    }

    if (comcdOptionValue !== "") {
      if (comcdOption === "ID")
        sql += ` AND VALUE LIKE '%${comcdOptionValue}%'`;
      else if (comcdOption === "NAME")
        sql += ` AND NAME LIKE '%${comcdOptionValue}%'`;
    }

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getDetailComCd"
);

// ************************** AUTH ************************** //
export const getAuths = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const authName: string = req.query.authName?.toString() ?? "";
    const useFlag: string = req.query.useFlag?.toString() ?? "ALL";

    let sql: string =
      ` SELECT` +
      `   COUNT(AUTH_ID) AS totalCount` +
      `   FROM auth` +
      `  WHERE ADMIN_FLAG = 'N'` +
      `    AND DELETED_AT IS NULL`;

    if (authName !== "") {
      sql += ` AND AUTH_NAME LIKE '%${authName}%'`;
    }

    if (useFlag !== "ALL") {
      sql += ` AND USE_FLAG = '${useFlag}'`;
    }

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getAuths"
);

export const getAuthLevelCondition = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const authName: string = req.query.authName?.toString() ?? "";

    let sql: string =
      ` SELECT` +
      `   COUNT(A.AUTH_ID) AS totalCount` +
      `   FROM auth A` +
      `   LEFT JOIN auth_level_condition AL` +
      `     ON A.AUTH_ID = AL.AUTH_ID` +
      `  WHERE A.USE_FLAG = 'Y'` +
      `    AND A.ADMIN_FLAG = 'N'` +
      `    AND A.TYPE != 'NONE'` +
      `    AND A.DELETED_AT IS NULL`;

    if (authName !== "") {
      sql += ` AND A.AUTH_NAME LIKE '%${authName}%'`;
    }

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getAuthLevelCondition"
);

// ************************** POST ************************** //
export const getPostAll = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const dateValue = req.query.dateValue?.toString() || "";
    const dateOption = req.query.dateOption;
    const postValue = req.query.postValue?.toString() || "";
    const postOption = req.query.postOption;

    let sql =
      ` SELECT` +
      `     COUNT(R.POST_ID) AS totalCount` +
      `   FROM (` +
      ` SELECT` +
      `     P.POST_ID` +
      `   FROM post P` +
      `   LEFT JOIN bracket B` +
      `     ON P.MENU_ID    = B.MENU_ID` +
      `    AND P.BRACKET_ID = B.BRACKET_ID` +
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
      `  ORDER BY P.POST_ID DESC` +
      ` ) R`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getPostAll"
);

export const getPosts = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId;
    const bracketId = req.query.bracketId;
    const dateValue = req.query.dateValue?.toString() || "";
    const dateOption = req.query.dateOption;
    const postValue = req.query.postValue?.toString() || "";
    const postOption = req.query.postOption;

    let sql =
      ` SELECT` +
      `     COUNT(R.POST_ID) AS totalCount` +
      `   FROM (` +
      ` SELECT` +
      `     P.POST_ID` +
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
      `  ORDER BY P.POST_ID DESC` +
      ` ) R`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getPosts"
);

// ************************** COMMENT ************************** //
export const getComments = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId;
    const postId = req.params.postId;

    const sql: string =
      ` SELECT` +
      `   COUNT(C.COMMENT_ID) AS commentCount` +
      `   FROM comment C` +
      `  WHERE C.MENU_ID = ${menuId}` +
      `    AND C.POST_ID = ${postId}` +
      `    AND C.DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].commentCount;
  },
  "COUNT - getComments"
);

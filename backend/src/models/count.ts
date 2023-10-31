import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";

// ************************** USER ************************** //
export const getUser = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, userId: string) => {
    const sql =
      ` SELECT` +
      `     COUNT(USER_ID) AS totalCount` +
      `   FROM user U` +
      `  WHERE U.USER_ID = '${userId}'`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getUser"
);

export const getUsers = tyrCatchModelHandler(
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

export const getWarnUsers = tyrCatchModelHandler(
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

export const getWarnContents = tyrCatchModelHandler(
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

export const getBanUsers = tyrCatchModelHandler(
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

export const getBanContents = tyrCatchModelHandler(
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
export const getTopMenu = tyrCatchModelHandler(
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
      sql += ` AND MENU_NAME LIKE '${menuName}'`;
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

export const getDetailMenu = tyrCatchModelHandler(
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
      sql += ` AND MENU_NAME LIKE '${menuName}'`;
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

export const getBrackets = tyrCatchModelHandler(
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
      sql += ` AND CONTENT LIKE '${bracketName}'`;
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
export const getMainComCd = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    let perPage: number = 15;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    const sql =
      ` SELECT` +
      `   (COUNT(COM_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM comcd` +
      `  WHERE VALUE = '0'` +
      `    AND DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getMainComCd"
);

export const getDetailComCd = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const comId = req.params.comId;
    let perPage: number = 15;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    const sql =
      ` SELECT` +
      `   (COUNT(COM_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM comcd` +
      `  WHERE COM_ID = '${comId}'` +
      `    AND VALUE != '0'` +
      `    AND DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getDetailComCd"
);

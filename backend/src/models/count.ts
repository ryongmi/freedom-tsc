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
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    const userAuthId = req.query.userAuthId;
    let perPage: number = 15;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    let sql =
      ` SELECT` +
      `   (COUNT(USER_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM user` +
      `  WHERE 1=1`;

    if (userAuthId) {
      sql += ` AND AUTH_ID = ${userAuthId}`;
    }

    if (userOption === "ID")
      sql += ` AND USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
    else if (userOption === "NAME")
      sql += ` AND DISPLAY_NAME LIKE '%${userOptionValue}%'`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getUsers"
);

export const getWarnUsers = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    let perPage: number = 15;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    let sql =
      ` SELECT` +
      `   (COUNT(W.WARN_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM warn W` +
      `  INNER JOIN user U` +
      `     ON W.USER_ID = U.USER_ID` +
      `    AND W.UN_WARN_AT IS NULL`;

    if (userOption === "ID")
      sql += ` AND U.USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
    else if (userOption === "NAME")
      sql += ` AND U.DISPLAY_NAME LIKE '%${userOptionValue}%'`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getWarnUsers"
);

export const getWarnContents = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userId = req.params.userId;
    let perPage: number = 15;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    const sql =
      ` SELECT` +
      `   (COUNT(W.WARN_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM warn W` +
      `  INNER JOIN user U` +
      `     ON W.USER_ID = U.USER_ID` +
      `  WHERE W.USER_ID = '${userId}'`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getWarnContents"
);

export const getBanUsers = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    let perPage: number = 15;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    let sql =
      ` SELECT` +
      `   (COUNT(B.BAN_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM ban B` +
      `  INNER JOIN user U` +
      `     ON B.USER_ID = U.USER_ID` +
      `    AND B.UN_BAN_AT IS NULL`;

    if (userOption === "ID")
      sql += ` AND U.USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
    else if (userOption === "NAME")
      sql += ` AND U.DISPLAY_NAME LIKE '%${userOptionValue}%'`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getBanUsers"
);

export const getBanContents = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userId = req.params.userId;
    let perPage: number = 15;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    const sql =
      ` SELECT` +
      `   (COUNT(B.BAN_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM ban B` +
      `  INNER JOIN user U` +
      `     ON B.USER_ID = U.USER_ID` +
      `  WHERE B.USER_ID = '${userId}'`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getBanContents"
);

// ************************** MENU ************************** //
export const getTopMenu = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection) => {
    const sql =
      ` SELECT` +
      `   COUNT(MENU_ID) AS totalCount` +
      // `   (COUNT(MENU_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM menu` +
      `  WHERE TOP_MENU_ID IS NULL` +
      `    AND DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getTopMenu"
);

export const getDetailMenu = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const topMenuId = req.params.topMenuId;
    let perPage: number = 15;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    const sql =
      ` SELECT` +
      `   (COUNT(MENU_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM menu` +
      `  WHERE TOP_MENU_ID = ${topMenuId}` +
      `    AND DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].totalCount;
  },
  "COUNT - getDetailMenu"
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

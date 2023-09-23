import { Request } from "express";
import * as db from "../util/database";
import mysql from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";

let conn: mysql.PoolConnection;
// ************************** USER ************************** //
export const getUser = tyrCatchModelHandler(
  async (req: Request, userId: string) => {
    const sql =
      ` SELECT` +
      `     COUNT(USER_ID) AS totalCount` +
      `   FROM user U` +
      `  WHERE U.USER_ID = '${userId}'`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].totalCount;
    return rows;
  },
  "COUNT - getUser",
  conn!
);

export const getUsers = tyrCatchModelHandler(
  async (req: Request) => {
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    const userAuthId = req.query.userAuthId;
    const perPage = req.query.perPage || 15;

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

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].totalCount;
    return rows;
  },
  "COUNT - getUsers",
  conn!
);

export const getWarnUsers = tyrCatchModelHandler(
  async (req: Request) => {
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    const perPage = req.query.perPage || 15;

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

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].totalCount;
    return rows;
  },
  "COUNT - getWarnUsers",
  conn!
);

export const getWarnContents = tyrCatchModelHandler(
  async (req: Request) => {
    const userId = req.params.userId;
    const perPage = req.query.perPage || 15;

    const sql =
      ` SELECT` +
      `   (COUNT(W.WARN_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM warn W` +
      `  INNER JOIN user U` +
      `     ON W.USER_ID = U.USER_ID` +
      `  WHERE W.USER_ID = '${userId}'`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].totalCount;
    return rows;
  },
  "COUNT - getWarnContents",
  conn!
);

export const getBanUsers = tyrCatchModelHandler(
  async (req: Request) => {
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    const perPage = req.query.perPage || 15;

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

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].totalCount;
    return rows;
  },
  "COUNT - getBanUsers",
  conn!
);

export const getBanContents = tyrCatchModelHandler(
  async (req: Request) => {
    const userId = req.params.userId;
    const perPage = req.query.perPage || 15;

    const sql =
      ` SELECT` +
      `   (COUNT(B.BAN_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM ban B` +
      `  INNER JOIN user U` +
      `     ON B.USER_ID = U.USER_ID` +
      `  WHERE B.USER_ID = '${userId}'`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].totalCount;
    return rows;
  },
  "COUNT - getBanContents",
  conn!
);

// ************************** MENU ************************** //
export const getTopMenu = tyrCatchModelHandler(
  async (req: Request) => {
    const perPage = req.query.perPage || 15;

    const sql =
      ` SELECT` +
      `   (COUNT(MENU_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM menu` +
      `  WHERE TOP_MENU_ID IS NULL` +
      `    AND DELETED_AT IS NULL`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].totalCount;
    return rows;
  },
  "COUNT - getTopMenu",
  conn!
);

export const getDetailMenu = tyrCatchModelHandler(
  async (req: Request) => {
    const topMenuId = req.params.topMenuId;
    const perPage = req.query.perPage || 15;

    const sql =
      ` SELECT` +
      `   (COUNT(MENU_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM menu` +
      `  WHERE TOP_MENU_ID = ${topMenuId}` +
      `    AND DELETED_AT IS NULL`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].totalCount;
    return rows;
  },
  "COUNT - getDetailMenu",
  conn!
);

// ************************** COM-CD ************************** //
export const getMainComCd = tyrCatchModelHandler(
  async (req: Request) => {
    const perPage = req.query.perPage || 15;

    const sql =
      ` SELECT` +
      `   (COUNT(COM_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM comcd` +
      `  WHERE VALUE = '0'` +
      `    AND DELETED_AT IS NULL`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].totalCount;
    return rows;
  },
  "COUNT - getMainComCd",
  conn!
);

export const getDetailComCd = tyrCatchModelHandler(
  async (req: Request) => {
    const comId = req.params.comId;
    const perPage = req.query.perPage || 15;

    const sql =
      ` SELECT` +
      `   (COUNT(COM_ID) DIV ${perPage}) + 1 AS totalCount` +
      `   FROM comcd` +
      `  WHERE COM_ID = '${comId}'` +
      `    AND VALUE != '0'` +
      `    AND DELETED_AT IS NULL`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].totalCount;
    return rows;
  },
  "COUNT - getDetailComCd",
  conn!
);

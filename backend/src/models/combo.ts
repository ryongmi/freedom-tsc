import { Request } from "express";
import * as db from "../util/database";
import mysql from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";

let conn: mysql.PoolConnection;

export const getComboComCd = tyrCatchModelHandler(
  async (_: Request, comId: number) => {
    const sql =
      ` SELECT` +
      `     VALUE AS value` +
      `   , NAME AS label` +
      `   FROM comcd` +
      `   WHERE COM_ID = '${comId}'` +
      `     AND VALUE != '0'` +
      `     AND USE_FLAG = 'Y'` +
      `     AND DELETED_AT IS NULL` +
      `   ORDER BY SORT`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getComboComCd",
  conn!
);

export const getComboAuth = tyrCatchModelHandler(
  async () => {
    const sql = `SELECT AUTH_ID AS value, AUTH_NAME AS label FROM auth ORDER BY AUTH_ID`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getComboAuth",
  conn!
);

export const getComboAuthAll = tyrCatchModelHandler(
  async () => {
    let sql =
      `SELECT ` +
      `     null       AS value` +
      `  , '전체 멤버' AS label` +
      ` UNION ALL ` +
      `(` +
      `  SELECT ` +
      `      AUTH_ID   AS value` +
      `    , AUTH_NAME AS label` +
      `    FROM auth ` +
      `   ORDER BY AUTH_ID` +
      `)`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getComboAuthAll",
  conn!
);

export const getComboBracket = tyrCatchModelHandler(
  async (_: Request, menuId: number) => {
    let sql =
      `SELECT ` +
      `    null      AS value` +
      `  , '전체보기' AS label` +
      ` UNION ALL ` +
      `SELECT ` +
      `    BRACKET_ID AS value` +
      `  , CONTENT    AS label` +
      `  FROM bracket `;

    if (menuId) sql += `WHERE MENU_ID = ${menuId}`;

    sql += `ORDER BY SORT`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getComboBracket",
  conn!
);

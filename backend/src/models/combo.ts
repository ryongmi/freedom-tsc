import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";

export const getComboComCd = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, comId: number) => {
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

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getComboComCd"
);

export const getComboPerPage = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const sql =
      ` SELECT` +
      `     VALUE AS value` +
      `   , NAME AS label` +
      `   FROM comcd` +
      `   WHERE COM_ID = 'PER_PAGE'` +
      `     AND VALUE != '0'` +
      `     AND USE_FLAG = 'Y'` +
      `     AND DELETED_AT IS NULL` +
      `   ORDER BY SORT`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);

    if (!req.query.perPage) req.query.perPage = rows[0].value;

    return rows;
  },
  "getComboComCd"
);

export const getComboAuth = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection) => {
    const sql: string = `SELECT AUTH_ID AS value, AUTH_NAME AS label FROM auth ORDER BY AUTH_ID DESC`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getComboAuth"
);

export const getComboBracket = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, menuId: number) => {
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

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getComboBracket"
);

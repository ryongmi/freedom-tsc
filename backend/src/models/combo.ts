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
      `     VALUE` +
      `   FROM comcd` +
      `   WHERE COM_ID = 'PER_PAGE'` +
      `     AND VALUE != '0'` +
      `     AND USE_FLAG = 'Y'` +
      `     AND DELETED_AT IS NULL` +
      `   ORDER BY SORT`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);

    if (req.query.perPage === "null") req.query.perPage = rows[0].VALUE;

    const perPage: Array<string> = [];
    rows.forEach((item) => {
      perPage.push(item["VALUE"]);
    });

    return perPage;
  },
  "getComboPerPage"
);

export const getComboAuth = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection) => {
    const sql: string =
      `SELECT ` +
      `    AUTH_ID    AS value` +
      `  , AUTH_NAME  AS label` +
      `  FROM auth ` +
      ` WHERE USE_FLAG = 'Y'` +
      `   AND DELETED_AT IS NULL` +
      ` ORDER BY AUTH_ID DESC `;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getComboAuth"
);

export const getComboBracket = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId || req.query.menuId;

    const sql: string =
      `SELECT ` +
      `    BRACKET_ID AS value` +
      `  , CONTENT    AS label` +
      `  , MENU_ID    AS menuId` +
      `  FROM bracket ` +
      ` WHERE MENU_ID = ${menuId}` +
      `   AND USE_FLAG = 'Y'` +
      `   AND DELETED_AT IS NULL` +
      ` ORDER BY SORT`;

    // if (menuId) sql += `WHERE MENU_ID = ${menuId}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getComboBracket"
);

export const getComboMenu = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    // const menuId = Number(req.params.menuId);
    const authId = req.session.user?.authId || 1;

    const sql: string =
      `WITH RECURSIVE CTE AS (` +
      ` SELECT` +
      `     MENU_ID` +
      `   , MENU_NAME` +
      `   , TOP_MENU_ID` +
      `   , CAST(SORT as CHAR(100)) lvl` +
      `   FROM menu` +
      `  WHERE ADMIN_FLAG = 'N'` +
      `    AND TOP_MENU_ID IS NULL` +
      `    AND DELETED_AT IS NULL` +
      `    AND USE_FLAG = 'Y'` +
      ` UNION ALL` +
      ` SELECT` +
      `     M.MENU_ID` +
      `   , M.MENU_NAME` +
      `   , M.TOP_MENU_ID` +
      `   , CONCAT(C.lvl, ',', M.SORT) lvl` +
      `   FROM menu M` +
      `  INNER JOIN CTE C` +
      `     ON M.TOP_MENU_ID = C.MENU_ID` +
      `    AND M.DELETED_AT IS NULL` +
      `    AND M.USE_FLAG = 'Y'` +
      `    AND M.POST_AUTH_ID >= ${authId}` +
      ` )` +
      ` SELECT ` +
      `     MENU_ID AS value` +
      `   , MENU_NAME AS label` +
      `   FROM CTE` +
      `  WHERE TOP_MENU_ID IS NOT NULL` +
      `  ORDER BY lvl`;

    // if (menuId) sql += `WHERE MENU_ID = ${menuId}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getComboMenu"
);

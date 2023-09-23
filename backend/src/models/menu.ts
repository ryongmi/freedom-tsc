import { Request } from "express";
import * as db from "../util/database";
import mysql from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";
import { Menu, DetailMenu } from "../interface/menu";

let conn: mysql.PoolConnection;

export const getMenuAuth = tyrCatchModelHandler(
  async (req: Request) => {
    const menuId = req.params.menuId;
    const authId = req.session.user!.AUTH_ID;

    const sql =
      ` SELECT` +
      `     IF(POST_AUTH_ID > ${authId}, 'Y' ,'N') AS POST` +
      `   , IF(COMMENT_AUTH_ID > ${authId}, 'Y' ,'N') AS COMMENT` +
      `   , IF(READ_AUTH_ID > ${authId}, 'Y' ,'N') AS READ` +
      `   FROM menu` +
      `  WHERE MENU_ID = ${menuId}` +
      `    AND USE_FLAG = 'Y'` +
      `    AND DELETED_AT IS NULL`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0];
    return rows;
  },
  "getMenuAuth",
  conn!
);

export const getMenu = tyrCatchModelHandler(
  async (_: Request, menuId: number) => {
    const sql =
      ` SELECT` +
      `     MENU_ID` +
      `   FROM menu` +
      `  WHERE MENU_ID = ${menuId}` +
      `    AND DELETED_AT IS NULL`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0];
    return rows;
  },
  "getMenu",
  conn!
);

export const getMenus = tyrCatchModelHandler(
  async (_: Request) => {
    const sql =
      `WITH RECURSIVE CTE AS (` +
      ` SELECT` +
      `     MENU_ID` +
      `   , POST_AUTH_ID` +
      `   , COMMENT_AUTH_ID` +
      `   , READ_AUTH_ID` +
      `   , MENU_NAME` +
      `   , TOP_MENU_ID` +
      `   , TYPE` +
      `   , CAST(SORT as CHAR(100)) lvl` +
      `   FROM menu` +
      `  WHERE TOP_MENU_ID IS NULL` +
      `    AND DELETED_AT IS NULL` +
      `    AND USE_FLAG = 'Y'` +
      ` UNION ALL` +
      ` SELECT` +
      `     M.MENU_ID` +
      `   , M.POST_AUTH_ID` +
      `   , M.COMMENT_AUTH_ID` +
      `   , M.READ_AUTH_ID` +
      `   , M.MENU_NAME` +
      `   , M.TOP_MENU_ID` +
      `   , M.TYPE` +
      `   , CONCAT(C.lvl, ',', M.SORT) lvl` +
      `   FROM menu M` +
      `  INNER JOIN CTE C` +
      `     ON M.TOP_MENU_ID = C.MENU_ID` +
      `    AND M.DELETED_AT IS NULL` +
      `    AND M.USE_FLAG = 'Y'` +
      ` )` +
      ` SELECT ` +
      `     MENU_ID` +
      `   , MENU_NAME` +
      `   , TOP_MENU_ID` +
      `   , POST_AUTH_ID` +
      `   , COMMENT_AUTH_ID` +
      `   , READ_AUTH_ID` +
      `   , TYPE` +
      `   FROM CTE` +
      `  ORDER BY lvl`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getMenus",
  conn!
);

export const getTopMenu = tyrCatchModelHandler(
  async (req: Request) => {
    let currentPage: number = 1;
    let perPage: number = 15;

    if (req.query.page && typeof req.query.page === "number")
      currentPage = req.query.page;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    const sql =
      ` SELECT` +
      `     MENU_ID` +
      `   , MENU_NAME` +
      `   , GET_DATE_FORMAT(CREATED_AT) AS CREATED_AT` +
      `   , GET_USER_NAME(CREATED_USER) AS CREATED_USER` +
      `   , GET_DATE_FORMAT(UPDATED_AT) AS UPDATED_AT` +
      `   , GET_USER_NAME(UPDATED_USER) AS UPDATED_USER` +
      `   , USE_FLAG` +
      `   , SORT` +
      `   FROM menu` +
      `  WHERE TOP_MENU_ID IS NULL` +
      `    AND DELETED_AT IS NULL` +
      ` ORDER BY SORT ` +
      ` LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getTopMenu",
  conn!
);

export const getDetailMenu = tyrCatchModelHandler(
  async (req: Request) => {
    const topMenuId = req.params.topMenuId;
    let currentPage: number = 1;
    let perPage: number = 15;

    if (req.query.page && typeof req.query.page === "number")
      currentPage = req.query.page;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    const sql =
      ` SELECT` +
      `     MENU_ID` +
      `   , MENU_NAME` +
      `   , POST_AUTH_ID` +
      `   , COMMENT_AUTH_ID` +
      `   , READ_AUTH_ID` +
      `   , GET_DATE_FORMAT(CREATED_AT) AS CREATED_AT` +
      `   , GET_USER_NAME(CREATED_USER) AS CREATED_USER` +
      `   , GET_DATE_FORMAT(UPDATED_AT) AS UPDATED_AT` +
      `   , GET_USER_NAME(UPDATED_USER) AS UPDATED_USER` +
      `   , TYPE` +
      `   , USE_FLAG` +
      `   , SORT` +
      `   FROM menu` +
      `  WHERE TOP_MENU_ID = ${topMenuId}` +
      `    AND DELETED_AT IS NULL` +
      `  ORDER BY SORT` +
      `  LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getDetailMenu",
  conn!
);

export const createdMenu = tyrCatchModelHandler(
  async (req: Request) => {
    const aryMenu: Array<Menu> = req.body.menu;
    const adminUserId = req.session.user!.USER_ID;

    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      aryMenu.forEach(async (menu) => {
        const menuId = menu.menuId;
        const menuName = menu.menuName;
        const useFlag = menu.useFlag;
        const sort = menu.sort;

        const sql =
          `INSERT INTO menu` +
          `(` +
          `   MENU_ID` +
          ` , MENU_NAME` +
          ` , CREATED_USER` +
          ` , USE_FLAG` +
          ` , SORT` +
          `)` +
          `VALUES` +
          `(` +
          `    ${menuId}` +
          ` , '${menuName}'` +
          ` , '${adminUserId}'` +
          ` , '${useFlag}'` +
          ` ,  ${sort}` +
          `)` +
          `ON DUPLICATE KEY UPDATE` +
          ` , MENU_NAME       = '${menuName}'` +
          ` , USE_FLAG        = '${useFlag}'` +
          ` , SORT            =  ${sort}` +
          ` , UPDATED_AT      =  now()` +
          ` , UPDATED_USER    = '${adminUserId}'`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryMenu.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "createdMenu",
  conn!
);

export const createdDetailMenu = tyrCatchModelHandler(
  async (req: Request) => {
    const aryMenu: Array<DetailMenu> = req.body.menu;
    const adminUserId = req.session.user!.USER_ID;

    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      aryMenu.forEach(async (menu) => {
        const menuId = menu.menuId;
        const menuName = menu.menuName;
        const topMenuId = menu.topMenuId;
        const postAuthId = menu.postAuthId;
        const commentAuthId = menu.commentAuthId;
        const readAuthId = menu.readAuthId;
        const useFlag = menu.useFlag;
        const sort = menu.sort;
        const type = menu.type;

        const sql =
          `INSERT INTO menu` +
          `(` +
          `   MENU_ID` +
          ` , MENU_NAME` +
          ` , TOP_MENU_ID` +
          ` , POST_AUTH_ID` +
          ` , COMMENT_AUTH_ID` +
          ` , READ_AUTH_ID` +
          ` , CREATED_USER` +
          ` , TYPE` +
          ` , USE_FLAG` +
          ` , SORT` +
          `)` +
          `VALUES` +
          `(` +
          `    ${menuId}` +
          ` , '${menuName}'` +
          ` ,  ${topMenuId}` +
          ` ,  ${postAuthId}` +
          ` ,  ${commentAuthId}` +
          ` ,  ${readAuthId}` +
          ` , '${adminUserId}'` +
          ` , '${type}'` +
          ` , '${useFlag}'` +
          ` ,  ${sort}` +
          `)` +
          `ON DUPLICATE KEY UPDATE` +
          `   POST_AUTH_ID    =  ${postAuthId}` +
          ` , COMMENT_AUTH_ID =  ${commentAuthId}` +
          ` , READ_AUTH_ID    =  ${readAuthId}` +
          ` , MENU_NAME       = '${menuName}'` +
          ` , TYPE            = '${type}'` +
          ` , USE_FLAG        = '${useFlag}'` +
          ` , SORT            =  ${sort}` +
          ` , UPDATED_AT      =  now()` +
          ` , UPDATED_USER    = '${adminUserId}'`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryMenu.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "createdDetailMenu",
  conn!
);

export const deletedMenu = tyrCatchModelHandler(
  async (req: Request) => {
    const aryMenu: Array<{ menuId: number }> = req.body.menu;
    const adminUserId = req.session.user!.USER_ID;

    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      aryMenu.forEach(async (menuId) => {
        const sql = `UPDATE menu SET DELETED_AT = now(), DELETED_USER = '${adminUserId}' WHERE MENU_ID = '${menuId}'`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryMenu.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "deletedMenu",
  conn!
);

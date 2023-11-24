import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";
import { Menu, DetailMenu } from "../interface/menu";

export const getMenuAuth = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId = req.params.menuId;
    const authId = req.session.user?.authId ?? 99;

    const sql: string =
      ` SELECT` +
      `     IF(POST_AUTH_ID >= ${authId}, 'Y' ,'N') AS post` +
      `   , IF(COMMENT_AUTH_ID >= ${authId}, 'Y' ,'N') AS comment` +
      `   , IF(IFNULL(READ_AUTH_ID, 99) >= ${authId}, 'Y' ,'N') AS 'read'` +
      `   FROM menu` +
      `  WHERE MENU_ID = ${menuId}` +
      `    AND USE_FLAG = 'Y'` +
      `    AND DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "getMenuAuth"
);

export const getMenu = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, menuId: number) => {
    const sql: string =
      ` SELECT` +
      `     MENU_ID` +
      `   , ADMIN_FLAG` +
      `   , MENU_NAME AS menuName` +
      `   FROM menu` +
      `  WHERE MENU_ID = ${menuId}` +
      `    AND DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "getMenu"
);

export const getUserMenus = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection) => {
    const sql: string =
      `WITH RECURSIVE CTE AS (` +
      ` SELECT` +
      `     MENU_ID` +
      `   , POST_AUTH_ID` +
      `   , COMMENT_AUTH_ID` +
      `   , READ_AUTH_ID` +
      `   , MENU_NAME` +
      `   , TOP_MENU_ID` +
      `   , TYPE` +
      `   , URL` +
      `   , CAST(SORT as CHAR(100)) lvl` +
      `   FROM menu` +
      `  WHERE ADMIN_FLAG = 'N'` +
      `    AND TOP_MENU_ID IS NULL` +
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
      `   , CONCAT('/post/', M.MENU_ID) AS URL` +
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
      `   , URL` +
      `   FROM CTE` +
      `  ORDER BY lvl`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getMenus"
);

export const getAdminMenus = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection) => {
    const sql: string =
      `WITH RECURSIVE CTE AS (` +
      ` SELECT` +
      `     MENU_ID` +
      `   , MENU_NAME` +
      `   , TOP_MENU_ID` +
      `   , URL` +
      `   , CAST(SORT as CHAR(100)) lvl` +
      `   FROM menu` +
      `  WHERE ADMIN_FLAG = 'Y'` +
      `    AND TOP_MENU_ID IS NULL` +
      `    AND DELETED_AT IS NULL` +
      `    AND USE_FLAG = 'Y'` +
      ` UNION ALL` +
      ` SELECT` +
      `     M.MENU_ID` +
      `   , M.MENU_NAME` +
      `   , M.TOP_MENU_ID` +
      `   , M.URL` +
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
      `   , URL` +
      `   FROM CTE` +
      `  ORDER BY lvl`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getAdminMenus"
);

export const getTopMenu = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);
    const menuName: string = req.query.menuName?.toString() ?? "";
    const adminFalg: string = req.query.adminFalg?.toString() ?? "ALL";
    const useFlag: string = req.query.useFlag?.toString() ?? "ALL";

    let sql: string =
      ` SELECT` +
      `     MENU_ID AS 'key'` +
      `   , MENU_ID AS menuId` +
      `   , MENU_NAME AS menuName` +
      `   , GET_DATE_FORMAT(CREATED_AT) AS createdAt` +
      `   , GET_USER_NAME(CREATED_USER) AS createdUser` +
      `   , GET_DATE_FORMAT(UPDATED_AT) AS updatedAt` +
      `   , GET_USER_NAME(UPDATED_USER) AS updatedUser` +
      `   , ADMIN_FLAG AS adminFlag` +
      `   , USE_FLAG AS useFlag` +
      `   , SORT AS sort` +
      `   , 'S' AS status` +
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

    sql += ` ORDER BY SORT LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getTopMenu"
);

export const getDetailMenu = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const topMenuId: number = Number(req.params.topMenuId);
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);
    const menuName: string = req.query.menuName?.toString() ?? "";
    const type: string = req.query.type?.toString() ?? "ALL";
    const useFlag: string = req.query.useFlag?.toString() ?? "ALL";

    let sql: string =
      ` SELECT` +
      `     MENU_ID AS 'key'` +
      `   , MENU_ID AS menuId ` +
      `   , MENU_NAME AS menuName` +
      `   , IFNULL(POST_AUTH_ID, 99999) AS postAuthId` +
      `   , IFNULL(COMMENT_AUTH_ID, 99999) AS commentAuthId` +
      `   , IFNULL(READ_AUTH_ID, 99999) AS readAuthId` +
      `   , GET_DATE_FORMAT(CREATED_AT) AS createdAt` +
      `   , GET_USER_NAME(CREATED_USER) AS createdUser` +
      `   , GET_DATE_FORMAT(UPDATED_AT) AS updatedAt` +
      `   , GET_USER_NAME(UPDATED_USER) AS updatedUser` +
      `   , URL AS url` +
      `   , USE_FLAG AS useFlag` +
      `   , TYPE AS type` +
      `   , SORT AS sort` +
      `   , 'S' AS status` +
      `   FROM menu` +
      `  WHERE TOP_MENU_ID = ${topMenuId}` +
      `    AND DELETED_AT IS NULL`;

    if (menuName !== "") {
      sql += ` AND MENU_NAME LIKE '%${menuName}%'`;
    }
    if (type !== "ALL") {
      sql += ` AND ADMIN_FLAG = '${type}'`;
    }
    if (useFlag !== "ALL") {
      sql += ` AND USE_FLAG = '${useFlag}'`;
    }

    sql += ` ORDER BY SORT LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getDetailMenu"
);

export const createdMenu = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryMenu: Array<Menu> = req.body.menu;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 51513153;

    try {
      await conn.beginTransaction();

      aryMenu.forEach(async (menu) => {
        const menuId = menu.menuId;
        const menuName = menu.menuName;
        const adminFlag = menu.adminFlag;
        const useFlag = menu.useFlag;
        const sort = menu.sort;

        const sql: string =
          `INSERT INTO menu` +
          `(` +
          `   MENU_ID` +
          ` , MENU_NAME` +
          ` , CREATED_USER` +
          ` , ADMIN_FLAG` +
          ` , USE_FLAG` +
          ` , SORT` +
          `)` +
          `VALUES` +
          `(` +
          `    ${menuId}` +
          ` , '${menuName}'` +
          ` ,  ${adminUserId}` +
          ` , '${adminFlag}'` +
          ` , '${useFlag}'` +
          ` ,  ${sort}` +
          `)` +
          `ON DUPLICATE KEY UPDATE` +
          `   MENU_NAME       = '${menuName}'` +
          ` , ADMIN_FLAG      = '${adminFlag}'` +
          ` , USE_FLAG        = '${useFlag}'` +
          ` , SORT            =  ${sort}` +
          ` , UPDATED_AT      =  now()` +
          ` , UPDATED_USER    =  ${adminUserId}`;

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
  "createdMenu"
);

export const createdDetailMenu = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryMenu: Array<DetailMenu> = req.body.menu;
    const topMenuId = Number(req.body.topMenuId);
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 1231321312;

    try {
      await conn.beginTransaction();

      aryMenu.forEach(async (menu) => {
        const menuId = menu.menuId;
        const menuName = menu.menuName;
        const postAuthId = menu.postAuthId === 99999 ? null : menu.postAuthId;
        const commentAuthId =
          menu.commentAuthId === 99999 ? null : menu.commentAuthId;
        const readAuthId = menu.readAuthId === 99999 ? null : menu.readAuthId;
        const url = menu.url;
        const type = menu.type;
        const useFlag = menu.useFlag;
        const sort = menu.sort;

        const sql: string =
          `INSERT INTO menu` +
          `(` +
          `   MENU_ID` +
          ` , MENU_NAME` +
          ` , TOP_MENU_ID` +
          ` , POST_AUTH_ID` +
          ` , COMMENT_AUTH_ID` +
          ` , READ_AUTH_ID` +
          ` , CREATED_USER` +
          ` , URL` +
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
          ` ,  ${adminUserId}` +
          ` ,  ${url === null ? null : `'${url}'`}` +
          ` ,  ${type === null ? null : `'${type}'`}` +
          ` , '${useFlag}'` +
          ` ,  ${sort}` +
          `)` +
          `ON DUPLICATE KEY UPDATE` +
          `   POST_AUTH_ID    =  ${postAuthId}` +
          ` , COMMENT_AUTH_ID =  ${commentAuthId}` +
          ` , READ_AUTH_ID    =  ${readAuthId}` +
          ` , MENU_NAME       = '${menuName}'` +
          ` , URL             =  ${url === null ? null : `'${url}'`}` +
          ` , TYPE            =  ${type === null ? null : `'${type}'`}` +
          ` , USE_FLAG        = '${useFlag}'` +
          ` , SORT            =  ${sort}` +
          ` , UPDATED_AT      =  now()` +
          ` , UPDATED_USER    =  ${adminUserId}`;

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
  "createdDetailMenu"
);

export const deletedMenu = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryMenu: Array<{ menuId: number }> = req.body.menu;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 131312;

    try {
      await conn.beginTransaction();

      let sql: string = "";
      aryMenu.forEach(async (menu) => {
        const menuId = menu.menuId;

        sql = `UPDATE menu SET DELETED_AT = now(), DELETED_USER = ${adminUserId} WHERE MENU_ID = ${menuId} OR TOP_MENU_ID = ${menuId}`;

        await conn.query(sql);

        sql = `UPDATE bracket SET DELETED_AT = now(), DELETED_USER = ${adminUserId} WHERE TOP_MENU_ID = ${menuId}`;

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
  "deletedMenu"
);

export const deletedDetailMenu = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryMenu: Array<{ menuId: number }> = req.body.menu;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 51512344;

    try {
      await conn.beginTransaction();

      let sql: string = "";
      aryMenu.forEach(async (menu) => {
        const menuId = menu.menuId;

        sql = `UPDATE menu SET DELETED_AT = now(), DELETED_USER = ${adminUserId} WHERE MENU_ID = ${menuId}`;

        await conn.query(sql);

        sql = `UPDATE bracket SET DELETED_AT = now(), DELETED_USER = ${adminUserId} WHERE MENU_ID = ${menuId}`;

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
  "deletedDetailMenu"
);

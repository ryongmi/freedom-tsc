import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tryCatchModelHandler } from "../middleware/try-catch";
import { Bracket } from "../interface/bracket";

export const getBracket = tryCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, bracketId: number) => {
    const sql: string =
      ` SELECT` +
      `     BRACKET_ID` +
      `   FROM bracket` +
      `  WHERE BRACKET_ID = ${bracketId}` +
      `    AND DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "getBracket"
);

export const getBrackets = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const menuId: number = Number(req.params.menuId);
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);
    const bracketName: string = req.query.bracketName?.toString() ?? "";
    const useFlag: string = req.query.useFlag?.toString() ?? "ALL";

    let sql: string =
      ` SELECT` +
      `     BRACKET_ID AS 'key'` +
      `   , BRACKET_ID AS bracketId` +
      `   , CONTENT AS content` +
      `   , GET_DATE_FORMAT(CREATED_AT) AS createdAt` +
      `   , GET_USER_NAME(CREATED_USER) AS createdUser` +
      `   , GET_DATE_FORMAT(UPDATED_AT) AS updatedAt` +
      `   , GET_USER_NAME(UPDATED_USER) AS updatedUser` +
      `   , USE_FLAG AS useFlag` +
      `   , SORT AS sort` +
      `   , MENU_ID AS menuId` +
      `   , TOP_MENU_ID AS topMenuId` +
      `   , 'S' AS status` +
      `   FROM bracket` +
      `  WHERE MENU_ID = ${menuId}` +
      `    AND DELETED_AT IS NULL`;

    if (bracketName !== "") {
      sql += ` AND CONTENT LIKE '${bracketName}'`;
    }
    if (useFlag !== "ALL") {
      sql += ` AND USE_FLAG = '${useFlag}'`;
    }

    sql += ` ORDER BY SORT LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getBrackets"
);

export const createdBracket = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryBracket: Array<Bracket> = req.body.bracket;
    const adminUserId: number = req.session.user!.userId;

    try {
      await conn.beginTransaction();

      aryBracket.forEach(async (bracket) => {
        const bracketId = bracket.bracketId;
        const menuId = bracket.menuId;
        const topMenuId = bracket.topMenuId;
        const content = bracket.content;
        const sort = bracket.sort;
        const useFlag = bracket.useFlag;

        const sql: string =
          `INSERT INTO bracket` +
          `(` +
          `   BRACKET_ID` +
          ` , MENU_ID` +
          ` , TOP_MENU_ID` +
          ` , CONTENT` +
          ` , CREATED_USER` +
          ` , USE_FLAG` +
          ` , SORT` +
          `)` +
          `VALUES` +
          `(` +
          `    ${bracketId}` +
          ` ,  ${menuId}` +
          ` ,  ${topMenuId}` +
          ` , '${content}'` +
          ` ,  ${adminUserId}` +
          ` , '${useFlag}'` +
          ` ,  ${sort}` +
          `)` +
          `ON DUPLICATE KEY UPDATE` +
          `   CONTENT      = '${content}'` +
          ` , USE_FLAG     = '${useFlag}'` +
          ` , SORT         =  ${sort}` +
          ` , UPDATED_AT   =  now()` +
          ` , UPDATED_USER =  ${adminUserId}`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryBracket.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "createdBracket"
);

export const deletedBracket = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryBracket: Array<Bracket> = req.body.bracket;
    const adminUserId: number = req.session.user!.userId;

    try {
      await conn.beginTransaction();

      aryBracket.forEach(async (bracket) => {
        const bracketId = bracket.bracketId;

        const sql: string = `UPDATE bracket SET DELETED_AT = now(), DELETED_USER = ${adminUserId} WHERE BRACKET_ID = ${bracketId}`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryBracket.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "deletedBracket"
);

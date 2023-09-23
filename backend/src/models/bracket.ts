import { Request } from "express";
import * as db from "../util/database";
import mysql from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";
import { Bracket } from "../interface/bracket";

let conn: mysql.PoolConnection;

export const getBrackets = tyrCatchModelHandler(
  async (req: Request) => {
    const menuId = req.params.menuId;

    const sql =
      ` SELECT` +
      `     BRACKET_ID` +
      `   , CONTENT` +
      `   , SORT` +
      `   FROM bracket` +
      `  WHERE MENU_ID = ${menuId}` +
      `  ORDER BY SORT`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getBrackets",
  conn!
);

export const createdBracket = tyrCatchModelHandler(
  async (req: Request) => {
    const aryBracket: Array<Bracket> = req.body.bracket;
    const menuId = req.body.menuId;

    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      aryBracket.forEach(async (bracket) => {
        const bracketId = bracket.bracketId;
        const content = bracket.content;
        const sort = bracket.sort;

        const sql =
          `INSERT INTO bracket` +
          `(` +
          `   BRACKET_ID` +
          ` , MENU_ID` +
          ` , CONTENT` +
          ` , SORT` +
          `)` +
          `VALUES` +
          `(` +
          `    ${bracketId}` +
          ` ,  ${menuId}` +
          ` , '${content}'` +
          ` ,  ${sort}` +
          `)` +
          `ON DUPLICATE KEY UPDATE` +
          `   CONTENT    = '${content}'` +
          ` , SORT       =  ${sort}`;

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
  "createdBracket",
  conn!
);

export const deletedBracket = tyrCatchModelHandler(
  async (req: Request) => {
    const aryDelBracket: Array<{ bracketId: number }> = req.body.bracket;
    const menuId = req.body.menuId;

    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      aryDelBracket.forEach(async (bracketId) => {
        const sql = `DELETE FROM menu WHERE BRACKET_ID = ${bracketId} AND MENU_ID = ${menuId}`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryDelBracket.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "deletedBracket",
  conn!
);

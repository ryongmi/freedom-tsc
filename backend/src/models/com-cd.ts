import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tryCatchModelHandler } from "../middleware/try-catch";
import { ComCd, DetailComCd } from "../interface/com-cd";

export const getComCd = tryCatchModelHandler(
  async (
    _: Request,
    conn: mysql.PoolConnection,
    comId: string,
    value: string
  ) => {
    const sql = `SELECT COM_ID FROM comcd WHERE COM_ID = '${comId}' AND VALUE = '${value}' AND DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "getComCd"
);

export const getMainComCd = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);
    const comcdOption: string = req.query.comcdOption?.toString() ?? "";
    const comcdOptionValue: string =
      req.query.comcdOptionValue?.toString() ?? "";

    let sql: string =
      ` SELECT` +
      `     COM_ID AS 'key'` +
      `   , COM_ID AS comId` +
      `   , NAME AS name` +
      `   , GET_DATE_FORMAT(CREATED_AT) AS createdAt` +
      `   , GET_USER_NAME(CREATED_USER) AS createdUser` +
      `   , GET_DATE_FORMAT(UPDATED_AT) AS updatedAt` +
      `   , GET_USER_NAME(UPDATED_USER) AS updatedUser` +
      `   , 'S' AS status` +
      `   FROM comcd` +
      `  WHERE VALUE = '0'` +
      `    AND DELETED_AT IS NULL`;

    if (comcdOptionValue !== "") {
      if (comcdOption === "ID")
        sql += ` AND COM_ID LIKE '%${comcdOptionValue}%'`;
      else if (comcdOption === "NAME")
        sql += ` AND NAME LIKE '%${comcdOptionValue}%'`;
    }

    sql +=
      `  ORDER BY COM_ID` +
      `  LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getMainComCd"
);

export const getDetailComCd = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const comId: string = req.params.comId;
    const comcdOption: string = req.query.comcdOption?.toString() ?? "";
    const comcdOptionValue: string =
      req.query.comcdOptionValue?.toString() ?? "";
    const useFlag: string = req.query.useFlag?.toString() ?? "ALL";
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);

    let sql: string =
      ` SELECT` +
      `     VALUE AS 'key'` +
      `   , VALUE AS value` +
      `   , NAME AS name` +
      `   , GET_DATE_FORMAT(CREATED_AT) AS createdAt` +
      `   , GET_USER_NAME(CREATED_USER) AS createdUser` +
      `   , GET_DATE_FORMAT(UPDATED_AT) AS updatedAt` +
      `   , GET_USER_NAME(UPDATED_USER) AS updatedUser` +
      `   , USE_FLAG AS useFlag` +
      `   , SORT AS sort` +
      `   , 'S' AS status` +
      `   FROM comcd` +
      `  WHERE COM_ID = '${comId}'` +
      `    AND VALUE != '0'` +
      `    AND DELETED_AT IS NULL`;

    if (useFlag !== "ALL") {
      sql += ` AND USE_FLAG = '${useFlag}'`;
    }

    if (comcdOptionValue !== "") {
      if (comcdOption === "ID")
        sql += ` AND COM_ID LIKE '%${comcdOptionValue}%'`;
      else if (comcdOption === "NAME")
        sql += ` AND NAME LIKE '%${comcdOptionValue}%'`;
    }

    sql += `  ORDER BY SORT LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getDetailComCd"
);

export const createdComCd = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryComCd: Array<ComCd> = req.body.comCd;
    const adminUserId: number = req.session.user!.userId;

    try {
      await conn.beginTransaction();

      aryComCd.forEach(async (com) => {
        const comId = com.comId;
        const name = com.name;

        let sql =
          `INSERT INTO comcd` +
          `(` +
          `   COM_ID` +
          ` , VALUE` +
          ` , NAME` +
          ` , CREATED_USER` +
          `)` +
          `VALUES` +
          `(` +
          `   '${comId}'` +
          ` , '0'` +
          ` , '${name}'` +
          ` ,  ${adminUserId}` +
          `)` +
          `ON DUPLICATE KEY UPDATE` +
          `   NAME         = '${name}'` +
          ` , UPDATED_AT   =  now()` +
          ` , UPDATED_USER =  ${adminUserId}`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryComCd.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "createdComCd"
);

export const createdDetailComCd = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryComCd: Array<DetailComCd> = req.body.comCd;
    const comId: string = req.body.comId;
    const adminUserId: number = req.session.user!.userId;

    try {
      await conn.beginTransaction();

      aryComCd.forEach(async (com) => {
        const value = com.value;
        const name = com.name;
        const useFlag = com.useFlag;
        const sort = com.sort;

        let sql =
          `INSERT INTO comcd` +
          `(` +
          `   COM_ID` +
          ` , VALUE` +
          ` , NAME` +
          ` , CREATED_USER` +
          ` , USE_FLAG` +
          ` , SORT` +
          `)` +
          `VALUES` +
          `(` +
          `   '${comId}'` +
          ` , '${value}'` +
          ` , '${name}'` +
          ` ,  ${adminUserId}` +
          ` , '${useFlag}'` +
          ` ,  ${sort}` +
          `)` +
          `ON DUPLICATE KEY UPDATE` +
          `   NAME         = '${name}'` +
          ` , UPDATED_AT   =  now()` +
          ` , UPDATED_USER =  ${adminUserId}` +
          ` , USE_FLAG     = '${useFlag}'` +
          ` , SORT         =  ${sort}`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryComCd.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "createdDetailComCd"
);

export const deletedComCd = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryComCd: Array<ComCd> = req.body.comCd;
    const adminUserId = req.session.user!.userId;

    try {
      await conn.beginTransaction();

      aryComCd.forEach(async (com) => {
        const comId = com.comId;

        const sql: string =
          `UPDATE comcd ` +
          `   SET DELETED_AT   = now()` +
          `     , DELETED_USER = ${adminUserId}` +
          ` WHERE COM_ID = '${comId}'` +
          `   AND DELETED_AT IS NULL`;

        await conn.query(sql);
      });

      await conn.commit();
      return;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "deletedComCd"
);

export const deletedDetailComCd = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const comId: string = req.body.comId;
    const aryComCd: Array<ComCd> = req.body.comCd;
    const adminUserId = req.session.user!.userId;

    try {
      await conn.beginTransaction();

      aryComCd.forEach(async (com) => {
        const value = com.value;

        const sql: string =
          `UPDATE comcd ` +
          `   SET DELETED_AT   = now()` +
          `     , DELETED_USER = ${adminUserId}` +
          ` WHERE COM_ID = '${comId}'` +
          `   AND VALUE  = '${value}'`;

        await conn.query(sql);
      });

      await conn.commit();
      return;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "deletedDetailComCd"
);

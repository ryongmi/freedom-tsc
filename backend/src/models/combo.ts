import { Request } from "express";
import mysql from "mysql2";
import * as db from "../util/database";
import * as log from "../util/log";

export const getComboComCd = async (req: Request, comId: number) => {
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

  let conn = null;
  try {
    conn = await db.getConnection();
    const [rows] = await conn!.query(sql);
    return rows;
  } catch (error) {
    console.log(error);
    if (error instanceof mysql)
      throw log.setErrorLog(req, error, "getComboComCd");
  } finally {
    await db.releaseConnection(conn);
  }
};

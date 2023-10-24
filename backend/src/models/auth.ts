import { Request } from "express";
import mysql from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";
import { AuthLevelCondition } from "../interface/auth";

export const getAuth = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, authId: number) => {
    const sql = `SELECT * FROM auth WHERE AUTH_ID = ${authId}`;

    const [rows] = await conn.query(sql);
    // return rows[0];
    return rows;
  },
  "getAuth"
);

export const getAuths = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection) => {
    const sql =
      ` SELECT` +
      `     A.AUTH_ID` +
      `   , A.AUTH_NAME` +
      `   , A.EXPLANATION` +
      `   , GET_DATE_FORMAT(A.UPDATED_AT) AS UPDATED_AT` +
      `   , GET_USER_NAME(A.UPDATED_USER) AS UPDATED_USER` +
      `   , L.POST` +
      `   , L.COMMENT` +
      `   , L.VISIT` +
      `   , L.PERIOD` +
      `   , L.TYPE` +
      `   FROM auth A` +
      `  INNER JOIN auth_level_condition L` +
      `     ON A.AUTH_ID = L.AUTH_ID` +
      `  ORDER BY AUTH_ID`;

    const [rows] = await conn.query(sql);
    return rows;
  },
  "getAuths"
);

export const updatedAuth = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryAuth: Array<AuthLevelCondition> = req.body.auth;
    const adminUserId = req.session.user!.USER_ID;

    try {
      await conn.beginTransaction();

      let sql;
      aryAuth.forEach(async (auth) => {
        const authId = auth.authId;
        const authName = auth.authName;
        const explanation = auth.explanation;
        const type = auth.type;

        sql =
          `UPDATE auth` +
          `   SET AUTH_NAME    = '${authName}'` +
          `     , EXPLANATION  = '${explanation}'` +
          `     , UPDATED_AT   = now()` +
          `     , UPDATED_USER = '${adminUserId}'` +
          ` WHERE AUTH_ID      =  ${authId}`;

        await conn.query(sql);

        if (type !== "NONE") {
          const post = auth.post;
          const comment = auth.comment;
          const visit = auth.visit;
          const period = auth.period;

          sql =
            `UPDATE auth_level_condition` +
            `   SET POST         = ${post}` +
            `     , COMMENT      = ${comment}` +
            `     , VISIT        = ${visit}` +
            `     , PERIOD       = ${period}` +
            `     , TYPE         = '${type}'` +
            `     , UPDATED_AT   = now()` +
            `     , UPDATED_USER = '${adminUserId}'` +
            ` WHERE AUTH_ID      =  ${authId}`;

          await conn.query(sql);
        }
      });

      await conn.commit();
      return aryAuth.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "updatedAuth"
);

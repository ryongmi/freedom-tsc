import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";
import { Auth, AuthLevelCondition } from "../interface/auth";

export const getAuth = tyrCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, authId: number) => {
    const sql = `SELECT * FROM auth WHERE AUTH_ID = ${authId}`;
    // `    AND USE_FLAG = 'Y'` +
    // `    AND DELETED_AT IS NULL`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "getAuth"
);

export const getAuths = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);
    const authName: string = req.query.authName?.toString() ?? "";
    const useFlag: string = req.query.useFlag?.toString() ?? "ALL";

    let sql: string =
      ` SELECT` +
      `     AUTH_ID AS 'key'` +
      `   , AUTH_ID AS authId` +
      `   , AUTH_NAME AS authName` +
      `   , EXPLANATION AS explanation` +
      `   , TYPE AS type` +
      `   , USE_FLAG AS useFlag` +
      `   , GET_DATE_FORMAT(CREATED_AT) AS createdAt` +
      `   , GET_USER_NAME(CREATED_USER) AS createdUser` +
      `   , GET_DATE_FORMAT(UPDATED_AT) AS updatedAt` +
      `   , GET_USER_NAME(UPDATED_USER) AS updatedUser` +
      `   , 'S' AS status` +
      `   FROM auth` +
      `  WHERE ADMIN_FLAG = 'N'` +
      `    AND DELETED_AT IS NULL`;

    if (authName !== "") {
      sql += ` AND AUTH_NAME LIKE '%${authName}%'`;
    }

    if (useFlag !== "ALL") {
      sql += ` AND USE_FLAG = '${useFlag}'`;
    }

    sql +=
      `  ORDER BY AUTH_ID` +
      `  LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getAuths"
);

export const updatedAuth = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryAuth: Array<Auth> = req.body.auth;
    // const adminUserId = req.session.user!.userId;
    const adminUserId = 13432423;

    try {
      await conn.beginTransaction();

      aryAuth.forEach(async (auth) => {
        const authId = auth.authId;
        const authName = auth.authName;
        const explanation = auth.explanation;
        const type = auth.type;
        const useFlag = auth.useFlag;

        const sql: string =
          `INSERT INTO auth` +
          `(` +
          `   AUTH_ID` +
          ` , AUTH_NAME` +
          ` , EXPLANATION` +
          ` , TYPE` +
          ` , USE_FLAG` +
          ` , CREATED_USER` +
          `)` +
          `VALUES` +
          `(` +
          `    ${authId}` +
          ` , '${authName}'` +
          ` , '${explanation}'` +
          ` , '${type}'` +
          ` , '${useFlag}'` +
          ` ,  ${adminUserId}` +
          `)` +
          `ON DUPLICATE KEY UPDATE` +
          `   AUTH_NAME    = '${authName}'` +
          ` , EXPLANATION  = '${explanation}'` +
          ` , TYPE         = '${type}'` +
          ` , USE_FLAG     = '${useFlag}'` +
          ` , UPDATED_AT   =  now()` +
          ` , UPDATED_USER =  ${adminUserId}`;

        await conn.query(sql);
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

export const deletedAuth = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryAuth: Array<{ authId: number }> = req.body.auth;
    // const adminUserId: number = req.session.user!.userId;
    const adminUserId: number = 423412;

    try {
      await conn.beginTransaction();
      let sql: string;
      aryAuth.forEach(async (auth) => {
        const authId = auth.authId;
        sql = `UPDATE auth SET DELETED_AT = now(), DELETED_USER = ${adminUserId} WHERE AUTH_ID = ${authId}`;

        await conn.query(sql);

        // sql = `UPDATE auth_level_condition SET DELETED_AT = now(), DELETED_USER = ${adminUserId} WHERE AUTH_ID = ${authId}`;

        // await conn.query(sql);
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
  "deletedAuth"
);

export const getAuthLevelCondition = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);
    const authName: string = req.query.authName?.toString() ?? "";

    let sql: string =
      ` SELECT` +
      `     A.AUTH_ID AS 'key'` +
      `   , A.AUTH_ID AS authId` +
      `   , A.AUTH_NAME AS authName` +
      `   , IFNULL(AL.POST, 0) AS post` +
      `   , IFNULL(AL.COMMENT, 0) AS comment` +
      `   , IFNULL(AL.VISIT, 0) AS visit` +
      `   , IFNULL(AL.PERIOD, 0) AS period` +
      `   , GET_DATE_FORMAT(AL.UPDATED_AT) AS updatedAt` +
      `   , GET_USER_NAME(AL.UPDATED_USER) AS updatedUser` +
      `   , 'S' AS status` +
      `   FROM auth A` +
      `   LEFT JOIN auth_level_condition AL` +
      `     ON A.AUTH_ID = AL.AUTH_ID` +
      `  WHERE A.USE_FLAG = 'Y'` +
      `    AND A.ADMIN_FLAG = 'N'` +
      `    AND A.TYPE != 'NONE'` +
      `    AND A.DELETED_AT IS NULL`;

    if (authName !== "") {
      sql += ` AND A.AUTH_NAME LIKE '%${authName}%'`;
    }

    sql +=
      `  ORDER BY A.AUTH_ID` +
      `  LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query(sql);
    return rows;
  },
  "getAuthLevelCondition"
);

export const updatedAuthLevelCondition = tyrCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryAuth: Array<AuthLevelCondition> = req.body.auth;
    // const adminUserId = req.session.user!.userId;
    const adminUserId = 132132;

    try {
      await conn.beginTransaction();

      aryAuth.forEach(async (auth) => {
        const authId = auth.authId;
        const post = auth.post;
        const comment = auth.comment;
        const visit = auth.visit;
        const period = auth.period;

        const sql: string =
          `INSERT INTO auth_level_condition` +
          `(` +
          `   AUTH_ID` +
          ` , POST` +
          ` , COMMENT` +
          ` , VISIT` +
          ` , PERIOD` +
          ` , UPDATED_AT` +
          ` , UPDATED_USER` +
          `)` +
          `VALUES` +
          `(` +
          `    ${authId}` +
          ` ,  ${post}` +
          ` ,  ${comment}` +
          ` ,  ${visit}` +
          ` ,  ${period}` +
          ` ,  now()` +
          ` ,  ${adminUserId}` +
          `)` +
          `ON DUPLICATE KEY UPDATE` +
          `   POST         =  ${post}` +
          ` , COMMENT      =  ${comment}` +
          ` , VISIT        =  ${visit}` +
          ` , PERIOD       =  ${period}` +
          ` , UPDATED_AT   =  now()` +
          ` , UPDATED_USER =  ${adminUserId}`;

        await conn.query(sql);
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
  "updatedAuthLevelCondition"
);

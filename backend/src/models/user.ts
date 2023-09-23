import { Request } from "express";
import * as db from "../util/database";
import mysql from "mysql2/promise";
import { tyrCatchModelHandler } from "../middleware/try-catch";
import { User, WarnUser, BanUser } from "../interface/user";

let conn: mysql.PoolConnection;

export const getUser = tyrCatchModelHandler(
  async (_: Request, userId: string) => {
    const sql =
      ` SELECT` +
      `     USER_ID` +
      `   , USER_LOGIN_ID` +
      `   , DISPLAY_NAME` +
      `   , AUTH_ID` +
      `   , COM.NAME AS BROADCASTER_TYPE` +
      `   , (SELECT IF(COUNT(B.BAN_ID) > 0, 'Y' ,'N') FROM ban B WHERE U.USER_ID = B.USER_ID AND B.UN_BAN_AT IS NULL) AS BAN_YN` +
      `   FROM user U` +
      `   INNER JOIN comcd COM` +
      `      ON COM.COM_ID = "BROADCASTER_TYPE"` +
      `     AND COM.VALUE = U.BROADCASTER_TYPE` +
      `   WHERE U.USER_ID = '${userId}'`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0];
    return rows;
  },
  "getUser",
  conn!
);

export const getUsers = tyrCatchModelHandler(
  async (req: Request) => {
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    const userAuthId = req.query.userAuthId;
    let currentPage: number = 1;
    let perPage: number = 15;

    if (req.query.page && typeof req.query.page === "number")
      currentPage = req.query.page;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    let sql =
      ` SELECT` +
      `     U.USER_ID` +
      `   , U.USER_LOGIN_ID` +
      `   , GET_USER_NAME_FORMAT(U.DISPLAY_NAME, U.USER_LOGIN_ID) AS USER_NAME` +
      `   , U.AUTH_ID` +
      `   , COM1.NAME AS TWITCH_TYPE` +
      `   , COM2.NAME AS BROADCASTER_TYPE` +
      `   , GET_DATE_FORMAT(U.CREATED_AT) AS CREATED_AT` +
      `   , GET_DATE_FORMAT(U.LAST_LOGIN_AT) AS LAST_LOGIN_AT` +
      `   , U.VISIT` +
      `   , GET_POST_COUNT(U.USER_ID) AS POST` +
      `   , GET_COMMENT_COUNT(U.USER_ID) AS COMMENT` +
      `   , GET_DATE_FORMAT(U.UPDATED_AT) AS UPDATED_AT` +
      `   , GET_USER_NAME(U.UPDATED_USER) AS UPDATED_USER` +
      `   , GET_USER_STATUS(U.USER_ID) AS USER_STATUS` +
      `   FROM user U` +
      `  INNER JOIN comcd COM1` +
      `     ON COM1.COM_ID = "TWITCH_TYPE"` +
      `    AND COM1.VALUE  = U.TWITCH_TYPE` +
      `  INNER JOIN comcd COM2` +
      `     ON COM2.COM_ID = "BROADCASTER_TYPE"` +
      `    AND COM2.VALUE  = U.BROADCASTER_TYPE` +
      `  WHERE 1=1`;

    if (userAuthId) {
      sql += ` AND U.AUTH_ID = ${userAuthId}`;
    }

    if (userOption === "ID")
      sql += ` AND U.USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
    else if (userOption === "NAME")
      sql += ` AND U.DISPLAY_NAME LIKE '%${userOptionValue}%'`;

    sql += `  ORDER BY CREATED_AT`;

    sql += ` LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0];
    return rows;
  },
  "getUsers",
  conn!
);

export const createdUser = tyrCatchModelHandler(
  async (_: Request, user: User) => {
    const userId = user.id;
    const userLoginId = user.login;
    const displayName = user.display_name;
    const eamil = user.eamil;
    const twitchType = user.type;
    const broadcasterType = user.broadcaster_type;

    const sql =
      `INSERT INTO user` +
      `(` +
      `   USER_ID` +
      ` , USER_LOGIN_ID` +
      ` , DISPLAY_NAME` +
      ` , TWITCH_TYPE` +
      ` , BROADCASTER_TYPE` +
      ` , EMAIL` +
      `)` +
      `VALUES` +
      `(` +
      `   '${userId}'` +
      ` , '${userLoginId}'` +
      ` , '${displayName}'` +
      ` , '${twitchType}'` +
      ` , '${broadcasterType}'` +
      ` ,  ${eamil}` +
      `)` +
      `ON DUPLICATE KEY UPDATE` +
      `   DISPLAY_NAME     = '${displayName}'` +
      ` , TWITCH_TYPE      = '${twitchType}'` +
      ` , BROADCASTER_TYPE = '${broadcasterType}'` +
      ` , EMAIL            = '${eamil}'` +
      ` , LAST_LOGIN_AT    =  now()`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0];
    return rows;
  },
  "createdUser",
  conn!
);

export const updatedUser = tyrCatchModelHandler(
  async (req: Request) => {
    const aryUser: Array<User> = req.body.user;
    const adminUserId = req.session.user!.USER_ID;

    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      aryUser.forEach(async (user) => {
        const userId = user.userId;
        const authId = user.authId;

        const sql =
          `UPDATE user` +
          `   SET AUTH_ID      = ${authId}` +
          `     , UPDATED_AT   = now()` +
          `     , UPDATED_USER = '${adminUserId}'` +
          ` WHERE USER_ID = '${userId}'`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryUser.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "updatedUser",
  conn!
);

export const getWarn = tyrCatchModelHandler(
  async (_: Request, wranId: number) => {
    const sql =
      ` SELECT` +
      `     COUNT(WARN_ID) AS WARN_COUNT` +
      `   FROM warn` +
      `  WHERE WARN_ID = ${wranId}`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].WARN_COUNT;
    return rows;
  },
  "getWarn",
  conn!
);

export const getWarnUsers = tyrCatchModelHandler(
  async (req: Request) => {
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    let currentPage: number = 1;
    let perPage: number = 15;

    if (req.query.page && typeof req.query.page === "number")
      currentPage = req.query.page;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    let sql =
      ` SELECT` +
      `     R.USER_ID` +
      `   , R.USER_NAME` +
      `   , R.AUTH_NAME` +
      `   , R.TWITCH_TYPE` +
      `   , R.BROADCASTER_TYPE` +
      `   , R.WARN_COUNT` +
      `   , GET_DATE_FORMAT(R.CREATED_AT) AS CREATED_AT` +
      `   , GET_USER_NAME(W.CREATED_USER) AS CREATED_USER` +
      `   FROM (` +
      `     SELECT` +
      `         W.USER_ID` +
      `       , GET_USER_NAME_FORMAT(U.DISPLAY_NAME, U.USER_LOGIN_ID) AS USER_NAME` +
      `       , A.AUTH_NAME` +
      `       , COM1.NAME AS TWITCH_TYPE` +
      `       , COM2.NAME AS BROADCASTER_TYPE` +
      `       , GET_WARN_COUNT(W.USER_ID) AS WARN_COUNT` +
      `       , MAX(W.CREATED_AT) AS CREATED_AT` +
      `       FROM warn W` +
      `      INNER JOIN user U` +
      `         ON W.USER_ID = U.USER_ID`;

    if (userOption === "ID")
      sql += ` AND U.USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
    else if (userOption === "NAME")
      sql += ` AND U.DISPLAY_NAME LIKE '%${userOptionValue}%'`;

    sql +=
      `      INNER JOIN auth A` +
      `         ON U.AUTH_ID = A.AUTH_ID` +
      `      INNER JOIN comcd COM1` +
      `         ON COM1.COM_ID = "TWITCH_TYPE"` +
      `        AND COM1.VALUE  = U.TWITCH_TYPE` +
      `      INNER JOIN comcd COM2` +
      `         ON COM2.COM_ID = "BROADCASTER_TYPE"` +
      `        AND COM2.VALUE  = U.BROADCASTER_TYPE` +
      `      WHERE W.UN_WARN_AT IS NULL` +
      `      GROUP BY W.USER_ID, USER_NAME, A.AUTH_NAME, TWITCH_TYPE, BROADCASTER_TYPE, WARN_COUNT` +
      `        ) R` +
      `   INNER JOIN warn W` +
      `      ON R.USER_ID    = W.USER_ID` +
      `     AND R.CREATED_AT = W.CREATED_AT` +
      `   ORDER BY CREATED_AT DESC` +
      `   LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getWarnUsers",
  conn!
);

export const getWarnContents = tyrCatchModelHandler(
  async (req: Request) => {
    const userId = req.params.userId;
    let currentPage: number = 1;
    let perPage: number = 15;

    if (req.query.page && typeof req.query.page === "number")
      currentPage = req.query.page;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    const sql =
      ` SELECT` +
      `     W.WARN_ID` +
      `   , W.USER_ID` +
      `   , GET_USER_NAME_FORMAT(U.DISPLAY_NAME, U.USER_LOGIN_ID) AS USER_NAME` +
      `   , W.POST_URL` +
      `   , W.WARN_REASON` +
      `   , GET_DATE_FORMAT(W.CREATED_AT) AS CREATED_AT` +
      `   , GET_USER_NAME(W.CREATED_USER) AS CREATED_USER` +
      `   , GET_DATE_FORMAT(W.UN_WARN_AT) AS UN_WARN_AT` +
      `   , GET_USER_NAME(W.UN_WARN_USER) AS UN_WARN_USER` +
      `   FROM warn W` +
      `   INNER JOIN user U` +
      `      ON W.USER_ID = U.USER_ID` +
      `   WHERE W.USER_ID = '${userId}'` +
      `   ORDER BY UN_WARN_AT, CREATED_AT DESC` +
      `   LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getWarnContents",
  conn!
);

export const getBan = tyrCatchModelHandler(
  async (_: Request, banId: number) => {
    const sql =
      ` SELECT` +
      `     COUNT(BAN_ID) AS BAN_COUNT` +
      `   FROM ban` +
      `  WHERE BAN_ID = ${banId}`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    // return rows[0].BAN_COUNT;
    return rows;
  },
  "getBan",
  conn!
);

export const getBanUsers = tyrCatchModelHandler(
  async (req: Request) => {
    const userOption = req.query.userOption;
    const userOptionValue = req.query.userOptionValue;
    let currentPage: number = 1;
    let perPage: number = 15;

    if (req.query.page && typeof req.query.page === "number")
      currentPage = req.query.page;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    let sql =
      ` SELECT` +
      `     R.USER_ID` +
      `   , R.USER_NAME` +
      `   , R.AUTH_NAME` +
      `   , R.TWITCH_TYPE` +
      `   , R.BROADCASTER_TYPE` +
      `   , R.BAN_COUNT` +
      `   , GET_DATE_FORMAT(R.CREATED_AT) AS CREATED_AT` +
      `   , GET_USER_NAME(B.CREATED_USER) AS CREATED_USER` +
      `   FROM (` +
      `     SELECT` +
      `         B.USER_ID` +
      `       , GET_USER_NAME_FORMAT(U.DISPLAY_NAME, U.USER_LOGIN_ID) AS USER_NAME` +
      `       , A.AUTH_NAME` +
      `       , COM1.NAME AS TWITCH_TYPE` +
      `       , COM2.NAME AS BROADCASTER_TYPE` +
      `       , GET_BAN_COUNT(B.USER_ID) AS BAN_COUNT` +
      `       , MAX(B.CREATED_AT) AS CREATED_AT` +
      `       FROM ban B` +
      `      INNER JOIN user U` +
      `         ON B.USER_ID = U.USER_ID`;

    if (userOption === "ID")
      sql += ` AND U.USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
    else if (userOption === "NAME")
      sql += ` AND U.DISPLAY_NAME LIKE '%${userOptionValue}%'`;

    sql +=
      `      INNER JOIN auth A` +
      `         ON U.AUTH_ID = A.AUTH_ID` +
      `      INNER JOIN comcd COM1` +
      `         ON COM1.COM_ID = "TWITCH_TYPE"` +
      `        AND COM1.VALUE  = U.TWITCH_TYPE` +
      `      INNER JOIN comcd COM2` +
      `         ON COM2.COM_ID = "BROADCASTER_TYPE"` +
      `        AND COM2.VALUE  = U.BROADCASTER_TYPE` +
      `      WHERE B.UN_BAN_AT IS NULL` +
      `      GROUP BY B.USER_ID, USER_NAME, A.AUTH_NAME, TWITCH_TYPE, BROADCASTER_TYPE, BAN_COUNT` +
      `        ) R` +
      `   INNER JOIN ban B` +
      `      ON R.USER_ID    = B.USER_ID` +
      `     AND R.CREATED_AT = B.CREATED_AT` +
      `   ORDER BY CREATED_AT DESC` +
      `   LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getBanUsers",
  conn!
);

export const getBanContents = tyrCatchModelHandler(
  async (req: Request) => {
    const userId = req.params.userId;
    let currentPage: number = 1;
    let perPage: number = 15;

    if (req.query.page && typeof req.query.page === "number")
      currentPage = req.query.page;
    if (req.query.perPage && typeof req.query.perPage === "number")
      perPage = req.query.perPage;

    const sql =
      ` SELECT` +
      `     B.BAN_ID` +
      `   , B.USER_ID` +
      `   , GET_USER_NAME_FORMAT(U.DISPLAY_NAME, U.USER_LOGIN_ID) AS USER_NAME` +
      `   , B.POST_URL` +
      `   , B.BAN_REASON` +
      `   , GET_DATE_FORMAT(B.CREATED_AT) AS CREATED_AT` +
      `   , GET_USER_NAME(B.CREATED_USER) AS CREATED_USER` +
      `   , GET_DATE_FORMAT(B.UN_BAN_AT) AS UN_BAN_AT` +
      `   , GET_USER_NAME(B.UN_BAN_USER) AS UN_BAN_USER` +
      `   FROM ban B` +
      `  INNER JOIN user U` +
      `     ON B.USER_ID = U.USER_ID` +
      `  WHERE B.USER_ID = '${userId}'` +
      `  ORDER BY UN_BAN_AT, CREATED_AT DESC` +
      `  LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
    return rows;
  },
  "getBanContents",
  conn!
);

export const createdWarnUser = tyrCatchModelHandler(
  async (req: Request) => {
    const aryUser: Array<WarnUser> = req.body.user;
    const adminUserId = req.session.user!.USER_ID;

    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      aryUser.forEach(async (user) => {
        const userId = user.userId;
        const postUrl = user.postUrl;
        const warnReason = user.warnReason;

        const sql =
          `INSERT INTO warn` +
          `(` +
          `     USER_ID` +
          `   , POST_URL` +
          `   , WARN_REASON` +
          `   , CREATED_USER` +
          `)` +
          `VALUES` +
          `(` +
          `     '${userId}'` +
          `   , '${postUrl}'` +
          `   , '${warnReason}'` +
          `   , '${adminUserId}'` +
          `)`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryUser.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "createdWarnUser",
  conn!
);

export const updatedUnWarnUser = tyrCatchModelHandler(
  async (req: Request) => {
    const aryWarn: Array<WarnUser> = req.body.warn;
    const adminUserId = req.session.user!.USER_ID;

    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      aryWarn.forEach(async (warn) => {
        const warnId = warn.warnId;

        const sql =
          `UPDATE warn` +
          `   SET UN_WARN_AT   = now()` +
          `     , UN_WARN_USER = '${adminUserId}'` +
          ` WHERE WARN_ID = '${warnId}'`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryWarn.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "updatedUnWarnUser",
  conn!
);

export const createdBanUser = tyrCatchModelHandler(
  async (req: Request) => {
    const aryUser: Array<BanUser> = req.body.user;
    const adminUserId = req.session.user!.USER_ID;

    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      aryUser.forEach(async (user) => {
        const userId = user.userId;
        const postUrl = user.postUrl;
        const banReason = user.banReason;

        const sql =
          `INSERT INTO ban` +
          `(` +
          `     USER_ID` +
          `   , POST_URL` +
          `   , BAN_REASON` +
          `   , CREATED_USER` +
          `)` +
          `VALUES` +
          `(` +
          `     '${userId}'` +
          `   , '${postUrl}'` +
          `   , '${banReason}'` +
          `   , '${adminUserId}'` +
          `)`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryUser.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "createdBanUser",
  conn!
);

export const updatedUnBanUser = tyrCatchModelHandler(
  async (req: Request) => {
    const aryBan: Array<BanUser> = req.body.ban;
    const adminUserId = req.session.user!.USER_ID;

    try {
      conn = await db.getConnection();
      await conn.beginTransaction();

      aryBan.forEach(async (ban) => {
        const banId = ban.banId;

        const sql =
          `UPDATE ban` +
          `   SET UN_BAN_AT   = now()` +
          `     , UN_BAN_USER = '${adminUserId}'` +
          ` WHERE BAN_ID = '${banId}'`;

        await conn.query(sql);
      });

      await conn.commit();
      return aryBan.length;
    } catch (error) {
      if (conn) {
        conn.rollback();
      }
      console.log(error);
      throw error;
    }
  },
  "updatedUnBanUser",
  conn!
);

import { Request } from "express";
import mysql, { RowDataPacket } from "mysql2/promise";
import { tryCatchModelHandler } from "../middleware/try-catch";
import { User, WarnUser, BanUser } from "../interface/user";

export const getUser = tryCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, userId: number) => {
    const sql =
      ` SELECT` +
      `     USER_ID AS userId` +
      `   , USER_LOGIN_ID AS userLoginId` +
      `   , DISPLAY_NAME AS displayName` +
      `   , U.AUTH_ID AS authId` +
      `   , A.ADMIN_FLAG AS adminFlag` +
      `   , COM.NAME AS broadcasterType` +
      `   , PROFILE_IMAGE_URL AS profileImgUrl` +
      `   , USER_STATUS AS userStatus` +
      `   FROM user U` +
      `   INNER JOIN comcd COM` +
      `      ON COM.COM_ID = "BROADCASTER_TYPE"` +
      `     AND COM.VALUE = U.BROADCASTER_TYPE` +
      `   INNER JOIN auth A` +
      `      ON U.AUTH_ID = A.AUTH_ID` +
      `   WHERE U.USER_ID = ${userId}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "getUser"
);

export const getUsers = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userOption: string = req.query.userOption?.toString() ?? "";
    const userOptionValue: string = req.query.userOptionValue?.toString() ?? "";
    const userAuthId: string = req.query.userAuthId?.toString() ?? "ALL";
    const userStatus: string = req.query.userStatus?.toString() ?? "ALL";
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);

    let sql =
      ` SELECT` +
      `     U.USER_ID AS 'key'` +
      `   , U.USER_ID AS userId` +
      `   , GET_USER_NAME_FORMAT(U.DISPLAY_NAME, U.USER_LOGIN_ID) AS userName` +
      `   , U.AUTH_ID AS authId` +
      `   , COM1.NAME AS twitchType` +
      `   , COM2.NAME AS broadcasterType` +
      `   , GET_DATE_FORMAT(U.CREATED_AT) AS createdAt` +
      `   , GET_DATE_FORMAT(U.LAST_LOGIN_AT) AS lastLoginAt` +
      `   , U.VISIT AS visit` +
      `   , GET_POST_COUNT(U.USER_ID) AS post` +
      `   , GET_COMMENT_COUNT(U.USER_ID) AS comment` +
      `   , GET_DATE_FORMAT(U.UPDATED_AT) AS updatedAt` +
      `   , GET_USER_NAME(U.UPDATED_USER) AS updatedUser` +
      `   , COM3.NAME AS userStatus` +
      `   , 'S' AS status` +
      `   FROM user U` +
      `  INNER JOIN comcd COM1` +
      `     ON COM1.COM_ID = "TWITCH_TYPE"` +
      `    AND COM1.VALUE  = U.TWITCH_TYPE` +
      `  INNER JOIN comcd COM2` +
      `     ON COM2.COM_ID = "BROADCASTER_TYPE"` +
      `    AND COM2.VALUE  = U.BROADCASTER_TYPE` +
      `  INNER JOIN comcd COM3` +
      `     ON COM3.COM_ID = "USER_STATUS"` +
      `    AND COM3.VALUE  = U.USER_STATUS` +
      `  WHERE 1=1`;

    if (userAuthId !== "ALL") {
      sql += ` AND U.AUTH_ID = ${userAuthId}`;
    }

    if (userStatus !== "ALL") {
      sql += ` AND U.USER_STATUS = '${userStatus}'`;
    }

    if (userOptionValue !== "") {
      if (userOption === "ID")
        sql += ` AND U.USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
      else if (userOption === "NAME")
        sql += ` AND U.DISPLAY_NAME LIKE '%${userOptionValue}%'`;
    }

    sql += `  ORDER BY U.CREATED_AT`;

    sql += ` LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows;
  },
  "getUsers"
);

export const createdUser = tryCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, user: User) => {
    const userId: number = Number(user.id);
    const userLoginId: string = user.login;
    const displayName: string = user.display_name ?? "";
    const email: string = user.email;
    const twitchType: string = user.type;
    const broadcasterType: string = user.broadcaster_type;
    const profileImageUrl: string = user.profile_image_url || "";

    const sql =
      `INSERT INTO user` +
      `(` +
      `   USER_ID` +
      ` , USER_LOGIN_ID` +
      ` , AUTH_ID` +
      ` , DISPLAY_NAME` +
      ` , TWITCH_TYPE` +
      ` , BROADCASTER_TYPE` +
      ` , PROFILE_IMAGE_URL` +
      ` , EMAIL` +
      `)` +
      `VALUES` +
      `(` +
      `    ${userId}` +
      ` , '${userLoginId}'` +
      ` , (SELECT MAX(AUTH_ID) FROM AUTH WHERE ADMIN_FLAG = 'N' AND USE_FLAG = 'Y' AND DELETED_AT IS NULL)` +
      ` , '${displayName}'` +
      ` , '${twitchType}'` +
      ` , '${broadcasterType}'` +
      ` , '${profileImageUrl}'` +
      ` , '${email}'` +
      `)` +
      `ON DUPLICATE KEY UPDATE` +
      `   DISPLAY_NAME      = '${displayName}'` +
      ` , TWITCH_TYPE       = '${twitchType}'` +
      ` , BROADCASTER_TYPE  = '${broadcasterType}'` +
      ` , PROFILE_IMAGE_URL = '${profileImageUrl}'` +
      ` , EMAIL             = '${email}'` +
      ` , VISIT             =  IF(DATE(NOW()) = DATE(LAST_LOGIN_AT), VISIT, VISIT + 1)` +
      ` , LAST_LOGIN_AT     =  now()`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0];
  },
  "createdUser"
);

export const updatedUser = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryUser: Array<User> = req.body.user;
    const adminUserId: number = req.session.user!.userId;

    try {
      await conn.beginTransaction();

      aryUser.forEach(async (user) => {
        const userId: number = user.userId;
        const authId: number = user.authId;

        const sql =
          `UPDATE user` +
          `   SET AUTH_ID      = ${authId}` +
          `     , UPDATED_AT   = now()` +
          `     , UPDATED_USER = ${adminUserId}` +
          ` WHERE USER_ID = ${userId}`;

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
  "updatedUser"
);

export const getWarn = tryCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, wranId: number) => {
    const sql =
      ` SELECT` +
      `     COUNT(WARN_ID) AS WARN_COUNT` +
      `   FROM warn` +
      `  WHERE WARN_ID = ${wranId}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].WARN_COUNT;
  },
  "getWarn"
);

export const getWarnUsers = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userOption: string = req.query.userOption?.toString() ?? "";
    const userOptionValue: string = req.query.userOptionValue?.toString() ?? "";
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);

    let sql =
      ` SELECT` +
      `     R.USER_ID AS 'key'` +
      `   , R.USER_ID AS userId` +
      `   , R.USER_NAME AS userName` +
      `   , R.AUTH_NAME AS authName` +
      `   , R.TWITCH_TYPE AS twitchType` +
      `   , R.BROADCASTER_TYPE AS broadcasterType` +
      `   , R.WARN_COUNT AS warnCount` +
      `   , GET_DATE_FORMAT(R.CREATED_AT) AS createdAt` +
      `   , GET_USER_NAME(W.CREATED_USER) AS createdUser` +
      `   FROM (` +
      `     SELECT` +
      `         U.USER_ID` +
      `       , GET_USER_NAME_FORMAT(U.DISPLAY_NAME, U.USER_LOGIN_ID) AS USER_NAME` +
      `       , A.AUTH_NAME` +
      `       , COM1.NAME AS TWITCH_TYPE` +
      `       , COM2.NAME AS BROADCASTER_TYPE` +
      `       , GET_WARN_COUNT(W.USER_ID) AS WARN_COUNT` +
      `       , MAX(W.CREATED_AT) AS CREATED_AT` +
      `       FROM user U` +
      `      INNER JOIN warn W` +
      `         ON U.USER_ID = W.USER_ID` +
      `        AND W.UN_WARN_AT IS NULL` +
      `      INNER JOIN auth A` +
      `         ON U.AUTH_ID = A.AUTH_ID` +
      `      INNER JOIN comcd COM1` +
      `         ON COM1.COM_ID = "TWITCH_TYPE"` +
      `        AND COM1.VALUE  = U.TWITCH_TYPE` +
      `      INNER JOIN comcd COM2` +
      `         ON COM2.COM_ID = "BROADCASTER_TYPE"` +
      `        AND COM2.VALUE  = U.BROADCASTER_TYPE` +
      `      WHERE U.USER_STATUS = 'W'`;

    if (userOptionValue !== "") {
      if (userOption === "ID")
        sql += ` AND U.USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
      else if (userOption === "NAME")
        sql += ` AND U.DISPLAY_NAME LIKE '%${userOptionValue}%'`;
    }

    sql +=
      `      GROUP BY U.USER_ID, USER_NAME, A.AUTH_NAME, TWITCH_TYPE, BROADCASTER_TYPE, WARN_COUNT` +
      `        ) R` +
      `   INNER JOIN warn W` +
      `      ON R.USER_ID    = W.USER_ID` +
      `     AND R.CREATED_AT = W.CREATED_AT` +
      `   GROUP BY R.USER_ID, USER_NAME, AUTH_NAME, TWITCH_TYPE, BROADCASTER_TYPE, WARN_COUNT, R.CREATED_AT, W.CREATED_USER` +
      `   ORDER BY R.CREATED_AT DESC` +
      `   LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query(sql);
    return rows;
  },
  "getWarnUsers"
);

export const getWarnContents = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userId: number = Number(req.params.userId);
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);

    const sql =
      ` SELECT` +
      `     W.WARN_ID AS 'key'` +
      `   , W.WARN_ID AS warnId` +
      `   , W.USER_ID AS userId` +
      `   , GET_USER_NAME_FORMAT(U.DISPLAY_NAME, U.USER_LOGIN_ID) AS userName` +
      `   , W.POST_URL AS postUrl` +
      `   , W.WARN_REASON AS warnReason` +
      `   , GET_DATE_FORMAT(W.CREATED_AT) AS createdAt` +
      `   , GET_USER_NAME(W.CREATED_USER) AS createdUser` +
      `   , GET_DATE_FORMAT(W.UN_WARN_AT) AS unWarnAt` +
      `   , GET_USER_NAME(W.UN_WARN_USER) AS unWarnUser` +
      `   FROM warn W` +
      `   INNER JOIN user U` +
      `      ON W.USER_ID = U.USER_ID` +
      `   WHERE W.USER_ID = ${userId}` +
      `   ORDER BY UN_WARN_AT, W.CREATED_AT DESC` +
      `   LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query(sql);
    return rows;
  },
  "getWarnContents"
);

export const getBan = tryCatchModelHandler(
  async (_: Request, conn: mysql.PoolConnection, banId: number) => {
    const sql =
      ` SELECT` +
      `     COUNT(BAN_ID) AS BAN_COUNT` +
      `   FROM ban` +
      `  WHERE BAN_ID = ${banId}`;

    const [rows] = await conn.query<RowDataPacket[]>(sql);
    return rows[0].BAN_COUNT;
  },
  "getBan"
);

export const getBanUsers = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userOption: string = req.query.userOption?.toString() ?? "";
    const userOptionValue: string = req.query.userOptionValue?.toString() ?? "";
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);

    let sql =
      ` SELECT` +
      `     R.USER_ID AS 'key'` +
      `   , R.USER_ID AS userId` +
      `   , R.USER_NAME AS userName` +
      `   , R.AUTH_NAME AS authName` +
      `   , R.TWITCH_TYPE AS twitchType` +
      `   , R.BROADCASTER_TYPE AS broadcasterType` +
      `   , R.BAN_COUNT AS banCount` +
      `   , GET_DATE_FORMAT(R.CREATED_AT) AS createdAt` +
      `   , GET_USER_NAME(B.CREATED_USER) AS createdUser` +
      `   FROM (` +
      `     SELECT` +
      `         B.USER_ID` +
      `       , GET_USER_NAME_FORMAT(U.DISPLAY_NAME, U.USER_LOGIN_ID) AS USER_NAME` +
      `       , A.AUTH_NAME` +
      `       , COM1.NAME AS TWITCH_TYPE` +
      `       , COM2.NAME AS BROADCASTER_TYPE` +
      `       , GET_BAN_COUNT(B.USER_ID) AS BAN_COUNT` +
      `       , MAX(B.CREATED_AT) AS CREATED_AT` +
      `       FROM user U` +
      `      INNER JOIN ban B` +
      `         ON U.USER_ID = B.USER_ID` +
      `        AND B.UN_BAN_AT IS NULL` +
      `      INNER JOIN auth A` +
      `         ON U.AUTH_ID = A.AUTH_ID` +
      `      INNER JOIN comcd COM1` +
      `         ON COM1.COM_ID = "TWITCH_TYPE"` +
      `        AND COM1.VALUE  = U.TWITCH_TYPE` +
      `      INNER JOIN comcd COM2` +
      `         ON COM2.COM_ID = "BROADCASTER_TYPE"` +
      `        AND COM2.VALUE  = U.BROADCASTER_TYPE` +
      `      WHERE U.USER_STATUS = 'B'`;

    if (userOptionValue !== "") {
      if (userOption === "ID")
        sql += ` AND U.USER_LOGIN_ID LIKE '%${userOptionValue}%'`;
      else if (userOption === "NAME")
        sql += ` AND U.DISPLAY_NAME LIKE '%${userOptionValue}%'`;
    }

    sql +=
      `      GROUP BY B.USER_ID, USER_NAME, A.AUTH_NAME, TWITCH_TYPE, BROADCASTER_TYPE, BAN_COUNT` +
      `        ) R` +
      `   INNER JOIN ban B` +
      `      ON R.USER_ID    = B.USER_ID` +
      `     AND R.CREATED_AT = B.CREATED_AT` +
      `   ORDER BY R.CREATED_AT DESC` +
      `   LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query(sql);
    return rows;
  },
  "getBanUsers"
);

export const getBanContents = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const userId: number = Number(req.params.userId);
    const currentPage: number = Number(req.query.page);
    const perPage: number = Number(req.query.perPage);

    const sql =
      ` SELECT` +
      `     B.BAN_ID AS 'key'` +
      `   , B.BAN_ID AS banId` +
      `   , B.USER_ID AS userId` +
      `   , GET_USER_NAME_FORMAT(U.DISPLAY_NAME, U.USER_LOGIN_ID) AS userName` +
      `   , B.POST_URL AS postUrl` +
      `   , B.BAN_REASON AS banReason` +
      `   , GET_DATE_FORMAT(B.CREATED_AT) AS createdAt` +
      `   , GET_USER_NAME(B.CREATED_USER) AS createdUser` +
      `   , GET_DATE_FORMAT(B.UN_BAN_AT) AS unBanAt` +
      `   , GET_USER_NAME(B.UN_BAN_USER) AS unBanUser` +
      `   FROM ban B` +
      `  INNER JOIN user U` +
      `     ON B.USER_ID = U.USER_ID` +
      `  WHERE B.USER_ID = ${userId}` +
      `  ORDER BY UN_BAN_AT, B.CREATED_AT DESC` +
      `  LIMIT ${(currentPage - 1) * perPage}, ${perPage}`;

    const [rows] = await conn.query(sql);
    return rows;
  },
  "getBanContents"
);

export const createdWarnUser = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryUser: Array<WarnUser> = req.body.user;
    const adminUserId: number = req.session.user!.userId;
    const postUrl: string = req.body.postUrl;
    const warnReason: string = req.body.warnReason;

    try {
      await conn.beginTransaction();

      let sql: string;
      aryUser.forEach(async (user) => {
        const userId: number = user.userId;

        sql =
          `INSERT INTO warn` +
          `(` +
          `     USER_ID` +
          `   , POST_URL` +
          `   , WARN_REASON` +
          `   , CREATED_USER` +
          `)` +
          `VALUES` +
          `(` +
          `      ${userId}` +
          `   , '${postUrl}'` +
          `   , '${warnReason}'` +
          `   ,  ${adminUserId}` +
          `)`;

        await conn.query(sql);

        sql =
          `UPDATE user` +
          `   SET UPDATED_AT   = now()` +
          `     , UPDATED_USER = ${adminUserId}` +
          `     , USER_STATUS  = IF(USER_STATUS = 'B', 'B', 'W')` +
          ` WHERE USER_ID = ${userId}`;

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
  "createdWarnUser"
);

export const updatedUnWarnUser = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryWarn: Array<WarnUser> = req.body.warn;
    const userId: number = Number(req.body.userId);
    const adminUserId: number = req.session.user!.userId;

    try {
      await conn.beginTransaction();
      let sql: string;
      aryWarn.forEach(async (warn) => {
        const warnId: number = warn.warnId;

        sql =
          `UPDATE warn` +
          `   SET UN_WARN_AT   = now()` +
          `     , UN_WARN_USER = ${adminUserId}` +
          ` WHERE WARN_ID = ${warnId}`;

        await conn.query(sql);
      });

      sql = `CALL PROC_SET_WARN_USER_STATUS(${userId}, ${adminUserId})`;

      await conn.query(sql);

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
  "updatedUnWarnUser"
);

export const createdBanUser = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryUser: Array<BanUser> = req.body.user;
    const adminUserId: number = req.session.user!.userId;
    const postUrl: string = req.body.postUrl;
    const banReason: string = req.body.banReason;

    try {
      await conn.beginTransaction();

      let sql: string;
      aryUser.forEach(async (user) => {
        const userId: number = user.userId;

        sql =
          `INSERT INTO ban` +
          `(` +
          `     USER_ID` +
          `   , POST_URL` +
          `   , BAN_REASON` +
          `   , CREATED_USER` +
          `)` +
          `VALUES` +
          `(` +
          `      ${userId}` +
          `   , '${postUrl}'` +
          `   , '${banReason}'` +
          `   ,  ${adminUserId}` +
          `)`;

        await conn.query(sql);

        sql =
          `UPDATE user` +
          `   SET UPDATED_AT   = now()` +
          `     , UPDATED_USER = ${adminUserId}` +
          `     , USER_STATUS  = 'B'` +
          ` WHERE USER_ID = ${userId}`;

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
  "createdBanUser"
);

export const updatedUnBanUser = tryCatchModelHandler(
  async (req: Request, conn: mysql.PoolConnection) => {
    const aryBan: Array<BanUser> = req.body.ban;
    const adminUserId: number = req.session.user!.userId;
    const userId: number = Number(req.body.userId);

    try {
      await conn.beginTransaction();

      let sql: string;
      aryBan.forEach(async (ban) => {
        const banId = ban.banId;

        sql =
          `UPDATE ban` +
          `   SET UN_BAN_AT   = now()` +
          `     , UN_BAN_USER = ${adminUserId}` +
          ` WHERE BAN_ID = ${banId}`;

        await conn.query(sql);
      });

      sql = `CALL PROC_SET_BAN_USER_STATUS(${userId}, ${adminUserId})`;

      await conn.query(sql);

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
  "updatedUnBanUser"
);

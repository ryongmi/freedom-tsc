import { Request } from "express";
import mysql from "mysql2";
import * as db from "./database";

export const setErrorLog = async (
  req: Request,
  err: mysql.QueryError,
  apiName: string
) => {
  const error = {
    code: err.code,
    errno: err.errno,
    message: err.message,
    apiName: apiName,
    sql: err.sql,
    isLoggedIn: req.session.isLoggedIn ? 1 : 0,
    userId: req.session.user ? req.session.user.USER_ID : null,
    auth: req.session.user ? req.session.user.AUTH : null,
  };

  const sql = `INSERT INTO error_log
              (
                  ERROR_CODE
                , ERROR_NO
                , ERROR_MSG
                , SQL
                , API_NAME
                , IS_LOGGED_IN
                , USER_ID
                , AUTH
              ) 
              VALUE
              (
                  '${error.code}'
                , '${error.errno}'
                , '${error.message}'
                , '${error.sql}'
                , '${error.apiName}'
                , '${error.isLoggedIn}'
                , '${error.userId}'
                , '${error.auth}'
              ) `;

  let conn = null;
  try {
    conn = await db.getConnection();
    const [rows] = await conn!.query(sql);
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) await db.releaseConnection(conn);
    throw error;
  }
};

export const setCrudLog = async (
  req: Request,
  err: mysql.QueryError,
  apiName: string
) => {
  const crud = {
    sql: err.sql,
    menuId: err.code,
    menuName: err.errno,
    apiName: apiName,
    isLoggedIn: req.session.isLoggedIn ? 1 : 0,
    userId: req.session.user ? req.session.user.USER_ID : null,
    auth: req.session.user ? req.session.user.AUTH : null,
  };

  const sql = `INSERT INTO crud_log
              (
                  ERROR_CODE
                , ERROR_NO
                , ERROR_MSG
                , SQL
                , API_NAME
                , IS_LOGGED_IN
                , USER_ID
                , AUTH
              ) 
              VALUE
              (
                  '${crud.code}'
                , '${crud.errno}'
                , '${crud.message}'
                , '${crud.sql}'
                , '${crud.apiName}'
                , '${crud.isLoggedIn}'
                , '${crud.userId}'
                , '${crud.auth}'
              ) `;

  try {
    const [rows] = await db.query(sql);
  } catch (error) {
    console.log(error);
  } finally {
    throw error;
  }
};

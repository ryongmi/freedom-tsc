import { Request } from "express";
import * as db from "./database";
import IError from "../interface/error";

export const setErrorLog = async (
  req: Request,
  err: IError,
  apiName: string
) => {
  const error = {
    code: err.code,
    errno: err.errno,
    message: err.message.replace(/'/g, "`"), // 메시지 안에 ' 표시가 생겨 sql 에러가 발생하여, 전부 `로 치환함
    apiName: apiName,
    sql: err.sql?.replace(/'/g, "`"),
    isLoggedIn: req.session.isLoggedIn ? "Login" : "Logout",
    userId: req.session.user ? req.session.user.userId : null,
    auth: req.session.user ? req.session.user.userId : null,
  };

  const sql = `INSERT INTO error_log
              (
                  ERROR_CODE
                , ERROR_NO
                , ERROR_MSG
                , ERROR_SQL
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
                ,  ${error.userId}
                ,  ${error.auth}
              ) `;
  console.log(sql);
  let conn = null;
  try {
    conn = await db.getConnection();
    const [rows] = await conn.query(sql);
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) await db.releaseConnection(conn);
    throw error;
  }
};

// export const setCrudLog = async (
//   req: Request,
//   err: IError,
//   apiName: string
// ) => {
//   const crud = {
//     sql: err.sql,
//     menuId: err.code,
//     menuName: err.errno,
//     apiName: apiName,
//     isLoggedIn: req.session.isLoggedIn ? 1 : 0,
//     userId: req.session.user ? req.session.user.USER_ID : null,
//     auth: req.session.user ? req.session.user.AUTH_ID : null,
//   };

//   const sql = `INSERT INTO crud_log
//               (
//                   ERROR_CODE
//                 , ERROR_NO
//                 , ERROR_MSG
//                 , SQL
//                 , API_NAME
//                 , IS_LOGGED_IN
//                 , USER_ID
//                 , AUTH
//               )
//               VALUE
//               (
//                   '${crud.code}'
//                 , '${crud.errno}'
//                 , '${crud.message}'
//                 , '${crud.sql}'
//                 , '${crud.apiName}'
//                 , '${crud.isLoggedIn}'
//                 , '${crud.userId}'
//                 , '${crud.auth}'
//               ) `;

//   let conn = null;
//   try {
//     conn = await db.getConnection();
//     const [rows] = await conn.query(sql);
//   } catch (error) {
//     console.log(error);
//   } finally {
//     if (conn) await db.releaseConnection(conn);
//     throw error;
//   }
// };

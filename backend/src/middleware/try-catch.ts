import { Request, Response, NextFunction } from "express";
import * as db from "../util/database";
import * as log from "../util/log";
import IError from "../interface/error";
import mysql from "mysql2/promise";

export const tyrCatchModelHandler = (
  handler: Function,
  apiName: string,
  conn: mysql.PoolConnection
) => {
  return async (
    req: Request,
    param1?: string | number,
    param2?: string | number
  ) => {
    try {
      // return await handler(req, param1, param2);
      const result = await handler(req, param1, param2);
      console.log("tyrCatchModelHandler: " + result);
      return result;
    } catch (error: IError | any) {
      console.log(error);
      throw log.setErrorLog(req, error, apiName);
    } finally {
      if (conn) await db.releaseConnection(conn);
    }
  };
};

export const tyrCatchControllerHandler = (handler: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

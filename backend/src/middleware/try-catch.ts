import { Request, Response, NextFunction } from "express";
import * as db from "../util/database";
import * as log from "../util/log";
import IError from "../interface/error";

export const tryCatchModelHandler = (handler: Function, apiName: string) => {
  return async (
    req: Request,
    param1?: string | number,
    param2?: string | number
  ) => {
    const conn = await db.getConnection();
    try {
      const result = await handler(req, conn, param1, param2);
      return result;
    } catch (error: IError | any) {
      console.log(error);
      await log.setErrorLog(req, error, apiName);
    } finally {
      if (conn) await db.releaseConnection(conn);
    }
  };
};

export const tryCatchControllerHandler = (handler: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

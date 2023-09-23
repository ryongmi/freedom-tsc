import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  //connectionLimit: 4 최대 연결수 제한
});

export const getConnection = async (): Promise<mysql.PoolConnection> => {
  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`connection error : ${error}`);
      throw error;
    } else {
      const err = new Error("connection error");
      throw err;
    }
  }
};

export const releaseConnection = async (conn: mysql.PoolConnection) => {
  try {
    await conn.release();
  } catch (error) {
    if (error instanceof Error)
      console.error(`release error : ${error.message}`);
    throw error;
  }
};

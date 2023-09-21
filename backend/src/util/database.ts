import mysql from "mysql2/promise";

// const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  //connectionLimit: 4 최대 연결수 제한
});

export const getConnection = async () => {
  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    console.error(`connection error : ${message}`);
    return null;
  }
};

export const releaseConnection = async (conn: mysql.PoolConnection) => {
  try {
    await conn.release();
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    console.error(`release error : ${message}`);
  }
};

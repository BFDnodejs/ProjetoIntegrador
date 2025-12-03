import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { PORT, NODE_ENV, DB_HOST, DB_USER, DB_NAME, DB_PASS } = process.env;

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "Z",
});

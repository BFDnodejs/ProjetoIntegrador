import dotenv from "dotenv";
import app from "./App";
import { pool } from "./adapters/config/config";

dotenv.config({path: "../../../.env"});

const { PORT, NODE_ENV } = process.env;

app.listen(PORT, async () => {
  try {
    await pool.getConnection();
    console.log(`Server running in ${NODE_ENV} ✅ mode on port ${PORT}🚀`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
});
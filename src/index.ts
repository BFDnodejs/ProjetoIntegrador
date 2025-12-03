import dotenv from "dotenv";
import app from "./App";

dotenv.config();

const { PORT, NODE_ENV } = process.env;

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} ✅ mode on port ${PORT}🚀`);
});

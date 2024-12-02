import { defineConfig } from "drizzle-kit";

const host = process.env.POSTGRES_HOST;
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const database = process.env.POSTGRES_DB;
if (!host || !user || !password || !database) {
  throw new Error("Missing required environment variables for PostgreSQL");
}

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    host,
    user,
    password,
    database,
    ssl: false,
  },
  schema: "./src/db/models",
});

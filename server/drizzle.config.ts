import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config(); // Load environment variables

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Ensure you have this in your .env file
  },
} satisfies Config;

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode!");
  config({ path: ".prod.env" });
} else {
  console.log("Running in development mode!");
  config({ path: ".env" });
}

const { DATABASE_URL } = process.env;
const databaseUrl = drizzle(
  postgres(DATABASE_URL!, { ssl: "require", max: 1 })
);

const main = async () => {
  try {
    await migrate(databaseUrl, { migrationsFolder: "./drizzle" });
    console.log("Migration successful!");
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
};

main();

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import express, { Request, Response } from "express";
import { Pool } from "pg";
import { products } from "./db/schema";

const router = express.Router();

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_PowvRna3LF6g@ep-fancy-poetry-a8ze3ol7-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});
const db = drizzle(pool);

const handleQueryError = (err: any, res: Response) => {
  console.error("Error executing query:", err);
  res.status(500).json({ error: "Internal server error" });
};

router.get("/products", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(products);
    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// GET A SINGLE PRODUCT

router.get("/product/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rows = await db.select().from(products).where(eq(products.id, +id));
    // if (rows.length === 0) {
    //   return res.json({ error: "Product not found" });
    // }
    res.json(rows[0]);
  } catch (err) {
    handleQueryError(err, res);
  }
});

export default router;

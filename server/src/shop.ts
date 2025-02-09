import { error } from "console";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import express, { Request, Response } from "express";
import { Pool } from "pg";
import { order_items, OrderItem, orders, products } from "./db/schema";

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

router.get(
  "/product/:id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const rows = await db.select().from(products).where(eq(products.id, +id));
      if (rows.length === 0) {
        return res.json({ error: "Product not found" });
      } else {
        res.json(rows[0]);
      }
    } catch (err) {
      handleQueryError(err, res);
    }
  }
);

// CREATE A NEW ORDER
router.post("/order", async (req: Request, res: Response) => {
  try {
    const { email, products: orderBody } = req.body;

    const order = await db.transaction(async (trx) => {
      const [newOrder] = await trx
        .insert(orders)
        .values({ customer_email: email })
        .returning();

      const productPrices = await Promise.all(
        orderBody.map(async (orderItem: any) => {
          const [res] = await db
            .select()
            .from(products)
            .where(eq(products.id, +orderItem.product_id));

          return res.product_price;
        })
      );

      const orderProducts = await Promise.all(
        orderBody.map(async (orderItem: any, index: number) => {
          const total = (+productPrices[index] * +orderItem.quantity).toFixed(
            2
          );
          const [orderProduct] = await trx
            .insert(order_items)
            .values({
              order_id: newOrder.id,
              product_id: orderItem.product_id,
              quantity: orderItem.quantity,
              total: +total,
            })
            .returning();
          return orderProduct;
        })
      );

      // UPDATE THE TOTAL PRICE OF THE ORDER
      const total = orderProducts.reduce((acc: number, curr: OrderItem) => {
        return acc + curr?.total;
      }, 0);

      const [updatedOrder] = await trx
        .update(orders)
        .set({ total: total.toFixed(2) })
        .where(eq(orders.id, newOrder.id))
        .returning();

      return { ...updatedOrder, products: orderProducts };
    });

    res.json(order);
  } catch (err) {
    console.log(error);
    handleQueryError(err, res);
  }
});

export default router;

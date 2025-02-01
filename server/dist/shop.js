"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const schema_1 = require("./db/schema");
const router = express_1.default.Router();
const pool = new pg_1.Pool({
    connectionString: "postgresql://neondb_owner:npg_PowvRna3LF6g@ep-fancy-poetry-a8ze3ol7-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
    ssl: { rejectUnauthorized: false },
});
const db = (0, node_postgres_1.drizzle)(pool);
const handleQueryError = (err, res) => {
    console.error("Error executing query:", err);
    res.status(500).json({ error: "Internal server error" });
};
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield db.select().from(schema_1.products);
        res.json(rows);
    }
    catch (err) {
        handleQueryError(err, res);
    }
}));
// GET A SINGLE PRODUCT
router.get("/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rows = yield db.select().from(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, +id));
        if (rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(rows[0]);
    }
    catch (err) {
        handleQueryError(err, res);
    }
}));
exports.default = router;

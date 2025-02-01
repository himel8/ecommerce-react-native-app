"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const shop_1 = __importDefault(require("./shop"));
if (process.env.NODE_ENV === "production") {
    console.log("Running in production mode!");
    (0, dotenv_1.config)({ path: ".prod.env" });
}
else {
    console.log("Running in development mode!");
    (0, dotenv_1.config)({ path: ".env" });
}
const { PORT } = process.env;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(shop_1.default);
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

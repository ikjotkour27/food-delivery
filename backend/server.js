import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
const app = express();
const port = process.env.PORT || 4000;

/* ✅ CORS — USE ONLY ONCE */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://food-delivery-admin.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

/* ✅ Preflight */
app.options("*", cors());

/* ✅ Middlewares */
app.use(express.json());

/* ✅ DB */
connectDB();

/* ✅ Routes */
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});

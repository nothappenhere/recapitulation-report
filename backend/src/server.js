import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import hargaTiketRoutes from "./routes/hargaTiketRoutes.js";
import stokTiketRoutes from "./routes/stokTiketRoutes.js";
import kodeTiketRoutes from "./routes/kodeTiketRoutes.js";
import penjualanTiketRoutes from "./routes/penjualanTiketRoutes.js";

dotenv.config();
const app = express();

//* Middleware global
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/harga-tiket", hargaTiketRoutes);
app.use("/api/stok-tiket", stokTiketRoutes);
app.use("/api/kode-tiket", kodeTiketRoutes);
app.use("/api/penjualan-tiket", penjualanTiketRoutes);

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});

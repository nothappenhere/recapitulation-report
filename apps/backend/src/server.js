import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/AuthRoutes.js";
import ticketPriceRoutes from "./routes/ticketPriceRoutes.js";
import visitHourRoutes from "./routes/visitHourRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";
import reservationRoutes from "./routes/ReservationRoutes.js";
import WalkinRoutes from "./routes/WalkinRoutes.js";
import calendarEventRoutes from "./routes/calendarEventRoutes.js";

// import stokTiketRoutes from "./routes/stokTiketRoutes.js";
// import kodeTiketRoutes from "./routes/kodeTiketRoutes.js";
// import penjualanTiketRoutes from "./routes/penjualanTiketRoutes.js";
// import transaksiRoutes from "./routes/transaksiRoutes.js";
// import WeeklyReportRoutes from "./routes/weeklyReportRoutes.js";
// import reservationRoutes from "./routes/reservationRoutes.js";

//* Load environment variables
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//* API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ticket-price", ticketPriceRoutes);
app.use("/api/region", regionRoutes);
app.use("/api/visit-hour", visitHourRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/walk-in", WalkinRoutes);
app.use("/api/calendar-event", calendarEventRoutes);

// app.use("/api/stok-tiket", stokTiketRoutes);
// app.use("/api/kode-tiket", kodeTiketRoutes);
// app.use("/api/penjualan-tiket", penjualanTiketRoutes);
// app.use("/api/transaksi", transaksiRoutes);
// app.use("/api/laporan", WeeklyReportRoutes);
// app.use("/api/reservations", reservationRoutes);

//* Start server after DB connection
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import CalendarEventRoutes from "./routes/CalendarEventRoutes.js";
import UserManageRoutes from "./routes/UserManageRoutes.js";
import TicketPriceRoutes from "./routes/TicketPriceRoutes.js";
import WalkinRoutes from "./routes/WalkinRoutes.js";
import GroupReservationRoutes from "./routes/GroupReservationRoutes.js";
import RegionRoutes from "./routes/RegionRoutes.js";
import VisitingHourRoutes from "./routes/VisitingHourRoutes.js";

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
app.use("/api/auth", AuthRoutes);
app.use("/api/calendar-event", CalendarEventRoutes);
app.use("/api/user-manage", UserManageRoutes);
app.use("/api/ticket-price", TicketPriceRoutes);
app.use("/api/walk-in", WalkinRoutes);
app.use("/api/group-reservation", GroupReservationRoutes);
app.use("/api/region", RegionRoutes);
app.use("/api/visit-hour", VisitingHourRoutes);

//* Start server after DB connection
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});

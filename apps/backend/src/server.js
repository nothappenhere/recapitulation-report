import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";

import AuthRoutes from "./routes/AuthRoutes.js";
import CalendarEventRoutes from "./routes/CalendarEventRoutes.js";
import UserManageRoutes from "./routes/UserManageRoutes.js";
import TicketPriceRoutes from "./routes/TicketPriceRoutes.js";
import DirectReservationRoutes from "./routes/DirectReservationRoutes.js";
import GroupReservationRoutes from "./routes/GroupReservationRoutes.js";
import CustomReservationRoutes from "./routes/CustomReservationRoutes.js";
import DailyRecapRoutes from "./routes/DailyRecapRoutes.js";
import RegionRoutes from "./routes/RegionRoutes.js";
import VisitingHourRoutes from "./routes/VisitingHourRoutes.js";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

//* Resolve dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//* Load environment variables
dotenv.config();
const app = express();

//* Middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//* API Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/calendar-event", CalendarEventRoutes);
app.use("/api/user-manage", UserManageRoutes);
app.use("/api/ticket-price", TicketPriceRoutes);
app.use("/api/direct-reservation", DirectReservationRoutes);
app.use("/api/group-reservation", GroupReservationRoutes);
app.use("/api/custom-reservation", CustomReservationRoutes);
app.use("/api/daily-recap", DailyRecapRoutes);
app.use("/api/region", RegionRoutes);
app.use("/api/visit-hour", VisitingHourRoutes);

//* Error Handling
app.use(notFound);
app.use(errorHandler);

//* Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) =>
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  );
}

//* Start server after DB connection
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});

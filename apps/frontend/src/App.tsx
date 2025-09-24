import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// Auth Page
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

import { DashboardPage } from "./pages/Dashboard";

// import TicketStockSection from "./pages/Stok-Tiket/ticket-stock-section";
// import { AddTicketStock } from "./pages/Stok-Tiket/ticket-stock-form";
// import TransaksiForm from "./pages/TransaksiForm";
// import WeeklyReport from "./pages/WeeklyReport";
// import WeeklyReportPage from "./pages/WeeklyReportPage";

// Ticket Price
import TicketPricePage from "./pages/TicketPrice/TicketPricePage";
import CreateTicketPrice from "./pages/TicketPrice/CreateTicketPrice";
import DetailTicketPrice from "./pages/TicketPrice/DetailTicketPrice";
// Reservation
import ReservationTable from "./pages/Reservation/ReservationTable";
import CreateReservation from "./pages/Reservation/CreateReservation";
import DetailReservation from "./pages/Reservation/DetailReservation";
import ReservationPrintPage from "./pages/Reservation/ReservationPrintPage";
// Walk-in
import WalkinTable from "./pages/Walk-in/WalkinTable";
import CreateWalkin from "./pages/Walk-in/CreateWalkin";
import DetailWalkin from "./pages/Walk-in/DetailWalkin";
import WalkinPrintPage from "./pages/Walk-in/WalkinPrintPage";
import QRPage from "./pages/Walk-in/QRPage";

import CalendarEventPage from "./pages/CalendarEventPage";
// import ReservationPrintPDF from "./pages/Reservation/ReservationPrintPDF";
// import QRForm from "./pages/QRForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/walk-in">
          <Route index element={<CreateWalkin />} />
          <Route path=":uniqueCode" element={<QRPage />} />
        </Route>

        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Navigate to="calendar" replace />} />

          <Route path="ticket-price">
            <Route index element={<TicketPricePage />} />
            <Route path="add" element={<CreateTicketPrice />} />
            <Route
              path="edit"
              element={<Navigate to="/dashboard/ticket-price" replace />}
            />
            <Route path="edit/:id" element={<DetailTicketPrice />} />
          </Route>

          <Route path="reservation">
            <Route index element={<ReservationTable />} />
            <Route path="add" element={<CreateReservation />} />
            <Route
              path="edit"
              element={<Navigate to="/dashboard/reservation" replace />}
            />
            <Route path="edit/:id" element={<DetailReservation />} />
            <Route
              path="print"
              element={<Navigate to="/dashboard/reservation" replace />}
            />
            <Route path="print/:id" element={<ReservationPrintPage />} />
          </Route>

          <Route path="walk-in">
            <Route index element={<WalkinTable />} />
            <Route path="add" element={<CreateWalkin />} />
            <Route
              path="edit"
              element={<Navigate to="/dashboard/walk-in" replace />}
            />
            <Route path="edit/:uniqueCode" element={<DetailWalkin />} />
            <Route
              path="print"
              element={<Navigate to="/dashboard/walk-in" replace />}
            />
            <Route path="print/:uniqueCode" element={<WalkinPrintPage />} />
          </Route>

          <Route path="calendar" element={<CalendarEventPage />} />

          {/* <Route path="stok-tiket" element={<TicketStockSection />} />
          <Route path="stok-tiket/add" element={<AddTicketStock />} />

          <Route path="transaksi" element={<TransaksiForm />} />

          <Route path="laporan-mingguan" element={<WeeklyReportPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

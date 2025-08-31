import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// Auth Page
import LoginForm from "./pages/Auth/Login";
import RegisterForm from "./pages/Auth/Register";
import ResetPasswordForm from "./pages/Auth/ResetPassword";
import { DashboardPage } from "./pages/Dashboard";

import TicketPriceSection from "./pages/Harga-Tiket/ticket-price-section";
import { AddTicketPrice } from "./pages/Harga-Tiket/ticket-price-form";
import TicketStockSection from "./pages/Stok-Tiket/ticket-stock-section";
import { AddTicketStock } from "./pages/Stok-Tiket/ticket-stock-form";
import TransaksiForm from "./pages/TransaksiForm";
// import WeeklyReport from "./pages/WeeklyReport";
import WeeklyReportPage from "./pages/WeeklyReportPage";
import ReservationForm from "./pages/Reservation-Form";
import ReservationTable from "./pages/Reservations/ReservationTable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/auth/register" element={<RegisterForm />} />
          <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
        </Route>

        <Route path="/dashboard" element={<DashboardPage />}>
          {/* <Route index element={<Navigate to="harga-tiket" />} /> */}
          <Route path="harga-tiket" element={<TicketPriceSection />} />
          <Route path="harga-tiket/add" element={<AddTicketPrice />} />

          <Route path="stok-tiket" element={<TicketStockSection />} />
          <Route path="stok-tiket/add" element={<AddTicketStock />} />

          <Route path="transaksi" element={<TransaksiForm />} />

          <Route path="laporan-mingguan" element={<WeeklyReportPage />} />

          <Route path="reservation" element={<ReservationTable />} />
          <Route path="reservation/add" element={<ReservationForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

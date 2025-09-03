import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// Auth Page
import LoginForm from "./pages/Auth/Login";
import RegisterForm from "./pages/Auth/Register";
import ResetPasswordForm from "./pages/Auth/ResetPassword";
import { DashboardPage } from "./pages/Dashboard";

import TicketPricePage from "./pages/TicketPage/TicketPricePage";
import TicketPriceForm from "./pages/TicketPage/TicketPriceForm";

import TicketStockSection from "./pages/Stok-Tiket/ticket-stock-section";
import { AddTicketStock } from "./pages/Stok-Tiket/ticket-stock-form";
import TransaksiForm from "./pages/TransaksiForm";
// import WeeklyReport from "./pages/WeeklyReport";
import WeeklyReportPage from "./pages/WeeklyReportPage";

import ReservationTable from "./pages/ReservationsPage/ReservationTable";
import ReservationForm from "./pages/ReservationsPage/ReservationForm";

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

          <Route path="ticket-price">
            <Route index element={<TicketPricePage />} />
            <Route path="add" element={<TicketPriceForm />} />
            <Route path=":ticketId" element={<TicketPriceForm />} />
          </Route>

          <Route path="stok-tiket" element={<TicketStockSection />} />
          <Route path="stok-tiket/add" element={<AddTicketStock />} />

          <Route path="transaksi" element={<TransaksiForm />} />

          <Route path="laporan-mingguan" element={<WeeklyReportPage />} />

          <Route path="reservation">
            <Route index element={<ReservationTable />} />
            <Route path="add" element={<ReservationForm />} />
            <Route path=":reservationId" element={<ReservationForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

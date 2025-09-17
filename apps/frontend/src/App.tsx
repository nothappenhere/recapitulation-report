import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// Auth Page
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

import { DashboardPage } from "./pages/Dashboard";

import TicketPricePage from "./pages/TicketPrice/TicketPricePage";
import TicketPriceForm from "./pages/TicketPrice/TicketPriceForm";

import TicketStockSection from "./pages/Stok-Tiket/ticket-stock-section";
import { AddTicketStock } from "./pages/Stok-Tiket/ticket-stock-form";
import TransaksiForm from "./pages/TransaksiForm";
// import WeeklyReport from "./pages/WeeklyReport";
import WeeklyReportPage from "./pages/WeeklyReportPage";

// import ReservationTable from "./pages/Visits/Reservation/ReservationTable";
// import ReservationForm from "./pages/Visits/Reservation/ReservationForm";
import VisitTabsPage from "./pages/Visits/VisitTabsPage";
import VisitTabsForm from "./pages/Visits/VisitTabsForm";

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

        <Route path="/dashboard" element={<DashboardPage />}>
          {/* <Route index element={<Navigate to="harga-tiket" />} /> */}

          <Route path="ticket-price">
            <Route index element={<TicketPricePage />} />
            <Route path="add" element={<TicketPriceForm />} />
            <Route path=":id" element={<TicketPriceForm />} />
          </Route>

          <Route path="stok-tiket" element={<TicketStockSection />} />
          <Route path="stok-tiket/add" element={<AddTicketStock />} />

          <Route path="transaksi" element={<TransaksiForm />} />

          <Route path="laporan-mingguan" element={<WeeklyReportPage />} />

          <Route path="visits">
            <Route index element={<VisitTabsPage />} />
            <Route path="add" element={<VisitTabsForm />} />
            <Route path=":id" element={<VisitTabsForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

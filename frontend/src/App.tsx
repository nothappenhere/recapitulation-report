import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LoginForm } from "./pages/Login";
import { ResetPasswordForm } from "./pages/ResetPassword";
import { RegisterForm } from "./pages/Register";
import { DashboardPage } from "./pages/Dashboard";
import TicketPriceSection from "./components/ticket-price-section";
import { AddTicketPrice } from "./components/add-ticket-price-form";

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
          <Route index element={<Navigate to="harga-tiket" />} />
          <Route path="harga-tiket" element={<TicketPriceSection />} />
          <Route path="harga-tiket/add" element={<AddTicketPrice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

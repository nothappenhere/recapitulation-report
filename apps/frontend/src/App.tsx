import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// Auth Page
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
// Visit Page
import CreateDirectVisit from "./pages/Visit/CreateDirectVisit";
import DirectQRPage from "./pages/Visit/DirectQRPage";
import CreateCustomVisit from "./pages/Visit/CreateCustomVisit";
import CustomQRPage from "./pages/Visit/CustomQRPage";

// Dashboard
import DashboardPage from "./pages/Dashboard/DashboardPage";
// Kalender
import CalendarEventPage from "./pages/Dashboard/CalendarEventPage";
// Pengelolaan Pengguna
import ManageUserPage from "./pages/Dashboard/UserManagement/ManageUserPage";
// import DetailUser from "./pages/Dashboard/UserManagement/DetailUser";
// Harga Tiket
import TicketPricePage from "./pages/Dashboard/TicketPrice/TicketPricePage";
import TicketPriceForm from "./pages/Dashboard/TicketPrice/TicketPriceForm";
// Reservasi Langsung
import WalkinPage from "./pages/Dashboard/Walk-in/WalkinPage";
import WalkinForm from "./pages/Dashboard/Walk-in/WalkinForm";
import WalkinPrintPage from "./pages/Dashboard/Walk-in/WalkinPrintPage";
// Reservasi Rombongan
import GroupReservationPage from "./pages/Dashboard/GroupReservation/GroupReservationPage";
import GroupReservationForm from "./pages/Dashboard/GroupReservation/GroupReservationForm";
import GroupReservationPrintPage from "./pages/Dashboard/GroupReservation/GroupReservationPrintPage";
// Reservasi Khusus
import CustomReservationPage from "./pages/Dashboard/CustomReservation/CustomReservationPage";
import CustomReservationForm from "./pages/Dashboard/CustomReservation/CustomReservationForm";
import CustomReservationPrintPage from "./pages/Dashboard/CustomReservation/CustomReservationPrintPage";
// Rekapitulasi Harian
import DailyRecapPage from "./pages/Dashboard/DailyRecap/DailyRecapPage";
import DailyRecapForm from "./pages/Dashboard/DailyRecap/DailyRecapForm";
import UserProfilePage from "./pages/Dashboard/UserManagement/UserProfilePage";

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

        <Route path="/visit">
          <Route index element={<Navigate to="direct" replace />} />

          <Route path="direct">
            <Route index element={<CreateDirectVisit />} />
            <Route path=":uniqueCode" element={<DirectQRPage />} />
          </Route>

          <Route path="custom">
            <Route index element={<CreateCustomVisit />} />
            <Route path=":uniqueCode" element={<CustomQRPage />} />
          </Route>
        </Route>

        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Navigate to="calendar" replace />} />
          <Route path="calendar" element={<CalendarEventPage />} />

          <Route path="profile">
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path=":username" element={<UserProfilePage />} />
          </Route>

          {/* Pengelolaan Pengguna */}
          <Route path="user-management">
            <Route index element={<ManageUserPage />} />
          </Route>

          {/* Harga Tiket */}
          <Route path="ticket-price">
            <Route index element={<TicketPricePage />} />
            <Route path="add" element={<TicketPriceForm />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/ticket-price" replace />}
            />
            <Route path="edit/:category" element={<TicketPriceForm />} />
          </Route>

          {/* Reservasi Langsung */}
          <Route path="walk-in">
            <Route index element={<WalkinPage />} />
            <Route path="add" element={<WalkinForm />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/walk-in" replace />}
            />
            <Route path="edit/:uniqueCode" element={<WalkinForm />} />

            <Route
              path="print"
              element={<Navigate to="/dashboard/walk-in" replace />}
            />
            <Route path="print/:uniqueCode" element={<WalkinPrintPage />} />
          </Route>

          {/* Reservasi Rombongan */}
          <Route path="group-reservation">
            <Route index element={<GroupReservationPage />} />
            <Route path="add" element={<GroupReservationForm />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/group-reservation" replace />}
            />
            <Route path="edit/:uniqueCode" element={<GroupReservationForm />} />

            <Route
              path="print"
              element={<Navigate to="/dashboard/group-reservation" replace />}
            />
            <Route
              path="print/:uniqueCode"
              element={<GroupReservationPrintPage />}
            />
          </Route>

          {/* Reservasi Khusus */}
          <Route path="custom-reservation">
            <Route index element={<CustomReservationPage />} />
            <Route path="add" element={<CustomReservationForm />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/custom-reservation" replace />}
            />
            <Route
              path="edit/:uniqueCode"
              element={<CustomReservationForm />}
            />

            <Route
              path="print"
              element={<Navigate to="/dashboard/custom-reservation" replace />}
            />
            <Route
              path="print/:uniqueCode"
              element={<CustomReservationPrintPage />}
            />
          </Route>

          {/* Rekapitulasi Harian */}
          <Route path="daily-recap">
            <Route index element={<DailyRecapPage />} />
            <Route path="add" element={<DailyRecapForm />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/daily-recap" replace />}
            />
            <Route path="edit/:uniqueCode" element={<DailyRecapForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

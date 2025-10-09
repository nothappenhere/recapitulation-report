import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// Auth Page
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
// Visit Page
import DirectVisitForm from "./pages/Visit/Direct/DirectVisitForm";
import DirectQRPage from "./pages/Visit/Direct/DirectQRPage";
import GroupVisitForm from "./pages/Visit/Group/GroupVisitForm";
import GroupQRPage from "./pages/Visit/Group/GroupQRPage";
import CustomVisitForm from "./pages/Visit/Custom/CustomVisitForm";
import CustomQRPage from "./pages/Visit/Custom/CustomQRPage";

// Dashboard
import DashboardPage from "./pages/Dashboard/DashboardPage";
// Kalender
import CalendarEventPage from "./pages/Dashboard/CalendarEventPage";
// Pengelolaan Pengguna
import ManageUserPage from "./pages/Dashboard/UserManagement/ManageUserPage";
import UserProfilePage from "./pages/Dashboard/UserManagement/UserProfilePage";
// Harga Tiket
import TicketPricePage from "./pages/Dashboard/TicketPrice/TicketPricePage";
import TicketPriceForm from "./pages/Dashboard/TicketPrice/TicketPriceForm";
// Reservasi Langsung
import DirectReservationPage from "./pages/Dashboard/DirectReservation/DirectReservationPage";
import DirectReservationForm from "./pages/Dashboard/DirectReservation/DirectReservationForm";
import DirectReservationPrintPage from "./pages/Dashboard/DirectReservation/DirectReservationPrintPage";
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

          {/* Reservasi Langsung */}
          <Route path="direct">
            <Route index element={<DirectVisitForm />} />
            <Route path=":uniqueCode" element={<DirectQRPage />} />
          </Route>

          {/* Reservasi Rombongan */}
          <Route path="group">
            <Route index element={<GroupVisitForm />} />
            <Route path=":uniqueCode" element={<GroupQRPage />} />
          </Route>

          {/* Reservasi Khusus */}
          <Route path="custom">
            <Route index element={<CustomVisitForm />} />
            <Route path=":uniqueCode" element={<CustomQRPage />} />
          </Route>
        </Route>

        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Navigate to="calendar" replace />} />
          <Route path="calendar" element={<CalendarEventPage />} />

          {/* Pengelolaan Pengguna */}
          <Route path="user-management">
            <Route index element={<ManageUserPage />} />
          </Route>
          <Route path="profile">
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path=":username" element={<UserProfilePage />} />
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
          <Route path="direct-reservation">
            <Route index element={<DirectReservationPage />} />
            <Route path="add" element={<DirectReservationForm />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/direct-reservation" replace />}
            />
            <Route
              path="edit/:uniqueCode"
              element={<DirectReservationForm />}
            />

            <Route
              path="print"
              element={<Navigate to="/dashboard/direct-reservation" replace />}
            />
            <Route
              path="print/:uniqueCode"
              element={<DirectReservationPrintPage />}
            />
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

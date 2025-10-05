import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// Auth Page
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
// Visit Page
import CreateDirectVisit from "./pages/Visit/CreateDirectVisit";
import CreateCustomVisit from "./pages/Visit/CreateCustomVisit";
import QRPage from "./pages/Visit/QRPage";

// Dashboard
import DashboardPage from "./pages/Dashboard/DashboardPage";
// Kalender
import CalendarEventPage from "./pages/Dashboard/CalendarEventPage";
// Pengelolaan Pengguna
import UserTable from "./pages/Dashboard/UserManagement/UserTable";
// import DetailUser from "./pages/Dashboard/UserManagement/DetailUser";
// Harga Tiket
import TicketPricePage from "./pages/Dashboard/TicketPrice/TicketPricePage";
import CreateTicketPrice from "./pages/Dashboard/TicketPrice/CreateTicketPrice";
import DetailTicketPrice from "./pages/Dashboard/TicketPrice/DetailTicketPrice";
// Reservasi Langsung
import WalkinTable from "./pages/Dashboard/Walk-in/WalkinTable";
import CreateWalkin from "./pages/Dashboard/Walk-in/CreateWalkin";
import DetailWalkin from "./pages/Dashboard/Walk-in/DetailWalkin";
import WalkinPrintPage from "./pages/Dashboard/Walk-in/WalkinPrintPage";
// Reservasi Rombongan
import GroupReservationTable from "./pages/Dashboard/GroupReservation/GroupReservationTable";
import CreateGroupReservation from "./pages/Dashboard/GroupReservation/CreateGroupReservation";
import DetailGroupReservation from "./pages/Dashboard/GroupReservation/DetailGroupReservation";
import GroupReservationPrintPage from "./pages/Dashboard/GroupReservation/GroupReservationPrintPage";
// Reservasi Khusus
import CustomReservationTable from "./pages/Dashboard/CustomReservation/CustomReservationTable";
import CreateCustomReservation from "./pages/Dashboard/CustomReservation/CreateCustomReservation";
// Rekapitulasi Harian
import RecapTable from "./pages/Dashboard/DailyRecap/RecapTable";
import CreateRecap from "./pages/Dashboard/DailyRecap/CreateRecap";
import DetailRecap from "./pages/Dashboard/DailyRecap/DetailRecap";

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

          <Route path="direct" element={<CreateCustomVisit />}>
            <Route path=":uniqueCode" element={<QRPage />} />
          </Route>

          <Route path="custom" element={<CreateCustomVisit />}>
            <Route path=":uniqueCode" element={<QRPage />} />
          </Route>
        </Route>

        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Navigate to="calendar" replace />} />
          <Route path="calendar" element={<CalendarEventPage />} />
          {/* Pengelolaan Pengguna */}
          <Route path="user-management">
            <Route index element={<UserTable />} />
          </Route>

          {/* Harga Tiket */}
          <Route path="ticket-price">
            <Route index element={<TicketPricePage />} />
            <Route path="add" element={<CreateTicketPrice />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/ticket-price" replace />}
            />
            <Route path="edit/:category" element={<DetailTicketPrice />} />
          </Route>

          {/* Reservasi Langsung */}
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

          {/* Reservasi Rombongan */}
          <Route path="group-reservation">
            <Route index element={<GroupReservationTable />} />
            <Route path="add" element={<CreateGroupReservation />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/group-reservation" replace />}
            />
            <Route
              path="edit/:uniqueCode"
              element={<DetailGroupReservation />}
            />

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
            <Route index element={<CustomReservationTable />} />
            <Route path="add" element={<CreateCustomReservation />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/custom-reservation" replace />}
            />
            <Route
              path="edit/:uniqueCode"
              element={<DetailGroupReservation />}
            />

            <Route
              path="print"
              element={<Navigate to="/dashboard/custom-reservation" replace />}
            />
            <Route
              path="print/:uniqueCode"
              element={<GroupReservationPrintPage />}
            />
          </Route>

          {/* Rekapitulasi Harian */}
          <Route path="daily-recap">
            <Route index element={<RecapTable />} />
            <Route path="add" element={<CreateRecap />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/daily-recap" replace />}
            />
            <Route path="edit/:uniqueCode" element={<DetailRecap />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

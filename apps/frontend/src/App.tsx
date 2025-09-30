import { BrowserRouter, Navigate, Route, Routes } from "react-router";

// Visit Page
import CreateVisit from "./pages/Tiket-Kunjungan/CreateVisit";
import QRPage from "./pages/Tiket-Kunjungan/QRPage";

// Auth Page
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

// Dashboard
import DashboardPage from "./pages/Dashboard/DashboardPage";
// Kalender
import CalendarEventPage from "./pages/Dashboard/CalendarEventPage";
// Pengelolaan Pengguna
import UserTable from "./pages/Dashboard/User-Management/UserTable";
import DetailUser from "./pages/Dashboard/User-Management/DetailUser";
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
import GroupReservationTable from "./pages/Dashboard/Group-Reservation/GroupReservationTable";
import CreateGroupReservation from "./pages/Dashboard/Group-Reservation/CreateGroupReservation";
import DetailGroupReservation from "./pages/Dashboard/Group-Reservation/DetailGroupReservation";
import GroupReservationPrintPage from "./pages/Dashboard/Group-Reservation/GroupReservationPrintPage";

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
          <Route index element={<CreateVisit />} />
          <Route path=":uniqueCode" element={<QRPage />} />
        </Route>

        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<Navigate to="calendar" replace />} />
          <Route path="calendar" element={<CalendarEventPage />} />

          <Route path="user-management">
            <Route index element={<UserTable />} />
            <Route path="add" element={<CreateWalkin />} />

            {/* <Route
              path="edit"
              element={<Navigate to="/dashboard/user-management" replace />}
            />
            <Route path="edit/:username" element={<DetailUser />} /> */}
          </Route>

          <Route path="ticket-price">
            <Route index element={<TicketPricePage />} />
            <Route path="add" element={<CreateTicketPrice />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/ticket-price" replace />}
            />
            <Route path="edit/:id" element={<DetailTicketPrice />} />
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

          {/* <Route path="custom-reservation">
            <Route index element={<GroupReservationTable />} />
            <Route path="add" element={<CreateGroupReservation />} />

            <Route
              path="edit"
              element={<Navigate to="/dashboard/custom-reservation" replace />}
            />
            <Route path="edit/:uniqueCode" element={<DetailGroupReservation />} />

            <Route
              path="print"
              element={<Navigate to="/dashboard/custom-reservation" replace />}
            />
            <Route
              path="print/:uniqueCode"
              element={<GroupReservationPrintPage />}
            />
          </Route> */}

          {/* <Route path="laporan-mingguan" element={<WeeklyReportPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

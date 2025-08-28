import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LoginForm } from "./components/login-form";
import { ResetPasswordForm } from "./components/reset-password-form";
import { RegisterForm } from "./components/register-form";

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
          {/* <Route index element={<SectionCards />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

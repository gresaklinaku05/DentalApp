import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import DoctorsPage from "./pages/DoctorsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import { ToastContainer } from "react-toastify";

const PrivatePage = ({ children }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivatePage>
              <DashboardPage />
            </PrivatePage>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivatePage>
              <PatientsPage />
            </PrivatePage>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivatePage>
              <AppointmentsPage />
            </PrivatePage>
          }
        />
        <Route
          path="/doctors"
          element={
            <PrivatePage>
              <DoctorsPage />
            </PrivatePage>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <PrivatePage>
              <AuditLogsPage />
            </PrivatePage>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
};

export default App;

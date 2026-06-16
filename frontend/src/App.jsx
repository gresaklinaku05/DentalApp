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
import SchoolsPage from "./pages/SchoolsPage";
import FactoriesPage from "./pages/FactoriesPage";
import LigjëruesiPage from "./pages/LigjëruesiPage";
import LibraryPage from "./pages/LibraryPage";
import PostimiPage from "./pages/PostimiPage";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/useAuth";

const PrivatePage = ({ children }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-slate-600">Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
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
        <Route
          path="/schools"
          element={
            <PrivatePage>
              <SchoolsPage />
            </PrivatePage>
          }
        />
        <Route
          path="/factories"
          element={
            <PrivatePage>
              <FactoriesPage />
            </PrivatePage>
          }
        />
        <Route
          path="/lecturers"
          element={
            <PrivatePage>
              <LigjëruesiPage />
            </PrivatePage>
          }
        />
        <Route
          path="/libraries"
          element={
            <PrivatePage>
              <LibraryPage />
            </PrivatePage>
          }
        />
        <Route
          path="/postimis"
          element={
            <PrivatePage>
              <PostimiPage />
            </PrivatePage>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
};

export default App;

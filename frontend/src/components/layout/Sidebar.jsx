import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/patients", label: "Patients" },
  { to: "/appointments", label: "Appointments" },
  { to: "/doctors", label: "Doctors", roles: ["admin"] },
  { to: "/audit-logs", label: "Audit Logs", roles: ["admin"] },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white p-5 flex md:flex-col gap-4 md:min-h-screen">
      <div className="hidden md:block">
        <h1 className="text-xl font-bold">Dental Clinic</h1>
        <p className="text-sm text-slate-300 mt-1">Welcome, {user?.name}</p>
      </div>
      <nav className="flex md:flex-col gap-2 w-full">
        {links
          .filter((link) => !link.roles || link.roles.includes(user?.role))
          .map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-3 py-2 rounded-lg transition ${
              location.pathname === link.to ? "bg-slate-700" : "hover:bg-slate-800"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={logout}
        className="md:mt-auto bg-rose-600 hover:bg-rose-700 px-3 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;

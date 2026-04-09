import { useEffect, useState } from "react";
import api from "../api/api";
import StatCard from "../components/common/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import LoadingSpinner from "../components/common/LoadingSpinner";

const COLORS = ["#0f172a", "#16a34a", "#e11d48"];

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalPatients: 0, totalAppointments: 0 });
  const [analytics, setAnalytics] = useState({
    patientsPerDoctor: [],
    appointmentsPerMonth: [],
    appointmentsByStatus: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [overviewResponse, analyticsResponse] = await Promise.all([
        api.get("/dashboard/overview"),
        api.get("/dashboard/analytics"),
      ]);
      setStats(overviewResponse.data);
      setAnalytics(analyticsResponse.data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <StatCard title="Total Patients" value={stats.totalPatients} />
        <StatCard title="Total Appointments" value={stats.totalAppointments} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold mb-3">Appointments Per Month</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.appointmentsPerMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#0f172a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold mb-3">Appointments By Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.appointmentsByStatus}
                  dataKey="total"
                  nameKey="status"
                  outerRadius={90}
                  label
                >
                  {analytics.appointmentsByStatus.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4">
        <h3 className="font-semibold mb-3">Patients Per Doctor</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.patientsPerDoctor}>
              <XAxis dataKey="fullName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalPatients" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;

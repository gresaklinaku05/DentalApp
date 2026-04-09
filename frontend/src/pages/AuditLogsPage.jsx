import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatDate } from "../utils/formatDate";

const AuditLogsPage = () => {
  const { isAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, limit: 20 });
  const [entity, setEntity] = useState("");

  const fetchLogs = async (nextPage = page, nextEntity = entity) => {
    setLoading(true);
    const response = await api.get("/audit-logs", { params: { page: nextPage, entity: nextEntity || undefined } });
    setLogs(response.data.data);
    setMeta({ total: response.data.total, limit: response.data.limit });
    setPage(nextPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs(1, "");
  }, []);

  if (!isAdmin) return <p className="text-slate-600">Only admin can view audit logs.</p>;
  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Audit Logs</h2>
        <select
          className="border rounded-lg p-2"
          value={entity}
          onChange={(e) => {
            setEntity(e.target.value);
            fetchLogs(1, e.target.value);
          }}
        >
          <option value="">All entities</option>
          <option value="User">User</option>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
          <option value="Appointment">Appointment</option>
          <option value="PatientHistory">Patient History</option>
        </select>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Action</th>
              <th className="text-left p-3">Entity</th>
              <th className="text-left p-3">Entity ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-3">{formatDate(log.timestamp)}</td>
                <td className="p-3">{log.user?.email || "-"}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.entity}</td>
                <td className="p-3">{log.entityId ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-2">
        <button
          className="border px-3 py-1 rounded"
          disabled={page <= 1}
          onClick={() => fetchLogs(page - 1)}
        >
          Prev
        </button>
        <button
          className="border px-3 py-1 rounded"
          disabled={page * meta.limit >= meta.total}
          onClick={() => fetchLogs(page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AuditLogsPage;

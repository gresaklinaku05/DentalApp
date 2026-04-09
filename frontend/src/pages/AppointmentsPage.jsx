import { useEffect, useState } from "react";
import api from "../api/api";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";

const initialForm = {
  patientId: "",
  doctorId: "",
  appointmentDate: "",
  reason: "",
  status: "scheduled",
  notes: "",
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const { isAdmin, isStaff } = useAuth();

  const fetchData = async () => {
    const [appointmentsResponse, patientsResponse, doctorsResponse] = await Promise.all([
      api.get("/appointments"),
      api.get("/patients"),
      api.get("/doctors"),
    ]);
    setAppointments(appointmentsResponse.data);
    setPatients(patientsResponse.data);
    setDoctors(doctorsResponse.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.patientId || !form.doctorId || !form.appointmentDate || !form.reason) {
      setError("Patient, doctor, date and reason are required");
      return;
    }

    const payload = { ...form, patientId: Number(form.patientId), doctorId: Number(form.doctorId) };
    if (editingId) {
      await api.put(`/appointments/${editingId}`, payload);
      toast.success("Appointment updated");
    } else {
      await api.post("/appointments", payload);
      toast.success("Appointment added");
    }
    resetForm();
    fetchData();
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    setForm({
      patientId: String(appointment.patientId || ""),
      doctorId: String(appointment.doctorId || ""),
      appointmentDate: appointment.appointmentDate
        ? new Date(appointment.appointmentDate).toISOString().slice(0, 16)
        : "",
      reason: appointment.reason || "",
      status: appointment.status || "scheduled",
      notes: appointment.notes || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    await api.delete(`/appointments/${id}`);
    toast.success("Appointment deleted");
    fetchData();
  };

  if (!isAdmin && !isStaff) {
    return <p className="text-slate-600">Only admin or staff can manage appointments.</p>;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-2 gap-3">
        {error && <p className="text-rose-600 text-sm md:col-span-2">{error}</p>}
        <select
          className="border rounded-lg p-2"
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
        >
          <option value="">Select patient *</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.fullName}
            </option>
          ))}
        </select>
        <input
          className="border rounded-lg p-2"
          type="datetime-local"
          value={form.appointmentDate}
          onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
        />
        <input
          className="border rounded-lg p-2"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        <select
          className="border rounded-lg p-2"
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
        >
          <option value="">Select doctor *</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.fullName}
            </option>
          ))}
        </select>
        <select
          className="border rounded-lg p-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          className="border rounded-lg p-2 md:col-span-2"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <div className="md:col-span-2 flex gap-2">
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg">
            {editingId ? "Update Appointment" : "Add Appointment"}
          </button>
          {editingId && (
            <button type="button" className="border px-4 py-2 rounded-lg" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Patient</th>
              <th className="text-left p-3">Doctor</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Reason</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.patient?.fullName || "-"}</td>
                <td className="p-3">{item.doctor?.fullName || "-"}</td>
                <td className="p-3">{formatDate(item.appointmentDate)}</td>
                <td className="p-3">{item.reason}</td>
                <td className="p-3 capitalize">{item.status}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="px-3 py-1 bg-amber-500 text-white rounded"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-rose-600 text-white rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AppointmentsPage;

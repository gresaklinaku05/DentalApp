import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  dateOfBirth: "",
  notes: "",
};

const PatientsPage = () => {
  const { isAdmin, isDoctor } = useAuth();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [history, setHistory] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tab, setTab] = useState("basic");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [error, setError] = useState("");
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyEditingId, setHistoryEditingId] = useState(null);
  const [historyForm, setHistoryForm] = useState({
    doctorId: "",
    visitDate: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

  const fetchData = async () => {
    const [patientsRes, appointmentsRes, historyRes, doctorsRes] = await Promise.all([
      api.get("/patients"),
      api.get("/appointments").catch(() => ({ data: [] })),
      api.get("/patient-history").catch(() => ({ data: [] })),
      api.get("/doctors").catch(() => ({ data: [] })),
    ]);
    setPatients(patientsRes.data);
    setAppointments(appointmentsRes.data);
    setHistory(historyRes.data);
    setDoctors(doctorsRes.data);
    if (!selectedPatientId && patientsRes.data.length > 0) {
      setSelectedPatientId(patientsRes.data[0].id);
    }
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
    if (!form.fullName || !form.phone) {
      setError("Full name and phone are required");
      return;
    }

    if (!isAdmin) {
      setError("Only admin can modify patient basic info");
      return;
    }
    if (editingId) {
      await api.put(`/patients/${editingId}`, form);
      toast.success("Patient updated");
    } else {
      await api.post("/patients", form);
      toast.success("Patient added");
    }
    resetForm();
    fetchData();
  };

  const handleEdit = (patient) => {
    setSelectedPatientId(patient.id);
    setEditingId(patient.id);
    setForm({
      fullName: patient.fullName || "",
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
      dateOfBirth: patient.dateOfBirth || "",
      notes: patient.notes || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    await api.delete(`/patients/${id}`);
    toast.success("Patient deleted");
    fetchData();
  };

  const openHistoryModal = (record = null) => {
    if (record) {
      setHistoryEditingId(record.id);
      setHistoryForm({
        doctorId: String(record.doctorId || ""),
        visitDate: record.visitDate ? new Date(record.visitDate).toISOString().slice(0, 16) : "",
        diagnosis: record.diagnosis || "",
        treatment: record.treatment || "",
        notes: record.notes || "",
      });
    } else {
      setHistoryEditingId(null);
      setHistoryForm({ doctorId: "", visitDate: "", diagnosis: "", treatment: "", notes: "" });
    }
    setHistoryModalOpen(true);
  };

  const saveHistory = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !historyForm.doctorId || !historyForm.visitDate || !historyForm.diagnosis || !historyForm.treatment) {
      return toast.error("Fill all required medical history fields");
    }
    const payload = {
      patientId: Number(selectedPatientId),
      doctorId: Number(historyForm.doctorId),
      visitDate: historyForm.visitDate,
      diagnosis: historyForm.diagnosis,
      treatment: historyForm.treatment,
      notes: historyForm.notes,
    };
    if (historyEditingId) {
      await api.put(`/patient-history/${historyEditingId}`, payload);
      toast.success("History updated");
    } else {
      await api.post("/patient-history", payload);
      toast.success("History added");
    }
    setHistoryModalOpen(false);
    fetchData();
  };

  const selectedHistory = history.filter((h) => h.patientId === selectedPatientId);
  const selectedAppointments = appointments.filter((a) => a.patientId === selectedPatientId);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Patients</h2>
      <div className="flex gap-2">
        {["basic", "appointments", "history"].map((name) => (
          <button
            key={name}
            className={`px-4 py-2 rounded-lg capitalize ${tab === name ? "bg-slate-900 text-white" : "bg-white border"}`}
            onClick={() => setTab(name)}
            type="button"
          >
            {name === "basic" ? "Basic Info" : name === "appointments" ? "Appointments" : "Medical History"}
          </button>
        ))}
      </div>

      {tab === "basic" && (
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-2 gap-3">
        {error && <p className="text-rose-600 text-sm md:col-span-2">{error}</p>}
        <input
          className="border rounded-lg p-2"
          placeholder="Full name *"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          className="border rounded-lg p-2"
          placeholder="Phone *"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="border rounded-lg p-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border rounded-lg p-2"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          className="border rounded-lg p-2"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
        />
        <input
          className="border rounded-lg p-2"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <div className="md:col-span-2 flex gap-2">
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg" disabled={!isAdmin}>
            {editingId ? "Update Patient" : "Add Patient"}
          </button>
          {editingId && (
            <button type="button" className="border px-4 py-2 rounded-lg" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className={`border-t cursor-pointer ${selectedPatientId === patient.id ? "bg-slate-50" : ""}`}
                onClick={() => setSelectedPatientId(patient.id)}
              >
                <td className="p-3">{patient.fullName}</td>
                <td className="p-3">{patient.phone}</td>
                <td className="p-3">{patient.email || "-"}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="px-3 py-1 bg-amber-500 text-white rounded"
                    onClick={() => handleEdit(patient)}
                    disabled={!isAdmin}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-rose-600 text-white rounded"
                    onClick={() => handleDelete(patient.id)}
                    disabled={!isAdmin}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {tab === "appointments" && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold mb-3">Appointments for selected patient</h3>
          <ul className="space-y-2">
            {selectedAppointments.map((appt) => (
              <li key={appt.id} className="border rounded p-2 text-sm">
                {new Date(appt.appointmentDate).toLocaleString()} - {appt.reason} ({appt.status})
              </li>
            ))}
            {selectedAppointments.length === 0 && <p className="text-slate-500 text-sm">No appointments found.</p>}
          </ul>
        </div>
      )}

      {tab === "history" && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Medical History for selected patient</h3>
            {(isAdmin || isDoctor) && (
              <button className="bg-slate-900 text-white px-3 py-2 rounded-lg" onClick={() => openHistoryModal()}>
                Add Record
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-2">Visit Date</th>
                  <th className="text-left p-2">Doctor</th>
                  <th className="text-left p-2">Diagnosis</th>
                  <th className="text-left p-2">Treatment</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedHistory.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{new Date(item.visitDate).toLocaleString()}</td>
                    <td className="p-2">{item.doctor?.fullName || "-"}</td>
                    <td className="p-2">{item.diagnosis}</td>
                    <td className="p-2">{item.treatment}</td>
                    <td className="p-2 space-x-2">
                      <button className="px-2 py-1 bg-amber-500 text-white rounded" onClick={() => openHistoryModal(item)}>
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-rose-600 text-white rounded"
                        onClick={async () => {
                          if (!window.confirm("Delete this history record?")) return;
                          await api.delete(`/patient-history/${item.id}`);
                          toast.success("History deleted");
                          fetchData();
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {selectedHistory.length === 0 && (
                  <tr><td className="p-3 text-slate-500" colSpan={5}>No medical history found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {historyModalOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <form onSubmit={saveHistory} className="bg-white rounded-xl p-5 w-full max-w-lg space-y-3">
            <h3 className="text-lg font-semibold">{historyEditingId ? "Edit Medical Record" : "Add Medical Record"}</h3>
            <select
              className="border rounded-lg p-2 w-full"
              value={historyForm.doctorId}
              onChange={(e) => setHistoryForm({ ...historyForm, doctorId: e.target.value })}
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.fullName}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              className="border rounded-lg p-2 w-full"
              value={historyForm.visitDate}
              onChange={(e) => setHistoryForm({ ...historyForm, visitDate: e.target.value })}
            />
            <input
              className="border rounded-lg p-2 w-full"
              placeholder="Diagnosis"
              value={historyForm.diagnosis}
              onChange={(e) => setHistoryForm({ ...historyForm, diagnosis: e.target.value })}
            />
            <input
              className="border rounded-lg p-2 w-full"
              placeholder="Treatment"
              value={historyForm.treatment}
              onChange={(e) => setHistoryForm({ ...historyForm, treatment: e.target.value })}
            />
            <textarea
              className="border rounded-lg p-2 w-full"
              placeholder="Notes"
              value={historyForm.notes}
              onChange={(e) => setHistoryForm({ ...historyForm, notes: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button type="button" className="border px-4 py-2 rounded-lg" onClick={() => setHistoryModalOpen(false)}>
                Cancel
              </button>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg">Save</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default PatientsPage;

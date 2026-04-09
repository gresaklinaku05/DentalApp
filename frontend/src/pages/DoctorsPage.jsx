import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import api from "../api/api";
import { useAuth } from "../context/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";

const schema = yup.object({
  fullName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  specialty: yup.string().required(),
});

const DoctorsPage = () => {
  const { isAdmin } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchDoctors = async () => {
    const response = await api.get("/doctors");
    setDoctors(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const onSubmit = async (values) => {
    try {
      if (editingId) await api.put(`/doctors/${editingId}`, values);
      else await api.post("/doctors", values);
      toast.success(`Doctor ${editingId ? "updated" : "added"} successfully`);
      setModalOpen(false);
      setEditingId(null);
      reset({ fullName: "", email: "", phone: "", specialty: "" });
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save doctor");
    }
  };

  const onEdit = (doctor) => {
    setEditingId(doctor.id);
    reset(doctor);
    setModalOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    await api.delete(`/doctors/${id}`);
    toast.success("Doctor deleted");
    fetchDoctors();
  };

  if (!isAdmin) return <p className="text-slate-600">Only admin can manage doctors.</p>;
  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doctors</h2>
        <button
          className="bg-slate-900 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            setEditingId(null);
            reset({ fullName: "", email: "", phone: "", specialty: "" });
            setModalOpen(true);
          }}
        >
          Add Doctor
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Specialty</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="border-t">
                <td className="p-3">{doctor.fullName}</td>
                <td className="p-3">{doctor.email}</td>
                <td className="p-3">{doctor.phone}</td>
                <td className="p-3">{doctor.specialty}</td>
                <td className="p-3 space-x-2">
                  <button className="px-3 py-1 bg-amber-500 text-white rounded" onClick={() => onEdit(doctor)}>Edit</button>
                  <button className="px-3 py-1 bg-rose-600 text-white rounded" onClick={() => onDelete(doctor.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <form className="bg-white rounded-xl p-5 w-full max-w-md space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <h3 className="font-semibold text-lg">{editingId ? "Edit Doctor" : "Add Doctor"}</h3>
            <input className="border rounded-lg p-2 w-full" placeholder="Full Name" {...register("fullName")} />
            {errors.fullName && <p className="text-rose-600 text-sm">{errors.fullName.message}</p>}
            <input className="border rounded-lg p-2 w-full" placeholder="Email" {...register("email")} />
            <input className="border rounded-lg p-2 w-full" placeholder="Phone" {...register("phone")} />
            <input className="border rounded-lg p-2 w-full" placeholder="Specialty" {...register("specialty")} />
            <div className="flex gap-2 justify-end">
              <button type="button" className="border px-4 py-2 rounded-lg" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg">Save</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default DoctorsPage;

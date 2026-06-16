import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";

const initialLecturerForm = { lecturerName: "", department: "", email: "" };
const initialLectureForm = { lectureName: "", lecturerId: "" };

const LigjëruesiPage = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecturerForm, setLecturerForm] = useState(initialLecturerForm);
  const [lectureForm, setLectureForm] = useState(initialLectureForm);
  const [editingLecturerId, setEditingLecturerId] = useState(null);

  const fetchLecturers = async () => {
    const response = await api.get("/lecturers");
    setLecturers(response.data);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchLecturers();
      setLoading(false);
    };
    load();
  }, []);

  const resetLecturerForm = () => {
    setLecturerForm(initialLecturerForm);
    setEditingLecturerId(null);
  };

  const handleLecturerSubmit = async (e) => {
    e.preventDefault();
    if (!lecturerForm.lecturerName || !lecturerForm.department || !lecturerForm.email) {
      return toast.error("All lecturer fields are required");
    }

    try {
      if (editingLecturerId) {
        await api.put(`/lecturers/${editingLecturerId}`, lecturerForm);
        toast.success("Lecturer updated");
      } else {
        await api.post("/lecturers", lecturerForm);
        toast.success("Lecturer added");
      }
      resetLecturerForm();
      await fetchLecturers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save lecturer");
    }
  };

  const handleEditLecturer = (lecturer) => {
    setEditingLecturerId(lecturer.id);
    setLecturerForm({
      lecturerName: lecturer.lecturerName,
      department: lecturer.department,
      email: lecturer.email,
    });
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    if (!lectureForm.lectureName || !lectureForm.lecturerId) {
      return toast.error("All lecture fields are required");
    }

    try {
      await api.post("/lectures", {
        lectureName: lectureForm.lectureName,
        lecturerId: Number(lectureForm.lecturerId),
      });
      toast.success("Lecture added");
      setLectureForm(initialLectureForm);
      await fetchLecturers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lecture");
    }
  };

  const handleDeleteLecture = async (lecture) => {
    if (!window.confirm(`Delete lecture ${lecture.lectureName}?`)) return;
    try {
      await api.delete(`/lectures/${lecture.id}`);
      toast.success("Lecture deleted");
      await fetchLecturers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lecture");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Lecturers & Lectures</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Lecturers</h3>
        <form
          onSubmit={handleLecturerSubmit}
          className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-2 gap-3"
        >
          <input
            className="border rounded-lg p-2"
            placeholder="Lecturer name *"
            value={lecturerForm.lecturerName}
            onChange={(e) => setLecturerForm({ ...lecturerForm, lecturerName: e.target.value })}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Department *"
            value={lecturerForm.department}
            onChange={(e) => setLecturerForm({ ...lecturerForm, department: e.target.value })}
          />
          <input
            className="border rounded-lg p-2 md:col-span-2"
            placeholder="Email *"
            type="email"
            value={lecturerForm.email}
            onChange={(e) => setLecturerForm({ ...lecturerForm, email: e.target.value })}
          />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg">
              {editingLecturerId ? "Update Lecturer" : "Add Lecturer"}
            </button>
            {editingLecturerId && (
              <button type="button" className="border px-4 py-2 rounded-lg" onClick={resetLecturerForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Lectures</h3>
        <form
          onSubmit={handleLectureSubmit}
          className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-2 gap-3"
        >
          <input
            className="border rounded-lg p-2"
            placeholder="Lecture name *"
            value={lectureForm.lectureName}
            onChange={(e) => setLectureForm({ ...lectureForm, lectureName: e.target.value })}
          />
          <select
            className="border rounded-lg p-2"
            value={lectureForm.lecturerId}
            onChange={(e) => setLectureForm({ ...lectureForm, lecturerId: e.target.value })}
          >
            <option value="">Select lecturer *</option>
            {lecturers.map((lecturer) => (
              <option key={lecturer.id} value={lecturer.id}>
                {lecturer.lecturerName}
              </option>
            ))}
          </select>
          <div>
            <button
              type="submit"
              className="bg-slate-900 text-white px-4 py-2 rounded-lg"
              disabled={lecturers.length === 0}
            >
              Add Lecture
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Lecturers and their lectures</h3>
        {lecturers.length === 0 ? (
          <p className="text-slate-500 bg-white border border-slate-200 rounded-xl p-4">No lecturers registered</p>
        ) : (
          lecturers.map((lecturer) => (
            <div key={lecturer.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{lecturer.lecturerName}</p>
                  <p className="text-sm text-slate-600">
                    {lecturer.department} · {lecturer.email}
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 bg-amber-500 text-white rounded text-sm"
                  onClick={() => handleEditLecturer(lecturer)}
                >
                  Edit lecturer
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-slate-200">
                    <th className="text-left p-3">Lecture name</th>
                    <th className="text-left p-3 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(lecturer.lectures || []).map((lecture) => (
                    <tr key={lecture.id} className="border-t border-slate-100">
                      <td className="p-3">{lecture.lectureName}</td>
                      <td className="p-3">
                        <button
                          type="button"
                          title="Delete lecture"
                          aria-label={`Delete ${lecture.lectureName}`}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded"
                          onClick={() => handleDeleteLecture(lecture)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(lecturer.lectures || []).length === 0 && (
                    <tr className="border-t border-slate-100">
                      <td colSpan={2} className="p-3 text-slate-500">
                        No lectures for this lecturer
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default LigjëruesiPage;

import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";

const initialSchoolForm = { schoolName: "", city: "" };
const initialStudentForm = { studentName: "", class: "", schoolId: "" };

const SchoolsPage = () => {
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schoolForm, setSchoolForm] = useState(initialSchoolForm);
  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [editingSchoolId, setEditingSchoolId] = useState(null);
  const [filterSchoolId, setFilterSchoolId] = useState("");

  const fetchSchools = async () => {
    const response = await api.get("/schools");
    setSchools(response.data);
  };

  const fetchStudents = async (schoolId = filterSchoolId) => {
    const params = schoolId ? { schoolId } : {};
    const response = await api.get("/students", { params });
    setStudents(response.data);
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchSchools(), fetchStudents()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const schoolId = e.target.value;
    setFilterSchoolId(schoolId);
    fetchStudents(schoolId);
  };

  const resetSchoolForm = () => {
    setSchoolForm(initialSchoolForm);
    setEditingSchoolId(null);
  };

  const handleSchoolSubmit = async (e) => {
    e.preventDefault();
    if (!schoolForm.schoolName || !schoolForm.city) {
      return toast.error("School name and city are required");
    }

    try {
      if (editingSchoolId) {
        await api.put(`/schools/${editingSchoolId}`, schoolForm);
        toast.success("School updated");
      } else {
        await api.post("/schools", schoolForm);
        toast.success("School added");
      }
      resetSchoolForm();
      await fetchSchools();
      await fetchStudents(filterSchoolId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save school");
    }
  };

  const handleEditSchool = (school) => {
    setEditingSchoolId(school.id);
    setSchoolForm({ schoolName: school.schoolName, city: school.city });
  };

  const handleDeleteSchool = async (id) => {
    if (!window.confirm("Delete this school? Its students will also be removed.")) return;
    try {
      await api.delete(`/schools/${id}`);
      toast.success("School deleted");
      if (editingSchoolId === id) resetSchoolForm();
      if (filterSchoolId === String(id)) setFilterSchoolId("");
      await fetchSchools();
      await fetchStudents(filterSchoolId === String(id) ? "" : filterSchoolId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete school");
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!studentForm.studentName || !studentForm.class || !studentForm.schoolId) {
      return toast.error("All student fields are required");
    }

    try {
      await api.post("/students", {
        studentName: studentForm.studentName,
        class: studentForm.class,
        schoolId: Number(studentForm.schoolId),
      });
      toast.success("Student added");
      setStudentForm(initialStudentForm);
      await fetchStudents(filterSchoolId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add student");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Schools & Students</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Schools</h3>
        <form
          onSubmit={handleSchoolSubmit}
          className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-2 gap-3"
        >
          <input
            className="border rounded-lg p-2"
            placeholder="School name *"
            value={schoolForm.schoolName}
            onChange={(e) => setSchoolForm({ ...schoolForm, schoolName: e.target.value })}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="City *"
            value={schoolForm.city}
            onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
          />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg">
              {editingSchoolId ? "Update School" : "Add School"}
            </button>
            {editingSchoolId && (
              <button type="button" className="border px-4 py-2 rounded-lg" onClick={resetSchoolForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3">School name</th>
                <th className="text-left p-3">City</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id} className="border-t">
                  <td className="p-3">{school.schoolName}</td>
                  <td className="p-3">{school.city}</td>
                  <td className="p-3 space-x-2">
                    <button
                      type="button"
                      className="px-3 py-1 bg-amber-500 text-white rounded"
                      onClick={() => handleEditSchool(school)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 bg-rose-600 text-white rounded"
                      onClick={() => handleDeleteSchool(school.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {schools.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-500">
                    No schools registered
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Students</h3>
        <form
          onSubmit={handleStudentSubmit}
          className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-3 gap-3"
        >
          <input
            className="border rounded-lg p-2"
            placeholder="Student name *"
            value={studentForm.studentName}
            onChange={(e) => setStudentForm({ ...studentForm, studentName: e.target.value })}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Class *"
            value={studentForm.class}
            onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
          />
          <select
            className="border rounded-lg p-2"
            value={studentForm.schoolId}
            onChange={(e) => setStudentForm({ ...studentForm, schoolId: e.target.value })}
          >
            <option value="">Select school *</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.schoolName}
              </option>
            ))}
          </select>
          <div className="md:col-span-3">
            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg" disabled={schools.length === 0}>
              Add Student
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-600" htmlFor="filter-school">
            Filter by school:
          </label>
          <select
            id="filter-school"
            className="border rounded-lg p-2 text-sm"
            value={filterSchoolId}
            onChange={handleFilterChange}
          >
            <option value="">All schools</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.schoolName}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3">Student name</th>
                <th className="text-left p-3">Class</th>
                <th className="text-left p-3">School</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="p-3">{student.studentName}</td>
                  <td className="p-3">{student.class}</td>
                  <td className="p-3">{student.school?.schoolName || "-"}</td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default SchoolsPage;

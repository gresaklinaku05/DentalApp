import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";

const initialFactoryForm = { factoryName: "", location: "" };
const initialWorkerForm = { firstName: "", lastName: "", position: "", factoryId: "" };

const FactoriesPage = () => {
  const [factories, setFactories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [factoryForm, setFactoryForm] = useState(initialFactoryForm);
  const [workerForm, setWorkerForm] = useState(initialWorkerForm);
  const [editingFactoryId, setEditingFactoryId] = useState(null);

  const fetchFactories = async () => {
    const response = await api.get("/factories");
    setFactories(response.data);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchFactories();
      setLoading(false);
    };
    load();
  }, []);

  const resetFactoryForm = () => {
    setFactoryForm(initialFactoryForm);
    setEditingFactoryId(null);
  };

  const handleFactorySubmit = async (e) => {
    e.preventDefault();
    if (!factoryForm.factoryName || !factoryForm.location) {
      return toast.error("Factory name and location are required");
    }

    try {
      if (editingFactoryId) {
        await api.put(`/factories/${editingFactoryId}`, factoryForm);
        toast.success("Factory updated");
      } else {
        await api.post("/factories", factoryForm);
        toast.success("Factory added");
      }
      resetFactoryForm();
      await fetchFactories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save factory");
    }
  };

  const handleEditFactory = (factory) => {
    setEditingFactoryId(factory.id);
    setFactoryForm({ factoryName: factory.factoryName, location: factory.location });
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    if (!workerForm.firstName || !workerForm.lastName || !workerForm.position || !workerForm.factoryId) {
      return toast.error("All worker fields are required");
    }

    try {
      await api.post("/workers", {
        firstName: workerForm.firstName,
        lastName: workerForm.lastName,
        position: workerForm.position,
        factoryId: Number(workerForm.factoryId),
      });
      toast.success("Worker added");
      setWorkerForm(initialWorkerForm);
      await fetchFactories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add worker");
    }
  };

  const handleDeleteWorker = async (worker) => {
    if (!window.confirm(`Delete worker ${worker.firstName} ${worker.lastName}?`)) return;
    try {
      await api.delete(`/workers/${worker.id}`);
      toast.success("Worker deleted");
      await fetchFactories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete worker");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Factories & Workers</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Factories</h3>
        <form
          onSubmit={handleFactorySubmit}
          className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-2 gap-3"
        >
          <input
            className="border rounded-lg p-2"
            placeholder="Factory name *"
            value={factoryForm.factoryName}
            onChange={(e) => setFactoryForm({ ...factoryForm, factoryName: e.target.value })}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Location *"
            value={factoryForm.location}
            onChange={(e) => setFactoryForm({ ...factoryForm, location: e.target.value })}
          />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg">
              {editingFactoryId ? "Update Factory" : "Add Factory"}
            </button>
            {editingFactoryId && (
              <button type="button" className="border px-4 py-2 rounded-lg" onClick={resetFactoryForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Workers</h3>
        <form
          onSubmit={handleWorkerSubmit}
          className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <input
            className="border rounded-lg p-2"
            placeholder="First name *"
            value={workerForm.firstName}
            onChange={(e) => setWorkerForm({ ...workerForm, firstName: e.target.value })}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Last name *"
            value={workerForm.lastName}
            onChange={(e) => setWorkerForm({ ...workerForm, lastName: e.target.value })}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Position *"
            value={workerForm.position}
            onChange={(e) => setWorkerForm({ ...workerForm, position: e.target.value })}
          />
          <select
            className="border rounded-lg p-2"
            value={workerForm.factoryId}
            onChange={(e) => setWorkerForm({ ...workerForm, factoryId: e.target.value })}
          >
            <option value="">Select factory *</option>
            {factories.map((factory) => (
              <option key={factory.id} value={factory.id}>
                {factory.factoryName}
              </option>
            ))}
          </select>
          <div className="lg:col-span-4">
            <button
              type="submit"
              className="bg-slate-900 text-white px-4 py-2 rounded-lg"
              disabled={factories.length === 0}
            >
              Add Worker
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Factories and their workers</h3>
        {factories.length === 0 ? (
          <p className="text-slate-500 bg-white border border-slate-200 rounded-xl p-4">No factories registered</p>
        ) : (
          factories.map((factory) => (
            <div key={factory.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{factory.factoryName}</p>
                  <p className="text-sm text-slate-600">{factory.location}</p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 bg-amber-500 text-white rounded text-sm"
                  onClick={() => handleEditFactory(factory)}
                >
                  Edit factory
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-slate-200">
                    <th className="text-left p-3">First name</th>
                    <th className="text-left p-3">Last name</th>
                    <th className="text-left p-3">Position</th>
                    <th className="text-left p-3 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(factory.workers || []).map((worker) => (
                    <tr key={worker.id} className="border-t border-slate-100">
                      <td className="p-3">{worker.firstName}</td>
                      <td className="p-3">{worker.lastName}</td>
                      <td className="p-3">{worker.position}</td>
                      <td className="p-3">
                        <button
                          type="button"
                          title="Delete worker"
                          aria-label={`Delete ${worker.firstName} ${worker.lastName}`}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded"
                          onClick={() => handleDeleteWorker(worker)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(factory.workers || []).length === 0 && (
                    <tr className="border-t border-slate-100">
                      <td colSpan={4} className="p-3 text-slate-500">
                        No workers in this factory
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

export default FactoriesPage;

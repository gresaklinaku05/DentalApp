import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";

const initialPostimiForm = { title: "", content: "", autherName: "" };
const initialKomentiForm = { text: "", postimiId: "" };

const PostimiPage = () => {
  const [postimis, setPostimis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postimiForm, setPostimiForm] = useState(initialPostimiForm);
  const [komentiForm, setKomentiForm] = useState(initialKomentiForm);
  const [editingPostimiId, setEditingPostimiId] = useState(null);

  const fetchPostimis = async () => {
    const response = await api.get("/postimis");
    setPostimis(response.data);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchPostimis();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load postimis");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resetPostimiForm = () => {
    setPostimiForm(initialPostimiForm);
    setEditingPostimiId(null);
  };

  const handlePostimiSubmit = async (e) => {
    e.preventDefault();
    if (!postimiForm.title || !postimiForm.content || !postimiForm.autherName) {
      return toast.error("Title, content, and author are required");
    }

    try {
      if (editingPostimiId) {
        await api.put(`/postimis/${editingPostimiId}`, postimiForm);
        toast.success("Postimi updated");
      } else {
        await api.post("/postimis", postimiForm);
        toast.success("Postimi added");
      }
      resetPostimiForm();
      await fetchPostimis();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save postimi");
    }
  };

  const handleEditPostimi = (postimi) => {
    setEditingPostimiId(postimi.id);
    setPostimiForm({
      title: postimi.title,
      content: postimi.content,
      autherName: postimi.autherName,
    });
  };

  const handleKomentiSubmit = async (e) => {
    e.preventDefault();
    if (!komentiForm.text || !komentiForm.postimiId) {
      return toast.error("Comment text and post are required");
    }

    try {
      await api.post("/komentis", {
        text: komentiForm.text,
        postimiId: Number(komentiForm.postimiId),
      });
      toast.success("Komenti added");
      setKomentiForm(initialKomentiForm);
      await fetchPostimis();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add komenti");
    }
  };

  const handleDeleteKomenti = async (komenti) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/komentis/${komenti.id}`);
      toast.success("Komenti deleted");
      await fetchPostimis();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete komenti");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Postimi & Komenti</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Postimis</h3>
        <form
          onSubmit={handlePostimiSubmit}
          className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-2 gap-3"
        >
          <input
            className="border rounded-lg p-2"
            placeholder="Title *"
            value={postimiForm.title}
            onChange={(e) => setPostimiForm({ ...postimiForm, title: e.target.value })}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Author *"
            value={postimiForm.autherName}
            onChange={(e) => setPostimiForm({ ...postimiForm, autherName: e.target.value })}
          />
          <textarea
            className="border rounded-lg p-2 md:col-span-2"
            placeholder="Content *"
            rows={3}
            value={postimiForm.content}
            onChange={(e) => setPostimiForm({ ...postimiForm, content: e.target.value })}
          />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg">
              {editingPostimiId ? "Update Postimi" : "Add Postimi"}
            </button>
            {editingPostimiId && (
              <button type="button" className="border px-4 py-2 rounded-lg" onClick={resetPostimiForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Komentis</h3>
        <form
          onSubmit={handleKomentiSubmit}
          className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-2 gap-3"
        >
          <input
            className="border rounded-lg p-2 md:col-span-2"
            placeholder="Comment text *"
            value={komentiForm.text}
            onChange={(e) => setKomentiForm({ ...komentiForm, text: e.target.value })}
          />
          <select
            className="border rounded-lg p-2 md:col-span-2"
            value={komentiForm.postimiId}
            onChange={(e) => setKomentiForm({ ...komentiForm, postimiId: e.target.value })}
          >
            <option value="">Select postimi *</option>
            {postimis.map((postimi) => (
              <option key={postimi.id} value={postimi.id}>
                {postimi.title}
              </option>
            ))}
          </select>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-slate-900 text-white px-4 py-2 rounded-lg"
              disabled={postimis.length === 0}
            >
              Add Komenti
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Postimis and their comments</h3>
        {postimis.length === 0 ? (
          <p className="text-slate-500 bg-white border border-slate-200 rounded-xl p-4">No postimis registered</p>
        ) : (
          postimis.map((postimi) => (
            <div key={postimi.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{postimi.title}</p>
                  <p className="text-sm text-slate-600">
                    {postimi.autherName} · {postimi.content}
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 bg-amber-500 text-white rounded text-sm"
                  onClick={() => handleEditPostimi(postimi)}
                >
                  Edit postimi
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-slate-200">
                    <th className="text-left p-3">Comment</th>
                    <th className="text-left p-3 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(postimi.komentet || []).map((komenti) => (
                    <tr key={komenti.id} className="border-t border-slate-100">
                      <td className="p-3">{komenti.text}</td>
                      <td className="p-3">
                        <button
                          type="button"
                          title="Delete komenti"
                          aria-label="Delete comment"
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded"
                          onClick={() => handleDeleteKomenti(komenti)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(postimi.komentet || []).length === 0 && (
                    <tr className="border-t border-slate-100">
                      <td colSpan={2} className="p-3 text-slate-500">
                        No comments on this postimi
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

export default PostimiPage;

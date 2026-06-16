import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/common/LoadingSpinner";

const initialLibraryForm = { libraryName: "", address: "" };
const initialBookForm = { bookName: "", author: "", isbn: "", libraryId: "" };

const LibrariesPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [libraryForm, setLibraryForm] = useState(initialLibraryForm);
  const [bookForm, setBookForm] = useState(initialBookForm);
  const [editingLibraryId, setEditingLibraryId] = useState(null);
  const [filterLibraryId, setFilterLibraryId] = useState("");

  const fetchLibraries = async () => {
    const response = await api.get("/libraries");
    setLibraries(response.data);
  };

  const fetchBooks = async (libraryId = filterLibraryId) => {
    const params = libraryId ? { libraryId } : {};
    const response = await api.get("/books", { params });
    setBooks(response.data);
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchLibraries(), fetchBooks()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const libraryId = e.target.value;
    setFilterLibraryId(libraryId);
    fetchBooks(libraryId);
  };

  const resetLibraryForm = () => {
    setLibraryForm(initialLibraryForm);
    setEditingLibraryId(null);
  };

  const handleLibrarySubmit = async (e) => {
    e.preventDefault();
    if (!libraryForm.libraryName || !libraryForm.address) {
      return toast.error("Library name and address are required");
    }

    try {
      if (editingLibraryId) {
        await api.put(`/libraries/${editingLibraryId}`, libraryForm);
        toast.success("Library updated");
      } else {
        await api.post("/libraries", libraryForm);
        toast.success("Library added");
      }
      resetLibraryForm();
      await fetchLibraries();
      await fetchBooks(filterLibraryId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save library");
    }
  };

  const handleEditLibrary = (library) => {
    setEditingLibraryId(library.id);
    setLibraryForm({ libraryName: library.libraryName, address: library.address });
  };

  const handleDeleteLibrary = async (id) => {
    if (!window.confirm("Delete this library? Its books will also be removed.")) return;
    try {
      await api.delete(`/libraries/${id}`);
      toast.success("Library deleted");
      if (editingLibraryId === id) resetLibraryForm();
      if (filterLibraryId === String(id)) setFilterLibraryId("");
      await fetchLibraries();
      await fetchBooks(filterLibraryId === String(id) ? "" : filterLibraryId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete library");
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!bookForm.bookName || !bookForm.author || !bookForm.isbn || !bookForm.libraryId) {
      return toast.error("All book fields are required");
    }

    try {
      await api.post("/books", {
        bookName: bookForm.bookName,
        author: bookForm.author,
        isbn: bookForm.isbn,
        libraryId: Number(bookForm.libraryId),
      });
      toast.success("Book added");
      setBookForm(initialBookForm);
      await fetchBooks(filterLibraryId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add book");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Libraries & Books</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Libraries</h3>
        <form
          onSubmit={handleLibrarySubmit}
          className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-2 gap-3"
        >
          <input
            className="border rounded-lg p-2"
            placeholder="Library name *"
            value={libraryForm.libraryName}
            onChange={(e) => setLibraryForm({ ...libraryForm, libraryName: e.target.value })}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Address *"
            value={libraryForm.address}
            onChange={(e) => setLibraryForm({ ...libraryForm, address: e.target.value })}
          />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg">
              {editingLibraryId ? "Update Library" : "Add Library"}
            </button>
            {editingLibraryId && (
              <button type="button" className="border px-4 py-2 rounded-lg" onClick={resetLibraryForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3">Library name</th>
                <th className="text-left p-3">Address</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {libraries.map((library) => (
                <tr key={library.id} className="border-t">
                  <td className="p-3">{library.libraryName}</td>
                  <td className="p-3">{library.address}</td>
                  <td className="p-3 space-x-2">
                    <button
                      type="button"
                      className="px-3 py-1 bg-amber-500 text-white rounded"
                      onClick={() => handleEditLibrary(library)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 bg-rose-600 text-white rounded"
                      onClick={() => handleDeleteLibrary(library.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {libraries.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-500">
                    No libraries registered
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Books</h3>
        <form
          onSubmit={handleBookSubmit}
          className="bg-white rounded-xl p-4 border border-slate-200 grid md:grid-cols-3 gap-3"
        >
          <input
            className="border rounded-lg p-2"
            placeholder="Book title *"
            value={bookForm.bookName}
            onChange={(e) => setBookForm({ ...bookForm, bookName: e.target.value })}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Author *"
            value={bookForm.author}
            onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="ISBN *"
            value={bookForm.isbn}
            onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
          />
          <select
            className="border rounded-lg p-2"
            value={bookForm.libraryId}
            onChange={(e) => setBookForm({ ...bookForm, libraryId: e.target.value })}
          >
            <option value="">Select library *</option>
            {libraries.map((library) => (
              <option key={library.id} value={library.id}>
                {library.libraryName}
              </option>
            ))}
          </select>
          <div className="md:col-span-3">
            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg" disabled={libraries.length === 0}>
              Add Book
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-600" htmlFor="filter-library">
            Filter by library:
          </label>
          <select
            id="filter-library"
            className="border rounded-lg p-2 text-sm"
            value={filterLibraryId}
            onChange={handleFilterChange}
          >
            <option value="">All libraries</option>
            {libraries.map((library) => (
              <option key={library.id} value={library.id}>
                {library.libraryName}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3">Book title</th>
                <th className="text-left p-3">Author</th>
                <th className="text-left p-3">ISBN</th>
                <th className="text-left p-3">Library</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="p-3">{book.bookName}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3">{book.isbn}</td>
                  <td className="p-3">{book.library?.libraryName || "-"}</td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-500">
                    No books found
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

export default LibrariesPage;

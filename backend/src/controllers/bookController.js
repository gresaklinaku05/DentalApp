const { Book , Library } = require("../models");
const { logAudit } = require("../utils/audit");

const createBook = async (req, res, next) => {
  try {
    const { bookName, author, isbn, libraryId } = req.body;
    const library = await Library.findByPk(libraryId);
    if (!library) return res.status(400).json({ message: "Selected library does not exist" });

    const book = await Book.create({
      bookName,
      author,
      isbn,
      libraryId,
    });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Book", entityId: book.id });
    return res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

const getBooks = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.libraryId) {
      where.libraryId = req.query.libraryId;
    }

    const books = await Book.findAll({
      where,
      include: [{ model: Library, as: "library", attributes: ["id", "libraryName", "address"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(books);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBook,
  getBooks,
};

const { Library } = require("../models");
const { logAudit } = require("../utils/audit");

const createLibrary = async (req, res, next) => {
  try {
    const { libraryName, address } = req.body;
    const library = await Library.create({ libraryName, address });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Library", entityId: library.id });
    return res.status(201).json(library);
  } catch (error) {
    next(error);
  }
};

const getLibraries = async (req, res, next) => {
  try {
    const libraries = await Library.findAll({ order: [["libraryName", "ASC"]] });
    return res.json(libraries);
  } catch (error) {
    next(error);
  }
};

const updateLibrary = async (req, res, next) => {
  try {
    const library = await Library.findByPk(req.params.id);
    if (!library) return res.status(404).json({ message: "Library not found" });

    await library.update(req.body);
    await logAudit({ userId: req.user.id, action: "UPDATE", entity: "Library", entityId: library.id });
    return res.json(library);
  } catch (error) {
    next(error);
  }
};

const deleteLibrary = async (req, res, next) => {
  try {
    const library = await Library.findByPk(req.params.id);
    if (!library) return res.status(404).json({ message: "Library not found" });

    await library.destroy();
    await logAudit({ userId: req.user.id, action: "DELETE", entity: "Library", entityId: library.id });
    return res.json({ message: "Library deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLibrary,
  getLibraries,
  updateLibrary,
  deleteLibrary,
};

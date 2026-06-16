const { Ligjëruesi, Ligjerata } = require("../models");
const { logAudit } = require("../utils/audit");

const createLecturer = async (req, res, next) => {
  try {
    const { lecturerName, department, email } = req.body;
    const lecturer = await Ligjëruesi.create({ lecturerName, department, email });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Lecturer", entityId: lecturer.id });
    return res.status(201).json(lecturer);
  } catch (error) {
    next(error);
  }
};

const getLecturers = async (req, res, next) => {
  try {
    const lecturers = await Ligjëruesi.findAll({
      include: [{ model: Ligjerata, as: "lectures" }],
      order: [
        ["lecturerName", "ASC"],
        [{ model: Ligjerata, as: "lectures" }, "lectureName", "ASC"],
      ],
    });
    return res.json(lecturers);
  } catch (error) {
    next(error);
  }
};

const updateLecturer = async (req, res, next) => {
  try {
    const lecturer = await Ligjëruesi.findByPk(req.params.id);
    if (!lecturer) return res.status(404).json({ message: "Lecturer not found" });

    await lecturer.update(req.body);
    await logAudit({ userId: req.user.id, action: "UPDATE", entity: "Lecturer", entityId: lecturer.id });
    return res.json(lecturer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLecturer,
  getLecturers,
  updateLecturer,
};
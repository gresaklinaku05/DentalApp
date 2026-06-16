const { Ligjerata, Ligjëruesi } = require("../models");
const { logAudit } = require("../utils/audit");

const createLecture = async (req, res, next) => {
  try {
    const { lectureName, lecturerId } = req.body;
    const lecturer = await Ligjëruesi.findByPk(lecturerId);
    if (!lecturer) return res.status(400).json({ message: "Selected lecture does not exist" });

    const lecture = await Ligjerata.create({ lectureName, lecturerId });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Lecture", entityId: lecture.id });
    return res.status(201).json(lecture);
  } catch (error) {
    next(error);
  }
};

const getLectures = async (req, res, next) => {
  try {
    const lectures = await Ligjerata.findAll({
      include: [{ model: Ligjëruesi, as: "lecturer", attributes: ["id", "lecturerName", "department"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(lectures);
  } catch (error) {
    next(error);
  }
};

const deleteLecture = async (req, res, next) => {
  try {
    const lecture = await Ligjerata.findByPk(req.params.id);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    await lecture.destroy();
    await logAudit({ userId: req.user.id, action: "DELETE", entity: "Lecture", entityId: lecture.id });
    return res.json({ message: "Lecture deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLecture,
  getLectures,
  deleteLecture,
};
const { Student, School } = require("../models");
const { logAudit } = require("../utils/audit");

const createStudent = async (req, res, next) => {
  try {
    const { studentName, class: studentClass, schoolId } = req.body;
    const school = await School.findByPk(schoolId);
    if (!school) return res.status(400).json({ message: "Selected school does not exist" });

    const student = await Student.create({
      studentName,
      class: studentClass,
      schoolId,
    });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Student", entityId: student.id });
    return res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

const getStudents = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.schoolId) {
      where.schoolId = req.query.schoolId;
    }

    const students = await Student.findAll({
      where,
      include: [{ model: School, as: "school", attributes: ["id", "schoolName", "city"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(students);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getStudents,
};

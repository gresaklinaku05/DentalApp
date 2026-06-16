const { School } = require("../models");
const { logAudit } = require("../utils/audit");

const createSchool = async (req, res, next) => {
  try {
    const { schoolName, city } = req.body;
    const school = await School.create({ schoolName, city });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "School", entityId: school.id });
    return res.status(201).json(school);
  } catch (error) {
    next(error);
  }
};

const getSchools = async (req, res, next) => {
  try {
    const schools = await School.findAll({ order: [["schoolName", "ASC"]] });
    return res.json(schools);
  } catch (error) {
    next(error);
  }
};

const updateSchool = async (req, res, next) => {
  try {
    const school = await School.findByPk(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });

    await school.update(req.body);
    await logAudit({ userId: req.user.id, action: "UPDATE", entity: "School", entityId: school.id });
    return res.json(school);
  } catch (error) {
    next(error);
  }
};

const deleteSchool = async (req, res, next) => {
  try {
    const school = await School.findByPk(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });

    await school.destroy();
    await logAudit({ userId: req.user.id, action: "DELETE", entity: "School", entityId: school.id });
    return res.json({ message: "School deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchool,
  getSchools,
  updateSchool,
  deleteSchool,
};

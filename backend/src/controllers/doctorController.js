const { Doctor } = require("../models");
const { logAudit } = require("../utils/audit");

const createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Doctor", entityId: doctor.id });
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({ order: [["createdAt", "DESC"]] });
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    await doctor.update(req.body);
    await logAudit({ userId: req.user.id, action: "UPDATE", entity: "Doctor", entityId: doctor.id });
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    await doctor.destroy();
    await logAudit({ userId: req.user.id, action: "DELETE", entity: "Doctor", entityId: doctor.id });
    res.json({ message: "Doctor deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDoctor, getDoctors, updateDoctor, deleteDoctor };

const { Patient } = require("../models");
const { logAudit } = require("../utils/audit");

const createPatient = async (req, res, next) => {
  try {
    const { fullName, phone, email, address, dateOfBirth, notes } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ message: "Full name and phone are required" });
    }

    const patient = await Patient.create({
      fullName,
      phone,
      email,
      address,
      dateOfBirth,
      notes,
    });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Patient", entityId: patient.id });
    return res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};

const getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(patients);
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    await patient.update(req.body);
    await logAudit({ userId: req.user.id, action: "UPDATE", entity: "Patient", entityId: patient.id });
    return res.json(patient);
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    await patient.destroy();
    await logAudit({ userId: req.user.id, action: "DELETE", entity: "Patient", entityId: patient.id });
    return res.json({ message: "Patient deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
};

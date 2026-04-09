const { PatientHistory, Patient, Doctor } = require("../models");
const { logAudit } = require("../utils/audit");

const doctorFilter = async (req) => {
  if (req.user.role !== "doctor") return {};
  const doctor = await Doctor.findOne({ where: { email: req.user.email } });
  if (!doctor) return { doctorId: -1 };
  return { doctorId: doctor.id };
};

const createHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.body.patientId);
    const doctor = await Doctor.findByPk(req.body.doctorId);
    if (!patient || !doctor) return res.status(404).json({ message: "Patient or doctor not found" });
    if (req.user.role === "doctor" && req.user.email !== doctor.email) {
      return res.status(403).json({ message: "Doctors can only add their own records" });
    }
    const record = await PatientHistory.create(req.body);
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "PatientHistory", entityId: record.id });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const where = await doctorFilter(req);
    const records = await PatientHistory.findAll({
      where,
      include: [
        { model: Patient, as: "patient", attributes: ["id", "fullName"] },
        { model: Doctor, as: "doctor", attributes: ["id", "fullName", "specialty", "email"] },
      ],
      order: [["visitDate", "DESC"]],
    });
    res.json(records);
  } catch (error) {
    next(error);
  }
};

const updateHistory = async (req, res, next) => {
  try {
    const record = await PatientHistory.findByPk(req.params.id, {
      include: [{ model: Doctor, as: "doctor" }],
    });
    if (!record) return res.status(404).json({ message: "History record not found" });
    if (req.user.role === "doctor" && record.doctor?.email !== req.user.email) {
      return res.status(403).json({ message: "Cannot modify other doctors' history" });
    }
    await record.update(req.body);
    await logAudit({ userId: req.user.id, action: "UPDATE", entity: "PatientHistory", entityId: record.id });
    res.json(record);
  } catch (error) {
    next(error);
  }
};

const deleteHistory = async (req, res, next) => {
  try {
    const record = await PatientHistory.findByPk(req.params.id, {
      include: [{ model: Doctor, as: "doctor" }],
    });
    if (!record) return res.status(404).json({ message: "History record not found" });
    if (req.user.role === "doctor" && record.doctor?.email !== req.user.email) {
      return res.status(403).json({ message: "Cannot delete other doctors' history" });
    }
    await record.destroy();
    await logAudit({ userId: req.user.id, action: "DELETE", entity: "PatientHistory", entityId: record.id });
    res.json({ message: "History record deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createHistory, getHistory, updateHistory, deleteHistory };

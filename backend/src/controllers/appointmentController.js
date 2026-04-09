const { Appointment, Patient, Doctor } = require("../models");
const { logAudit } = require("../utils/audit");

const createAppointment = async (req, res, next) => {
  try {
    const { patientId, doctorId, appointmentDate, reason, status, notes } = req.body;

    const patient = await Patient.findByPk(patientId);
    const doctor = await Doctor.findByPk(doctorId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      reason,
      status,
      notes,
    });

    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Appointment", entityId: appointment.id });
    return res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Patient, as: "patient", attributes: ["id", "fullName", "phone"] },
        { model: Doctor, as: "doctor", attributes: ["id", "fullName", "specialty"] },
      ],
      order: [["appointmentDate", "DESC"]],
    });
    return res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (req.body.patientId || req.body.doctorId) {
      const patient = await Patient.findByPk(req.body.patientId || appointment.patientId);
      const doctor = await Doctor.findByPk(req.body.doctorId || appointment.doctorId);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    }

    await appointment.update(req.body);
    await logAudit({ userId: req.user.id, action: "UPDATE", entity: "Appointment", entityId: appointment.id });
    return res.json(appointment);
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    await appointment.destroy();
    await logAudit({ userId: req.user.id, action: "DELETE", entity: "Appointment", entityId: appointment.id });
    return res.json({ message: "Appointment deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};

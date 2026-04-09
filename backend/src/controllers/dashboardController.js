const { Patient, Appointment, Doctor } = require("../models");
const { fn, col, literal } = require("sequelize");

const getOverview = async (req, res, next) => {
  try {
    const [totalPatients, totalAppointments] = await Promise.all([
      Patient.count(),
      Appointment.count(),
    ]);

    res.json({ totalPatients, totalAppointments });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const patientsPerDoctor = await Doctor.findAll({
      attributes: [
        "id",
        "fullName",
        [fn("COUNT", literal("DISTINCT appointments.patientId")), "totalPatients"],
      ],
      include: [
        {
          model: Appointment,
          as: "appointments",
          attributes: [],
          required: false,
        },
      ],
      group: ["Doctor.id"],
      raw: true,
    });

    const appointmentsPerMonth = await Appointment.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("appointmentDate"), "%Y-%m"), "month"],
        [fn("COUNT", col("id")), "total"],
      ],
      group: [literal("month")],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    const appointmentsByStatus = await Appointment.findAll({
      attributes: ["status", [fn("COUNT", col("id")), "total"]],
      group: ["status"],
      raw: true,
    });

    res.json({ patientsPerDoctor, appointmentsPerMonth, appointmentsByStatus });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview, getAnalytics };

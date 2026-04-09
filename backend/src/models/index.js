const sequelize = require("../config/database");
const User = require("./User");
const Patient = require("./Patient");
const Appointment = require("./Appointment");
const RefreshToken = require("./RefreshToken");
const Doctor = require("./Doctor");
const PatientHistory = require("./PatientHistory");
const AuditLog = require("./AuditLog");

Patient.hasMany(Appointment, {
  foreignKey: "patientId",
  as: "appointments",
  onDelete: "CASCADE",
});
Appointment.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });
Doctor.hasMany(Appointment, {
  foreignKey: "doctorId",
  as: "appointments",
  onDelete: "RESTRICT",
});
Appointment.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctor" });

User.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
  onDelete: "CASCADE",
});
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

Patient.hasMany(PatientHistory, {
  foreignKey: "patientId",
  as: "history",
  onDelete: "CASCADE",
});
Doctor.hasMany(PatientHistory, {
  foreignKey: "doctorId",
  as: "history",
  onDelete: "RESTRICT",
});
PatientHistory.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });
PatientHistory.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctor" });

User.hasMany(AuditLog, { foreignKey: "userId", as: "auditLogs", onDelete: "SET NULL" });
AuditLog.belongsTo(User, { foreignKey: "userId", as: "user" });

const initDb = async () => {
  await sequelize.authenticate();
};

module.exports = {
  sequelize,
  initDb,
  User,
  Patient,
  Appointment,
  RefreshToken,
  Doctor,
  PatientHistory,
  AuditLog,
};

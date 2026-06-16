const sequelize = require("../config/database");
const User = require("./User");
const Patient = require("./Patient");
const Appointment = require("./Appointment");
const RefreshToken = require("./RefreshToken");
const Doctor = require("./Doctor");
const PatientHistory = require("./PatientHistory");
const AuditLog = require("./AuditLog");
const School = require("./School");
const Student = require("./Student");
const Factory = require("./Factory");
const Worker = require("./Worker");
const Ligjëruesi = require("./Ligjëruesi");
const Ligjerata = require("./Ligjerata");
const Library = require("./Library");
const Book = require("./Book");
const Postimi = require("./Postimi");
const Komenti = require("./Komenti");

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

School.hasMany(Student, { foreignKey: "schoolId", as: "students", onDelete: "CASCADE" });
Student.belongsTo(School, { foreignKey: "schoolId", as: "school" });

Factory.hasMany(Worker, { foreignKey: "factoryId", as: "workers", onDelete: "CASCADE" });
Worker.belongsTo(Factory, { foreignKey: "factoryId", as: "factory" });

Ligjëruesi.hasMany(Ligjerata, { foreignKey: "lecturerId", as: "lectures", onDelete: "CASCADE" });
Ligjerata.belongsTo(Ligjëruesi, { foreignKey: "lecturerId", as: "lecturer" });

Library.hasMany(Book, { foreignKey: "libraryId", as: "books", onDelete: "CASCADE" });
Book.belongsTo(Library, { foreignKey: "libraryId", as: "library" });

Postimi.hasMany(Komenti, { foreignKey: "postimiId", as: "komentet", onDelete: "CASCADE" });
Komenti.belongsTo(Postimi, { foreignKey: "postimiId", as: "postimi" });

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
  School,
  Student,
  Factory,
  Worker,
  Ligjëruesi,
  Ligjerata,
  Library,
  Book,
  Postimi,
  Komenti,
};

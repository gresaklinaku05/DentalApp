const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const patientSchema = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().allow("", null),
  address: Joi.string().allow("", null),
  dateOfBirth: Joi.date().iso().allow(null, ""),
  notes: Joi.string().allow("", null),
});

const doctorSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  specialty: Joi.string().required(),
});

const appointmentSchema = Joi.object({
  patientId: Joi.number().integer().required(),
  doctorId: Joi.number().integer().required(),
  appointmentDate: Joi.date().required(),
  reason: Joi.string().required(),
  status: Joi.string().valid("scheduled", "completed", "cancelled").optional(),
  notes: Joi.string().allow("", null),
});

const patientHistorySchema = Joi.object({
  patientId: Joi.number().integer().required(),
  doctorId: Joi.number().integer().required(),
  visitDate: Joi.date().required(),
  diagnosis: Joi.string().required(),
  treatment: Joi.string().required(),
  notes: Joi.string().allow("", null),
});

const schoolSchema = Joi.object({
  schoolName: Joi.string().required(),
  city: Joi.string().required(),
});

const studentSchema = Joi.object({
  studentName: Joi.string().required(),
  class: Joi.string().required(),
  schoolId: Joi.number().integer().required(),
});

const factorySchema = Joi.object({
  factoryName: Joi.string().required(),
  location: Joi.string().required(),
});

const workerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  position: Joi.string().required(),
  factoryId: Joi.number().integer().required(),
});

const lecturerSchema = Joi.object({
  lecturerName: Joi.string().required(),
  department: Joi.string().required(),
  email: Joi.string().email().required(),
});

const lectureSchema = Joi.object({
  lectureName: Joi.string().required(),
  lecturerId: Joi.number().integer().required(),
});

const librarySchema = Joi.object({
  libraryName: Joi.string().required(),
  address: Joi.string().required(),
});

const bookSchema = Joi.object({
  bookName: Joi.string().required(),
  author: Joi.string().required(),
  isbn: Joi.string().required(),
  libraryId: Joi.number().integer().required(),
});

const postimiSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  autherName: Joi.string().required(),
});

const komentiSchema = Joi.object({
  text: Joi.string().required(),
  postimiId: Joi.number().integer().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  patientSchema,
  doctorSchema,
  appointmentSchema,
  patientHistorySchema,
  schoolSchema,
  studentSchema,
  factorySchema,
  workerSchema,
  lecturerSchema,
  lectureSchema,
  librarySchema,
  bookSchema,
  postimiSchema,
  komentiSchema,
};

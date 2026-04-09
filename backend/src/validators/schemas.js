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

module.exports = {
  registerSchema,
  loginSchema,
  patientSchema,
  doctorSchema,
  appointmentSchema,
  patientHistorySchema,
};

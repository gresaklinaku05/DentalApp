const bcrypt = require("bcryptjs");
const { sequelize, User, Patient, Doctor, Appointment, PatientHistory, RefreshToken } = require("../models");

const seed = async () => {
  try {
    await sequelize.authenticate();
    // Expect schema created via migrations.

    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const doctorUserPassword = await bcrypt.hash("Doctor@123", 10);
    const staffPassword = await bcrypt.hash("Staff@123", 10);
    await User.destroy({ where: {} });
    await PatientHistory.destroy({ where: {} });
    await Appointment.destroy({ where: {} });
    await Doctor.destroy({ where: {} });
    await Patient.destroy({ where: {} });
    await RefreshToken.destroy({ where: {} });

    await User.create({
      name: "Clinic Admin",
      email: "admin@clinic.com",
      password: adminPassword,
      role: "admin",
    });
    await User.create({
      name: "Dr. Emily Brown",
      email: "doctor@clinic.com",
      password: doctorUserPassword,
      role: "doctor",
    });
    await User.create({
      name: "Front Desk Staff",
      email: "staff@clinic.com",
      password: staffPassword,
      role: "staff",
    });

    const doctor1 = await Doctor.create({
      fullName: "Dr. Emily Brown",
      email: "doctor@clinic.com",
      phone: "555-0201",
      specialty: "Orthodontics",
    });
    const doctor2 = await Doctor.create({
      fullName: "Dr. Michael Lee",
      email: "michael.lee@clinic.com",
      phone: "555-0202",
      specialty: "General Dentistry",
    });

    const patient1 = await Patient.create({
      fullName: "John Doe",
      phone: "555-0101",
      email: "john.doe@email.com",
      address: "123 Main St",
      dateOfBirth: "1990-05-12",
      notes: "First-time patient",
    });

    const patient2 = await Patient.create({
      fullName: "Sara Khan",
      phone: "555-0102",
      email: "sara.khan@email.com",
      address: "456 Oak Ave",
      dateOfBirth: "1988-09-21",
      notes: "Requires follow-up for cleaning",
    });

    await Appointment.bulkCreate([
      {
        patientId: patient1.id,
        doctorId: doctor1.id,
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        reason: "Dental cleaning",
        status: "scheduled",
        notes: "",
      },
      {
        patientId: patient2.id,
        doctorId: doctor2.id,
        appointmentDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        reason: "Cavity check",
        status: "scheduled",
        notes: "",
      },
    ]);

    await PatientHistory.bulkCreate([
      {
        patientId: patient1.id,
        doctorId: doctor1.id,
        visitDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        diagnosis: "Mild plaque buildup",
        treatment: "Professional cleaning",
        notes: "Follow up in 6 months",
      },
      {
        patientId: patient2.id,
        doctorId: doctor2.id,
        visitDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        diagnosis: "Early cavity",
        treatment: "Composite filling",
        notes: "Monitor sensitivity",
      },
    ]);

    console.log("Seed completed successfully.");
    console.log("Admin login: admin@clinic.com / Admin@123");
    console.log("Doctor login: doctor@clinic.com / Doctor@123");
    console.log("Staff login: staff@clinic.com / Staff@123");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();

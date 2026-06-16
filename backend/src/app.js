const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientHistoryRoutes = require("./routes/patientHistoryRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const studentRoutes = require("./routes/studentRoutes");
const factoryRoutes = require("./routes/factoryRoutes");
const workerRoutes = require("./routes/workerRoutes");
const lecturerRoutes = require("./routes/ligjëruesiRoutes");
const lectureRoutes = require("./routes/ligjerataRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const komentiRoutes = require("./routes/komentiRoutes");
const postimiRoutes = require("./routes/postimiRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patient-history", patientHistoryRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/factories", factoryRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/libraries", libraryRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/postimis", postimiRoutes);
app.use("/api/komentis", komentiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

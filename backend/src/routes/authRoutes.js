const express = require("express");
const { login, logout, refreshToken, register } = require("../controllers/authController");
const validate = require("../middleware/validateMiddleware");
const { registerSchema, loginSchema } = require("../validators/schemas");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;

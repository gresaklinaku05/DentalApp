const express = require("express");
const { createLecture, getLectures, deleteLecture } = require("../controllers/ligjerataController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { lectureSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").get(getLectures).post(validate(lectureSchema), createLecture);
router.route("/:id").delete(deleteLecture);

module.exports = router;
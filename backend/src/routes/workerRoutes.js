const express = require("express");
const { createWorker, getWorkers, deleteWorker } = require("../controllers/workerController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { workerSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").get(getWorkers).post(validate(workerSchema), createWorker);
router.route("/:id").delete(deleteWorker);

module.exports = router;

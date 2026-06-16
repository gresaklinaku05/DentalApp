const express = require("express");
const {
  createPostimi,
  getPostimis,
  updatePostimi,
} = require("../controllers/postimiController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { postimiSchema} = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").get(getPostimis).post(validate(postimiSchema), createPostimi);
router.route("/:id").put(validate(postimiSchema), updatePostimi);

module.exports = router;

const express = require("express");
const {
  createFactory,
  getFactories,
  updateFactory,
} = require("../controllers/factoryController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { factorySchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").get(getFactories).post(validate(factorySchema), createFactory);
router.route("/:id").put(validate(factorySchema), updateFactory);

module.exports = router;

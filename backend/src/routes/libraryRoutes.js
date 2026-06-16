const express = require("express");
const {
  createLibrary,
  getLibraries,
  updateLibrary,
  deleteLibrary,
} = require("../controllers/libraryController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { librarySchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").get(getLibraries).post(validate(librarySchema), createLibrary);
router.route("/:id").put(validate(librarySchema), updateLibrary).delete(deleteLibrary);

module.exports = router;

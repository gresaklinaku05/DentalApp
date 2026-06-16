const express = require("express");
const { createBook, getBooks } = require("../controllers/bookController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { bookSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").get(getBooks).post(validate(bookSchema), createBook);

module.exports = router;

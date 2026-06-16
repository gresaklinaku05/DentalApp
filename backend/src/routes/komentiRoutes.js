const express = require("express");
const { createKomenti, getKomentis, deleteKomenti } = require("../controllers/komentiController");
const authenticate = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { komentiSchema } = require("../validators/schemas");

const router = express.Router();

router.use(authenticate);
router.route("/").get(getKomentis).post(validate(komentiSchema), createKomenti);
router.route("/:id").delete(deleteKomenti);

module.exports = router;

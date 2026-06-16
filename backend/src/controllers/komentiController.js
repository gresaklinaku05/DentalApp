const { Komenti,Postimi  } = require("../models");
const { logAudit } = require("../utils/audit");

const createKomenti = async (req, res, next) => {
  try {
    const { text, postimiId } = req.body;
    const postimi = await Postimi.findByPk(postimiId);
    if (!postimi) return res.status(400).json({ message: "Selected postimi does not exist" });

    const komenti = await Komenti.create({ text, postimiId });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Komenti", entityId: komenti.id });
    return res.status(201).json(komenti);
  } catch (error) {
    next(error);
  }
};

const getKomentis = async (req, res, next) => {
  try {
    const komentis = await Komenti.findAll({
      include: [{ model: Postimi, as: "postimi", attributes: ["id", "title"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(komentis);
  } catch (error) {
    next(error);
  }
};

const deleteKomenti = async (req, res, next) => {
  try {
    const komenti = await Komenti.findByPk(req.params.id);
    if (!komenti) return res.status(404).json({ message: "Komenti not found" });

    await komenti.destroy();
    await logAudit({ userId: req.user.id, action: "DELETE", entity: "Komenti", entityId: komenti.id });
    return res.json({ message: "Komenti deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createKomenti,
  getKomentis,
  deleteKomenti,
};

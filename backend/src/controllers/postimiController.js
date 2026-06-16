const { Postimi,Komenti } = require("../models");
const { logAudit } = require("../utils/audit");

const createPostimi = async (req, res, next) => {
  try {
    const { title, content, autherName } = req.body;
    const postimi = await Postimi.create({ title, content, autherName });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Postimi", entityId: postimi.id });
    return res.status(201).json(postimi);
  } catch (error) {
    next(error);
  }
};

const getPostimis = async (req, res, next) => {
  try {
    const postimis = await Postimi.findAll({
      include: [{ model: Komenti, as: "komentet" }],
      order: [
        ["createdAt", "DESC"],
        [{ model: Komenti, as: "komentet" }, "createdAt", "ASC"],
      ],
    });
    return res.json(postimis);
  } catch (error) {
    next(error);
  }
};

const updatePostimi = async (req, res, next) => {
  try {
    const postimi = await Postimi.findByPk(req.params.id);
    if (!postimi) return res.status(404).json({ message: "Postimi not found" });

    await postimi.update(req.body);
    await logAudit({ userId: req.user.id, action: "UPDATE", entity: "Postimi", entityId: postimi.id });
    return res.json(postimi);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPostimi,
  getPostimis,
  updatePostimi,
};

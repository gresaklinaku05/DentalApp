const { Factory, Worker } = require("../models");
const { logAudit } = require("../utils/audit");

const createFactory = async (req, res, next) => {
  try {
    const { factoryName, location } = req.body;
    const factory = await Factory.create({ factoryName, location });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Factory", entityId: factory.id });
    return res.status(201).json(factory);
  } catch (error) {
    next(error);
  }
};

const getFactories = async (req, res, next) => {
  try {
    const factories = await Factory.findAll({
      include: [{ model: Worker, as: "workers" }],
      order: [
        ["factoryName", "ASC"],
        [{ model: Worker, as: "workers" }, "lastName", "ASC"],
      ],
    });
    return res.json(factories);
  } catch (error) {
    next(error);
  }
};

const updateFactory = async (req, res, next) => {
  try {
    const factory = await Factory.findByPk(req.params.id);
    if (!factory) return res.status(404).json({ message: "Factory not found" });

    await factory.update(req.body);
    await logAudit({ userId: req.user.id, action: "UPDATE", entity: "Factory", entityId: factory.id });
    return res.json(factory);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFactory,
  getFactories,
  updateFactory,
};

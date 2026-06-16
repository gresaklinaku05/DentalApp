const { Worker, Factory } = require("../models");
const { logAudit } = require("../utils/audit");

const createWorker = async (req, res, next) => {
  try {
    const { firstName, lastName, position, factoryId } = req.body;
    const factory = await Factory.findByPk(factoryId);
    if (!factory) return res.status(400).json({ message: "Selected factory does not exist" });

    const worker = await Worker.create({ firstName, lastName, position, factoryId });
    await logAudit({ userId: req.user.id, action: "CREATE", entity: "Worker", entityId: worker.id });
    return res.status(201).json(worker);
  } catch (error) {
    next(error);
  }
};

const getWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.findAll({
      include: [{ model: Factory, as: "factory", attributes: ["id", "factoryName", "location"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(workers);
  } catch (error) {
    next(error);
  }
};

const deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findByPk(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    await worker.destroy();
    await logAudit({ userId: req.user.id, action: "DELETE", entity: "Worker", entityId: worker.id });
    return res.json({ message: "Worker deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorker,
  getWorkers,
  deleteWorker,
};

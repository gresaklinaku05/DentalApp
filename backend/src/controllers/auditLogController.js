const { AuditLog, User } = require("../models");
const { Op } = require("sequelize");

const getAuditLogs = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const offset = (page - 1) * limit;
    const where = {};

    if (req.query.entity) where.entity = req.query.entity;
    if (req.query.action) where.action = req.query.action;
    if (req.query.userId) where.userId = Number(req.query.userId);
    if (req.query.from || req.query.to) {
      where.timestamp = {};
      if (req.query.from) where.timestamp[Op.gte] = new Date(req.query.from);
      if (req.query.to) where.timestamp[Op.lte] = new Date(req.query.to);
    }

    const { rows, count } = await AuditLog.findAndCountAll({
      where,
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "role"] }],
      order: [["timestamp", "DESC"]],
      limit,
      offset,
    });
    res.json({ data: rows, page, limit, total: count });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuditLogs };

const { AuditLog } = require("../models");

const logAudit = async ({ userId, action, entity, entityId = null }) => {
  try {
    await AuditLog.create({ userId, action, entity, entityId });
  } catch {
    // avoid blocking request on audit failure
  }
};

module.exports = { logAudit };

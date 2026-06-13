const auditService = require('../services/auditService');

//all audit logs
const getAllLogs = (req, res, next) => {
  try {
    const logs = auditService.getAllLogs();
    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLogs
};

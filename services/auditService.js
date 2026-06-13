const { auditLogs } = require('../data/store');

/*
  Adds an entry to the audit log
  @param {Object} entry - Audit log entry
 */
const addLog = (entry) => {
  auditLogs.push({
    ...entry,
    timestamp: new Date().toISOString()
  });
};

/*
  Gets all audit logs in reverse chronological order
  @returns {Array} - List of audit logs
 */
const getAllLogs = () => {
  return [...auditLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

module.exports = {
  addLog,
  getAllLogs
};

const { v4: uuidv4 } = require('uuid');
const { leaves } = require('../data/store');
const employeeService = require('./employeeService');
const auditService = require('./auditService');

/*
 Creates a leave request
  @param {Object} leaveData - Leave request data
  @returns {Object} - Created leave
 */
const createLeave = (leaveData) => {
  const { employeeId, startDate, endDate } = leaveData;

  // Verify employee exists
  const employee = employeeService.findEmployeeById(employeeId);
  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Overlap check: Pending or Approved leaves for same employee
  const hasOverlap = leaves.some(leave => {
    if (leave.employeeId !== employeeId) return false;
    if (leave.status === 'Rejected') return false;

    const existingStart = new Date(leave.startDate);
    const existingEnd = new Date(leave.endDate);

    return (start <= existingEnd && end >= existingStart);
  });

  if (hasOverlap) {
    const error = new Error("Leave request overlaps with an existing pending or approved leave");
    error.statusCode = 400;
    throw error;
  }

  // Calculate duration
  const diffTime = Math.abs(end - start);
  const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const newLeave = {
    leaveId: uuidv4(),
    ...leaveData,
    duration,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  leaves.push(newLeave);

  // Add audit log
  auditService.addLog({
    action: "Leave Created",
    leaveId: newLeave.leaveId,
    employeeId: newLeave.employeeId
  });

  return newLeave;
};

/*
  Gets all leave requests with filtering, pagination, and sorting
  @param {Object} params - Query parameters
  @returns {Object} - Paginated leave requests
 */
const getAllLeaves = (params = {}) => {
  let result = [...leaves];
  const { employeeId, leaveType, status, page = 1, limit = 10, sortBy = 'startDate', order = 'asc' } = params;

  // Filtering
  if (employeeId) result = result.filter(l => l.employeeId === employeeId);
  if (leaveType) result = result.filter(l => l.leaveType === leaveType);
  if (status) result = result.filter(l => l.status.toLowerCase() === status.toLowerCase());

  // Sorting
  result.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'startDate' || sortBy === 'createdAt') {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (order === 'desc') {
      return valB > valA ? 1 : -1;
    }
    return valA > valB ? 1 : -1;
  });

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedResult = result.slice(startIndex, startIndex + parseInt(limit));

  return {
    total: result.length,
    page: parseInt(page),
    limit: parseInt(limit),
    data: paginatedResult
  };
};

/**
 * Approves a leave request
 * @param {string} leaveId - Leave ID
 * @returns {Object} - Updated leave
 */
const approveLeave = (leaveId) => {
  const leave = leaves.find(l => l.leaveId === leaveId);
  if (!leave) {
    const error = new Error("Leave request not found");
    error.statusCode = 404;
    throw error;
  }

  leave.status = 'Approved';

  auditService.addLog({
    action: "Leave Approved",
    leaveId,
    timestamp: new Date().toISOString()
  });

  return leave;
};

/**
 * Rejects a leave request
 * @param {string} leaveId - Leave ID
 * @param {string} remarks - Rejection remarks
 * @returns {Object} - Updated leave
 */
const rejectLeave = (leaveId, remarks) => {
  if (!remarks) {
    const error = new Error("Remarks are mandatory for rejection");
    error.statusCode = 400;
    throw error;
  }

  const leave = leaves.find(l => l.leaveId === leaveId);
  if (!leave) {
    const error = new Error("Leave request not found");
    error.statusCode = 404;
    throw error;
  }

  leave.status = 'Rejected';
  leave.remarks = remarks;

  auditService.addLog({
    action: "Leave Rejected",
    leaveId,
    remarks,
    timestamp: new Date().toISOString()
  });

  return leave;
};

/**
 * Gets leave summary for an employee
 * @param {string} employeeId - Employee ID
 * @returns {Object} - Leave summary
 */
const getLeaveSummary = (employeeId) => {
  const employee = employeeService.findEmployeeById(employeeId);
  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  const employeeLeaves = leaves.filter(l => l.employeeId === employeeId);

  return {
    employeeId: employee.employeeId,
    employeeName: employee.name,
    totalLeaveRequests: employeeLeaves.length,
    approved: employeeLeaves.filter(l => l.status === 'Approved').length,
    pending: employeeLeaves.filter(l => l.status === 'Pending').length,
    rejected: employeeLeaves.filter(l => l.status === 'Rejected').length
  };
};

module.exports = {
  createLeave,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getLeaveSummary
};

/**
 * Validates leave request data
 * @param {Object} data - Leave request data
 * @returns {string|null} - Error message or null if valid
 */
const validateLeave = (data) => {
  const { employeeId, leaveType, startDate, endDate, reason } = data;

  if (!employeeId) return "Employee ID is required";
  if (!leaveType) return "Leave type is required";
  if (!startDate) return "Start date is required";
  if (!endDate) return "End date is required";
  if (!reason) return "Reason is required";

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) return "Invalid start date";
  if (isNaN(end.getTime())) return "Invalid end date";

  if (end < start) return "End date cannot be before start date";

  // Calculate duration in days (inclusive)
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays > 10) return "Leave duration cannot exceed 10 days";

  return null;
};

module.exports = {
  validateLeave
};

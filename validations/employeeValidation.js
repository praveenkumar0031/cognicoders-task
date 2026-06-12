/**
 * Validates employee data
 * @param {Object} data - Employee data
 * @returns {string|null} - Error message or null if valid
 */
const validateEmployee = (data) => {
  const { employeeId, name, email, department, joiningDate } = data;

  if (!employeeId) return "Employee ID is required";
  if (!name || name.length < 3) return "Name must be at least 3 characters long";
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) return "Valid email is required";
  
  if (!department) return "Department is required";
  
  if (!joiningDate) return "Joining date is required";
  const joining = new Date(joiningDate);
  const now = new Date();
  if (joining > now) return "Joining date cannot be in the future";

  return null;
};

module.exports = {
  validateEmployee
};

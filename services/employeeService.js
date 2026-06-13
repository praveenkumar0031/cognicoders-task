const { employees } = require('../data/store');

/*
 Creates a new employee
  @param {Object} employeeData - Employee data
  @returns {Object} - Created employee
  @throws {Error} - If employee ID is not unique
 */
const createEmployee = (employeeData) => {
  const existingEmployee = employees.find(emp => emp.employeeId === employeeData.employeeId);
  if (existingEmployee) {
    const error = new Error("Employee ID already exists");
    error.statusCode = 400;
    throw error;
  }

  employees.push(employeeData);
  return employeeData;
};

/*
 Gets all employees with optional filtering and search
 @param {Object} filters - Query parameters
 @returns {Array} - List of filtered employees
 */
const getAllEmployees = (filters = {}) => {
  let result = [...employees];
  const { department, search } = filters;

  if (department) {
    result = result.filter(emp => emp.department.toLowerCase() === department.toLowerCase());
  }

  if (search) {
    const searchTerm = search.toLowerCase();
    result = result.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm) || 
      emp.email.toLowerCase().includes(searchTerm)
    );
  }

  return result;
};

/*
  Finds an employee by ID
  @param {string} employeeId - Employee ID
  @returns {Object|undefined} - Employee object or undefined
 */
const findEmployeeById = (employeeId) => {
  return employees.find(emp => emp.employeeId === employeeId);
};

module.exports = {
  createEmployee,
  getAllEmployees,
  findEmployeeById
};

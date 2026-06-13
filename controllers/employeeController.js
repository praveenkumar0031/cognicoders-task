const employeeService = require('../services/employeeService');
const { validateEmployee } = require('../validations/employeeValidation');


 //Creates a new employee
const createEmployee = (req, res, next) => {
  try {
    const error = validateEmployee(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    const newEmployee = employeeService.createEmployee(req.body);
    res.status(201).json({
      success: true,
      data: newEmployee,
      message: "Employee created successfully"
    });
  } catch (error) {
    next(error);
  }
};


// Gets all employees
const getAllEmployees = (req, res, next) => {
  try {
    const employees = employeeService.getAllEmployees(req.query);
    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees
};

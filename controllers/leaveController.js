const leaveService = require('../services/leaveService');
const { validateLeave } = require('../validations/leaveValidation');


 //Creates a leave request
const createLeave = (req, res, next) => {
  try {
    const error = validateLeave(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    const newLeave = leaveService.createLeave(req.body);
    res.status(201).json({
      success: true,
      data: newLeave,
      message: "Leave request created successfully"
    });
  } catch (error) {
    next(error);
  }
};


  //Gets all leave requests
 
const getAllLeaves = (req, res, next) => {
  try {
    const result = leaveService.getAllLeaves(req.query);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};


 //Approves a leave request
 
const approveLeave = (req, res, next) => {
  try {
    const updatedLeave = leaveService.approveLeave(req.params.leaveId);
    res.status(200).json({
      success: true,
      data: updatedLeave,
      message: "Leave approved successfully"
    });
  } catch (error) {
    next(error);
  }
};

//Rejects a leave request
 
const rejectLeave = (req, res, next) => {
  try {
    const updatedLeave = leaveService.rejectLeave(req.params.leaveId, req.body.remarks);
    res.status(200).json({
      success: true,
      data: updatedLeave,
      message: "Leave rejected successfully"
    });
  } catch (error) {
    next(error);
  }
};


  //Gets leave summary for an employee
 
const getLeaveSummary = (req, res, next) => {
  try {
    const summary = leaveService.getLeaveSummary(req.params.employeeId);
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLeave,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getLeaveSummary
};

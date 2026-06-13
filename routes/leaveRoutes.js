const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

router.post('/', leaveController.createLeave);
router.get('/', leaveController.getAllLeaves);
router.patch('/:leaveId/approve', leaveController.approveLeave);
router.patch('/:leaveId/reject', leaveController.rejectLeave);
router.get('/summary/:employeeId', leaveController.getLeaveSummary);

module.exports = router;

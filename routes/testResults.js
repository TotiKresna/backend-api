const express = require('express');
const router = express.Router();
const testResultController = require('../controllers/testResultController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware(['superadmin', 'admin', 'user']), testResultController.getAllTestResults);
router.get('/:id', authMiddleware(['superadmin', 'admin', 'user']), testResultController.getTestResultById)
router.post('/', authMiddleware(['superadmin', 'admin']), testResultController.createTestResult);
router.put('/:id', authMiddleware(['superadmin', 'admin']), testResultController.updateTestResult);
router.delete('/:id', authMiddleware(['superadmin', 'admin']), testResultController.deleteTestResult);
router.post('/multi', authMiddleware(['superadmin', 'admin']), testResultController.deleteMultipleTestResult);

module.exports = router;
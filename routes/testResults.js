const express = require('express');
const router = express.Router();
const testResultController = require('../controllers/testResultController');


router.get('/', testResultController.getAllTestResults);
router.post('/', testResultController.createTestResult);
router.put('/:id', testResultController.updateTestResult);
router.delete('/:id', testResultController.deleteTestResult);
router.post('/multi', testResultController.deleteMultipleTestResult);
router.get('/:id', testResultController.getTestResultById)

module.exports = router;
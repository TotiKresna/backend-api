const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware(['superadmin', 'admin', 'user']), studentController.getAllStudents);
router.get('/:id', authMiddleware(['superadmin', 'admin', 'user']), studentController.getStudentsById);
router.post('/', authMiddleware(['superadmin', 'admin']), studentController.createStudent);
router.put('/:id', authMiddleware(['superadmin', 'admin']), studentController.updateStudent);
router.delete('/:id', authMiddleware(['superadmin', 'admin']), studentController.deleteStudent);
router.post('/multi', authMiddleware(['superadmin', 'admin']), studentController.deleteMultipleStudents);

module.exports = router;
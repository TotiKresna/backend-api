const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/create-admin', authMiddleware(['superadmin']), authController.createAdmin);
router.get('/check', authMiddleware(), authController.checkAuth);

module.exports = router;
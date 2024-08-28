const express = require('express');
const router = express.Router();
const { importData, importProgress } = require('../controllers/importController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware(['superadmin', 'admin']), importData);
router.get('/progress', authMiddleware(['superadmin', 'admin']), importProgress);

module.exports = router;
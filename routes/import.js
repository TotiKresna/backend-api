const express = require('express');
const router = express.Router();
const { importData } = require('../controllers/importController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware(['superadmin', 'admin']), importData);


module.exports = router;
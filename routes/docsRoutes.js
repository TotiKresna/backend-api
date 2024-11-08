// routes/docsRoutes.js
const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const specs = require('../config/swagger');

const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: "Matematika Detik API Documentation",
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
  },
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, swaggerUiOptions));

module.exports = router;
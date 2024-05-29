const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/students');
const testResultRoutes = require('./routes/testResults');
const importRoutes = require('./routes/import');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const app = express();

// Config
require('dotenv').config();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware untuk sesi
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // 24 hours
  }),
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Middleware untuk file upload
app.use(fileUpload());

// Routes
app.get("/", (req, res) => { res.send("NodeJS Project by Mastod"); });
app.use('/students', studentRoutes);
app.use('/test-results', testResultRoutes);
app.use('/import', importRoutes);

module.exports = app;

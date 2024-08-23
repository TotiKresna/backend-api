// app.js
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/students');
const testResultRoutes = require('./routes/testResults');
const importRoutes = require('./routes/import');
const authRoutes = require('./routes/authRoutes.js');
const startWorker = require('./worker/importWorker.js');

const app = express();

// Config
require('dotenv').config();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://frontend-react-liart.vercel.app', //  URL frontend 
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Middleware untuk file upload
app.use(fileUpload());

// Routes
app.get("/", (req, res) => { res.send("NodeJS Project by Mastod"); });
app.use('/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/test-results', testResultRoutes);
app.use('/api/import', importRoutes);

startWorker();

module.exports = app;
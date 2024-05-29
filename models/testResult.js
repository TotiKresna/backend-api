const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
  opm_tambah: { type: Number, required: false },
  opm_kurang: { type: Number, required: false },
  opm_kali: { type: Number, required: false },
  opm_bagi: { type: Number, required: false },
});

module.exports = mongoose.model('TestResult', testResultSchema);
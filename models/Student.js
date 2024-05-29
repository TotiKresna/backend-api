const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: mongoose.Types.ObjectId
    //   },
    nama: String,
    kelas: String,
});

module.exports = mongoose.model('Student', studentSchema);
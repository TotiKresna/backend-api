const Student = require("../models/Student");
const TestResult = require('../models/testResult');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { nama, kelas: studentClass } = req.body;

    // Validasi: Cek apakah nama dan kelas tidak kosong
    if (!nama || !studentClass) {
      return res
        .status(400)
        .json({ message: "Nama dan kelas tidak boleh kosong" });
    }

    // Cek apakah data siswa sudah ada
    const existingStudent = await Student.findOne({
      nama,
      kelas: studentClass,
    });
    if (existingStudent) {
      return res.status(400).json({ message: "Data siswa sudah ada" });
    }

    // Jika data siswa belum ada, buat data baru
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();

    // Emit 'newStudent' event
    const io = req.app.get('io');
    io.emit('newStudent', savedStudent);

    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error creating student" });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, kelas: studentClass } = req.body;

    // Cek apakah data siswa yang akan diperbarui sudah ada
    const existingStudent = await Student.findOne({
      _id: { $ne: id },
      nama,
      kelas: studentClass,
    });
    if (existingStudent) {
      return res.status(400).json({ message: "Data siswa sudah ada" });
    }

    // Perbarui data siswa
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedStudent) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    // Emit 'updateStudent' event
    const io = req.app.get('io');
    io.emit('updateStudent', updatedStudent);

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error updating student" });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari data siswa berdasarkan id
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }

    // Hapus semua data nilai yang terhubung dengan siswa tersebut
    await TestResult.deleteMany({ student_id: id });

    // Hapus data siswa
    await student.deleteOne({ _id: id });

    // Emit 'deleteStudent' event
    const io = req.app.get('io');
    io.emit('deleteStudent', id);

    res.status(200).json({ message: 'Siswa berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};

exports.deleteMultipleStudents = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: 'Please provide a list of IDs to delete.' });
    }

     // Hapus semua data nilai yang terhubung dengan siswa-siswa tersebut
     await TestResult.deleteMany({ student_id: { $in: ids } });

    // Delete students whose IDs are in the provided list
    const result = await Student.deleteMany({ _id: { $in: ids } });

    // Emit 'deleteMultipleStudents' event
    const io = req.app.get('io');
    io.emit('deleteMultipleStudents', ids);

    // Return the number of documents deleted
    res.status(200).json({ message: `${result.deletedCount} students successfully deleted.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting students', error: error.message });
  }
};

exports.getStudentsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari data siswa berdasarkan id
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
}

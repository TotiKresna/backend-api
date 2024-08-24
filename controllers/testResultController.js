const TestResult = require('../models/testResult');
const Student = require('../models/Student');

// Get all test results
exports.getAllTestResults = async (req, res) => {
  try {
    const testResults = await TestResult.find().populate('student_id');
    res.status(200).json(testResults);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching test results' });
  }
};

// Create a new test result
exports.createTestResult = async (req, res) => {
  try {
    const { nama, kelas: studentClass, opm_tambah, opm_kurang, opm_kali, opm_bagi } = req.body;

    // Validasi: Cek apakah nama dan kelas tidak kosong
    if (!nama || !studentClass) {
      return res.status(400).json({ message: 'Nama dan kelas tidak boleh kosong' });
    }

    // Cek apakah data siswa sudah ada
    let student = await Student.findOne({ nama, kelas: studentClass });
    if (!student) {
      // Jika siswa belum ada, buat data siswa baru
      student = new Student({ nama, kelas: studentClass });
      await student.save();
    }

    // Menghitung total OPM hanya dengan nilai yang tersedia
    const opm_total = [opm_tambah, opm_kurang, opm_kali, opm_bagi]
      .filter(value => value != null)
      .reduce((acc, value) => acc + value, 0);

    // Buat data hasil tes baru dan masukkan ke database, periksa semua nilai opm terlebih dahulu agar tidak undefined
    const newTestResult = new TestResult({
      student_id: student._id,
      opm_tambah: opm_tambah != null ? opm_tambah : 0,
      opm_kurang: opm_kurang != null ? opm_kurang : 0,
      opm_kali: opm_kali != null ? opm_kali : 0,
      opm_bagi: opm_bagi != null ? opm_bagi : 0,
      opm_total
    });

    const savedTestResult = await newTestResult.save();

    res.status(201).json(savedTestResult);
  } catch (error) {
    res.status(500).json({ message: 'Error creating test result', error: error.message });
  }
};

exports.updateTestResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { opm_tambah, opm_kurang, opm_kali, opm_bagi } = req.body;

    // Cari data hasil tes berdasarkan id
    const testResult = await TestResult.findById(id);
    if (!testResult) {
      return res.status(404).json({ message: 'Hasil tes tidak ditemukan' });
    }

    // Hitung total OPM hanya dengan nilai yang tersedia
    const opm_total = [opm_tambah, opm_kurang, opm_kali, opm_bagi]
      .filter(value => value != null)
      .reduce((acc, value) => acc + value, 0);

    // Perbarui nilai OPM pada data hasil tes, pastikan semua nilai tidak undefined
    testResult.opm_tambah = opm_tambah != null ? opm_tambah : testResult.opm_tambah;
    testResult.opm_kurang = opm_kurang != null ? opm_kurang : testResult.opm_kurang;
    testResult.opm_kali = opm_kali != null ? opm_kali : testResult.opm_kali;
    testResult.opm_bagi = opm_bagi != null ? opm_bagi : testResult.opm_bagi;
    testResult.opm_total = opm_total;

    // Simpan perubahan data hasil tes
    const updatedTestResult = await testResult.save();

    res.status(200).json(updatedTestResult);
  } catch (error) {
    res.status(500).json({ message: 'Error updating test result', error: error.message });
  }
};

// Delete test 
exports.deleteTestResult = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari data hasil tes berdasarkan id
    const testResult = await TestResult.findById(id);
    if (!testResult) {
      return res.status(404).json({ message: 'Hasil tes tidak ditemukan' });
    }

    // Hapus data hasil tes
    await TestResult.deleteOne({ _id: id });

    res.status(200).json({ message: 'Hasil tes berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting test result', error: error.message });
  }
};

exports.deleteMultipleTestResult = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: 'Masukkan daftar ID yang ingin dihapus.' });
    }

    // Delete students whose IDs are in the provided list
    const result = await TestResult.deleteMany({ _id: { $in: ids } });

    // Return the number of documents deleted
    res.status(200).json({ message: `${result.deletedCount} Hasil tes berhasil dihapus.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting test result', error: error.message });
  }
};

exports.getTestResultById = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari data siswa berdasarkan id
    const testResult = await TestResult.findById(id);
    if (!testResult) {
      return res.status(404).json({ message: 'Hasil Test tidak ditemukan' });
    }
    res.status(200).json(testResult);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testResults', error: error.message });
  }
}
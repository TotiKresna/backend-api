// const xlsx = require("xlsx");
// const Student = require("../models/Student");
// const TestResult = require("../models/testResult");
// const mongoose = require('mongoose');

// exports.importData = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         if (!req.files || Object.keys(req.files).length === 0) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(400).send('No files were uploaded.');
//         }
//         if (!req.session) {
//             req.session = {};
//         }
//         // Akses file yang diunggah
//         const excelFile = req.files[Object.keys(req.files)[0]];
//         req.session.uploadedFileData = excelFile.data;

//         // Baca file dari buffer langsung
//         const workbook = xlsx.read(req.session.uploadedFileData, { type: 'buffer' });
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];

//         const columnNames = [];
//         const expectedColumnNames = ['nama', 'kelas', 'opm_tambah', 'opm_kurang', 'opm_kali', 'opm_bagi'];
//         const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

//         data[0].forEach((columnName, index) => {
//             const normalizedColumnName = columnName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
//             columnNames[index] = normalizedColumnName;
//         });

//         const normalizedExpectedColumnNames = expectedColumnNames.map(columnName => columnName.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));

//         if (normalizedExpectedColumnNames.some(columnName => !columnNames.includes(columnName))) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(400).send({ error: 'Nama kolom tidak sesuai dengan format yang diharapkan.' });
//         }

//         for (let i = 1; i < data.length; i++) {
//             const row = data[i];
//             const rowData = {};

//             expectedColumnNames.forEach((columnName, index) => {
//                 const cellValue = row[index];
//                 rowData[columnName] = cellValue;
//             });

//             if (!rowData.nama || !rowData.kelas) {
//                 continue;
//             }

//             // Cari atau buat data siswa
//             const student = await Student.findOneAndUpdate(
//                 { nama: rowData.nama, kelas: rowData.kelas },
//                 { nama: rowData.nama, kelas: rowData.kelas },
//                 { upsert: true, new: true, session }
//             );

//             // Inisialisasi nilai opm yang kosong ke 0
//             const opm_tambah = parseFloat(rowData.opm_tambah) || 0;
//             const opm_kurang = parseFloat(rowData.opm_kurang) || 0;
//             const opm_kali = parseFloat(rowData.opm_kali) || 0;
//             const opm_bagi = parseFloat(rowData.opm_bagi) || 0;

//             let opm_total = opm_tambah + opm_kurang + opm_kali + opm_bagi;
//             opm_total = parseFloat(opm_total.toFixed(2)); // Membatasi dua angka di belakang koma

//             // Cari data nilai yang sudah ada dengan student_id atau dengan student_id null dan nilai yang sama
//             const existingTestResult = await TestResult.findOne({
//                 student_id: { $in: [student._id, null] },
//                 opm_tambah: rowData.opm_tambah,
//                 opm_kurang: rowData.opm_kurang,
//                 opm_kali: rowData.opm_kali,
//                 opm_bagi: rowData.opm_bagi
//             }).session(session);

//             if (existingTestResult) {
//                 // Jika data nilai sudah ada, perbarui dengan student_id baru
//                 existingTestResult.student_id = student._id;
//                 existingTestResult.opm_tambah = rowData.opm_tambah;
//                 existingTestResult.opm_kurang = rowData.opm_kurang;
//                 existingTestResult.opm_kali = rowData.opm_kali;
//                 existingTestResult.opm_bagi = rowData.opm_bagi;
//                 existingTestResult.opm_total = opm_total;
//                 await existingTestResult.save({ session });
//             } else {
//                 // Jika data nilai tidak ada, buat data baru
//                 await TestResult.create(
//                     [{
//                         student_id: student._id,
//                         opm_tambah: rowData.opm_tambah,
//                         opm_kurang: rowData.opm_kurang,
//                         opm_kali: rowData.opm_kali,
//                         opm_bagi: rowData.opm_bagi,
//                         opm_total: opm_total
//                     }],
//                     { session }
//                 );
//             }
//         }

//         await session.commitTransaction();
//         session.endSession();
//         res.status(200).send({ success: 'Data berhasil diimpor.' });
//     } catch (e) {
//         await session.abortTransaction();
//         session.endSession();
//         res.status(500).send({ error: 'Terjadi kesalahan: ' + e.message });
//     }
// };

// const xlsx = require("xlsx");
// const Student = require("../models/Student");
// const TestResult = require("../models/testResult");
// const mongoose = require('mongoose');

// const BATCH_SIZE = 5; // Tentukan ukuran batch sesuai kebutuhan

// exports.importData = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         if (!req.files || Object.keys(req.files).length === 0) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(400).send('No files were uploaded.');
//         }
//         if (!req.session) {
//             req.session = {};
//         }

//         // Akses file yang diunggah
//         const excelFile = req.files[Object.keys(req.files)[0]];
//         req.session.uploadedFileData = excelFile.data;

//         // Baca file dari buffer langsung
//         const workbook = xlsx.read(req.session.uploadedFileData, { type: 'buffer' });
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];

//         const columnNames = [];
//         const expectedColumnNames = ['nama', 'kelas', 'opm_tambah', 'opm_kurang', 'opm_kali', 'opm_bagi'];
//         const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

//         data[0].forEach((columnName, index) => {
//             const normalizedColumnName = columnName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
//             columnNames[index] = normalizedColumnName;
//         });

//         const normalizedExpectedColumnNames = expectedColumnNames.map(columnName => columnName.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));

//         if (normalizedExpectedColumnNames.some(columnName => !columnNames.includes(columnName))) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(400).send({ error: 'Nama kolom tidak sesuai dengan format yang diharapkan.' });
//         }

//         // Pisahkan data menjadi beberapa batch
//         const batches = [];
//         for (let i = 1; i < data.length; i += BATCH_SIZE) {
//             const batch = data.slice(i, i + BATCH_SIZE);
//             batches.push(batch);
//         }

//         for (const batch of batches) {
//             for (const row of batch) {
//                 const rowData = {};

//                 expectedColumnNames.forEach((columnName, index) => {
//                     const cellValue = row[index];
//                     rowData[columnName] = cellValue;
//                 });

//                 if (!rowData.nama || !rowData.kelas) {
//                     continue;
//                 }

//                 // Cari atau buat data siswa
//                 const student = await Student.findOneAndUpdate(
//                     { nama: rowData.nama, kelas: rowData.kelas },
//                     { nama: rowData.nama, kelas: rowData.kelas },
//                     { upsert: true, new: true, session }
//                 );

//                 // Inisialisasi nilai opm yang kosong ke 0
//                 const opm_tambah = parseFloat(rowData.opm_tambah) || 0;
//                 const opm_kurang = parseFloat(rowData.opm_kurang) || 0;
//                 const opm_kali = parseFloat(rowData.opm_kali) || 0;
//                 const opm_bagi = parseFloat(rowData.opm_bagi) || 0;

//                 let opm_total = opm_tambah + opm_kurang + opm_kali + opm_bagi;
//                 opm_total = parseFloat(opm_total.toFixed(2)); // Membatasi dua angka di belakang koma

//                 // Cari data nilai yang sudah ada dengan student_id atau dengan student_id null dan nilai yang sama
//                 const existingTestResult = await TestResult.findOne({
//                     student_id: { $in: [student._id, null] },
//                     opm_tambah: rowData.opm_tambah,
//                     opm_kurang: rowData.opm_kurang,
//                     opm_kali: rowData.opm_kali,
//                     opm_bagi: rowData.opm_bagi
//                 }).session(session);

//                 if (existingTestResult) {
//                     // Jika data nilai sudah ada, perbarui dengan student_id baru
//                     existingTestResult.student_id = student._id;
//                     existingTestResult.opm_tambah = rowData.opm_tambah;
//                     existingTestResult.opm_kurang = rowData.opm_kurang;
//                     existingTestResult.opm_kali = rowData.opm_kali;
//                     existingTestResult.opm_bagi = rowData.opm_bagi;
//                     existingTestResult.opm_total = opm_total;
//                     await existingTestResult.save({ session });
//                 } else {
//                     // Jika data nilai tidak ada, buat data baru
//                     await TestResult.create(
//                         [{
//                             student_id: student._id,
//                             opm_tambah: rowData.opm_tambah,
//                             opm_kurang: rowData.opm_kurang,
//                             opm_kali: rowData.opm_kali,
//                             opm_bagi: rowData.opm_bagi,
//                             opm_total: opm_total
//                         }],
//                         { session }
//                     );
//                 }
//             }

//             // Commit transaksi untuk setiap batch
//             await session.commitTransaction();
//             session.startTransaction(); // Mulai transaksi baru untuk batch berikutnya
//         }

//         session.endSession();
//         res.status(200).send({ success: 'Data berhasil diimpor.' });
//     } catch (e) {
//         await session.abortTransaction();
//         session.endSession();
//         res.status(500).send({ error: 'Terjadi kesalahan: ' + e.message });
//     }
// };

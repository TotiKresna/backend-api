const mongoose = require('mongoose');
const Student = require("../models/Student");
const Job = require('../models/Job');
const TestResult = require("../models/testResult");

exports.processBatch = async (batch, sessionId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        
        for (const row of batch) {
            const rowData = {};
            const expectedColumnNames = ['nama', 'kelas', 'opm_tambah', 'opm_kurang', 'opm_kali', 'opm_bagi'];

            expectedColumnNames.forEach((columnName, index) => {
                rowData[columnName] = row[index];
            });

            if (!rowData.nama || !rowData.kelas) {
                continue;
            }

            // Cari atau buat data siswa
            const student = await Student.findOneAndUpdate(
                { nama: rowData.nama, kelas: rowData.kelas },
                { nama: rowData.nama, kelas: rowData.kelas },
                { upsert: true, new: true, session }
            );

            const opm_tambah = parseFloat(rowData.opm_tambah) || 0;
            const opm_kurang = parseFloat(rowData.opm_kurang) || 0;
            const opm_kali = parseFloat(rowData.opm_kali) || 0;
            const opm_bagi = parseFloat(rowData.opm_bagi) || 0;

            let opm_total = opm_tambah + opm_kurang + opm_kali + opm_bagi;
            opm_total = parseFloat(opm_total.toFixed(2));

            const existingTestResult = await TestResult.findOne({
                student_id: { $in: [student._id, null] },
                opm_tambah: rowData.opm_tambah,
                opm_kurang: rowData.opm_kurang,
                opm_kali: rowData.opm_kali,
                opm_bagi: rowData.opm_bagi
            }).session(session);

            if (existingTestResult) {
                existingTestResult.student_id = student._id;
                existingTestResult.opm_tambah = rowData.opm_tambah;
                existingTestResult.opm_kurang = rowData.opm_kurang;
                existingTestResult.opm_kali = rowData.opm_kali;
                existingTestResult.opm_bagi = rowData.opm_bagi;
                existingTestResult.opm_total = opm_total;
                await existingTestResult.save({ session });
            } else {
                await TestResult.create(
                    [{
                        student_id: student._id,
                        opm_tambah: rowData.opm_tambah,
                        opm_kurang: rowData.opm_kurang,
                        opm_kali: rowData.opm_kali,
                        opm_bagi: rowData.opm_bagi,
                        opm_total: opm_total
                    }],
                    { session }
                );
            }


        }

        await session.commitTransaction();

        // Update job status
        await Job.findOneAndUpdate(
            { sessionId: sessionId },
            { status: 'completed', updatedAt: new Date() }
        );

    } catch (error) {
        await session.abortTransaction();

        // Update job status to failed
        await Job.findOneAndUpdate(
            { sessionId: sessionId },
            { status: 'failed', error: error.message, updatedAt: new Date() }
        );

        throw error;
    } finally {
        session.endSession();
    }
};

const mongoose = require('mongoose');
const xlsx = require("xlsx");
const Job = require('../models/Job');

exports.importData = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const excelFile = req.files[Object.keys(req.files)[0]];
        const workbook = xlsx.read(excelFile.data, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        const BATCH_SIZE = 15;
        const jobs = [];

        for (let i = 1; i < data.length; i += BATCH_SIZE) {
            const batch = data.slice(i, i + BATCH_SIZE);

            jobs.push({
                batch,
                status: 'pending',
                createdAt: new Date(),
                progress: 0
            });
        }

        await Job.insertMany(jobs, { session });

        await session.commitTransaction();
        

        res.status(200).send({ success: 'Data processing has started.' });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).send({ error: 'An error occurred: ' + error.message });
    } finally {
        session.endSession();
    }
};

exports.importProgress = async (req, res) => {
    try {
        const latestJob = await Job.findOne().sort({ createdAt: -1 });
        if (!latestJob) {
            return res.status(404).json({ error: 'No import job found' });
        }
        res.json({ progress: latestJob.progress, status: latestJob.status });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch import progress' });
    }
};
const Job = require('../models/Job');
const { processBatch } = require('../controllers/WorkerController');

const startWorker = async (app) => {
    const io = app.get('io');
    while (true) {
        try {
            const job = await Job.findOneAndUpdate(
                { status: 'pending' },
                { status: 'processing', updatedAt: new Date() },
                { new: true }
            );

            if (job) {
                try {
                    await processBatch(job.batch, job.sessionId, io);
                    job.status = 'completed';
                } catch (error) {
                    job.status = 'failed';
                    job.error = error.message;
                } finally {
                    job.updatedAt = new Date();
                    await job.save();
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Tunggu 5 detik
            }
        } catch (error) {
            console.error('Error processing job:', error);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Tunggu 5 detik sebelum coba lagi
        }
    }
};

module.exports = startWorker;

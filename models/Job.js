const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobObjectId: {type: mongoose.Schema.Types.ObjectId, require:true},
    batch: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    progress: {
        type: Number,
        default: 0
    },
    sessionId: {
        type: String,
        required: false
    },
    error: {
        type: String,
        default: null
    }
});


module.exports = mongoose.model('Job', jobSchema);
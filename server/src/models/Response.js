const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    value: mongoose.Schema.Types.Mixed, // Can be String, [String] for checkboxes, or Object for grid
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const responseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    },
    answers: [answerSchema],
    respondentEmail: String,
    ipAddress: String,
    userAgent: String,
    startTime: Date,
    endTime: Date,
    duration: Number // in seconds
}, {
    timestamps: true
});

// Calculate duration before saving
responseSchema.pre('save', function(next) {
    if (this.startTime && this.endTime) {
        this.duration = Math.round((this.endTime - this.startTime) / 1000);
    }
    next();
});

module.exports = mongoose.model('Response', responseSchema);

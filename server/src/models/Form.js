const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: String,
    value: String
});

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['short', 'paragraph', 'multiple', 'checkbox', 'dropdown', 'linear', 'grid', 'email', 'number', 'phone', 'url']
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    required: {
        type: Boolean,
        default: false
    },
    options: [optionSchema],
    settings: {
        shuffleOptions: Boolean,
        linearScale: {
            min: Number,
            max: Number,
            minLabel: String,
            maxLabel: String
        },
        grid: {
            rows: [String],
            columns: [String]
        }
    }
});

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'Untitled form'
    },
    description: String,
    questions: [questionSchema],
    theme: {
        header: String,
        background: String
    },
    settings: {
        collectEmail: {
            type: Boolean,
            default: false
        },
        limitOneResponse: {
            type: Boolean,
            default: false
        },
        showProgress: {
            type: Boolean,
            default: true
        }
    },
    createdBy: {
        type: String,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Form', formSchema);

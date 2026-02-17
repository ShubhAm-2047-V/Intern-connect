const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the company User ID
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skillsRequired: {
        type: [String],
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    stipend: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    deadline: {
        type: Date
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Internship', InternshipSchema);

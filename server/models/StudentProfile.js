const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    education: {
        type: String
    },
    interests: {
        type: [String],
        default: []
    },
    resumeUrl: {
        type: String
    }
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);

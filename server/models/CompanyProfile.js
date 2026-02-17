const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    documents: [{
        title: String,
        url: String
    }]
});

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);

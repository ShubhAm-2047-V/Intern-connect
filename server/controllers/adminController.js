const User = require('../models/User');
const CompanyProfile = require('../models/CompanyProfile');
const Internship = require('../models/Internship');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify company
// @route   PUT /api/admin/verify-company/:companyId
// @access  Private (Admin)
const verifyCompany = async (req, res) => {
    try {
        const profile = await CompanyProfile.findById(req.params.companyId);
        if (profile) {
            profile.verified = true;
            await profile.save();
            res.json({ message: 'Company Verified', profile });
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify internship
// @route   PUT /api/admin/verify-internship/:internshipId
// @access  Private (Admin)
const verifyInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.internshipId);
        if (internship) {
            internship.verified = true;
            await internship.save();
            res.json({ message: 'Internship Verified', internship });
        } else {
            res.status(404).json({ message: 'Internship not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all companies
// @route   GET /api/admin/companies
// @access  Private (Admin)
const getCompanies = async (req, res) => {
    try {
        const companies = await CompanyProfile.find({}).populate('user', 'name email');
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUsers,
    verifyCompany,
    verifyInternship,
    getCompanies
};

const StudentProfile = require('../models/StudentProfile');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

const CompanyProfile = require('../models/CompanyProfile');

// @desc    Get current student profile
// @route   GET /api/student/profile
// @access  Private (Student)
const getProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'name email');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student)
const updateProfile = async (req, res) => {
    try {
        const { skills, education, interests, resumeUrl } = req.body;

        let profile = await StudentProfile.findOne({ user: req.user.id });

        if (!profile) {
            // Create profile if it doesn't exist (Fix for missing profile issue)
            profile = new StudentProfile({
                user: req.user.id,
                skills: skills || [],
                education: education || '',
                interests: interests || [],
                resumeUrl: resumeUrl || ''
            });
        } else {
            profile.skills = skills || profile.skills;
            profile.education = education || profile.education;
            profile.interests = interests || profile.interests;
            profile.resumeUrl = resumeUrl || profile.resumeUrl;
        }

        const updatedProfile = await profile.save();
        res.json(updatedProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all verified internships
// @route   GET /api/student/internships
// @access  Private (Student)
const getInternships = async (req, res) => {
    try {
        // Only show verified internships
        let internships = await Internship.find({ verified: true }).populate('company', 'name email').lean();

        // Fetch real company names
        internships = await Promise.all(internships.map(async (internship) => {
            if (internship.company) {
                const companyProfile = await CompanyProfile.findOne({ user: internship.company._id });
                if (companyProfile && companyProfile.companyName) {
                    internship.company.name = companyProfile.companyName;
                }
            }
            return internship;
        }));

        res.json(internships);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Apply for internship
// @route   POST /api/student/apply/:id
// @access  Private (Student)
const applyInternship = async (req, res) => {
    try {
        const internshipId = req.params.id;
        const studentId = req.user.id;

        // Check if student is already in an internship (ACTIVE)
        const activeInternship = await Application.findOne({ student: studentId, status: 'Accepted' });
        if (activeInternship) {
            return res.status(400).json({ message: 'You are in a internship complete it first' });
        }

        // Check if already applied to THIS internship
        const existingApplication = await Application.findOne({ student: studentId, internship: internshipId });
        if (existingApplication) {
            return res.status(400).json({ message: 'Already applied to this internship' });
        }

        const application = await Application.create({
            student: studentId,
            internship: internshipId
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get student applications
// @route   GET /api/student/applications
// @access  Private (Student)
const getApplications = async (req, res) => {
    try {
        let applications = await Application.find({ student: req.user.id })
            .populate({
                path: 'internship',
                select: 'title company', // Populating internship details
                populate: { path: 'company', select: 'name' } // Nested populate for company name
            })
            .lean();

        // Fetch real company names for applications
        applications = await Promise.all(applications.map(async (app) => {
            if (app.internship && app.internship.company) {
                const companyProfile = await CompanyProfile.findOne({ user: app.internship.company._id });
                if (companyProfile && companyProfile.companyName) {
                    app.internship.company.name = companyProfile.companyName;
                }
            }
            return app;
        }));

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getInternships,
    applyInternship,
    getApplications
};

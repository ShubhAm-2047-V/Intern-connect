const CompanyProfile = require('../models/CompanyProfile');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

// @desc    Get current company profile
// @route   GET /api/company/profile
// @access  Private (Company)
const getProfile = async (req, res) => {
    try {
        const profile = await CompanyProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update company profile
// @route   POST /api/company/profile
// @access  Private (Company)
const updateProfile = async (req, res) => {
    try {
        const { companyName, description, website, location } = req.body;

        let profile = await CompanyProfile.findOne({ user: req.user.id });

        if (profile) {
            profile.companyName = companyName || profile.companyName;
            profile.description = description || profile.description;
            profile.website = website || profile.website;
            profile.location = location || profile.location;

            profile = await profile.save();
            res.json(profile);
        } else {
            // Create new
            profile = await CompanyProfile.create({
                user: req.user.id,
                companyName,
                description,
                website,
                location
            });
            res.status(201).json(profile);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Post a new internship
// @route   POST /api/company/internship
// @access  Private (Company)
const postInternship = async (req, res) => {
    try {
        const { title, description, skillsRequired, duration, stipend, location, deadline } = req.body;

        const internship = await Internship.create({
            company: req.user.id,
            title,
            description,
            skillsRequired,
            duration,
            stipend,
            location,
            deadline
        });

        res.status(201).json(internship);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get company's internships
// @route   GET /api/company/internships
// @access  Private (Company)
const getMyInternships = async (req, res) => {
    try {
        let internships;
        if (req.user.role === 'admin') {
            internships = await Internship.find({});
        } else {
            internships = await Internship.find({ company: req.user.id });
        }
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get applications for company's jobs
// @route   GET /api/company/applications
// @access  Private (Company)
// @desc    Get applications for company's jobs
// @route   GET /api/company/applications
// @access  Private (Company)
// @desc    Get applications for company's jobs
// @route   GET /api/company/applications
// @access  Private (Company)
const getJobApplications = async (req, res) => {
    try {
        let applications;
        if (req.user.role === 'admin') {
            applications = await Application.find({})
                .populate('student', 'name email')
                .populate('internship', 'title')
                .lean(); // Use lean to allow attaching extra properties
        } else {
            // Find all internships by this company
            const internships = await Internship.find({ company: req.user.id });
            const internshipIds = internships.map(i => i._id);

            // Find applications for these internships
            applications = await Application.find({ internship: { $in: internshipIds } })
                .populate('student', 'name email')
                .populate('internship', 'title')
                .lean();
        }

        // Attach Student Profile Data (Skills, Education, Resume)
        const StudentProfile = require('../models/StudentProfile');

        const applicationsWithProfile = await Promise.all(applications.map(async (app) => {
            const profile = await StudentProfile.findOne({ user: app.student._id });
            return {
                ...app,
                studentProfile: profile || { skills: [], education: 'N/A', interests: [] }
            };
        }));

        res.json(applicationsWithProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update application status
// @route   PUT /api/company/application/:id
// @access  Private (Company)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify this application belongs to one of the company's internships
        const internship = await Internship.findById(application.internship);
        // Allow admin to bypass ownership check
        if (req.user.role !== 'admin' && internship.company.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single application by ID
// @route   GET /api/company/application/:id
// @access  Private (Company)
const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('student', 'name email')
            .populate('internship', 'title company')
            .lean();

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check authorization (Company must own the internship)
        if (req.user.role !== 'admin' && application.internship.company.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Fetch Student Profile
        const StudentProfile = require('../models/StudentProfile');
        const profile = await StudentProfile.findOne({ user: application.student._id });

        const applicationWithProfile = {
            ...application,
            studentProfile: profile || { skills: [], education: 'N/A', interests: [] }
        };

        res.json(applicationWithProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    postInternship,
    getMyInternships,
    getJobApplications,
    updateApplicationStatus,
    getApplicationById
};

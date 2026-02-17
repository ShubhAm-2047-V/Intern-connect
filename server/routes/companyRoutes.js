const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getProfile,
    updateProfile,
    postInternship,
    getMyInternships,
    getJobApplications,
    updateApplicationStatus
} = require('../controllers/companyController');

// All routes protected and for 'company' role
router.use(protect);
router.use(authorize('company', 'admin'));

router.route('/profile').get(getProfile).post(updateProfile);
router.route('/internship').post(postInternship);
router.route('/internships').get(getMyInternships);
router.route('/applications').get(getJobApplications);
router.route('/application/:id').put(updateApplicationStatus);

module.exports = router;

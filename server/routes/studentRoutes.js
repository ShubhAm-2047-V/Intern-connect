const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getProfile,
    updateProfile,
    getInternships,
    applyInternship,
    getApplications
} = require('../controllers/studentController');

// All routes protected and for 'student' role
router.use(protect);
router.use(authorize('student', 'admin'));

router.route('/profile').get(getProfile).put(updateProfile);
router.route('/internships').get(getInternships);
router.route('/apply/:id').post(applyInternship);
router.route('/applications').get(getApplications);

module.exports = router;

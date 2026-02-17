const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getUsers, verifyCompany, verifyInternship, getCompanies } = require('../controllers/adminController');

// All routes protected and for 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.put('/verify-company/:companyId', verifyCompany);
router.put('/verify-internship/:internshipId', verifyInternship);
router.get('/companies', getCompanies);

module.exports = router;

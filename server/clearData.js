const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const CompanyProfile = require('./models/CompanyProfile');
const Internship = require('./models/Internship');
const Application = require('./models/Application');

dotenv.config();

const clearData = async () => {
    try {
        await connectDB();

        console.log('Clearing data...');
        await User.deleteMany();
        await StudentProfile.deleteMany();
        await CompanyProfile.deleteMany();
        await Internship.deleteMany();
        await Application.deleteMany();

        console.log('All data cleared successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

clearData();

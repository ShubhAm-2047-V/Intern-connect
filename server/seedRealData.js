const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const CompanyProfile = require('./models/CompanyProfile');
const Internship = require('./models/Internship');
const Application = require('./models/Application');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await StudentProfile.deleteMany();
        await CompanyProfile.deleteMany();
        await Internship.deleteMany();
        await Application.deleteMany();

        console.log('--- Creating Real Data ---');

        // --- Create Students ---
        const s1 = await User.create({ name: 'shubham', email: 'shubham@example.com', password: '123', role: 'student' });
        await StudentProfile.create({
            user: s1._id,
            skills: ['HTML/CSS', 'JavaScript', 'React', 'Python'],
            education: 'Student',
            interests: ['Web Development', 'AI', 'Data Science']
        });
        const s2 = await User.create({ name: 'anurag', email: 'anurag@example.com', password: '123', role: 'student' });
        await StudentProfile.create({
            user: s2._id,
            skills: ['Java', 'C++', 'SQL'],
            education: 'Student',
            interests: ['Software Engineering', 'Databases']
        });
        console.log(`Created Students: shubham@example.com, anurag@example.com`);

        // --- Create Companies ---
        const c1 = await User.create({ name: 'Infosys', email: 'infosis@example.com', password: '123', role: 'company' });
        await CompanyProfile.create({
            user: c1._id,
            companyName: 'Infosys',
            description: 'Infosys is a global leader in next-generation digital services and consulting.',
            location: 'Bangalore, India',
            website: 'https://www.infosys.com'
        });

        const c2 = await User.create({ name: 'Google', email: 'google@example.com', password: '123', role: 'company' });
        await CompanyProfile.create({
            user: c2._id,
            companyName: 'Google',
            description: 'Google’s mission is to organize the world’s information and make it universally accessible and useful.',
            location: 'Mountain View, CA',
            website: 'https://www.google.com'
        });
        console.log(`Created Companies: infosis@example.com, google@example.com`);

        // --- Create Internships ---
        await Internship.create({
            company: c1._id,
            title: 'Systems Engineer Intern',
            description: 'Join Infosys as a Systems Engineer Intern. You will work on enterprise-level applications and gain hands-on experience with modern tech stacks.',
            skillsRequired: ['Java', 'Spring Boot', 'SQL'],
            duration: '6 Months',
            stipend: 'Paid',
            location: 'Bangalore, India',
            verified: true
        });

        await Internship.create({
            company: c1._id,
            title: 'Frontend Developer Intern',
            description: 'Help build intuitive user interfaces for our global clients.',
            skillsRequired: ['React', 'JavaScript', 'CSS'],
            duration: '3 Months',
            stipend: 'Paid',
            location: 'Remote',
            verified: true
        });

        await Internship.create({
            company: c2._id,
            title: 'Software Engineering Intern',
            description: 'As a Software Engineering Intern at Google, you will work on core products that impact billions of users worldwide.',
            skillsRequired: ['C++', 'Python', 'Algorithms', 'Data Structures'],
            duration: '3-6 Months',
            stipend: 'Paid',
            location: 'Mountain View, CA',
            verified: true
        });

        await Internship.create({
            company: c2._id,
            title: 'Machine Learning Intern',
            description: 'Work alongside elite researchers and engineers to build the next generation of AI models.',
            skillsRequired: ['Python', 'TensorFlow', 'Machine Learning'],
            duration: '6 Months',
            stipend: 'Paid',
            location: 'Remote',
            verified: true
        });
        console.log(`Created Internships for Infosys and Google`);

        // --- Create Admin ---
        await User.create({ name: 'Admin User', email: 'admin@example.com', password: '123', role: 'admin' });
        console.log(`Created Admin: admin@example.com`);

        console.log('--- Real Data Imported Successfully ---');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

importData();

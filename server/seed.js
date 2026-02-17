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

        console.log('--- Creating Demo Data ---');

        // --- Create 5 Students ---
        const studentUsers = [];
        for (let i = 1; i <= 5; i++) {
            const user = await User.create({
                name: `Student ${i}`,
                email: `student${i}@example.com`,
                password: 'password123',
                role: 'student'
            });
            await StudentProfile.create({
                user: user._id,
                skills: ['JavaScript', 'React', 'Node.js', 'Python'],
                education: 'B.Sc Computer Science',
                interests: ['Web Development', 'AI', 'Data Science']
            });
            console.log(`Created: ${user.email} / password123`);
            studentUsers.push(user);
        }

        // --- Create 5 Companies ---
        const companies = [];
        const companyNames = ['TechFlow', 'DataMinds', 'CloudSystems', 'InnovateAI', 'CyberSecure'];

        for (let i = 0; i < 5; i++) {
            const user = await User.create({
                name: companyNames[i],
                email: `company${i + 1}@example.com`,
                password: 'password123',
                role: 'company'
            });

            await CompanyProfile.create({
                user: user._id,
                companyName: companyNames[i],
                description: `We are ${companyNames[i]}, a leading tech company.`,
                location: 'Remote',
                website: `https://${companyNames[i].toLowerCase()}.com`
            });

            // Create a job for each company
            await Internship.create({
                company: user._id,
                title: `${['Frontend', 'Backend', 'Data', 'AI', 'Cyber'][i]} Intern`,
                description: `Join ${companyNames[i]} as an intern.`,
                skillsRequired: ['Tech', 'Teamwork'],
                duration: '6 Months',
                stipend: 'Paid',
                location: 'Remote',
                verified: true // Verify them so they show up
            });

            console.log(`Created: ${user.email} / password123`);
            companies.push(user);
        }

        // --- Create Admin ---
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });
        console.log(`Created: admin@example.com / password123`);

        console.log('--- Data Imported Successfully ---');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();

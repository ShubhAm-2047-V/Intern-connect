const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const users = [
    { name: 'shubham', email: 'shubham@example.com', password: '123', role: 'student' },
    { name: 'anurag', email: 'anurag@example.com', password: '123', role: 'student' },
    { name: 'infosis', email: 'infosis@example.com', password: '123', role: 'company' },
    { name: 'google', email: 'google@example.com', password: '123', role: 'company' },
    { name: 'admin', email: 'admin@example.com', password: '123', role: 'admin' }
];

const importData = async () => {
    try {
        await connectDB();

        for (const u of users) {
            // Delete if already exist
            await User.deleteOne({ email: u.email });
            await User.create(u);
            console.log(`Created user: ${u.name} (${u.role})`);
        }
        console.log('Demo Users Imported successfully!');
        process.exit();
    } catch (error) {
        console.error('Error in importData:', error);
        process.exit(1);
    }
};

importData();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const updatePasswords = async () => {
    try {
        console.log('--- Updating All Passwords to "123" ---');

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            user.password = '123';
            await user.save(); // Triggers bcrypt pre-save hook
            console.log(`Updated password for: ${user.email}`);
        }

        console.log('--- All Passwords Updated Successfully ---');
        process.exit();
    } catch (error) {
        console.error(`Error updating passwords: ${error.message}`);
        process.exit(1);
    }
};

updatePasswords();

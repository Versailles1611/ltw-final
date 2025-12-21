/**
 * createAdmin.js - Script tạo/reset Admin user
 * 
 * Chạy: node createAdmin.js
 * ĐÃ SỬA: Database đổi thành project-photo-sharing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Connection URI - ĐÃ SỬA: Đổi tên DB
const MONGODB_URI = 'mongodb://127.0.0.1:27017/project-photo-sharing';

// ============================================
// MONGOOSE SCHEMA
// ============================================

const userSchema = new mongoose.Schema({
    _id: String,
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    location: String,
    description: String,
    occupation: String,
    login_name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// ============================================
// ADMIN CONFIG
// ============================================

const ADMIN_DATA = {
    _id: "admin_user_id_001",
    first_name: "Admin",
    last_name: "User",
    location: "System",
    description: "System Administrator",
    occupation: "Admin",
    login_name: "admin",
    password: bcrypt.hashSync("admin", 10),  // password = "admin"
};

// ============================================
// MAIN FUNCTION
// ============================================

async function createAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB: ' + MONGODB_URI);

        // Check if admin exists
        const existingAdmin = await User.findOne({ login_name: "admin" });

        if (existingAdmin) {
            console.log('Admin user exists, updating password...');
            existingAdmin.password = ADMIN_DATA.password;
            await existingAdmin.save();
            console.log('Admin password updated successfully!');
        } else {
            console.log('Creating new admin user...');
            await User.create(ADMIN_DATA);
            console.log('Admin user created successfully!');
        }

        console.log('\n--- ADMIN CREDENTIALS ---');
        console.log('  login_name: "admin"');
        console.log('  password: "admin"');
        console.log('-------------------------\n');

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
}

createAdmin();

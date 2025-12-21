/**
 * initData.js - Script nạp dữ liệu vào MongoDB với Login credentials
 * 
 * Chạy: node initData.js
 * Auto-generate login_name (lowercase last_name) và password "123" cho tất cả users
 * ĐÃ SỬA: Database đổi thành project-photo-sharing, thêm Admin user
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Connection URI - ĐÃ SỬA: Đổi tên DB
const MONGODB_URI = 'mongodb://127.0.0.1:27017/project-photo-sharing';

// ============================================
// MONGOOSE SCHEMAS (Updated with login credentials)
// ============================================

const userSchema = new mongoose.Schema({
    _id: String,
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    location: String,
    description: String,
    occupation: String,
    // Authentication fields
    login_name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const commentSchema = new mongoose.Schema({
    _id: String,
    comment: { type: String, required: true },
    date_time: { type: Date, default: Date.now },
    user_id: { type: String, required: true },
});

const photoSchema = new mongoose.Schema({
    _id: String,
    file_name: { type: String, required: true },
    description: { type: String, default: '' },  // Thêm description
    date_time: { type: Date, default: Date.now },
    user_id: { type: String, required: true },
    comments: [commentSchema],
});

const schemaInfoSchema = new mongoose.Schema({
    _id: String,
    __v: Number,
    load_date_time: Date,
});

const User = mongoose.model('User', userSchema);
const Photo = mongoose.model('Photo', photoSchema);
const SchemaInfo = mongoose.model('SchemaInfo', schemaInfoSchema);

// ============================================
// SAMPLE DATA (từ models.js với login credentials)
// ============================================

// Default password cho tất cả users (dễ test)
const DEFAULT_PASSWORD = '123';

// Hash password
const hashPassword = (password) => bcrypt.hashSync(password, 10);

// Users với login_name auto-generated từ lowercase last_name
const users = [
    {
        _id: "57231f1a30e4351f4e9f4bd7",
        first_name: "Ian",
        last_name: "Malcolm",
        location: "Austin, TX",
        description: "Should've stayed in the car.",
        occupation: "Mathematician",
        login_name: "malcolm",  // lowercase last_name
        password: hashPassword(DEFAULT_PASSWORD),
    },
    {
        _id: "57231f1a30e4351f4e9f4bd8",
        first_name: "Ellen",
        last_name: "Ripley",
        location: "Nostromo",
        description: "Lvl 6 rating. Pilot.",
        occupation: "Warrant Officer",
        login_name: "ripley",
        password: hashPassword(DEFAULT_PASSWORD),
    },
    {
        _id: "57231f1a30e4351f4e9f4bd9",
        first_name: "Peregrin",
        last_name: "Took",
        location: "Gondor",
        description: "Home is behind, the world ahead... And there are many paths to tread.",
        occupation: "Thain",
        login_name: "took",
        password: hashPassword(DEFAULT_PASSWORD),
    },
    {
        _id: "57231f1a30e4351f4e9f4bda",
        first_name: "Rey",
        last_name: "Kenobi",
        location: "D'Qar",
        description: "Excited to be here!",
        occupation: "Rebel",
        login_name: "kenobi",
        password: hashPassword(DEFAULT_PASSWORD),
    },
    {
        _id: "57231f1a30e4351f4e9f4bdb",
        first_name: "April",
        last_name: "Ludgate",
        location: "Pawnee, IN",
        description: "Witch",
        occupation: "Animal Control",
        login_name: "ludgate",
        password: hashPassword(DEFAULT_PASSWORD),
    },
    {
        _id: "57231f1a30e4351f4e9f4bdc",
        first_name: "John",
        last_name: "Ousterhout",
        location: "Stanford, CA",
        description: "CS142!",
        occupation: "Professor",
        login_name: "ousterhout",
        password: hashPassword(DEFAULT_PASSWORD),
    },
    // ĐÃ THÊM: Admin User
    {
        _id: "admin_user_id_001",
        first_name: "Admin",
        last_name: "User",
        location: "System",
        description: "System Administrator",
        occupation: "Admin",
        login_name: "admin",
        password: hashPassword("admin"),  // password = "admin" (khác với DEFAULT_PASSWORD)
    },
];

// Photos với Comments và Description
const photos = [
    {
        _id: "57231f1a30e4351f4e9f4bdd",
        date_time: new Date("2012-08-30 10:44:23"),
        file_name: "ouster.jpg",
        description: "Spending a quiet afternoon with my books 📚",
        user_id: "57231f1a30e4351f4e9f4bdc",
        comments: [
            { _id: "57231f1a30e4351f4e9f4be9", date_time: new Date("2012-09-02 14:01:00"), comment: "Learning new programming languages is hard...", user_id: "57231f1a30e4351f4e9f4bdc" },
            { _id: "57231f1a30e4351f4e9f4bea", date_time: new Date("2013-09-06 14:02:00"), comment: "This is another comment, with a bit more text.", user_id: "57231f1a30e4351f4e9f4bdc" },
            { _id: "57231f1a30e4351f4e9f4beb", date_time: new Date("2013-09-08 14:06:00"), comment: "If you see this text in boldface then HTML escaping isn't working.", user_id: "57231f1a30e4351f4e9f4bdc" },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4bde",
        date_time: new Date("2009-09-13 20:00:00"),
        file_name: "malcolm2.jpg",
        description: "Nature always finds a way...",
        user_id: "57231f1a30e4351f4e9f4bd7",
        comments: [
            { _id: "57231f1a30e4351f4e9f4bec", date_time: new Date("2009-09-14 18:07:00"), comment: "Life finds a way.", user_id: "57231f1a30e4351f4e9f4bd7" },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4bdf",
        date_time: new Date("2009-09-13 20:05:03"),
        file_name: "malcolm1.jpg",
        description: "Just another day at the lab 🔬",
        user_id: "57231f1a30e4351f4e9f4bd7",
        comments: [],
    },
    {
        _id: "57231f1a30e4351f4e9f4be0",
        date_time: new Date("2013-11-18 18:02:00"),
        file_name: "ripley1.jpg",
        description: "Ready for another mission! 🚀",
        user_id: "57231f1a30e4351f4e9f4bd8",
        comments: [],
    },
    {
        _id: "57231f1a30e4351f4e9f4be1",
        date_time: new Date("2013-09-20 17:30:00"),
        file_name: "ripley2.jpg",
        description: "Back from a long journey in space",
        user_id: "57231f1a30e4351f4e9f4bd8",
        comments: [
            { _id: "57231f1a30e4351f4e9f4bed", date_time: new Date("2013-11-28 17:45:13"), comment: "Back from my trip. Did IQs just drop sharply while I was away?", user_id: "57231f1a30e4351f4e9f4bd8" },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be2",
        date_time: new Date("2009-07-10 16:02:49"),
        file_name: "kenobi1.jpg",
        description: "Beautiful sunset today ☀️",
        user_id: "57231f1a30e4351f4e9f4bda",
        comments: [],
    },
    {
        _id: "57231f1a30e4351f4e9f4be3",
        date_time: new Date("2010-03-18 23:48:00"),
        file_name: "kenobi2.jpg",
        description: "Training session completed!",
        user_id: "57231f1a30e4351f4e9f4bda",
        comments: [
            { _id: "57231f1a30e4351f4e9f4bee", date_time: new Date("2013-11-02 14:07:00"), comment: "Hey Rey, great form!", user_id: "57231f1a30e4351f4e9f4bd8" },
            { _id: "57231f1a30e4351f4e9f4bef", date_time: new Date("2013-11-02 14:09:15"), comment: "Definitely! I love your work!", user_id: "57231f1a30e4351f4e9f4bda" },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be4",
        date_time: new Date("2010-08-30 14:26:00"),
        file_name: "kenobi3.jpg",
        description: "Made a new friend today! 🐾",
        user_id: "57231f1a30e4351f4e9f4bda",
        comments: [
            { _id: "57231f1a30e4351f4e9f4bf0", date_time: new Date("2010-09-06 13:59:33"), comment: "Made a new friend today!", user_id: "57231f1a30e4351f4e9f4bda" },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be5",
        date_time: new Date("2013-12-03 09:02:00"),
        file_name: "took1.jpg",
        description: "Adventures with my best friend! 🌄",
        user_id: "57231f1a30e4351f4e9f4bd9",
        comments: [
            { _id: "57231f1a30e4351f4e9f4bf4", date_time: new Date("2016-01-04 02:00:01"), comment: "Which one are you?", user_id: "57231f1a30e4351f4e9f4bdb" },
            { _id: "57231f1a30e4351f4e9f4bf5", date_time: new Date("2016-01-04 02:04:01"), comment: "The tall one.", user_id: "57231f1a30e4351f4e9f4bd9" },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be6",
        date_time: new Date("2013-12-03 09:03:00"),
        file_name: "took2.jpg",
        description: "Second breakfast is the best breakfast! 🍳",
        user_id: "57231f1a30e4351f4e9f4bd9",
        comments: [
            { _id: "57231f1a30e4351f4e9f4bf2", date_time: new Date("2013-12-04 13:12:00"), comment: "What do you mean you haven't heard of second breakfast?", user_id: "57231f1a30e4351f4e9f4bd9" },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be7",
        date_time: new Date("2013-09-04 09:16:32"),
        file_name: "ludgate1.jpg",
        description: "Just being me... 🖤",
        user_id: "57231f1a30e4351f4e9f4bdb",
        comments: [
            { _id: "57231f1a30e4351f4e9f4bf3", date_time: new Date("2013-09-04 10:14:32"), comment: "Beautiful yet cold and aloof.", user_id: "57231f1a30e4351f4e9f4bdb" },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be8",
        date_time: new Date("2008-10-16 17:12:28"),
        file_name: "kenobi4.jpg",
        description: "My trusty ride! 🏍️",
        user_id: "57231f1a30e4351f4e9f4bda",
        comments: [
            { _id: "57231f1a30e4351f4e9f4bf1", date_time: new Date("2008-10-16 18:04:55"), comment: "Wouldn't get anywhere without this beauty!", user_id: "57231f1a30e4351f4e9f4bda" },
        ],
    },
];

const schemaInfo = {
    _id: "57231f1b30e4351f4e9f4bf6",
    __v: 0,
    load_date_time: new Date(),
};

// ============================================
// MAIN FUNCTION
// ============================================

async function initData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB: ' + MONGODB_URI);

        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Photo.deleteMany({});
        await SchemaInfo.deleteMany({});
        console.log('Cleared all existing data');

        console.log('Loading Users with login credentials...');
        await User.insertMany(users);
        console.log(`Loaded ${users.length} users`);

        console.log('Loading Photos with Comments...');
        await Photo.insertMany(photos);
        console.log(`Loaded ${photos.length} photos`);

        console.log('Loading SchemaInfo...');
        await SchemaInfo.create(schemaInfo);
        console.log('Loaded SchemaInfo');

        // Show login credentials
        console.log('\n--- LOGIN CREDENTIALS ---');
        users.forEach(user => {
            console.log(`  ${user.first_name} ${user.last_name}: login_name="${user.login_name}", password="${DEFAULT_PASSWORD}"`);
        });
        console.log('-------------------------\n');

        console.log('Database initialized successfully!');

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
}

initData();

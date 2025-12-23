/**
 * loadDatabase.js - Script nạp dữ liệu vào MongoDB
 * 
 * Chạy: node loadDatabase.js
 * MongoDB URI: mongodb://127.0.0.1:27017/cs142project6
 */

const mongoose = require('mongoose');

// MongoDB Connection URI
const MONGODB_URI = 'mongodb+srv://yentth321:yentth321@yencluster.qqbzlz7.mongodb.net/final-ltw?appName=YenCluster';

// ============================================
// MONGOOSE SCHEMAS
// ============================================

// User Schema
const userSchema = new mongoose.Schema({
    _id: String,
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    location: String,
    description: String,
    occupation: String,
});

// Comment Sub-Schema (embedded trong Photo)
const commentSchema = new mongoose.Schema({
    _id: String,
    comment: { type: String, required: true },
    date_time: { type: Date, default: Date.now },
    user_id: { type: String, required: true },
});

// Photo Schema
const photoSchema = new mongoose.Schema({
    _id: String,
    file_name: { type: String, required: true },
    date_time: { type: Date, default: Date.now },
    user_id: { type: String, required: true },
    comments: [commentSchema],
});

// SchemaInfo Schema
const schemaInfoSchema = new mongoose.Schema({
    _id: String,
    __v: Number,
    load_date_time: Date,
});

// Create Models
const User = mongoose.model('User', userSchema);
const Photo = mongoose.model('Photo', photoSchema);
const SchemaInfo = mongoose.model('SchemaInfo', schemaInfoSchema);

// ============================================
// DỮ LIỆU MẪU (Từ models.js)
// ============================================

// Users
const users = [
    {
        _id: "57231f1a30e4351f4e9f4bd7",
        first_name: "Ian",
        last_name: "Malcolm",
        location: "Austin, TX",
        description: "Should've stayed in the car.",
        occupation: "Mathematician",
    },
    {
        _id: "57231f1a30e4351f4e9f4bd8",
        first_name: "Ellen",
        last_name: "Ripley",
        location: "Nostromo",
        description: "Lvl 6 rating. Pilot.",
        occupation: "Warrant Officer",
    },
    {
        _id: "57231f1a30e4351f4e9f4bd9",
        first_name: "Peregrin",
        last_name: "Took",
        location: "Gondor",
        description: "Home is behind, the world ahead... And there are many paths to tread. Through shadow, to the edge of night, until the stars are all alight... Mist and shadow, cloud and shade, all shall fade... all... shall... fade... ",
        occupation: "Thain",
    },
    {
        _id: "57231f1a30e4351f4e9f4bda",
        first_name: "Rey",
        last_name: "Kenobi",
        location: "D'Qar",
        description: "Excited to be here!",
        occupation: "Rebel",
    },
    {
        _id: "57231f1a30e4351f4e9f4bdb",
        first_name: "April",
        last_name: "Ludgate",
        location: "Pawnee, IN",
        description: "Witch",
        occupation: "Animal Control",
    },
    {
        _id: "57231f1a30e4351f4e9f4bdc",
        first_name: "John",
        last_name: "Ousterhout",
        location: "Stanford, CA",
        description: "<i>CS142!</i>",
        occupation: "Professor",
    },
];

// Photos với Comments embedded
const photos = [
    {
        _id: "57231f1a30e4351f4e9f4bdd",
        date_time: new Date("2012-08-30 10:44:23"),
        file_name: "ouster.jpg",
        user_id: "57231f1a30e4351f4e9f4bdc", // John Ousterhout
        comments: [
            {
                _id: "57231f1a30e4351f4e9f4be9",
                date_time: new Date("2012-09-02 14:01:00"),
                comment: "Learning new programming languages is hard... it's so easy to forget a </div>!",
                user_id: "57231f1a30e4351f4e9f4bdc", // John
            },
            {
                _id: "57231f1a30e4351f4e9f4bea",
                date_time: new Date("2013-09-06 14:02:00"),
                comment: "This is another comment, with a bit more text; if the text gets long enough, does it wrap properly from line to line?",
                user_id: "57231f1a30e4351f4e9f4bdc", // John
            },
            {
                _id: "57231f1a30e4351f4e9f4beb",
                date_time: new Date("2013-09-08 14:06:00"),
                comment: "If you see this text in <b>boldface</b> then HTML escaping isn't working properly.",
                user_id: "57231f1a30e4351f4e9f4bdc", // John
            },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4bde",
        date_time: new Date("2009-09-13 20:00:00"),
        file_name: "malcolm2.jpg",
        user_id: "57231f1a30e4351f4e9f4bd7", // Ian Malcolm
        comments: [
            {
                _id: "57231f1a30e4351f4e9f4bec",
                date_time: new Date("2009-09-14 18:07:00"),
                comment: "If there is one thing the history of evolution has taught us it's that life will not be contained. Life breaks free, it expands to new territories and crashes through barriers, painfully, maybe even dangerously, but, uh... well, there it is. Life finds a way.",
                user_id: "57231f1a30e4351f4e9f4bd7", // Ian
            },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4bdf",
        date_time: new Date("2009-09-13 20:05:03"),
        file_name: "malcolm1.jpg",
        user_id: "57231f1a30e4351f4e9f4bd7", // Ian Malcolm
        comments: [],
    },
    {
        _id: "57231f1a30e4351f4e9f4be0",
        date_time: new Date("2013-11-18 18:02:00"),
        file_name: "ripley1.jpg",
        user_id: "57231f1a30e4351f4e9f4bd8", // Ellen Ripley
        comments: [],
    },
    {
        _id: "57231f1a30e4351f4e9f4be1",
        date_time: new Date("2013-09-20 17:30:00"),
        file_name: "ripley2.jpg",
        user_id: "57231f1a30e4351f4e9f4bd8", // Ellen Ripley
        comments: [
            {
                _id: "57231f1a30e4351f4e9f4bed",
                date_time: new Date("2013-11-28 17:45:13"),
                comment: "Back from my trip. Did IQs just... drop sharply while I was away?",
                user_id: "57231f1a30e4351f4e9f4bd8", // Ellen
            },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be2",
        date_time: new Date("2009-07-10 16:02:49"),
        file_name: "kenobi1.jpg",
        user_id: "57231f1a30e4351f4e9f4bda", // Rey Kenobi
        comments: [],
    },
    {
        _id: "57231f1a30e4351f4e9f4be3",
        date_time: new Date("2010-03-18 23:48:00"),
        file_name: "kenobi2.jpg",
        user_id: "57231f1a30e4351f4e9f4bda", // Rey Kenobi
        comments: [
            {
                _id: "57231f1a30e4351f4e9f4bee",
                date_time: new Date("2013-11-02 14:07:00"),
                comment: "Hey Rey, great form. Love what you do with the scavenged tech, got any tips?",
                user_id: "57231f1a30e4351f4e9f4bd8", // Ellen
            },
            {
                _id: "57231f1a30e4351f4e9f4bef",
                date_time: new Date("2013-11-02 14:09:15"),
                comment: "Definitely! I love your work! I'm away on a trip at the moment, but let's meet up when I get back! :)",
                user_id: "57231f1a30e4351f4e9f4bda", // Rey
            },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be4",
        date_time: new Date("2010-08-30 14:26:00"),
        file_name: "kenobi3.jpg",
        user_id: "57231f1a30e4351f4e9f4bda", // Rey Kenobi
        comments: [
            {
                _id: "57231f1a30e4351f4e9f4bf0",
                date_time: new Date("2010-09-06 13:59:33"),
                comment: "Made a new friend today! Well, they followed me home, anyway.",
                user_id: "57231f1a30e4351f4e9f4bda", // Rey
            },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be5",
        date_time: new Date("2013-12-03 09:02:00"),
        file_name: "took1.jpg",
        user_id: "57231f1a30e4351f4e9f4bd9", // Peregrin Took
        comments: [
            {
                _id: "57231f1a30e4351f4e9f4bf4",
                date_time: new Date("2016-01-04 02:00:01"),
                comment: "Which one are you?",
                user_id: "57231f1a30e4351f4e9f4bdb", // April
            },
            {
                _id: "57231f1a30e4351f4e9f4bf5",
                date_time: new Date("2016-01-04 02:04:01"),
                comment: "The tall one.",
                user_id: "57231f1a30e4351f4e9f4bd9", // Peregrin
            },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be6",
        date_time: new Date("2013-12-03 09:03:00"),
        file_name: "took2.jpg",
        user_id: "57231f1a30e4351f4e9f4bd9", // Peregrin Took
        comments: [
            {
                _id: "57231f1a30e4351f4e9f4bf2",
                date_time: new Date("2013-12-04 13:12:00"),
                comment: "What do you mean you haven't heard of second breakfast?",
                user_id: "57231f1a30e4351f4e9f4bd9", // Peregrin
            },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be7",
        date_time: new Date("2013-09-04 09:16:32"),
        file_name: "ludgate1.jpg",
        user_id: "57231f1a30e4351f4e9f4bdb", // April Ludgate
        comments: [
            {
                _id: "57231f1a30e4351f4e9f4bf3",
                date_time: new Date("2013-09-04 10:14:32"),
                comment: "Beautiful yet cold and aloof. Loner. Does not obey, occasionally chooses to cooperate. ",
                user_id: "57231f1a30e4351f4e9f4bdb", // April
            },
        ],
    },
    {
        _id: "57231f1a30e4351f4e9f4be8",
        date_time: new Date("2008-10-16 17:12:28"),
        file_name: "kenobi4.jpg",
        user_id: "57231f1a30e4351f4e9f4bda", // Rey Kenobi
        comments: [
            {
                _id: "57231f1a30e4351f4e9f4bf1",
                date_time: new Date("2008-10-16 18:04:55"),
                comment: "Wouldn't get anywhere without this beauty! Completely built from scraps by hand, but she goes at top speeds that'll rival any First Order piece of junk.",
                user_id: "57231f1a30e4351f4e9f4bda", // Rey
            },
        ],
    },
];

// SchemaInfo
const schemaInfo = {
    _id: "57231f1b30e4351f4e9f4bf6",
    __v: 0,
    load_date_time: new Date(),
};

// ============================================
// MAIN FUNCTION - NẠP DỮ LIỆU
// ============================================

async function loadDatabase() {
    try {
        // 1. Kết nối MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB: ' + MONGODB_URI);

        // 2. Xóa dữ liệu cũ
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Photo.deleteMany({});
        await SchemaInfo.deleteMany({});
        console.log('✅ Cleared all existing data');

        // 3. Nạp Users
        console.log('👥 Loading Users...');
        await User.insertMany(users);
        console.log(`✅ Loaded ${users.length} users`);

        // 4. Nạp Photos (với Comments embedded)
        console.log('📷 Loading Photos with Comments...');
        await Photo.insertMany(photos);
        console.log(`✅ Loaded ${photos.length} photos`);

        // 5. Nạp SchemaInfo
        console.log('ℹ️  Loading SchemaInfo...');
        await SchemaInfo.create(schemaInfo);
        console.log('✅ Loaded SchemaInfo');

        // 6. Thống kê
        const userCount = await User.countDocuments();
        const photoCount = await Photo.countDocuments();
        let commentCount = 0;
        const allPhotos = await Photo.find({});
        allPhotos.forEach(photo => {
            commentCount += photo.comments.length;
        });

        console.log('\n📊 Database Statistics:');
        console.log(`   Users: ${userCount}`);
        console.log(`   Photos: ${photoCount}`);
        console.log(`   Comments: ${commentCount}`);

        console.log('\n🎉 Database loaded successfully!');
        console.log('👉 You can now start the webServer.js');

    } catch (error) {
        console.error('❌ Error loading database:', error);
    } finally {
        // Đóng kết nối
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);
    }
}

// Chạy script
loadDatabase();

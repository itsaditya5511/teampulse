require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find();
        console.log("Users in DB:", users);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkDB();

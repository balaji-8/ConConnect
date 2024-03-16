const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL, {});
    console.log(`MongoDB Connected: ${con.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;

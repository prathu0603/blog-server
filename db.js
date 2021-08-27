const mongoose = require("mongoose");

const Connection = async () => {
  try {
    const URL = process.env.MONGO_URL;
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error In MongoDB", error);
  }
};

module.exports = Connection;

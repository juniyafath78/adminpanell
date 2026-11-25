const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes('<db_username>') || mongoUri.includes('<db_password>')) {
    throw new Error(
      'MONGO_URI is not configured with valid MongoDB Atlas credentials in backend/.env'
    );
  }

  const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB Atlas connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;

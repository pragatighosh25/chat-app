import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { DB_NAME } from '../constants.js';

//function to connect to the database
export const connectDB = async () => {
  try {

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established');
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

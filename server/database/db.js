import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "BookLibrary", 
      
    })
    .then(() => {
      console.log(`Kết nối thành công`);
    })
    .catch((err) => {
      console.log(`Lỗi kết nối:`, err);
    });
};
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";
import expressFileupload from "express-fileupload";
import fs from "fs";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";
import dotenv from "dotenv"

// Load config từ file .env
dotenv.config({ path: "./config/config.env" });
console.log(`Server is running on port ${process.env.PORT}`)
// Kiểm tra file config.env
if (!fs.existsSync("./config/config.env")) {
  console.error("⚠️ Thiếu file config.env. Vui lòng kiểm tra lại.");
}

// Kiểm tra biến môi trường FRONTEND_URL
if (!process.env.FRONTEND_URL) {
  console.error("⚠️ Thiếu FRONTEND_URL trong file config.env. Vui lòng kiểm tra lại.");
}

// Tạo thư mục tạm cho express-fileupload nếu chưa có
if (!fs.existsSync("./temp/")) {
  fs.mkdirSync("./temp/");
}

// Kết nối tới database


export const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressFileupload({
    useTempFiles: true,
    tempFileDir: "./temp/",
  })
);

// Định nghĩa các routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

notifyUsers();
removeUnverifiedAccounts();

connectDB();

app.use(errorMiddleware);


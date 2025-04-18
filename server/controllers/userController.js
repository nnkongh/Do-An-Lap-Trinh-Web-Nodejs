import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

// Lấy tất cả người dùng đã xác nhận tài khoản
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ accountVerified: true });
    res.status(200).json({
        success: true,
        users,
    });
});

// Đăng ký Admin mới
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    // Kiểm tra xem có ảnh đại diện không
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Cần avatar Admin", 400));
    }

    const { name, email, password } = req.body;

    // Kiểm tra các trường thông tin cơ bản
    if (!name || !email || !password) {
        return next(new ErrorHandler("Xin vui lòng điền hết vào chỗ trống", 400));
    }

    // Kiểm tra nếu người dùng đã đăng ký rồi
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
        return next(new ErrorHandler("Người dùng đã đăng ký rồi", 400));
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Mật khẩu phải dài 8 đến 16 ký tự", 400));
    }

    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    // Kiểm tra định dạng ảnh
    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(new ErrorHandler("File format không được hỗ trợ", 400));
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tải ảnh lên Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
            folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS"
        }
    );

    // Kiểm tra lỗi khi tải ảnh lên Cloudinary
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Lỗi Cloudinary", cloudinaryResponse.error || "lỗi");
        return next(new ErrorHandler("Lỗi khi tải hình ảnh lên Cloudinary", 500));
    }

    // Tạo mới người dùng Admin
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        accountVerified: true,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    });

    // Trả về thông báo thành công
    res.status(201).json({
        success: true,
        message: "Admin đã được đăng ký thành công",
        user, // Thay `admin` bằng `user`
    });
});

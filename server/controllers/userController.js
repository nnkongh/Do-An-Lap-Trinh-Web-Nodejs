import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../middlewares/errorMiddlewares";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
export const getAllUsers = catchAsyncErrors(async(req, res, next)=>{
    const users = await User.find({accountVerified: true});
    resizeBy.status(200).json({
        success: true,
        users,
    });
});
export const registerNewAdmin= catchAsyncErrors(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("cần avatar Admin", 400));
    }
    const {name,email,password}=req.body;
    if (!name || !email || !password){
        return next(new ErrorHandler("Xin vui lòng điền hết vào chỗ trống", 400));
    }
    const isRegistered = await User.findOne({email, accountVerified: true});
    if (isRegistered){
        return next(new ErrorHandler("Người dùng đã đăng ký rồi", 400));
    }
    if (password.length < 8 || password.length > 16){
        return next(
            new ErrorHandler("Mật khẩu phải dài 8 đến 16 ký tự", 400)
        );
    }
    const {avatar} = req.files;
    const allowedFormats = ["image/png","image/jpeg","image/webp"];
    if (!allowedFormats.includes(avatar.mimetype)){
        return next(new ErrorHandler("file format không được hỗ trợ", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
            folder:"LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS"
        }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error){
        console.error(
            "lỗi Cloudinary",
            cloudinaryResponse.error || "lỗi"
        );
        return next(
            new ErrorHandler("lỗi khi tải hình ảnh lên cloudinary", 500)
        );
    }
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        accountVerified: true,
        avatar:{
            public_id:cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    });
    res.status(201).json({
        success: true,
        message: "Admin đã được đăng ký thành công",
        admin,
    })
});
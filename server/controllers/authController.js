import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt"; // Sửa lỗi import
import crypto from "crypto";
import {sendVerificationCode} from "../utils/sendVerificationCode.js";
import {sendToken} from "../utils/sendtoken.js";
import {sendEmail} from "../utils/sendEmail.js";
import { generateForgotPassWordEmailTemplate } from "../utils/emailTemplates.js";


export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorHandler("Xin hãy nhập hết vào chỗ trống", 400));
        }

        const isRegistered = await User.findOne({ email, accountVerified: true });
        if (isRegistered) {
            return next(new ErrorHandler("Người dùng này đã tồn tại", 400));
        }

        const registrationAttemptsByUser = await User.find({ email, accountVerified: false });
        if (registrationAttemptsByUser.length > 5) {
            return next(new ErrorHandler("Bạn đã vượt quá mức đăng ký cho phép, vui lòng liên hệ hỗ trợ", 400));
        }

        if (password.length < 8 || password.length > 16) {
            return next(new ErrorHandler("Mật khẩu phải từ 8 đến 16 ký tự", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            accountVerified: role === "Admin" ? true : false, // hoặc tùy config của bạn

        });

        const verificationCode = user.generateVerificationCode(); // Sửa lỗi gọi method
        await user.save();

        sendVerificationCode(verificationCode, email, res);
    } catch (error) {
        next(error);
    }
});


export const verifyOTP = catchAsyncErrors(async (req, res, next)=> {
    const {email,otp} =req.body;
    if(!email|| !otp){
        return next(new ErrorHandler("Email hoặc otp bị thiếu", 400))
    };
    try{
        const userAllEntries=await User.find({
            email,
            accountVerified:false,
        }).sort({createdAt:-1});

        if(!userAllEntries || userAllEntries.length === 0){
            return next(new ErrorHandler("người dùng không tìm thấy", 404));
        }
        let user;
        if(userAllEntries.length>1){
            user =userAllEntries[0];
            await User.deleteMany({
                _id: {$ne: user._id},
                email,
                accountVerified:false,
            });
        }else{
            user=userAllEntries[0];
        }
        if(user.verificationCode !== Number(otp)){
            return next(new ErrorHandler("Mã otp ko hợp lệ",400));
        }
        const currentTime=Date.now();
        const verificationCodeExpire=new Date(
            user.verificationCodeExpire
        ).getTime();
        if(currentTime>verificationCodeExpire){
            return next(new ErrorHandler("OTP quá hạn", 400));
        }
        user.accountVerified=true;
        user.verificationCode=null;
        user.verificationCodeExpire=null;
        await user.save({validateModifiedOnly:true});
        sendToken(user,200,"tài khoản đã đc xác minh", res);
    }catch (error) {
        return next(new ErrorHandler("server bị lỗi", 500));
    }
});
export const login =catchAsyncErrors(async(req, res, next)=>{
    
    const {email,password}=req.body;
    if (!email||!password){
        return next(new ErrorHandler("Vui lòng điền hết vào ô trống", 400))
    }
    const user = await User.findOne({email, accountVerified: true}).select("+password");
    if(!user){
        return next(new ErrorHandler("email hoặc password không hợp lệ", 400));       
    }
    const isPasswordMatched= await bcrypt.compare(password, user.password);
    if (!isPasswordMatched){
        return next(new ErrorHandler("Email hoặc password không đúng", 400));
    }
    
    sendToken(user, 200, "user đăng nhập thành công", res);
});
export const logout = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("token", "",{
        expires: new Date(Date.now()),
        httpOnly: true,       
    })
    .json({
        success: true,
        message:"đăng xuất thành công",
    });
});
export const getUser=catchAsyncErrors(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user,

    })
});
export const forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    if (!req.body.email){
        return next(new ErrorHandler("cần email", 400));
    }
    const user=await User.findOne({
        email:req.body.email,
        accountVerified:true,
    });
    if (!user) {
        return next (new ErrorHandler("email không hợp lệ", 400));
    }
    const resetToken =user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});
    const resetPasswordUrl= `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message= generateForgotPassWordEmailTemplate(resetPasswordUrl);
    
    try{
        await sendEmail({
            email: user.email, 
            subject: "khôi phục mật khẩu",
            message,
        });
        console.log("đang làm tới dòng 149")
        res.status(200).json({
            success: true,
            message:`email đã gửi đến ${user.email} thành công.`,
        });
    }   catch (error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire= undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message, 500));
    }
});
export const resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const {token} =req.params;
    const resetPasswordToken =crypto.createHash("sha256").update(token).digest("hex");
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()},
    });
    if (!user) {
        return next(new ErrorHandler(
            "mã gửi không hợp lệ hoặc đã quá hạn", 
            400
        )
        );
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("mật khẩu không trùng khớp", 400))
    }
    if(
        req.body.password.length < 8  || 
        req.body.password.length > 16 || 
        req.body.confirmPassword.length < 8 || 
        req.body.confirmPassword.length > 16 
    ){
        return next(
            new ErrorHandler("mật khẩu phải từ 8 đến 16 ký tự", 400)
        );
    }
    const hashedPassword=await bcrypt.hash(req.body.password, 10);
    user.password=hashedPassword;
    user.resetPasswordToken= undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendToken(user, 200,"mật khẩu đã được đổi thành công", res );
});
export const updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user =await User.findById(req.user._id).select("+password"); 
    const {currentPassword, newPassword, confirmNewPassword}=req.body;
    if(!currentPassword || !newPassword || !confirmNewPassword){
        return next(new ErrorHandler("làm ơn điền hết vào chỗ trống.", 400));
    }
    const isPasswordMatched = await bcrypt.compare(
        currentPassword, 
        user.password
    );
    if(!isPasswordMatched){
        return next( new ErrorHandler("mật khẩu hiện tại sai", 400));
    }
    if (
        newPassword.length < 8  || 
        newPassword.length > 16 || 
        confirmNewPassword.length < 8 || 
        confirmNewPassword.length > 16 )
        {
         return next(
            new ErrorHandler("mật khẩu phải từ 8 đến 16 ký tự", 400)
       );
    }
    if(newPassword !== confirmNewPassword){
        return next(
            new ErrorHandler("Mật khẩu không trùng khớp",
                400
            )
        );
    }
    const hashedPassword=await bcrypt.hash(newPassword, 10);
    user.password=hashedPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message:"mật khẩu đã được cập nhật",
    })
});
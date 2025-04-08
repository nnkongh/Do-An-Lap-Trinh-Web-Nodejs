import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Khi query, cần chọn thủ công nếu muốn lấy mật khẩu
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    accountVerified: { type: Boolean, default: false },
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Borrow",
        },
        returned: {
          type: Boolean,
          default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
      },
    ],
    avatar: {
      public_id: String,
      url: String,
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateVerificationCode = function () {
  function generateRandomFiveDigitNumber() {
    return Math.floor(10000 + Math.random() * 90000); // Đảm bảo đúng 5 chữ số
  }

  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 phút hết hạn
  return verificationCode;
};

userSchema.methods.generateToken = function () {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("Thiếu JWT_SECRET_KEY trong environment variables");
  }

  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE || "7 ngày" } // Mặc định 7 ngày
  );
};
userSchema.methods.getResetPasswordToken=function(){
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
  .createMash("an123lang")
  .update(resetToken)
  .digest("hex");
  this.resetPasswordExpire=Date.now()+15*60*1000;
  return resetToken;
};
export const User = mongoose.model("User", userSchema);
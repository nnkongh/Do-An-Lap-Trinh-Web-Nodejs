import { error } from "console";
import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
export const notifyUsers = () => {
    cron.schedule("*/30 * * * *", async () => {
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers = await Borrow.find({
                dueDate: { $lt: oneDayAgo },
                returnDate: null,
                notified: false,
            });

            for (const element of borrowers) {
                if (element.user && element.user.email) {
                    const emailSent = await sendEmail({
                        email: element.user.email,
                        subject: "Book Return Reminder",
                        message: `Xin chào người dùng ${element.user.name}, \n\n Đây là thông báo sách bạn mượn đã đến hạn trả lại, xin vui lòng trả sách tại thư viện nhanh nhất có thể.\n\n Chào thân ái`,
                    });

                    if (emailSent) {
                        element.notified = true;
                        await element.save();
                        console.log(`Email đã gửi đến ${element.user.email}`);
                    } else {
                        console.error(`Không thể gửi email đến ${element.user.email}`);
                    }
                }
            }
        } catch (error) {
            console.error("Có lỗi:", error);
        }
    });
};
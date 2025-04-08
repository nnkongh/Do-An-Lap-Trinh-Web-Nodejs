import cron from "node-cron";
import { User } from "../models/userModel";

export const removeUnverifiedAccounts = () => {
    cron.schedule("*/5 * * * *", async () => {
        try {
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
            const result = await User.deleteMany({
                accountVerified: false,
                createdAt: { $lt: thirtyMinutesAgo },
            });

            console.log(`Đã xóa ${result.deletedCount} tài khoản chưa xác thực.`);
        } catch (error) {
            console.error("Có lỗi khi xóa tài khoản chưa xác thực:", error);
        }
    });
};
export async function sendVerificationCode(verrificationCode, email, res){
    try{
        const message=generateVerificationOtpEmailTemplate(verrificationCode);
        sendmail({
            email,
            subject:"Mã xác nhận(Thư viện sách online)",
            message,
        });
        res.status(200).json({
            success:true,
            message:"Mã xác nhận đã gửi",
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Mã không gửi được",
        });
    }
}
    

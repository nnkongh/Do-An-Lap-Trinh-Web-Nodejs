class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

export const errorMiddleware=(err, req, res, next)=>{
    err.message=err.message || "Lỗi chung";
    err.statusCode=err.statusCode || 500;

    if(err.code === 11000){
        const statusCode=400;
        const message=`Bị trùng cmnr`;
        err=new ErrorHandler(message, statusCode) 
    }
    if(err.name ==="JsonWebTokenError"){
        const statusCode=400;
        const message=`web ko hợp lệ`;
        err=new ErrorHandler(message, statusCode) 
    }
    if(err.name === "TokenExpiredError"){
        const statusCode=400;
        const message=`web ko hợp lệ`;
        err=new ErrorHandler(message, statusCode)
    }
    if(err.name ==="CastError"){
        const statusCode=400;
        const message=`không tìm thấy:" $(err.path)`;
        err=new ErrorHandler(message, statusCode);
    }
    const errorMessage=err.errors 
        ? Object.values(err.errors)
            .map(error => error.message)
            .join("")
        :err.message;
    return res.status(err.statusCode).json({
        sucesss: false,
        message: errorMessage,
    });
};

export default ErrorHandler;



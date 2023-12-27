const EnumErrors = require("../../handlers/errors/EnumError");

const errorHandler = (error,req,res,next)=>{
    
    switch(error.code){
        case EnumErrors.DATABASE_ERROR:
            res.json({status:"Error", error:error.name})
            break;
        case EnumErrors.INVALID_TYPES_ERROR:
            res.json({status:"Error", error:error.name})
            break;
        case EnumErrors.LOGIN_ERROR:
            res.json({status:"Error", error:error.name})
            break;
        case EnumErrors.ROUTING_ERROR:
            res.json({status:"Error", error:error.name})
            break;
        default:
            res.status(500).json({status:"error", error:"Internal server error"})
            break;
    }
}

module.exports = errorHandler;
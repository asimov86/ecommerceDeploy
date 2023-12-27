const messageModel = require ('../models/mongo/message.model');

////////////////////////////
/// Rutas para messages ///
////////////////////////////
class Messages{
    constructor(logger) {
        this.logger = logger;
    }

    async post(item){
        let{user, message} =item;
        this.logger.info(user, message);
        if ( !message || !user)
        this.logger.info({status :"error" , error:" Info Incompleta"})
        let result =await messageModel.create({
            user,
            message
        })
        return result
    }
}

module.exports = Messages;
const mongoose = require('mongoose');

const messageCollection = 'message';
const messageSchema= new mongoose.Schema({
    user:{
        type:String,
        unique: false
    },
    message:String,
    createTimestamp: {
        type: Date, // Utiliza el tipo de dato Date para almacenar la fecha y hora
        default: Date.now, // Establece la fecha y hora actual por defecto
    }
})

const messageModel = mongoose.model(messageCollection,messageSchema);
module.exports = messageModel;


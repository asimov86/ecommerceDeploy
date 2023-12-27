const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const productCollection = 'product';
const productSchema= new mongoose.Schema({
    title:{
        type:String,
        unique: true,
    },
    description:String,
    category:{
        type:String,
        enum:["comida", "bebida", "postre"],
        index:true
    },
    price:Number,
    thumbnail:String,
    code:String,
    stock:Number,
    createTimestamp: {
        type: Date, // Utiliza el tipo de dato Date para almacenar la fecha y hora
        default: Date.now, // Establece la fecha y hora actual por defecto
    },
    modifyTimestamp: {
        type: Date, // Utiliza el tipo de dato Date para almacenar la fecha y hora
        default: Date.now, // Establece la fecha y hora actual por defecto
    },
    owner: {
        type: mongoose.Types.ObjectId,
        default: 'admin',
        required: false,
        ref: "users"
    }
})
productSchema.plugin(mongoosePaginate);
const Products = mongoose.model(productCollection,productSchema);
module.exports = Products;
const mongoose = require('mongoose');

const userCollection = 'user';
const userSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    password: {
        type: String,
        required: false
    },
    cart:{
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: "cart"
    },
    role: {
        type:mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: "role"
    },
    picture: String,
    confirmed: {
        type: Boolean,
        default: false
    },
    documents: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
        required: false
    },
    last_connection: {
        type: Date,
        require: true,
        default: null
    }
});

const Users = mongoose.model(userCollection, userSchema);
module.exports = Users;
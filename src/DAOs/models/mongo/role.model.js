const mongoose = require('mongoose');


const roleCollection = 'role';
const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true
    }

});

const Roles = mongoose.model(roleCollection, roleSchema);
module.exports = Roles;
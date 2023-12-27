const roleModel = require('../DAOs/dbManagers/RolesDao');

const role = new roleModel();

const getRoleByID = async (uid) => {
    try {
        return role.findById(uid);
    } catch (error) {
        throw error;
    }
}

const getRoleByName = async (name) => {
    try {
        return role.findByName(name);
    } catch (error) {
        throw error;
    }
}

module.exports = {getRoleByID, getRoleByName};
const Roles = require('../models/mongo/role.model');


class Role{
    async findById(uid) {
        try {
            const role = await Roles.findOne({ _id: uid});
            return role;
        } catch (error) {
            throw error;
        }
    }

    async findByName(name) {
        try {
            const roleName = await Roles.findOne({roleName: name});
            return roleName;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Role;
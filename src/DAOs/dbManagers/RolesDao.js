const Roles = require('../models/mongo/role.model');


class Role{
    async findById(uid) {
        const role = await Roles.findOne({ _id: uid});
        return role;
    }

    async findByName(name) {
        const roleName = await Roles.findOne({roleName: name});
        return roleName;
    }
}

module.exports = Role;
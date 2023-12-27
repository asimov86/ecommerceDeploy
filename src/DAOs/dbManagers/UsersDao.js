const Users = require('../models/mongo/user.model');

class UsersDao {
    async findAll() {
        return await Users.find()
    }

    async insertOne(newUserInfo) {
        const newUser = await Users.create(newUserInfo);
        return newUser._id
    }

    async confirmNewUser(userId) {
        try {
            let userExist = await Users.find({_id: userId});
            if(userExist){
                const user = await Users.updateOne(
                    {_id: userId}, 
                    {$set:{
                        confirmed:'true'}
                    }
                );
                return user;
            }   
            
        } catch (error) {
            return ("No se pudo actualizar el usuario. " + error.message);
        }
        
    }

    async getUserByEmail(email) {
        const user = await Users.findOne({ email: email});
        return user;
    }

    async findById(uid) {
        try {
            const user = await Users.findOne({ _id: uid});
            if (!user || typeof user === 'undefined') {
                console.log(user);
                const error = new Error(`Error!: El usuario ${uid} no existe.`);
                error.code = 14001; // Asignar un código al error
                throw error;
            }
            return user;
        } catch (error) {
            throw error;
        }
        
    }
    async findByCart(cid) {
        const user = await Users.findOne({ cart: cid});
        return user;
    }

    async findByCartId(cid) {
        const user = await Users.findOne({ cart: cid});
        return user;
    }

    async updateUser(id, user){
        //delete user._id;
        const result = await Users.updateOne({ _id: id }, { $set: user });
        return result;
    };

    async findByIdAndUpdate(uid, last_connection) {
        try {
            const filter = { _id: uid };
            const update = { $set: last_connection };
            const options = { new: true };

            const updatedUser = await Users.findOneAndUpdate(filter, update, options);
            if (!updatedUser) {
                const error = new Error(`Error!: El usuario ${uid} no pudo ser actualizado.`);
                error.code = 14002; // Código de error personalizado
                throw error;
            }
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async updateUserDocuments(userId, documents) {
        try {
            const newDocument = documents;
            // Verifico si existe el usuario
            const user = await Users.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            user.documents.push(newDocument);
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UsersDao;
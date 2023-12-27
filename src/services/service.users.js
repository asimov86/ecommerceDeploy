//const {Router} = require('express');
const jwt = require('../utils/jwt');
const { generateToken, authToken, verifyJwt} = require('../utils/jwt')
const UsersDao = require('../DAOs/dbManagers/UsersDao');

const Users = new UsersDao();


const getUsers = async () => {
    try {
        return Users.findAll();
    } catch (error) {
        throw error;
    }
}

const getUserByID = async (uid) => {
    try {
        return Users.findById(uid);
    } catch (error) {
        throw error;
    }
}

const getUserByCartId = async (cid) => {
    try {
        return Users.findByCartId(cid);
    } catch (error) {
        throw error;
    }
}

const createUser = async (userInfo) => {
    try {
        return Users.insertOne(userInfo)
    } catch (error) {
        throw error;
    }
}

const confirmToken = async (authToken) => {
    try {
        // Decodificar el token JWT utilizando verifyJwt
        const user = await verifyJwt(authToken);
        const userId = user.userId;
        return Users.confirmNewUser(userId);
    } catch (error) {
        throw error;
    }
}

const getUserByEmail = async (email) => {
    try {
        return Users.getUserByEmail(email);
    } catch (error) {
        throw error;
    }
}

const getUserByCart = async (email) => {
    try {
        return Users.findByCart(email);
    } catch (error) {
        throw error;
    }
}

const updateUser = async (id, user) => {
    try {
        return Users.updateUser(id, user);
    } catch (error) {
        throw error;
    }
}

const findByIdAndUpdateDate = async (userId, last_connection) => {
    try {
        return Users.findByIdAndUpdate(userId, last_connection);
    } catch (error) {
        throw error;
    }
}

const updateUserDocuments = async (uid, documents) => {
    try {
        return Users.updateUserDocuments(uid, documents);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUsers,
    getUserByID,
    createUser,
    confirmToken,
    getUserByEmail,
    getUserByCart,
    getUserByCartId,
    updateUser,
    findByIdAndUpdateDate,
    updateUserDocuments
};


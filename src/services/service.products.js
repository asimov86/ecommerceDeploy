//const {Router} = require('express');
const ProductsDao = require('../DAOs/dbManagers/ProductsDao.js');
const User = require('./service.users.js');
const Role = require('./service.roles.js');

const Products = new ProductsDao();

const findAll = async (customQuery,page,limitValue,sort) => {
    try {
        return Products.findAll(customQuery,page,limitValue,sort);
    } catch (error) {
        throw error;
    }
};

const getById = async (pid) => {
    try {
        return Products.getById(pid);
    } catch (error) {
        throw error;
    }
}

const insertOne = async (newProductInfo) => {
    try {
        return Products.insertOne(newProductInfo);
    } catch (error) {
        throw error;
    }
}

const update = async (newProductInfo, itemId) => {
    try {
        console.log(newProductInfo);
        console.log(itemId );
        return Products.update(newProductInfo, itemId);
    } catch (error) {
        throw error;
    }
}

const deleteById = async (itemId, userValue) => {
    try {
        const user = await User.getUserByID(userValue);
        // Para la prueba de la Documentación de la API elimino la parte de permisos
        const prod = await Products.getById(itemId);
        let prodOwner = prod.owner;
        const roleUserId = user.role.toString();
        const roleUser= await Role.getRoleByID(roleUserId); //
        const roleUserName = roleUser.roleName;
        if(roleUserName !== 'admin'){
            if(prodOwner == null ){
                //Para evitar un error, verifico por si algún producto no tiene owner. Así sólo lo borra un admin.
                const error = new Error('Error al buscar el owner del producto para eliminar.');
                error.code = 15001; // Asignar un código al error
                throw error;
            }
            // Verifico que el usuario actual sea el owner del producto para que lo pueda eliminar.
            if ((prodOwner.toString() !== userValue)) {
                const error = new Error('El usuario actual no es owner del producto, no se puede eliminar.');
                error.code = 15002; // Asignar un código al error
                throw error;        
            }
        }
        return Products.deleteById(itemId);
    } catch (error) {
        throw error;
    }
}

const getPreviousPage = async (currentPage) => {
    try {
        return Products.getPreviousPage(currentPage);
    } catch (error) {
        throw error;
    }
}

const getNextPage = async (currentPage) => {
    try {
        return Products.getNextPage(currentPage);
    } catch (error) {
        throw error;
    }
}

module.exports = {findAll, getById, insertOne, update, deleteById, getPreviousPage, getNextPage};
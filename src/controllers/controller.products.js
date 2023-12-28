const {Router} = require('express');
const authorizationMiddleware = require('../middleware/authorization.js');
const {isAdmin, isPremium} = require('../middleware/authorization.js');
//const ProductsDao = require('../DAOs/dbManagers/ProductsDao');
const productsService = require('../services/service.products.js');
const ProductsDTO = require('../DTO/product.dto.js');
const { authToken, verifyJwt } = require('../utils/jwt.js');
//const Products = new ProductsDao();
const router = Router();

// API
router.get('/', async (req, res) => {
    // Agregando límite, si no se agrega el límite trae todo los productos, de traer el límite trae la cantidad indicada.
    let limitValue = parseInt(req.query.limit, 10) || 10;
    let page = parseInt(req.query.page, 10) || 1;
    let customQuery = req.query.query;
    if(!customQuery){
        customQuery = '';
    }else{
        customQuery = customQuery.toLowerCase();
    }
    let sort = parseInt(req.query.sort) || '';
    const products = await productsService.findAll(customQuery,page,limitValue,sort);
    req.logger.info(products)
    res.json({messages: products});
}) 

router.get('/:pid', authorizationMiddleware.isUser, async (req, res) => {
    try {
        const user = req.params.user;
        const pid = req.params.pid;
        const prod = await productsService.getById(pid);
        req.logger.info(prod)
        res.json({messages: prod});
    } catch (error) {
        console.log(error);
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.post('/', authToken, isAdmin, async (req, res) => {
    try {
        const { title, description, category, price, thumbnail, code, stock } = req.body;
        //req.logger.info(req)
        const lowerCategoryProduct = category.toLowerCase();
        const productRegister = { title, description, lowerCategoryProduct, price, thumbnail, code, stock }
        const newProductInfo = new ProductsDTO(productRegister);
        const newProduct = await productsService.insertOne(newProductInfo);
        req.logger.info(`The product has been created with ID: ${newProduct}`);
        res.json({message: newProduct});
    } catch (error) {
        console.log(error);
        if (error.code === 13003) {
            req.logger.error('Error: The product could not be inserted.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
    
});

router.put('/:pid', authToken, isAdmin, async (req, res) => {
    try {
        const { title, description, category, price, thumbnail, code, stock } = req.body;
        const lowerCategoryProduct = category.toLowerCase();
        const productRegister = { title, description, lowerCategoryProduct, price, thumbnail, code, stock }  
        const itemId = req.params.pid;
        const newProductInfo = new ProductsDTO(productRegister);
        const prod = await productsService.update(newProductInfo, itemId);
        req.logger.info(`El producto ${itemId} se actualizó satisfactoriamente.`)
        res.json({message:`El producto se actualizó satisfactoriamente.`});
    } catch (error) {
        console.log(error);
        if (error.code === 13004) {
            req.logger.error('Error: The product could not be updated.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }

})

router.delete('/:pid', authToken, isAdmin, async (req, res) => {
    try {
        const itemId = req.params.pid;
        //console.log(req.params.user)
        const prod = await productsService.deleteById(itemId);
        req.logger.info(`El producto ${itemId} se elimino satisfactoriamente.`)
        res.json({message:`El producto se elimino satisfactoriamente.`});
    } catch (error) {
        console.log(error);
        if (error.code === 14001) {
            req.logger.error('Error: The product could not be deleted.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }

});


module.exports = router;
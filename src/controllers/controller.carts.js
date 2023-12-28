const {Router} = require('express');
//const CartsDao = require('../DAOs/dbManagers/CartsDao');
const cartsService = require('../services/service.carts');
const ticketsService = require('../services/service.tickets');
const logger = require('../utils/winston/prodLogger.winston');
const { verifyJwt } = require('../utils/jwt')
const { isUser } = require('../middleware/authorization');
//const Carts = new CartsDao(logger);
const router = Router();

router.get('/:cid', async (req, res) => {
    try {
        let idC = req.params.cid;
        const cart = await cartsService.getCartById(idC);
        req.logger.info(JSON.stringify(cart));
        res.json({message: cart});
    } catch (error) {
        console.log(error);
        if (error.code === 12002) {
            req.logger.error('Error: The supplied cart does not exist.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
})

router.post('/', async (req, res) => {
    try {
        const newCart = await cartsService.createCart();
        req.logger.info(`Cart with ID: ${newCart} created.`, newCart);
        res.json({message: `Cart with ID: ${newCart} created.`});
    } catch (error) {
        console.log(error);
        if (error.code === 12000) {
            req.logger.error('Error: Error creating Cart.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        let idC = req.params.cid;
        let idP = req.params.pid;
        const car = await cartsService.addProductToCart(idC, idP);
        req.logger.info(`Product ${idP} added to cart.`, car);
        return res.json({ message : car});
    } catch (error) {
        console.log(error);
        if (error.code === 10000) {
            req.logger.error('Error: Producto sin existencia');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        if (error.code === 10001) {
            req.logger.error('Error: Carrito sin usuario asociado.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        if (error.code === 10002) {
            req.logger.error('Error: El usuario no puede adquirir el producto.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        if (error.code === 12001) {
            req.logger.error('Error: El producto no existe.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        if (error.code === 12002) {
            req.logger.error('Error: El carrito no existe.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        if (error.code === 11001) {
            req.logger.error('No se puede continuar la compra. Producto con stock insuficiente.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.put('/:cid', verifyJwt, isUser, async(req, res) =>{
    try {
        let idC = req.params.cid;
        const items = req.body;
        const car = await cartsService.putProduct(idC, items);
        req.logger.info(`Products added to cart ${idC}.`, car);
        res.json({ message : car});
    } catch (error) {
        console.log(error);
        if (error.code === 13000) {
            req.logger.error('No se pudo actualizar los productos del carrito.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});


router.put('/:cid/products/:pid', verifyJwt, isUser, async(req, res) =>{
    try {
        let idC = req.params.cid;
        let idP = req.params.pid;
        console.log(idC);
        console.log(idP);
        const item = req.body;
        console.log(item);
        const car = await cartsService.putProducts(idC, idP, item);
        req.logger.info(`Product ${idP} added to cart ${idC}.`, car);
        res.json({ message : car});
    } catch (error) {
        console.log(error);
        if (error.code === 13000) {
            req.logger.error('No se pudo actualizar los productos del carrito.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
    
});

router.delete('/:cid', verifyJwt, isUser, async(req, res) =>{
    try {
        let idC = req.params.cid;
        const car = await cartsService.deleteProducts(idC);
        req.logger.info(`Removed products.`);
        res.json({ message : `Removed products.`});
    } catch (error) {
        console.log(error);
        if (error.code === 12002) {
            req.logger.error('No se pudo eliminar productos del carrito.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        if (error.code === 13000) {
            req.logger.error('No se pudo eliminar productos del carrito.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.delete('/:cid/products/:pid', verifyJwt, isUser, async(req, res) =>{
    try {
        let idC = req.params.cid;
        let idP = req.params.pid;
        const car = await cartsService.deleteProduct(idC, idP);
        req.logger.info(`Product ${idC} removed from cart.`, car);
        res.json({ message : car});
    } catch (error) {
        console.log(error);
        if (error.code === 12001) {
            req.logger.error('No se pudo eliminar el producto.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        if (error.code === 12002) {
            req.logger.error('No se pudo eliminar el producto.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.post('/:cid/purchase', verifyJwt, isUser, async (req, res) => {
    try {
        let idC = req.params.cid;
        const ticket = await ticketsService.createTicket(idC);
        req.logger.info(`Purchase ticket created.`, ticket);
        res.json({ message : ticket});
    } catch (error) {
        console.log(error);
        if (error.code === 11001) {
            req.logger.error('No se puede continuar la compra. Producto con stock insuficiente.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
    
});

module.exports = router;
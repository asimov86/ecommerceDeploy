const { Router } = require('express'); // Traemos sólo el enrutador de express
const CartsManager = require('../DAOs/fileManagers/Carts_file');
const router = Router();

//Rutas para carts

const carrito = new CartsManager('carrito');

router.post('/', async (req, res) => {
    const car = await carrito.addCart();
    res.json({message: 'Cart created: ' + car});
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const car = await carrito.getById(id);
    res.json({message: 'Cart ' + JSON.stringify(car)});
});

router.post('/:idC/products/:id_prod', async (req, res) => {
    const { idC, id_prod } = req.params;
    const car = await carrito.addItem(idC, id_prod);
    res.json({message: 'Add product ' + JSON.stringify(car)});
});

module.exports = router;

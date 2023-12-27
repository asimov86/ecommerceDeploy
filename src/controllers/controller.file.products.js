const { Router } = require('express'); // Traemos sólo el enrutador de express
const ProductManager = require('../DAOs/fileManagers/Products_file');
const uploader = require('../utils/multer');

const router = Router();

///////////////////////////
const product = new ProductManager('/files/productos');


//Rutas para productos

//GET

router.get("/realTimeProducts", async (req, res) => {
    const newProduct = await product.getProducts();
    res.render('realTimeProducts.handlebars', { 
        newProduct: newProduct,
        listExists: true,});
});

router.get("/home", async (req, res) => {
    const listProducts = await product.getProducts();
    res.render('home.handlebars', { 
        listProducts: listProducts,
        listExists: true,});
});

router.get('/', async (req, res) => {   
    // Agregando límite, si no se agrega el límite trae todo los productos, de traer el límite trae la cantidad indicada.
    let limitValue = req.query.limit;
    if (!limitValue ) {
    }else{
        limitValue = parseInt(limitValue); 
    }
    const prod = await product.getProducts();
    const prodLimit = prod.slice(0, limitValue);
    res.json({message: prodLimit});
});

router.get('/:pid', async (req, res) => {
    let idP = parseInt(req.params.pid);
    const prod = await product.getProductById(idP);
    res.json({message: prod});
});

router.post('/', async (req, res) =>{
    let { title, description, productN, price, thumbnail, code, stock } = req.body;
    const prod =  await product.addProduct(title, description, productN, price, thumbnail, code, stock);
    res.json({ message: `new product ${prod}`});
})

router.put('/:id', async (req, res) =>{
    let item = req.body;
    let id = parseInt(req.params.id);
    const prod = await product.updateProduct(id, item);
    res.json({ message: `update product: ${prod}`});
})

router.delete('/:id', async (req, res) =>{
    let id = parseInt(req.params.id);
    const prod = await product.deleteProductById(id);
    res.json({ message: `delete product: ${prod}`});
})

module.exports = router; 
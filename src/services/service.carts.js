const CartsDao = require('../DAOs/dbManagers/CartsDao');
const UsersDao = require('../DAOs/dbManagers/UsersDao.js');
//const products= require('../DAOs/dbManagers/ProductsDao.js');
const productsService = require('../services/service.products.js');
const ticketsService = ('../services/service.tickets.js');
const usersService = ('../services/service.users.js');
//const Products = new products();
const Carts = new CartsDao();
const Users = new UsersDao();

const getCartById = async (idC) => {
    try {
        const cart = await Carts.getCartById(idC);
        if(!cart || cart.length === 0){
            const error = new Error('Cart not found or empty.');
            error.code = 12002; // Asignar un código al error
            throw error;
        }
        return cart;
    } catch (error) {
        throw error;
    }
}

const createCart = async () => {
    try {
        const newCart = await Carts.createCart();
        if(!newCart){
            const error = new Error('Could not create cart.');
            error.code = 12000; // Asignar un código al error
            throw error;
        }
        return newCart;
    } catch (error) {
        throw error;
    }
}

const addProductToCart = async (idC, idP) => {
    try {

            ////////////////////////////////////////////////////////////////////////////////////////////////
            //      Busco que ambos existan, carrito y producto.
            //      Busco el producto dentro de products en el carrito.
            //      Si existe le aumento la cantidad sino agrego el id del producto y la cantidad en 1.
            ////////////////////////////////////////////////////////////////////////////////////////////////
            let quantity = 1;
            let productList = [];
            const product = await productsService.getById(idP);
            if (product.stock === 0) { 
                const error = new Error('Producto sin existencia');
                error.code = 10000; // Asignar un código al error
                throw error;
            }
            //busco el owner del producto, si es el mismo id del usuario que está logueado no podrá comprar el producto
            let ownerProduct = product.owner;
            let idOwnerProduct = ownerProduct.toString();
            let user = await Users.findByCartId(idC);
            if (!user) {
                const error = new Error('Carrito sin usuario asociado.');
                error.code = 10001; // Asignar un código al error
                throw error;
            }
            let idUser= user._id;
            let idOwner = idUser.toString();
            if(idOwnerProduct === idOwner){
                const error = new Error('El producto ya le pertenece al usuario.');
                error.code = 10002; // Asignar un código al error
                throw error;
            }
            //
            let cart = await Carts.getCartById(idC);
        if(!cart){ 
            //req.logger.info(`Error!: El carrito no existe, carrito: ${cart}`);
            //return done(null, false, {message: 'Cart not found'})
            return res.send({ status: 400, message: "El carrito no existe!" });
        }
        let productsCart = cart[0].products;
        // Esto debo mejorarlo con esto>
        // https://es.stackoverflow.com/questions/511479/como-se-accede-a-un-array-de-objetos-en-javascript
        if (!cart) {
            return res.status(404).json({error: true , message:'El carrito no existe.'});
        }else{
            //Buscamos si el carrito tiene productos.
            if((productsCart).length===0){
                ////////////////////
                const stockProduct = product.stock;
                const idProduct = product.id;
                const priceProduct = product.price;
                if(stockProduct >= quantity){
                    // si es menor o igual al stock se puede comprar"
                    const newStock = stockProduct - quantity;
                    const productInfo = {  
                        productId: idProduct,
                        title: product.title,
                        quantity: quantity,
                        price: priceProduct
                    }
                    productList.push(productInfo);
                    product.stock = newStock;
                    // Actualizo el stock del producto agragdo al carrito
                    const updateStockProduct = await productsService.update(product, idProduct);
                    let carts = await Carts.addProductToCart(idC, idP);
                    return carts
                }else{
                    const error = new Error('No se puede continuar la compra. Producto con stock insuficiente.');
                    error.code = 11001; // Asignar un código al error
                    throw error;
                }
                ////////////////////
                //let carts = await cartModel.updateOne({_id: idC}, {$set:{products: {product: idP, quantity:1}}});
                //return carts
            }else{
                const stockProduct = product.stock;
                const idProduct = product.id;
                const priceProduct = product.price;
                if(stockProduct >= quantity){
                    // si es menor o igual al stock se puede comprar"
                    const newStock = stockProduct - quantity;
                    const productInfo = {  
                        productId: idProduct,
                        title: product.title,
                        quantity: quantity,
                        price: priceProduct
                    }
                    productList.push(productInfo);
                    product.stock = newStock;
                    // Actualizo el stock del producto agragdo al carrito
                    const updateStockProduct = await productsService.update(product, idProduct);
                    let carts = await Carts.addProductToCart(idC, idP);
                    return carts
                }else{
                    const error = new Error('No se puede continuar la compra. Producto con stock insuficiente.');
                    error.code = 11001; // Asignar un código al error
                    throw error;
                }
            }
        }
    } catch (error) {
        throw error;
    }
}

const putProduct = async (idC, items) => {
    try {
        return Carts.putProduct(idC, items);
    } catch (error) {
        throw error;
    }
}

const putProducts = async (idC, idP, item) => {
    try {
        return Carts.putProducts(idC, idP, item);
    } catch (error) {
        throw error;
    }
}

const deleteProduct = async (idC, idP) => {
    try {
        const product = await productsService.getById(idP);
        const stockProduct = product.stock;
        const idProduct = product.id;
        // si es menor o igual al stock se puede comprar"
        let cart = await Carts.getCartById(idC);
        if (!cart) {
            const error = new Error('El carrito suministrado no existe.');
            error.code = 12002; // Asignar un código al error
            throw error;
        }
        let productsCart = cart[0].products;
        for(let i=0; i<productsCart.length; i++){
            const productCart = productsCart[i].product;
            const idProductFound = productCart._id.toString();
            if (idProductFound == idP) {
                // El producto con el ID deseado está en el array "products" del carrito
                let quantity = productsCart[i].quantity;
                const newStock = stockProduct + quantity;
                product.stock = newStock;                          
            } else {
                // El producto con el ID deseado no está en el array "products" del carrito
                /* const error = new Error('El producto no está en el carrito. No se puede eliminar.');
                error.code = 11002; // Asignar un código al error
                throw error; */
            }
        }   
        // Actualizo el stock del producto eliminado del carrito
        const updateStockProduct = await productsService.update(product, idProduct);
        return Carts.deleteProduct(idC, idP);
    } catch (error) {
        throw error;
    }
}

const deleteProducts = async (idC) => {
    try {
        return Carts.deleteProducts(idC);
    } catch (error) {
        throw error;
    }
}


module.exports = {  getCartById, 
                    createCart,
                    addProductToCart, 
                    putProduct, 
                    putProducts, 
                    deleteProduct, 
                    deleteProducts};
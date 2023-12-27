const Carts = require('../models/mongo/cart.model');
//const Products = require('../models/mongo/product.model');
const Products = require('../../services/service.products');
const logger = require('../../utils/winston/prodLogger.winston');



class CartsDao {
    constructor(logger) {
        this.logger = logger;
    }

    async getCartById(idC) {
        try{
            let cart = await Carts.find({_id:idC}).lean().populate('products.product');
            if(!cart || cart.length === 0){
                const error = new Error('Cart not found or empty.');
                error.code = 12002; // Asignar un código al error
                throw error;
            }
            return cart;
        }catch(error){
            throw error;
        }
    }

    async createCart(product) {
        try{ 
            const newCart = await Carts.create(product);
            if(!newCart){
                const error = new Error('Could not create cart.');
                error.code = 12000; // Asignar un código al error
                throw error;
            }
            return newCart._id
        }catch(error){
            throw error;
        }
    }

    async addProductToCart (idC, idP) {
        try{
            // Busco que ambos existan, carrito y producto.
            // Busco el carrito
            // Busco el producto dentro de products en el carrito.
            // Si existe le aumento la cantidad sino agrego el id del producto y la cantidad en 1.
    /* db.carts.updateOne({_id:ObjectId("63e2f3aecae487e581d06f70"), products: {$elemMatch: {product: {$eq:23263}}}}, {$set:{"products.$.quantity":6}}) */
            let quantity = 1; 
            let product = await Products.getById(idP);
            if (!product) {
                const error = new Error('El producto no existe.');
                error.code = 12001; // Asignar un código al error
                throw error;
                //return {error: 'El producto no existe.'};
            }
            let cart = await Carts.find({_id: idC});
            let productsCart = cart[0].products;
            // Esto debo mejorarlo con esto>
            // https://es.stackoverflow.com/questions/511479/como-se-accede-a-un-array-de-objetos-en-javascript

            if (!cart) {
                //return {error: 'El carrito no existe.'};
                const error = new Error('El carrito no existe.');
                error.code = 12002; // Asignar un código al error
                throw error;
            }else{
                //Buscamos si el carrito tiene productos.
                if((productsCart).length===0){
                    //this.logger.info("Carrito vacio");
                    let carts = await Carts.updateOne({_id: idC}, {$set:{products: {product: idP, quantity:1}}});
                    return carts
                }else{
                    //this.logger.info("Carrito con productos");
                    let carts = await Carts.updateOne({_id: idC, products: {$elemMatch: {product: {$eq:idP}}}}, {$inc:{"products.$.quantity":quantity}});
                    if(carts.matchedCount===0){
                        let newProduct = [{ "product":idP, "quantity":quantity}]
                        // this.logger.info("Producto nuevo, no se debe incrementar sino agregar.")
                        let carts = await Carts.updateOne({_id: idC}, {$push:{products:{$each:newProduct}}});
                        return carts
                    }
                    return carts    
                } 
            }
        }catch(error){
            throw error;
        }    
    }

    async putProduct (idC, items) {
        try {
            let cart = await Carts.find({_id:idC});
            if (!cart){
                const error = new Error('El carrito no existe.');
                error.code = 12002; // Asignar un código al error
                throw error;
            }
            await Carts.updateOne({_id: idC }, {$unset : {"products":1}});
            cart = await Carts.updateOne({_id: idC }, {$set : {"products":items}});
            return cart;         
        }catch (error) {
            throw error;
        }
    }

    async putProducts (idC, idP, item) {
        try {
            let cart = await Carts.find({_id:idC});
            if (!cart){
                const error = new Error('El carrito no existe.');
                error.code = 12002; // Asignar un código al error
                throw error;
            }
            let number = item.findIndex(item => item.product === idP);
            let quantityP = item[number].quantity;
            cart = await Carts.updateOne({_id: idC, products: {$elemMatch: {product: {$eq:idP}}}}, {$set:{"products.$.quantity":quantityP}});
            if(cart.matchedCount===0){
                let newProduct = [{ "product":idP, "quantity":quantityP}]
                // this.logger.info("Producto nuevo, no se debe incrementar sino agregar.")
                cart = await Carts.updateOne({_id: idC}, {$push:{products:{$each:newProduct}}});
            }
            return cart     
        }catch (error) {
            throw error;
        }
    }

    async deleteProduct (idC, idP) {
        try{
            let product = await Products.getById(idP);
            if (!product) {
                const error = new Error('Elproducto no existe.');
                error.code = 12001; // Asignar un código al error
                throw error;
            }
            let cart = await Carts.find({_id: idC});
            let productsCart = cart[0].products;
            if (!cart) {
                const error = new Error('El carrito no existe.');
                error.code = 12002; // Asignar un código al error
                throw error;
            }else{
                //Buscamos si el carrito tiene productos.
                if((productsCart).length===0){
                    // Carrito vacio
                    return
                }else{
                    // Carrito con productos
                    let cart = await Carts.updateOne({
                        _id: idC,
                      },
                      {
                        $pull: {
                          products: {
                             product: idP,
                          },
                        },
                      }
                    );
                    
                    return cart    
                } 
            }
        }catch(error){
            throw error;
        } 
    }

    async deleteProducts (idC) {
        try{
            let findCart = await Carts.find({_id: idC});
            if (!findCart || (findCart.length === 0)) {
                const error = new Error('El carrito no existe.');
                error.code = 12002; // Asignar un código al error
                throw error;
            }
            let productsCart = findCart[0].products;
            //Buscamos si el carrito tiene productos.
            if(!productsCart || (productsCart).length===0){
                const error = new Error('El carrito está vacío.');
                error.code = 13000; // Asignar un código al error
                throw error;
            }
            //Carrito con productos
            let cart = await Carts.updateOne({_id: idC }, {$set : {products: []}});
            return cart   
        }catch(error){
            throw error;
        } 
    }
}

module.exports = CartsDao;
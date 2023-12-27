const User = require('./service.users.js');
const cartModel = require('../DAOs/models/mongo/cart.model.js');
const productModel = require('../DAOs/models/mongo/product.model.js');
const ticketModel = require('../DAOs/models/mongo/ticket.model.js');
const TicketDAO = require('../DAOs/dbManagers/ticketsDao.js');
const TicketDTO = require('../DTO/ticket.dto');
const winstonLogger = require('../utils/winston/prodLogger.winston'); 
const ticketService = new TicketDAO(winstonLogger);
 


const getTickets = async () => {
    try {
        let result = await ticketService.getAll();
        return result
    } catch (error) {
        throw error;
    }
    
}

const createTicket = async (idC) => {
    try {
        /* const {cid} = req.params;
        let idC = cid; */
        //Genero codigo unico
        let codeT = await ticketService.createCode();
        //Fecha 
        let purchase_datetime = new Date();
        //Usuario que realiza la compra
        let user = await User.getUserByCart(idC);
        if(!user){
            const error = new Error('El usuario no existe.');
            error.code = 14002; // Asignar un código al error
            throw error;
        }
        //Monto total a pagar del carrito
        //
        //Busco los valores del carrito
        let cart = await cartModel.findOne({_id:idC}).lean().populate('products.product');
        if(!cart){ 
            const error = new Error('El carrito no existe.');
            error.code = 12002; // Asignar un código al error
            throw error;
        }
        let addToPayment = 0;
        let productList = [];
        //Recorro el carrito
        for(let i=0; i<cart.products.length; i++){
            //Busco id, precio, stock, quantity
            const idProduct = cart.products[i].product._id;
            // Busco el title del producto para guardar la lista de productos
            const productComplete = await productModel.findById({_id:idProduct});
            const priceProduct = cart.products[i].product.price;
            const quantityProduct = cart.products[i].quantity;
            let priceXQuantity = priceProduct*quantityProduct;
            // multiplico el precio del producto por la cantidad y lo agrego al pago total
            addToPayment = addToPayment + priceXQuantity;
            // Eliminar el producto del carrito por id, una vez que se agrega al pago total
                const productInfo = {  
                    productId: idProduct,
                    title: productComplete.title,
                    quantity: quantityProduct,
                    price: priceProduct
                }
                productList.push(productInfo);        
                let idP = idProduct.toString();
                let updateCart = await cartModel.updateOne({
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
        }  
        const userId = user.id;
        const ticketRegister = {
            codeT, 
            purchase_datetime,
            productList,
            addToPayment,
            userId
        }
        const newPurchaseInfo = new TicketDTO(ticketRegister)
        //crear ticket de compra
        let result = await ticketService.createTicket(newPurchaseInfo);
        return result
    } catch (error) {
        throw error;
    }
    
    
};

module.exports = {
    createTicket,
    getTickets,
}




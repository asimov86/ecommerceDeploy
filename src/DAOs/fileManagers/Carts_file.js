const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

class CartsManager{
    constructor(fileName){
        this.fileName = fileName;
  
    }

    async getData() {
        const data = await fs.promises.readFile(`./${this.fileName}.json`, 'utf-8');
        return JSON.parse(data);
      }

    async getById(id){
        
        try{
            //Traigo carritos
            const data = await this.getData();
            let cart = data.find(carrito => carrito.id === id);
            let getProduct = [];
             getProduct = cart.productos;
            let error = (cart.length === 0) ? 'error:producto no encontrado' : 'Producto encontrado';
            console.error (error);
            return cart;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async addItem(idC, id_prod){
        
        try{
            let carrito = {};
            let products = await fs.promises.readFile(`./productos.json`, 'utf-8');
            products = JSON.parse(products);
            let data = await this.getData();
            //Item a agregar en el carrito, lo busco por id_prod
            const item = products.find(item => item.id === parseInt(id_prod));
            const findByIndex = data.findIndex((cart) => cart.id === idC);
            //Busco  el carrito por id
            carrito = data.find(carrito => carrito.id === idC);
            // Busco el producto en el carrito
            let productos = carrito.productos;
            let idProdNoExist = true;
            for (let i = 0; i < productos.length; i++) {
                if (productos[i].product === parseInt(id_prod)) {
                    productos[i].quantity += 1;
                    idProdNoExist = false;
                    break;// salgo del bucle ya que encontré el producto
                }
            }
            if(idProdNoExist){
                // Si el prod no existe lo agrega.
                productos.push({
                    product: parseInt(id_prod),
                    quantity: 1,
                });
            }
            const updateItem = data.splice(findByIndex,1,carrito);
            await fs.promises.writeFile(`./${this.fileName}.json`, JSON.stringify(data));
            return carrito;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async addCart(){
        
        try{
            let fileExists = fs.existsSync(`./${this.fileName}.json`);
            if(fileExists == true) {
                console.log(`File exists: ${fileExists}`);
            }else{
                let data = [];
                console.log("Entro a crear el archivo vacío.");
                await fs.promises.writeFile(`./${this.fileName}.json`, JSON.stringify(data));
            }
            const data = await this.getData();
            const newCar ={
                id: uuidv4(),
                timestamp: new Date().toLocaleString(),
                productos: [],
                };
            data.push(newCar);
            await fs.promises.writeFile(`./${this.fileName}.json`, JSON.stringify(data));
            return newCar.id;   
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

}

module.exports = CartsManager;

const fs = require("fs");


class ProductManager{
    constructor(path){
        this.path = path;
        this.getProducts();
        this.products = [];
        
    }

    // -----------------------------------------------------------------------------------------------
    // Antes de agregar el producto al archivo se valida que llegan todas las props 
    // ejmeplo: if(title&& description&& price&& thumbnail&& code&& stock)
    // ---------------------------------------------------------------------------------------------
    async addProduct(title, description, productN, price, thumbnail, code, stock){
        
        try {
            if(title && description && price && thumbnail && code && stock){
                //console.log("Llegó todo el producto");
                let item = { 
                    title: title, 
                    description: description, 
                    product: productN,
                    price: price, 
                    thumbnail: thumbnail, 
                    code:code, 
                    stock: stock
                };
                let data = await fs.promises.readFile(`./${this.path}.json`, 'utf-8');
                data = JSON.parse(data);
                if(data === '[]') {
                    data.push(item);
                } else {
                    item.id = data.length + 1;
                    data.push(item);
                }

                if (await this.getProductByCode(item.code) === false) {
                    //console.log("Se guarda el item");
                    await fs.promises.writeFile(`./${this.path}.json`, JSON.stringify(data));
                    return item.id; 
                    // Si el item no existe en el archivo se agrega y se retorna el id del item agregado
                }else {
                    // Si existe product.code en el array product, se indica por consola que el producto existe. 
                    console.log(`El producto que intenta ingresar ya existe.`);
                }   
            }
        } catch(error) {
            console.log(`Hubo un error ${error}`);
        }
    }
    // --------------------------------------------------------------------------------------------------
    // updateProducto recibe dos argumentos (id, newData)
    // --------------------------------------------------------------------------------------------------

    async updateProduct(id, item){
        try {
            //Buscamos si existe el producto
            let findProduct = await this.getProductByCode(item.code);
            //console.log(`Find product ${findProduct}`);
            //leemos el archivo
            if (findProduct===true) {
                let data = await fs.promises.readFile(`./${this.path}.json`, 'utf-8');
                data = JSON.parse(data);
                const findByIndex = data.findIndex((product) => product.id === id);
                item.id = id;
                const updateItem = data.splice(findByIndex,1,item);
                await fs.promises.writeFile(`./${this.path}.json`, JSON.stringify(data));
                return data;
            }
            else{
                return 'Product Not Found'
            }
        } catch(error) {
            console.log(`Hubo un error ${error}`);
        } 
}

   async getProductByCode(code) {
        try{
            let data = await fs.promises.readFile(`./${this.path}.json`, 'utf-8');
            data = JSON.parse(data);
            let resultado = data.find(item => item.code === code);
            if (!resultado) {
                return false
                //devuelve false si el item no existe en el archivo
            }else{
                return true
                //devuelve true si el item existe en el archivo
            }
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async getProductById(id){
        try{
            let data = await fs.promises.readFile(`./${this.path}.json`, 'utf-8');
            data = JSON.parse(data);
            let resultado = data.find(item => item.id === id);
            if (!resultado) {
                return "Product Not Found";
            } else {
                return resultado;
            }
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }
    
    async getProducts(){
        //console.log("Se valida que el archivo exista.")
        try{
            //let fileExists = fs.existsSync(`../files/${this.path}.json`);
            let fileExists = fs.existsSync(`./${this.path}.json`);
            console.log(`File exists: ${fileExists}`);
            if(fileExists == true) {
                let data = await fs.promises.readFile(`./${this.path}.json`, 'utf-8');
                data = JSON.parse(data);
                return data;
            }else{
                let data = [];
                console.log("Entro a crear el archivo vacío.");
                await fs.promises.writeFile(`./${this.path}.json`, JSON.stringify(data));
                return data;
            }
        }catch(err){
                return console.log('Método getProducts. Error de lectura!', err);
            } 
        }

    async deleteProductById(id){
        try{
            let data = await fs.promises.readFile(`./${this.path}.json`, 'utf-8');
            data = JSON.parse(data);
            let resultado = data.find(item => item.id === id);
            if (!resultado) {
                return "Product Not Found";
            } else {
                const newData = data.filter((item) => item.id !== id);
                for (let i = 0; i < newData.length; i++) {//Actualizo la posición de los productos en el array luego de borrar un item.
                newData[i].id = (i + 1);
                }
                await fs.promises.writeFile(`./${this.path}.json`, JSON.stringify(newData));
                return "Deleted successfully!";
            }    
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async deleteProducts(){
        try{
            let deleteAll = [];
            await fs.promises.writeFile(`./${this.path}.json`, JSON.stringify(deleteAll));
            let deleteData = await fs.promises.readFile(`./${this.path}.json`, 'utf-8');
            return deleteData;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    }

//const product = new ProductManager('productos');

module.exports = ProductManager;
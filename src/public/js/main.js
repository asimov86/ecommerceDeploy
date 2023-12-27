const socket = io.connect();
const addProduct = document.getElementById('addProduct');
const userID = document.getElementById('userId');
const currentPage = document.getElementById('currentPage');
const limit = document.getElementById('limit');
const sort = document.getElementById('sort');
const newProduct = document.getElementById('newProduct');
const errorElement = document.getElementById('error-message');
//const { RAILWAY_DOMAIN} = require('../../public/js/config');
const userValue = userID.value;
addProduct.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: addProduct[0].value,
        description: addProduct[1].value,
        category: addProduct[2].value.toLowerCase(),
        price: parseFloat(addProduct[3].value),
        thumbnail: addProduct[4].value,
        code: addProduct[5].value,
        stock: parseFloat(addProduct[6].value),
        owner: userID.value
    }
    socket.emit('update', producto);
    addProduct.reset()
});

// ------------ Renderizamos --------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

socket.on('products', (initialProducts) => {
    //localStorage.setItem('productos', JSON.stringify(initialProducts.docs));
    console.log('Numero 1')
    tabla.innerHTML = '';
    makeHtmlTable(initialProducts);
});


// En el socket.on para el evento 'productDeleted'
socket.on('productDeleted', message => {
    showMessage(message);
});

// En el socket.on para el evento 'productInserted'
socket.on('productInserted', message => {
    showMessage(message);
});


function showMessage(message){
    errorElement.innerText = `Message: ${message}`;
    setTimeout(() => {
        window.location.reload();
    }, 5000);
}

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

function addDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.btnDelete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productData = JSON.parse(this.getAttribute('data-product-data'));
            deleteProducts(productId, userValue);
        });
    });
}

function addButtonListeners() {
    const addButtons = document.querySelectorAll('.btnAddtoCart');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productData = JSON.parse(this.getAttribute('data-product-data'));
            addProducts(productId, productData);
        });
    });
}

function makeHtmlTable(initialProducts) {
    const tabla = document.getElementById('tabla');
    const newProductsValue = document.getElementById('newProducts').value;
    // Convertir la cadena JSON a un array de objetos
    const newProducts = JSON.parse(newProductsValue);
    const products = initialProducts.docs;
    if (newProducts.length > 0) {
        conjunto = newProducts.map((e)=> {
            return `
                <tr id="${e._id}">
                <th scope="row">${e._id}</th>
                <td>${e.title}</td>
                <td>${e.description}</td>
                <td>$${e.price}</td>
                <td colspan="2">${e.stock}</td>
                <td>
                    <img style="height: 54px;" src="${e.thumbnail}" >
                </td>
                <td>
                <button type="button" class="btn btn-danger btn-sm btnDelete" data-product-id="${e._id}" data-product-data='${JSON.stringify(newProducts)}'>Eliminar</button>
                </td>
                <td>
                <button type="button" class="btn btn-primary btn-sm btnAddtoCart" data-product-id="${e._id}" data-product-data='${JSON.stringify(newProducts)}'>Agregar</button>
                </td>
                </tr> 
            `;
        }).join('');
    }else{
        conjunto = `<tr><td colspan="8"><h3>No hay productos</h3></td></tr>` 
    }
    tabla.innerHTML = conjunto
    // Agrega oyentes de eventos después de renderizar
    addDeleteButtonListeners();
}

function deleteProducts(productId, userValue) {
    socket.emit('delete', productId, userValue);
}
// Agregar al carrito
function addProducts(productId, productData) {
    socket.emit('add', productId);
}

//////////////////////////////////////////////////////////////////////

addProductToCart = async (pid) => {

    const cart = document.getElementById("carrito");
    cid = cart.value;
    const options = {
     method:"POST",
     body:"",
     headers:{
         "Content-Type":"application/json"
     }
    };
 
    const response = await fetch(
     `https://ecommercedeploy-production.up.railway.app/api/carts/${cid}/products/${pid}`,
     options
    )
    if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('authToken', responseData.token);
        // Redirigir a la vista /api/views/products
        location.assign("/api/views/products");
    } else {
        // Si la respuesta no es exitosa (por ejemplo, error de autenticación)
        const errorData = await response.json(); // Parsear la respuesta como un objeto JSON si hay un mensaje de error
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
        // Actualizar el DOM para mostrar un mensaje de error
        // Por ejemplo:
        // const errorElement = document.getElementById('error-message');
        // errorElement.innerText = `Error: ${response.status} - ${errorData.message}`;
        // Dentro de la lógica de manejo de errores
        
        errorElement.innerText = `Error: ${response.status} - ${errorData.error}`;
    }
 }

 deleteProductFromCart = async (pid) => {

    const cart = document.getElementById("carrito");
    cid = cart.value;
    const options = {
     method:"DELETE",
     body:"",
     headers:{
         "Content-Type":"application/json"
     }
    };
 
    await fetch(
     `https://ecommercedeploy-production.up.railway.app/api/carts/${cid}/products/${pid}`,
     options
    )
 }
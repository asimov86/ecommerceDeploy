const form = document.getElementById('loginForm');
const errorElement = document.getElementById('error-message');
form.addEventListener('submit', async evt => {
    try {
        evt.preventDefault();
        const data = new FormData(form);
        const obj = {};
        data.forEach((value,key)=>obj[key] = value);

        const headers = {
            'Content-Type': 'application/json',
        
        };
        const method = 'POST';
        const body = JSON.stringify(obj);

        const response = await fetch('/api/sessions/login',{
            headers,
            method,
            body,
        })
        /* const responseData = await response.json();
        localStorage.setItem('authToken', responseData.token)
        // Redirigir a la vista /api/views/products
        location.assign("/api/views/products"); */
        //////////////////////////////////

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
        //////////////////////////////////////
    } catch (error) {
        errorElement.innerText = `Tenemos un error ${error.error}`;
    }
    
});

function goToRegister() {
    location.href = '/api/views/register';
}
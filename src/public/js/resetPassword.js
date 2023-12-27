const form = document.getElementById('resetPasswordForm');
const response = document.getElementById('response');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key] = value);
    fetch('/api/sessions/confirmResetPassword',{
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(obj),
    }).then( response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json()
    })
    .then( data => (response.innerHTML = data.message))
    .catch( error => {
        /* console.error('Error: ' + err.message);
        response.innerHTML = err.message; */
        if (error instanceof SyntaxError) {
            // El error se debe a que la respuesta no es JSON
            console.error('Error de análisis JSON:', error);
            response.innerHTML = 'El servidor ha devuelto una respuesta no válida. Por favor, verifica tus datos y vuelve a intentarlo.';
        } else {
            // Otro tipo de error
            console.error('Error:', error);
            response.innerHTML = 'Ha ocurrido un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
        }
    } );
});



function goToRegister() {
    location.href = '/api/views/register';
}

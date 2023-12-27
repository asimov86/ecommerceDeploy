

// Utilizando un evento de escucha de clic para el logout
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', async () => {
    try {
        const userIdValue = document.getElementById('userId').innerText;

        const headers = {
            'Content-Type': 'application/json'
        };
        const method = 'POST';
        const body = JSON.stringify({ userId: userIdValue });

        const response = await fetch('/api/sessions/logout', {
            headers,
            method,
            body,
        });

        if (response.ok) {
          console.log(response);
          errorElement.innerText = `Mensaje: ${response.message}`;
          location.assign("/api/views/login");
        } else {
            const errorData = await response.json();
            // Manejar el error si es necesario, por ejemplo:
            const errorElement = document.getElementById('error-message');
            errorElement.innerText = `Error: ${response.status} - ${errorData.error}`;
        }
    } catch (error) {
        const errorElement = document.getElementById('error-message');
        errorElement.innerText = `Tenemos un error ${error.error}`;
    } 
});
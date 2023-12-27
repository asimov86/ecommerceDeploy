const socket = io();
const chatBox = document.getElementById('chatBox');
const chatURL = '/api/chats';
let user; // Declarar la variable user fuera del evento

Swal.fire({
    title: "Identificate : ",
    input: "text",
    text: " Ingrese su nombre en el chat",
    inputValidator: (value) => {
        return !value && 'Necesitas un nombre de usuario'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    socket.emit('authenticated', user);
})

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        const message = chatBox.value.trim();
        if (message.length > 0) {
            const fyh = new Date().toLocaleString();
            socket.emit("message", { user: user, message: message, fyh: fyh });
            fetch(chatURL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: user, message: message, fyh: fyh })
            }).then((response) => response.json())
            .then((data)=> console.log('dataFetch', data))
        chatBox.value="";
        }
    }
})

/* socket.on('messageLogs', data => {
    if (!user) return;

    const messages = data.map(message => {
        return `${message.user} ${message.fyh} dice: ${message.message}<br/>`;
    }).join(""); // Unir todos los mensajes en una cadena
    log.innerHTML = messages; // Actualizar el contenido del log con los mensajes
}) */

socket.on('newUserConnected', data => {
    if (!user) return;
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: "success"
    })
});

socket.on('newMessage', data => {
    // Aquí puedes manejar el mensaje recibido
    const messageLog = document.getElementById('messageLogs');
    const newMessage = `${data.user} ${data.fyh} dice: ${data.message}<br/>`;

    // Agregar el nuevo mensaje al log de mensajes
    messageLog.innerHTML += newMessage;
});
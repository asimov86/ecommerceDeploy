const {app, server, io} = require('./app');
const SocketConfig = require('./socketConfig');
const logger = require('../src/utils/winston/prodLogger.winston')
const {PORT} = require('../src/public/js/config.js');

server.listen(PORT,()=>{
    logger.info(`Server running at port ${PORT}`);
});
 // Instancia de SocketHandler para configurar WebSocket
const socketConfig = new SocketConfig(io);

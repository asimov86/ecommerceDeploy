const winston = require('winston');
const { customWinston } = require('./custom.winston');
const { ENVIRONMENT } = require('../../public/js/config');


const loggerLevel = ENVIRONMENT === "dev" ? "debug" : "info";

const winstonLogger = winston.createLogger({
    levels: customWinston.levels,
    transports:[
        new winston.transports.Console({
            level: loggerLevel,
            format:winston.format.combine(
                winston.format.colorize({colors:customWinston.colors}),
                winston.format.simple()
            ),
        }), 
        new winston.transports.File({
            filename: './errors.log', 
            level: "error",
            format: winston.format.simple()
        })
    ]
})

 

module.exports = winstonLogger;
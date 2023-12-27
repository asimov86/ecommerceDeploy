const getLogger =  require('../../utils/winston/factory');

const addLogger = (req, res, next) =>{
    let today = new Date();
    let date = today.toLocaleDateString();
    let time = today.toLocaleTimeString();
    let dateAndTime = date + ' - ' + time;
    req.logger = getLogger;
    req.logger.http(`Method: ${req.method} en ${JSON.stringify(req.url)} - Headers: ${JSON.stringify(req.headers)}  - Params: ${JSON.stringify(req.params)} - Query: ${JSON.stringify(req.query)} - Body: ${JSON.stringify(req.body)} - ${dateAndTime}`);
    next();
}

module.exports = addLogger;
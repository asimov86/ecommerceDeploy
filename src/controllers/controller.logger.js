const addLogger = require("../middleware/logger/logger.middleware");
const { Router } = require ("express");

const router  = Router();

router.get('/', addLogger, async (req, res) => {
    req.logger.fatal('Probando nivel de logger fatal!');
    req.logger.error('Probando nivel de logger error!');
    req.logger.warning('Probando nivel de logger warning!');
    req.logger.info('Probando nivel de logger info!');
    req.logger.http('Probando nivel de logger http!');
    req.logger.debug('Probando nivel de logger debug!');
    res.send('Probando nuestro logger');
});

module.exports = router;
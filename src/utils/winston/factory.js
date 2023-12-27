const { ENVIRONMENT } = require('../../public/js/config');

switch (ENVIRONMENT) {
    case 'dev':
        module.exports = require('./devLogger.winston')
        break;
    case 'prod':
        module.exports = require('./prodLogger.winston')
        break;
}
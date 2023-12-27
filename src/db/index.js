const mongoose = require('mongoose');
const {MONGODB_URI} = require('../public/js/config');
const logger = require('../utils/winston/prodLogger.winston');

class MongoConnection{
    static #instance

    constructor() {
        this.logger = logger;
        this.connect();
    };

    async connect() {
        try {
            await mongoose.connect(MONGODB_URI);
            logger.info('Connected to MongoDB');
        }catch (e) {
            logger.info('Error connecting', e);
        }
    };

    static getInstance() {
        if(this.#instance) {
            return this.#instance;
        }

        this.#instance = new MongoConnection(logger);
        return this.#instance;
    }
}
// Patrón Singleton

module.exports = MongoConnection;
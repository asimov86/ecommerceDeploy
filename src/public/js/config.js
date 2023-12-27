const {config} = require('dotenv');

config();
const PORT = process.env.PORT || 8080;
const RAILWAY_DOMAIN = process.env.RAILWAY_DOMAIN;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENTE_ID_GITHUB = process.env.CLIENTE_ID_GITHUB;
const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB;
const CLIENT_CALLBACK_GITHUB = process.env.CLIENT_CALLBACK_GITHUB;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;
const SERVICE_MAILING = process.env.SERVICE_MAILING;
const PORT_MAILING = process.env.PORT_MAILING;
const USER_MAILING = process.env.USER_MAILING;
const PASS_MAILING = process.env.PASS_MAILING;
const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';

module.exports = {
    MONGODB_URI,
    CLIENTE_ID_GITHUB,
    CLIENT_SECRET_GITHUB,
    CLIENT_CALLBACK_GITHUB,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    SECRET_KEY_JWT,
    SERVICE_MAILING,
    PORT_MAILING,
    USER_MAILING,
    PASS_MAILING,
    ENVIRONMENT,
    PORT
};
const settings = require('./setting');
const knex = require('knex');
require('dotenv').config()

module.exports = knex({
    client: process.env.DB_CLIENT || settings.DB_CLIENT,
    connection: {
        host : process.env.DB_HOST || settings.DB_HOST,
        user : process.env.DB_USER || settings.DB_USER,
        password : process.env.DB_PASSWORD || settings.DB_PASSWORD,
        database : process.env.DB_DATABASE || settings.DB_DATABASE
    }
});
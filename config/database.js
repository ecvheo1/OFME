const mysql = require('mysql2/promise');
const {logger} = require('./winston');
const database = require('../databasePool');

const pool = mysql.createPool({
    host: database.host,
    user: database.user,
    port: database.port,
    password: database.password,
    database: database.database
});


module.exports = {
    pool: pool
};
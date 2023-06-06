const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');
//console.log("Conectado al crm de : " + database.host)
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has to many connections');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused');
        }
    }

    if (connection) connection.release();
    console.log('DB CRM is Connected');
    return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;

module.exports.host = database.host;
// pool.end(function (err) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(err)
//     }
//   });
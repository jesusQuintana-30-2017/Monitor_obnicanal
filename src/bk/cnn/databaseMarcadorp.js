const mysql = require('mysql');
const { promisify } = require('util');
const { databaseMarcador2 } = require('./keys');
//console.log("Conectado al marcador2 de : " + databaseMarcador2.host)
const pool = mysql.createPool(databaseMarcador2);

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
    console.log('DB is Connected Marcador 2');
    return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;

module.exports.host = databaseMarcador2.host;
// pool.end(function (err) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(err)
//     }
//   });
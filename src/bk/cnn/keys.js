const Cryptr = require('cryptr');
const cryptr = new Cryptr('bsw2019');
const fs = require('fs');

module.exports = {
    database: leerConexion(),
    databaseMarcador: leerConexionMarcador(),
    databaseMarcador2: leerConexionMarcador2(),
    databaseMarcador3: leerConexionMarcador3(),
    databaseMarcador4: leerConexionMarcador4(),
    databaseMarcador5: leerConexionMarcador5(),
    databaseMarcador6: leerConexionMarcador6(),
    databaseMarcador7: leerConexionMarcador7(),
    databaseMarcador8: leerConexionMarcador8(),
    databaseMarcadorO: leerConexionMarcadorO(),
    mde: leerConexionMde(),
    hist: leerConexionHist()
};

function leerConexion() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.crm.ip,
        user: selected.mysql.crm.usuario,
        password: selected.mysql.crm.contrasena,
        database: selected.mysql.crm.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionMarcador() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.cc.ip,
        user: selected.mysql.cc.usuario,
        password: selected.mysql.cc.contrasena,
        database: selected.mysql.cc.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionMarcador2() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.cc2.ip,
        user: selected.mysql.cc2.usuario,
        password: selected.mysql.cc2.contrasena,
        database: selected.mysql.cc2.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionMarcador3() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.cc3.ip,
        user: selected.mysql.cc3.usuario,
        password: selected.mysql.cc3.contrasena,
        database: selected.mysql.cc3.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionMarcador4() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.cc4.ip,
        user: selected.mysql.cc4.usuario,
        password: selected.mysql.cc4.contrasena,
        database: selected.mysql.cc4.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionMarcador5() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.cc5.ip,
        user: selected.mysql.cc5.usuario,
        password: selected.mysql.cc5.contrasena,
        database: selected.mysql.cc5.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionMarcador6() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.cc6.ip,
        user: selected.mysql.cc6.usuario,
        password: selected.mysql.cc6.contrasena,
        database: selected.mysql.cc6.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionMarcador7() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.cc7.ip,
        user: selected.mysql.cc7.usuario,
        password: selected.mysql.cc7.contrasena,
        database: selected.mysql.cc7.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionMarcador8() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.cc8.ip,
        user: selected.mysql.cc8.usuario,
        password: selected.mysql.cc8.contrasena,
        database: selected.mysql.cc8.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionMarcadorO() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.cco.ip,
        user: selected.mysql.cco.usuario,
        password: selected.mysql.cco.contrasena,
        database: selected.mysql.cco.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionMde() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.mde.ip,
        user: selected.mysql.mde.usuario,
        password: selected.mysql.mde.contrasena,
        database: selected.mysql.mde.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}

function leerConexionHist() {
    let cnn2020 = fs.readFileSync('cnn2020.json');
    let conf = JSON.parse(cnn2020);
    const decryptedString = cryptr.decrypt(conf.conexiones);
    var configuraciones = JSON.parse(decryptedString);
    var conexiones = configuraciones.conexiones;
    var selected = conexiones.filter(conexion => conexion.select)[0];
    var coneObj = {
        host: selected.mysql.hist.ip,
        user: selected.mysql.hist.usuario,
        password: selected.mysql.hist.contrasena,
        database: selected.mysql.hist.baseDatos,
        connectionLimit: 3
    };

    return coneObj;
}
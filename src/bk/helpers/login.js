const querys = require('../querys/login');
const pool = require('../cnn/database');
const https = require('https');
module.exports.validarUsuario = async(datos, event) => {

    const retorno = {};
    const usuario = await pool.query(querys.validaUsuario, [datos.usuarioid.trim()]);
    if (usuario.length > 0) {

        let nuevoUsurio = JSON.parse(JSON.stringify(usuario[0]));
        let key = "Espartacus2019bswcenter" + datos.usuarioid.trim();
        if (nuevoUsurio.SSUSRPSW == "") {

            retorno.valido = false;
            retorno.mensaje = "El usuario " + datos + " no existe";
            event.reply("validarUsuarioResult", retorno);

        } else {

            var url = datos.url + "?psw=" + datos.pssw + "&llave=" + key + "&pswdb=" + nuevoUsurio.SSUSRPSW;
            console.log(url);
            var request = require('request');
            request(url, await
                function(error, response, body) {

                    if (error) {
                        retorno.valido = false;
                        retorno.mensaje = "Ocurrio un error al validar el usuario";

                    } else {

                        if (body == "true") {
                            retorno.valido = true;
                            retorno.mensaje = "Bienvenido!!";
                            retorno.canal = "I";
                            event.reply("validarUsuarioResult", retorno);

                        } else {
                            retorno.valido = false;
                            retorno.mensaje = "Contraseña no valida";
                            event.reply("validarUsuarioResult", retorno);
                        }


                    }

                });

        }

    } else {

        const retorno = {};
        const usuario = await pool.query(querys.validaUsuario, [datos.usuarioid.trim()]);
        if (usuario.length > 0) {

            let nuevoUsurio = JSON.parse(JSON.stringify(usuario[0]));
            let key = "Espartacus2019bswcenter" + datos.usuarioid.trim();
            if (nuevoUsurio.SSUSRPSW == "") {

                retorno.valido = false;
                retorno.mensaje = "El usuario " + datos + " no existe";
                event.reply("validarUsuarioResult", retorno);

            } else {

                var url = datos.url + "?psw=" + datos.pssw + "&llave=" + key + "&pswdb=" + nuevoUsurio.SSUSRPSW;
                console.log(url);
                var request = require('request');
                request(url, await
                    function(error, response, body) {

                        if (error) {
                            retorno.valido = false;
                            retorno.mensaje = "Ocurrio un error al validar el usuario";

                        } else {

                            if (body == "true") {
                                retorno.valido = true;
                                retorno.mensaje = "Bienvenido!!";
                                retorno.canal = "O";
                                event.reply("validarUsuarioResult", retorno);

                            } else {
                                retorno.valido = false;
                                retorno.mensaje = "Contraseña no valida";
                                event.reply("validarUsuarioResult", retorno);
                            }


                        }

                    });

            }

        } else {

            retorno.valido = false;
            retorno.mensaje = "Usuario no existe";
            event.reply("validarUsuarioResult", retorno);
        }
    }
    return retorno;
}

module.exports.consultarNombre = async(usuarioid) => {

    const usuario = await pool.query(querys.nombreUsuario, [usuarioid.trim()]);
    if (usuario.length == 0) {
        const usuario = await pool.query(querys.nombreUsuario, [usuarioid.trim()]);
        return usuario;

    } else {
        return usuario;
    }
}

module.exports.consultarPorId = async(usuarioid) => {

    const datosusuario = await pool.query(querys.consultarPorId, [usuarioid.trim()]);
    const receso = await pool.query(querys.Estaenreceso, [usuarioid]);
    datosusuario[0].estatusRec = receso[0].sts;
    if (receso[0].sts != "RES") {

        if (datosusuario.length > 0) {
            var idMax = await pool.query(querys.calcularIdbtmpersonal, [usuarioid.trim()]);
            await pool.query(querys.insertarMovimientos, [idMax[0].id, usuarioid.trim()]);
            await pool.query(querys.actulizarAgenteOutbound, ["DISPONIBLE", "S", usuarioid.trim()]);
            await pool.query(querys.actulizarAgenteInbound, ["DISPONIBLE", "S", usuarioid.trim()]);
            await pool.query(querys.updateMovimientosRecesoUsuario, [usuarioid.trim()]);
            await pool.query(querys.actulizarRecesos, [usuarioid.trim()]);

        }
    } else if (receso[0].sts == "RES") {
        const infoRec = await pool.query(querys.infoReceso, [usuarioid.trim()]);
        datosusuario[0].dscReceso = infoRec[0].BTCRECESONOMC;
        datosusuario[0].horaReceso = infoRec[0].BTMPERSONALHINI;
    }

    return datosusuario;
}
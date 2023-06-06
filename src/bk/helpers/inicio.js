const pool = require('../cnn/database');
const pool2 = require('../cnn/databaseMarcador.js');
const pool3 = require('../cnn/databaseMarcadorp.js');
const mde = require('../cnn/databaseMde.js');
const hist = require('../cnn/databaseHist.js');
const poolOBD = require('../cnn/marcadorOBD.js');
const querys = require('../querys/inicio');
const  { databaseMarcador } = require('../cnn/keys');
const  { databaseMarcador2 } = require('../cnn/keys');
const  { databaseMarcador3 } = require('../cnn/keys');
const  { databaseMarcador4 } = require('../cnn/keys');
const  { databaseMarcador5 } = require('../cnn/keys');
const  { databaseMarcador6 } = require('../cnn/keys');
const  { databaseMarcador7 } = require('../cnn/keys');
const  { databaseMarcador8 } = require('../cnn/keys');
const $ = require('jquery');
const { query } = require('../cnn/database');
var arrColas = [];
module.exports.pool = pool

//Informacion del agente
module.exports.consultarAgentes = async(campana, cola, ID, sts, stsres, canalCon, canal_inicial, idagnt, nombre) => {
    var codecola = "";
    var consulta;
    var consulta2;
    if (cola == '')
    {
        codecola = arrColas.toString();
    }
    else 
    {
        codecola = cola.toString();
    }
    // if (ID == '') {
    //     const agentes = {};
    //     consulta = querys.consultarAgentesAll + " AND btagenteCola IN("+codecola+") AND btAgenteCmpId <> '0001' order by field(sts, 'En LLAMADA', 'DISPONIBLE', 'RECESO', 'NO CONECTADO', 'NO DISPONIBLE'), duracion desc;";
    //     const supervisor = await pool.query(consulta, [campana, '', sts, stsres, idagnt, nombre]);
    //     agentes.in = supervisor
    //     consulta2 = querys.consultarAgentesAllV + " AND skill IN("+codecola+") GROUP BY id order by field(sts, 'EN LLAMADA', 'DISPONIBLE', 'RECESO', 'NO DISPONIBLE'), duracion desc;"
    //     const agentesV = await pool.query(consulta2, [campana, '', sts, idagnt, nombre]);
    //     agentes.agv = agentesV;
    //     return agentes;
    // } else {
        const agentes = {};
        consulta = querys.consultarAgentes + " AND btagenteCola IN("+codecola+") AND btAgenteCmpId <> '0001' order by field(sts, 'En LLAMADA', 'DISPONIBLE', 'RECESO', 'NO CONECTADO', 'NO DISPONIBLE'), duracion desc;";
        const supervisor = await pool.query(consulta, [campana, ID, ID, sts, stsres, idagnt, nombre]);
        agentes.in = supervisor
        consulta2 = querys.consultarAgentesV + " AND skill IN("+codecola+") GROUP BY id order by field(sts, 'EN LLAMADA', 'DISPONIBLE', 'RECESO', 'NO DISPONIBLE'), duracion desc;"
        const agentesV = await pool.query(consulta2, [campana, ID, ID, sts, idagnt, nombre]);
        agentes.agv = agentesV;
        return agentes;
    //}

}

module.exports.consultarAgentesM = async(campana, cola, ID, sts, stsres, canalCon, canal_inicial, idagnt, nombre) => {
    const agentes = {};
    if (ID == '') {
        const agentemulti = await mde.query(querys.agntsrsAll, ['', idagnt, nombre]);
        agentes.agentemulti = agentemulti;
        return agentes;
    } else {
        const agentemulti = await mde.query(querys.agntsrsAll, [ID, idagnt, nombre]);
        agentes.agentemulti = agentemulti;
        return agentes;
    }

}

module.exports.consultarAgentesO = async(campana, cola, ID, sts, stsres, canalCon, canal_inicial, idagnt, nombre) => {
    const agentes = {};
    /*if (ID == '') {
        const supervisorOut = await pool.query(querys.consultarAgentesOutAll, [campana, '', sts, stsres, idagnt, nombre]);
        agentes.out = supervisorOut
        console.log(supervisorOut);
        return agentes;
    } else {*/
        const supervisorOut = await pool.query(querys.consultarAgentesOut, [campana, ID,ID, sts, stsres, idagnt, nombre]);
        agentes.out = supervisorOut
        return agentes;
    //}

}

module.exports.consultarAgentesC = async(campana, cola, ID, sts, stsres, canalCon, canal_inicial, idagnt, nombre) => {
    const agentes = {};
    if (ID == '') {
            const agnts = await pool.query(querys.consultarAgentesCbA, ['', sts, stsres, idagnt, nombre]);
            agentes.agnts = agnts;
            return agentes;
    } else {
            const agnts = await pool.query(querys.consultarAgentesCb, [ID, sts, stsres, idagnt, nombre]);
            agentes.agnts = agnts;
            return agentes;
    }

}

module.exports.getAllCampanas = async(datos) => {
    const recesos = await pool.query(querys.consultarRecesos,[]);
    const allCampanas = await pool.query(querys.getAllCampanas, [datos]);
    var campanas = {};
    var arr_conexiones = [];

    campanas.crm = pool.host.toString();
    arr_conexiones.push(databaseMarcador.host.toString())
    arr_conexiones.push(databaseMarcador2.host.toString())
    arr_conexiones.push(databaseMarcador3.host.toString())
    arr_conexiones.push(databaseMarcador4.host.toString())
    arr_conexiones.push(databaseMarcador5.host.toString())
    arr_conexiones.push(databaseMarcador6.host.toString())
    arr_conexiones.push(databaseMarcador7.host.toString())
    arr_conexiones.push(databaseMarcador8.host.toString())
    campanas.conexiones = arr_conexiones;

    campanas.recesos = recesos;
    if (allCampanas.length == 1) {
        const Campanas = await pool.query(querys.allCampanas, []);
        campanas.in = Campanas;
        campanas.out = "";
        return campanas;
    } else {
        campanas.in = allCampanas;
        campanas.out = "";
        return campanas;
    }
}

module.exports.getAllEstatus = async(datos) => {
    const allEstatus = await pool.query(querys.getAllEstatus, []);
    const estatusRes = await pool.query(querys.getEstatusRes, []);
    const Estatus = {};
    Estatus.agente = allEstatus,
        Estatus.receso = estatusRes;
    return Estatus
}

module.exports.consultarSupervisores = async(usuarioid, monitorv) => {
        const supervisores = {}
        const preferencias = await pool.query(querys.consultarPreferencias, [usuarioid]);
        supervisores.preferencias = preferencias;
        const timeInd = await pool.query(querys.ConsultarTimeInd, []);
        supervisores.timeInd = timeInd;
        const allSupervisores = await pool.query(querys.consultarSupervisores, [usuarioid]);
        await pool.query(querys.sesionVencida, [usuarioid]);
        await pool.query(querys.insertarMovimientos, [usuarioid, monitorv]);
        if (allSupervisores.length == 0) {
            const all = await pool.query(querys.consultarSupervisoresOut, [usuarioid]);
            supervisores.all = all;
            supervisores.canal = "O"
            if (all.length == 0) {
                const coordinador = await pool.query(querys.coordinadores, [usuarioid])
                if (coordinador.length > 0) {
                const Tsupervisores = await pool.query(querys.consultarSupervisoresAll, [])
                supervisores.all = Tsupervisores;
                supervisores.canal = "O/I"
                return supervisores;
                } else {

                }
            } else {
                return supervisores;
            }
        } else {
            supervisores.all = allSupervisores; 
            supervisores.canal = "I"
            return supervisores;
        }


}

//Indicadores
module.exports.conIndicadores = async(campana, cola, ID, sts, stsres, canalCon, agenteid, nombre) => {
    if (ID == '') {
        const arr_indicadores = {};
        if (canalCon == 1) {
            const conIndicadores = await pool.query(querys.conIndicadoresAll, [campana, cola, ID, sts, stsres, agenteid, nombre]);
            arr_indicadores.in = conIndicadores;
            arr_indicadores.out = {}
            return arr_indicadores;
        } else if (canalCon == 2) {
            const supervisorOut = await pool.query(querys.consultarAgentesOutAll, [campana, ID, sts, stsres, agenteid, nombre]);
            arr_indicadores.in = {};
            arr_indicadores.out = supervisorOut;
            return arr_indicadores;
        } else if (canalCon == 0) {
            const supervisorOut = await pool.query(querys.consultarAgentesOutAll, [campana, ID, sts, stsres, agenteid, nombre]);
            const conIndicadores = await pool.query(querys.conIndicadoresAll, [campana, cola, ID, sts, stsres, agenteid, nombre]);
            arr_indicadores.in = conIndicadores;
            arr_indicadores.out = supervisorOut;
            return arr_indicadores;
        }
    } else {
        const arr_indicadores = {};
        const conIndicadores = await pool.query(querys.conIndicadores, [campana, cola, ID, sts, stsres, agenteid, nombre]);
        const supervisorOut = await pool.query(querys.consultarAgentesOut, [campana, ID, sts, stsres, agenteid, nombre]);
        if (canalCon == 1) {
            arr_indicadores.in = conIndicadores;
            arr_indicadores.out = {}
            return arr_indicadores;
        } else if (canalCon == 2) {
            arr_indicadores.in = 0
            arr_indicadores.out = supervisorOut;
            return arr_indicadores;
        } else if (canalCon == 0) {
            arr_indicadores.in = conIndicadores;
            arr_indicadores.out = supervisorOut;
            return arr_indicadores;
        }
    }
}

module.exports.getConsultarMetricas = async(cola, event, arrConexiones) => {
    var codecola = "";
    if (cola == '')
    {
        codecola = '';
    }
    else 
    {
        codecola = cola.toString();
    }
    for (let i = 0; i < arrConexiones.length; i++) {
        let retorno = {};
        let url;
        //crm3 y fonacot
        const timeInd = await pool.query(querys.ConsultarUrlMetricas, []);
        url = timeInd[0].valor+"servidor="+arrConexiones[i]+"&colaId="+codecola;
        //url = "http://localhost:3005/consultarMetricas/?servidor="+arrConexiones[i]+"&colaId="+codecola;
        var request = require('request');
        request(url, await
            function(error, response, body) {
                let result = {};
                if (error) {
                    retorno.valido = false;
                    retorno.mensaje = "Error de conexión con el servidor";
                    event.reply('getConsultarMetricasResult', retorno);
                } else {
                    retorno.valido = true;
                    retorno.mensaje = "Success";
                    if (response.complete && response.statusCode == 200) {
                        const res = JSON.parse(response.body);
                        retorno.res = res[0];
                        retorno.servidor = arrConexiones[i];
                        event.reply('getConsultarMetricasResult', retorno);
                    }
                }
            });        
        } 
}

module.exports.getConsultarMetricasdos = async(cola, event) => {
    let retorno = {};
    //crm3 y fonacot
    let url = "http://172.16.41.108/BastiaanSoftwareCenter_Espartacus/php/repositorios/MonitorInb02.php?accion=consultarMetricastotal&colaId="+cola;
    var request = require('request');
    request(url, await
    function(error, response, body) {
        let result = {};
        if (error) {
            retorno.valido = false;
            retorno.mensaje = "Error de conexión con el servidor";
            event.reply('getConsultarMetricasResult', retorno);
        } else {
            retorno.valido = true;
            retorno.mensaje = "Success";
            if (response.complete && response.statusCode == 200) {

                const res = JSON.parse(response.body);
                retorno.res = res.valor;
                retorno.servidor = 0;
                event.reply('getConsultarMetricasResult', retorno);
            }
        }
    });
}

//cerrar sesion agente
module.exports.cerrarSesionAgt = async(agnt, modulo, motivos, fecha, hora) => {

    const conIndicadores = await pool.query(querys.consultarAgentesAll, ['', '', '', 'DISPONIBLE', '', agnt, '']);
    const supervisorOut = await pool.query(querys.consultarAgentesOutAll, ['', '', 'DISPONIBLE', '', agnt, '']);
    const conIndicadoresME = await pool.query(querys.consultarAgentesAllME, [ agnt]);

    if (conIndicadores.length > 0 && supervisorOut.length > 0 && conIndicadoresME.length > 0 ) {
        if (modulo == "I") {
            const cerrarSesionAgt = await pool.query(querys.cerrarSesionAgt, [agnt]);
            return cerrarSesionAgt;
        } else if (modulo == "O") {
            const cerrarSesionAgt = await pool.query(querys.cerrarSesionAgtOut, [agnt]);
            return cerrarSesionAgt;
        }else if (modulo == "ME") {
            const cerrarSesionAgt = await pool.query(querys.cerrarSesionAgtMe, [0,agnt]);
            //medios escritos facebook
         await mde.query(querys.cerrarSesionAgtMeF1, [agnt]); 
         await mde.query(querys.cerrarSesionAgtMeF3, [agnt]);
         await mde.query(querys.cerrarSesionAgtMeF4, [agnt]);
         //medios escritos twitter
         await mde.query(querys.cerrarSesionAgtMeT1, [agnt]); 
         await mde.query(querys.cerrarSesionAgtMeT3, [agnt]);
         await mde.query(querys.cerrarSesionAgtMeT4, [agnt]);
         //medios escritos chat
         await mde.query(querys.cerrarSesionAgtMeCH1, [agnt]);
         await mde.query(querys.cerrarSesionAgtMeCH2, [agnt]);
            return cerrarSesionAgt;
        }
        else {
            const rechReceso = await pool.query(querys.rechazarReceso, [agnt]);
            const CerrarSesionAg = await pool.query(querys.CerrarSesionAg, [agnt]);
            const updateMovimientosUsuario = await pool.query(querys.updateMovimientosUsuario, [hora, fecha, hora, hora,agnt, "SBSC"]);
            const updateReceso = await pool.query(querys.updateReceso, [fecha+' '+hora, fecha, hora, fecha+' '+hora,agnt, motivos]);
            /*const max = await pool.query(querys.calcularIdmonacH, []);
            const InsertarSesionTrabajoHistorial = await pool.query(querys.InsertarSesionTrabajoHistorial, [max[0].id, agnt, fecha, hora, "", "2", ""]);*/
            const cerrarSesionAgt = await pool.query(querys.cerrarSesionAgt, [agnt]);
            const cerrarSesionAgtO = await pool.query(querys.cerrarSesionAgtOut, [agnt]);
            const cerrarSesionAgtME = await pool.query(querys.cerrarSesionAgtMe, [0,agnt]);
            //medios escritos facebook
         await mde.query(querys.cerrarSesionAgtMeF1, [agnt]); 
         await mde.query(querys.cerrarSesionAgtMeF3, [agnt]);
         await mde.query(querys.cerrarSesionAgtMeF4, [agnt]);
         //medios escritos twitter
         await mde.query(querys.cerrarSesionAgtMeT1, [agnt]); 
         await mde.query(querys.cerrarSesionAgtMeT3, [agnt]);
         await mde.query(querys.cerrarSesionAgtMeT4, [agnt]);
         //medios escritos chat
         await mde.query(querys.cerrarSesionAgtMeCH1, [agnt]);
         await mde.query(querys.cerrarSesionAgtMeCH2, [agnt]);
            
            await pool.query(querys.InsertarSesionTrabajoHistorial, [  agnt, fecha, hora, "", "2", ""]);
            return cerrarSesionAgt;
        }
    }
    else
    {
        const rechReceso = await pool.query(querys.rechazarReceso, [agnt]);
        await pool.query(querys.CerrarSesionAg, [agnt]);
        await pool.query(querys.updateMovimientosUsuario, [hora, fecha, hora, hora,agnt, "SBSC"]);
        await pool.query(querys.updateReceso, [fecha+' '+hora, fecha, hora, fecha+' '+hora,agnt, motivos]);
        //const max = await pool.query(querys.calcularIdmonacH, []);       
        const cerrarSesionAgt = await pool.query(querys.cerrarSesionAgt, [agnt]);
        const cerrarSesionAgtO = await pool.query(querys.cerrarSesionAgtOut, [agnt]);
        const cerrarSesionAgtME = await pool.query(querys.cerrarSesionAgtMe, [0,agnt]);
        await pool.query(querys.InsertarSesionTrabajoHistorial, [  agnt, fecha, hora, "", "2", ""]);
         //medios escritos facebook
         await mde.query(querys.cerrarSesionAgtMeF1, [agnt]); 
         await mde.query(querys.cerrarSesionAgtMeF3, [agnt]);
         await mde.query(querys.cerrarSesionAgtMeF4, [agnt]);
         //medios escritos twitter
         await mde.query(querys.cerrarSesionAgtMeT1, [agnt]); 
         await mde.query(querys.cerrarSesionAgtMeT3, [agnt]);
         await mde.query(querys.cerrarSesionAgtMeT4, [agnt]);
         //medios escritos chat
         await mde.query(querys.cerrarSesionAgtMeCH1, [agnt]);
         await mde.query(querys.cerrarSesionAgtMeCH2, [agnt]);
        return cerrarSesionAgt;
    }

}

module.exports.getAllColas = async(datos) => {
    var colas = {};
    arrColas = [];
    if(datos == "PX4384")
    {
        const allColas = await pool.query(querys.getAllColasP, []);
        for (let i = 0; i < allColas.length; i++) {
            arrColas.push(allColas[i].ID);            
        }
        return colas.colas = allColas;
    }
    else
    {
        const allColas = await pool.query(querys.getAllColas, []);
        for (let i = 0; i < allColas.length; i++) {
            arrColas.push(allColas[i].ID);            
        }
        return colas.colas = allColas;
    }
}

module.exports.getAgenteVideo = async(usr, modulo) => {
    if (modulo == "I") {
        const agntVideo = await pool.query(querys.getAgenteVideo, [usr]);
        return agntVideo;
    } else {
        const agntVideo = await pool.query(querys.getAgenteVideo, [usr]);
        return agntVideo;
    }
}

module.exports.configurarVideo = async(video, usr, ext, modulo) => {
    if (modulo == "I") {
        const agt = await pool.query(querys.getAgenteVideo, [usr])
        if (agt.length > 0) {
            if (video.ConfiguraGrabacion == "numLlamadas") {
                const agt = await pool.query(querys.configuracionNumLlamadas, [video.ConfiguraGrabacion, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "numDias") {
                const agt = await pool.query(querys.configuracionNumDias, [video.ConfiguraGrabacion, video.Valor, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "numTiempo") {
                const agt = await pool.query(querys.configuracionNumTiempo, [video.ConfiguraGrabacion, video.Valor, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "siempre" || video.ConfiguraGrabacion == "no") {
                const agt = await pool.query(querys.configuracionVideo, [video.ConfiguraGrabacion, usr])
            }
        } else {
            const agt = await pool.query(querys.newConfiguracion, [ext, '', video.ConfiguraGrabacion, video.Valor, usr])
        }
    } else {
        const agt = await pool.query(querys.getAgenteVideo, [usr])
        if (agt.length > 0) {
            if (video.ConfiguraGrabacion == "numLlamadas") {
                const agt = await pool.query(querys.configuracionNumLlamadas, [video.ConfiguraGrabacion, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "numDias") {
                const agt = await pool.query(querys.configuracionNumDias, [video.ConfiguraGrabacion, video.Valor, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "numTiempo") {
                const agt = await pool.query(querys.configuracionNumTiempo, [video.ConfiguraGrabacion, video.Valor, video.Valor, usr])
            } else if (video.ConfiguraGrabacion == "siempre" || video.ConfiguraGrabacion == "no") {
                const agt = await pool.query(querys.configuracionVideo, [video.ConfiguraGrabacion, usr])
            }
        } else {
            const agt = await pool.query(querys.newConfiguracion, [ext, '', video.ConfiguraGrabacion, video.Valor, usr])
        }
    }
}

module.exports.getAllSupervisores = async(datos) => {
    const allSupervisor = await pool.query(querys.getSupervisor, [datos]);
    var supervisores = {};
    if (allSupervisor.length <= 0) {
        const allSupervisores = await pool.query(querys.getAllSupervisores, []);
        return supervisores.supervisores = allSupervisores;
    } else {
        return supervisores.supervisores = allSupervisor;
    }

}

//Recesos
module.exports.getConsultaReceso = async(agnt, valor, modulo) => {
    retorno = {}
    if (modulo == "I") {
        const receso = await pool.query(querys.agenteReceso, [agnt]);
        //validacion de si el usuario solicitó un receso
        if (receso.length > 0) {
            //valida el valor pasado por el boton en inicio.html
            if (valor == 1) {
                //autoriza el receso
                const autReceso = await pool.query(querys.autorizaReceso, [agnt]);
                retorno.valido = true;
                retorno.mensaje = "Receso Autorizado"
            } else {
                //rechaza el receso
                const rechReceso = await pool.query(querys.rechazarReceso, [agnt]);
                retorno.valido = true;
                retorno.mensaje = "Receso Rechazado"
            }
        } else {
            retorno.valido = false;
            retorno.mensaje = "Agente no solicitó receso"
        }
        return retorno;
    } else {
        const receso = await pool.query(querys.agenteReceso, [agnt]);
        //validacion de si el usuario solicitó un receso
        if (receso.length > 0) {
            //valida el valor pasado por el boton en inicio.html
            if (valor == 1) {
                //autoriza el receso
                const autReceso = await pool.query(querys.autorizaReceso, [agnt]);
                retorno.valido = true;
                retorno.mensaje = "Receso Autorizado"
            } else {
                //rechaza el receso
                const rechReceso = await pool.query(querys.rechazarReceso, [agnt]);
                retorno.valido = true;
                retorno.mensaje = "Receso Rechazado"
            }
        } else {
            retorno.valido = false;
            retorno.mensaje = "Agente no solicitó receso"
        }
        return retorno;
    }

}

//Acciones Llamadas
module.exports.accionesLlamadas = async(extAgnt, extEscucha, valor, marcador) => {
    const retorno = {};
    const timeInd = await pool.query(querys.ConsultarUrlLlam, []);
    if (valor == 1) {
        //escucha llamada fona y crm3 
        var url = timeInd[0].valor+"&accion=crearArchivo&extesionEscucha=" + extEscucha + "&extesionAgente=" + extAgnt + "&contexto=app-chanspy&marcador="+marcador;
        //console.log(url)
        //escucha llamada sepomex 
        //var url = "http://"+ pool.host.toString() +"/BastiaanSoftwareCenter_Espartacus/php/repositorios/Asterisk_cli.php?&accion=crearArchivo&extesionEscucha=" + extEscucha + "&extesionAgente=" + extAgnt + "&contexto=app-chanspy";
        var request = require('request');
        request(url, await
            function(error, response, body) {

                if (error) {
                    retorno.valido = false;
                    retorno.mensaje = "Error de conexión con el servidor";
                } else {
                    retorno.valido = true;
                    retorno.mensaje = "Success";
                }

            });
    } else if (valor == 2) {
        //asesorar llamada fona y crm3
        var url = timeInd[0].valor+"accion=crearArchivo&extesionEscucha=" + extEscucha + "&extesionAgente=" + extAgnt + "&contexto=app-inteview&marcador="+marcador;
        //asesorar llamada sepomex
        //var url = "http://"+ pool.host.toString() +"/BastiaanSoftwareCenter_Espartacus/php/repositorios/Asterisk_cli.php?&accion=crearArchivo&extesionEscucha=" + extEscucha + "&extesionAgente=" + extAgnt + "&contexto=app-inteview";
        var request = require('request');
        request(url, await
            function(error, response, body) {

                if (error) {
                    retorno.valido = false;
                    retorno.mensaje = "Error de conexión con el servidor";
                } else {
                    retorno.valido = true;
                    retorno.mensaje = "Success";
                }

            });
    } else {
        //intrusion llamada fona y crm3
        var url = timeInd[0].valor+"accion=crearArchivo&extesionEscucha=" + extEscucha + "&extesionAgente=" + extAgnt + "&contexto=app-intrusion&marcador="+marcador;
        //intrusion llamada sepomex
        //var url = "http://"+ pool.host.toString() +"/BastiaanSoftwareCenter_Espartacus/php/repositorios/Asterisk_cli.php?&accion=crearArchivo&extesionEscucha=" + extEscucha + "&extesionAgente=" + extAgnt + "&contexto=app-intrusion";
        var request = require('request');
        request(url, await
            function(error, response, body) {

                if (error) {
                    retorno.valido = false;
                    retorno.mensaje = "Error de conexión con el servidor";
                } else {
                    retorno.valido = true;
                    retorno.mensaje = "Success";
                }

            });
    }
    return retorno;
}

//indicadores outbound
module.exports.getindicadoresOut = async(campanas, fechaHoy, horaAc) => {
    const indicadores = {};
    const universo = await pool.query(querys.universo, [campanas]);
    const realizadas = await poolOBD.query(querys.realizadas, [fechaHoy, horaAc,campanas]);
    const exitosas = await pool.query(querys.exitosas, [fechaHoy,campanas]);
    const noExitosas = await pool.query(querys.noExitosas, [fechaHoy,campanas]);
    const rellamar = await pool.query(querys.rellamar, [fechaHoy,campanas]);
    const pendientes = await pool.query(querys.pendientes, [campanas]);
    indicadores.universo = universo;
    indicadores.realizadas = realizadas;
    indicadores.exitosas = exitosas;
    indicadores.noExitosas = noExitosas;
    indicadores.rellamar = rellamar;
    indicadores.pendientes = pendientes;
    return indicadores;
}

module.exports.getindicadoresCb = async(campanas, fechaHoy, horaAc) => {
    const indicadores = {};
    const universo = await pool.query(querys.cbuniverso, []);
    const realizadas = await poolOBD.query(querys.cbrealizadas, [fechaHoy, horaAc]);
    const exitosas = await pool.query(querys.cbexitosas, [horaAc]);
    const noExitosas = await pool.query(querys.cbnoexitosas, [horaAc]);
    const rellamar = await pool.query(querys.cbrellamar, [horaAc]);
    const pendientes = await pool.query(querys.cbpendientes, [horaAc]);
    const aht = await poolOBD.query(querys.cbaht, [fechaHoy, horaAc]);
    indicadores.universo = universo;
    indicadores.realizadas = realizadas;
    indicadores.exitosas = exitosas;
    indicadores.noExitosas = noExitosas;
    indicadores.rellamar = rellamar;
    indicadores.pendientes = pendientes;
    indicadores.aht = aht;
    return indicadores;
}

//guardar las rondas 
module.exports.lnzaRondaCampana = async(campana, arrancar_llamadas, numeroRonda, supervisor) => {
    const retorno = {};
    //crm3 y fona
    var url = "http://" + pool2.host.toString() + "//BastiaanSoftwareCenter_Espartacus/php/repositorios/MonitorOutbound.php?accion=guardarRondasCampana&campanaId=" + campana + "&arrancarLlamadas=" + arrancar_llamadas + "&NumeroRonda=" + numeroRonda + "&usuario=" + supervisor;
    //sepomex
    //var url = "http://"+ pool.host.toString() +"//BastiaanSoftwareCenter_Espartacus/php/repositorios/MonitorOutbound.php?accion=guardarRondasCampana&campanaId="+campana+"&arrancarLlamadas="+arrancar_llamadas+"&NumeroRonda="+numeroRonda+"&usuario="+supervisor;

    var request = require('request');
    request(url, await
        function(error, response, body) {

            if (error) {
                retorno.valido = false;
                retorno.mensaje = "Error de conexión con el servidor";
            } else {
                retorno.valido = true;
                retorno.mensaje = "Success";
            }

        });

}

//consultar agentes 
module.exports.consultarIdnAgentes = async(arrConexiones, cola, event) => {
    const retorno = {}
    var consulta;
    var codecola
    if (cola == '') {
        codecola = " and cola like concat('%','','%')"
    } else {
        codecola = " and cola IN("+ cola.toString() +")"
    }
    var marcador = '';
    for (let i = 0; i < arrConexiones.length; i++) {
        marcador = '';
        //const idnAgnts = await pool.query(querys.consultarIdnAgnts, []);
        consulta = querys.ahtI + codecola;
        const ahtI = await pool.query(consulta, [marcador]);
        const ahtO = await pool.query(querys.ahtO, [marcador]);
        const ahtIs = await pool.query(consulta, [arrConexiones[i]]);
        const ahtOs = await pool.query(querys.ahtO, [arrConexiones[i]]);
        retorno.ahtI = ahtI;
        retorno.ahtO = ahtO;
        retorno.ahtIs = ahtIs;
        retorno.ahtOs = ahtOs;
        retorno.marcador = arrConexiones[i];
        //retorno.idnAgnts = idnAgnts;
        event.reply("getIdnAgntsResult", retorno);
    }
}

module.exports.ConsultaInteracciones =  async(ID) => {
    const agentes = {};
    if (ID == "") {
        const totalesmc = await mde.query(querys.totalesmc, [ID, ID, ID, ID, ID, ID]);
        const Enatnmc = await mde.query(querys.Enatnmc, [ID, ID, ID, ID, ID, ID]);
        const Enespmc = await mde.query(querys.Enespmc, []);
        const Atnmc = await mde.query(querys.Atnmc, [ID, ID, ID, ID, ID, ID]);
        const Abnmc = await mde.query(querys.Abnmc, []);
        agentes.totalesmc = totalesmc;
        agentes.Enatnmc = Enatnmc;
        agentes.Enespmc = Enespmc;
        agentes.Abnmc = Abnmc;
        agentes.Atnmc = Atnmc;
    } else {
        const totalesmc = await mde.query(querys.totalesmc, [ID, ID, ID, ID, ID, ID]);
        const Enatnmc = await mde.query(querys.Enatnmc, [ID, ID, ID, ID, ID, ID]);
        const Enespmc = await mde.query(querys.Enespmc, []);
        const Atnmc = await mde.query(querys.Atnmc, [ID, ID, ID, ID, ID, ID]);
        const Abnmc = await mde.query(querys.Abnmc, []);
        agentes.totalesmc = totalesmc;
        agentes.Enatnmc = Enatnmc;
        agentes.Enespmc = Enespmc;
        agentes.Abnmc = Abnmc;
        agentes.Atnmc = Atnmc;
    }
    return agentes;
}

module.exports.insertarPreferencia = async(usuario, indicador) =>{
    const retorno = {};
    const preferenciaExist = await pool.query(querys.consultarPreferenciaExist,[usuario,indicador])
    if (preferenciaExist.length == 0) {
        const insertarPreferencia = await pool.query(querys.insertarPreferencias, [usuario, indicador])
    } else {
        const eliminarPreferencia = await pool.query(querys.eliminarPreferencias, [usuario, indicador])
    }
    
    const preferencias = await pool.query(querys.consultarPreferencias, [usuario]);
    retorno.preferencias = preferencias;
    return retorno;
    
}

module.exports.indicadoresAgnt = async(campana, cola, ID, sts, stsres, canalCon, agenteid, nombre) =>
{
    const arr_indicadores = {};
    const totalAgnts = await pool.query(querys.totalAgnts, [campana, cola, ID, sts, stsres, agenteid, nombre,campana, ID, sts, stsres, agenteid, nombre]);
    const totalAgntsll = await pool.query(querys.totalAgntsll, [campana, cola, ID, stsres, agenteid, nombre,campana, ID, stsres, agenteid, nombre]);
    const totalAgntsRes = await pool.query(querys.totalAgntsRes, [campana, cola, ID, sts, agenteid, nombre,campana, ID, sts, agenteid, nombre]);
    const totalAgntsol = await pool.query(querys.totalAgntsol, [campana, cola, ID, sts, agenteid, nombre,campana, ID, sts, agenteid, nombre]);
    const totalAgntsolaut = await pool.query(querys.totalAgntsolaut, [campana, cola, ID, sts, agenteid, nombre,campana, ID, sts, agenteid, nombre]);
    const totalAgntsd = await pool.query(querys.totalAgntsd, [campana, cola, ID, stsres, agenteid, nombre,campana, ID, stsres, agenteid, nombre]);
    arr_indicadores.total = totalAgnts;
    arr_indicadores.totall = totalAgntsll;
    arr_indicadores.totalr = totalAgntsRes;
    arr_indicadores.totals = totalAgntsol;
    arr_indicadores.totalsa = totalAgntsolaut;
    arr_indicadores.totald = totalAgntsd;
    return arr_indicadores;
        
}

module.exports.getUrl = async(datos, event) =>
{
    var url;
    if (datos.canal == "I")
    {
        const op = await pool.query(querys.ConsultarOp, []);
        url = op[0].valor+"&CNUSERID="+ datos.supervisor+"&EJECUTIVO_TC="+ datos.agente +"&ID_TC="+datos.idllam+"&TIPOMONITOREO_TC=1&ESTATUS_MON=LIN"     
    }
    else if (datos.canal = 'F') 
    {
        const op = await pool.query(querys.ConsultarOpRS, ['urlmon7']);
        const idllamada = await pool.query(querys.consultaridllamada, ['11',datos.idllam,datos.agente])
        if ( idllamada.length == 0 ) {
            return 0;
        }
        
        url = op[0].valor+"&CNUSERID="+ datos.supervisor+"&EJECUTIVO_TC="+ datos.agente +"&ID_TC="+ idllamada[0].id +"&TIPOMONITOREO_TC=1&ESTATUS_MON=LIN"
    } 
    else if (datos.canal = 'W') 
    {
        const op = await pool.query(querys.ConsultarOpRS, ['urlmon6']);
        const idllamada = await pool.query(querys.consultaridllamada, ['8',datos.idllam,datos.agente])
        if ( idllamada.length == 0 ) {
            return 0;
        }
        url = op[0].valor+"&CNUSERID="+ datos.supervisor+"&EJECUTIVO_TC="+ datos.agente +"&ID_TC="+ idllamada[0].id +"&TIPOMONITOREO_TC=1&ESTATUS_MON=LIN"
        
    }
    else if (datos.canal = 'T') 
    {
        const op = await pool.query(querys.ConsultarOpRS, ['urlmon8']);
        const idllamada = await pool.query(querys.consultaridllamada, ['12',datos.idllam,datos.agente])
        if ( idllamada.length == 0 ) {
            return 0;
        }
        url = op[0].valor+"&CNUSERID="+ datos.supervisor+"&EJECUTIVO_TC="+ datos.agente +"&ID_TC="+ idllamada[0].id +"&TIPOMONITOREO_TC=1&ESTATUS_MON=LIN"
        
    }
    else if (datos.canal = 'M') 
    {
        const op = await pool.query(querys.ConsultarOpRS, ['urlmon10']);
        const idllamada = await pool.query(querys.consultaridllamada, ['13',datos.idllam,datos.agente])
        if ( idllamada.length == 0 ) {
            return 0;
        }
        url = op[0].valor+"&CNUSERID="+ datos.supervisor+"&EJECUTIVO_TC="+ datos.agente +"&ID_TC="+ idllamada[0].id +"&TIPOMONITOREO_TC=1&ESTATUS_MON=LIN"
        
    }
    else if (datos.canal = 'CH') 
    {
        const op = await pool.query(querys.ConsultarOpRS, ['urlmon5']);
        const idllamada = await pool.query(querys.consultaridllamada, ['7',datos.idllam,datos.agente])
        if ( idllamada.length == 0 ) {
            return 0;
        }
        url = op[0].valor+"&CNUSERID="+ datos.supervisor+"&EJECUTIVO_TC="+ datos.agente +"&ID_TC="+ idllamada[0].id +"&TIPOMONITOREO_TC=1&ESTATUS_MON=LIN"
        
    }
    else if (datos.canal = 'O') 
    {
        const op = await pool.query(querys.ConsultarOp, []);
        url = op[0].valor+"&CNUSERID="+ datos.supervisor+"&EJECUTIVO_TC="+ datos.agente +"&ID_TC="+datos.idllam+"&TIPOMONITOREO_TC=2&ESTATUS_MON=LIN"     
        
    }
    // else if (datos.canal = 'S') 
    // {
    //     const op = await pool.query(querys.ConsultarOp, []);
    //     url = op[0].valor+"&CNUSERID="+ datos.supervisor+"&EJECUTIVO_TC="+ datos.agente +"&ID_TC="+datos.idllam+"&TIPOMONITOREO_TC=1&ESTATUS_MON=LIN"
    // }
    return  url;
}

module.exports.cerrarSesionSupervisor = async(ID,fecha, hora) => {
    
   const cerrarSesion = await pool.query(querys.updateMovimientosUsuario, [hora, fecha, hora, hora,ID, "SBSC"]);
   return;
}


module.exports.consultasesion = async(id) =>{
    const consulta = {};
    const sesion = await pool.query(querys.consultasesion,[id])
    return consulta.sesion = sesion;
}

module.exports.consultarInteraccionesEnEspera = async(canal) => {
    const interacciones = {};
        const enespera = await mde.query(querys.consultarInteracionesEnEspera, [canal]);
        interacciones.enespera = enespera;
        return interacciones;
}

module.exports.consultarInformacionAgentes = async(canal,agenteBD) => {
    const informacionAgentes = {};
    const informacionAgentesC = await pool.query(querys.consultarInformacionAgentes, [agenteBD]);
    informacionAgentes.informacionAgentes = informacionAgentesC;
    return informacionAgentes; 
}

module.exports.consultarInformacionAgentesOcupadas = async(canal,agenteBD) => {
    const informacionAgentesOcupadas = {};
    const informacionAgentesOcupadasC = await mde.query(querys.consultarInformacionAgentesOcupadas, [agenteBD]);
    informacionAgentesOcupadas.informacionAgentesOcupadas = informacionAgentesOcupadasC;
    return informacionAgentesOcupadas; 
}

//Informacion del agente
module.exports.indicadoresAgentes = async(campana, cola, ID, sts, stsres, canalCon, canal_inicial, idagnt, nombre, ibdA, obdA) => {
    var codecola = "";
    var consulta;
    var consulta2;
    if (cola == '')
    {
        codecola = arrColas;
    }
    else 
    {
        codecola = cola;
    }
        const indAgentes = {};
        const indTotales = await pool.query(querys.indicadoresTotales, [campana, ID, ID, sts, stsres, idagnt, nombre, codecola, ibdA,
            campana, ID, ID, sts, idagnt, nombre, codecola, ibdA, campana, ID, ID, sts, stsres, idagnt, nombre, obdA]);
        indAgentes.total = indTotales
        const indDetalle = await pool.query(querys.indicadoresDetalle, [campana, ID, ID, sts, stsres, idagnt, nombre, codecola, ibdA,
            campana, ID, ID, sts, idagnt, nombre, codecola, ibdA, campana, ID, ID, sts, stsres, idagnt, nombre, obdA]);
        indAgentes.detalle = indDetalle;
        return indAgentes;
}
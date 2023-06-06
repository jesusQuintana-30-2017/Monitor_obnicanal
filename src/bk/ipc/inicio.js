const { ipcMain } = require('electron');

const helper = require('../helpers/inicio');

//Informacion del Agente
ipcMain.on('getConsultarAgentes', async(event, campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre) => {
    if (cola == []) {
        cola = '';
    }
    if (sts == "ALL") {
        sts = '';
    }
    if (sts == "LLAMADA") {
        sts = 'EN LLAMADA';
    }
    if (stsres == "ALL") {
        stsres = '';
    }
    if (campana == '') {
        campana = '';
    }
    const consultarAgentes = await helper.consultarAgentes(campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre);
    event.reply('getConsultarAgentesResult', consultarAgentes);
});

ipcMain.on('getConsultarAgentesM', async(event, campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre) => {
    if (cola == []) {
        cola = '';
    }
    if (sts == "ALL") {
        sts = '';
    }
    if (sts == "LLAMADA") {
        sts = 'EN LLAMADA';
    }
    if (stsres == "ALL") {
        stsres = '';
    }
    if (campana == '') {
        campana = '';
    }
    const consultarAgentes = await helper.consultarAgentesM(campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre);
    event.reply('getConsultarAgentesMResult', consultarAgentes);
});

ipcMain.on('getConsultarAgentesO', async(event, campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre) => {
    if (cola == []) {
        cola = '';
    }
    if (sts == "ALL") {
        sts = '';
    }
    if (sts == "LLAMADA") {
        sts = 'EN LLAMADA';
    }
    if (stsres == "ALL") {
        stsres = '';
    }
    if (campana == '') {
        campana = '';
    }
    const consultarAgentes = await helper.consultarAgentesO(campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre);
    event.reply('getConsultarAgentesOResult', consultarAgentes);
});

ipcMain.on('getConsultarAgentesC', async(event, campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre) => {
    if (cola == []) {
        cola = '';
    }
    if (sts == "ALL") {
        sts = '';
    }
    if (sts == "LLAMADA") {
        sts = 'EN LLAMADA';
    }
    if (stsres == "ALL") {
        stsres = '';
    }
    if (campana == '') {
        campana = '';
    }
    const consultarAgentes = await helper.consultarAgentesC(campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre);
    event.reply('getConsultarAgentesCResult', consultarAgentes);
});

ipcMain.on('getAllCampanas', async(event, dato) => {
    const allCampanas = await helper.getAllCampanas(dato);
    event.reply("getAllCampanasResult", allCampanas);
});

ipcMain.on('consultarSupervisores', async(event, usuarioid, monitorv) => {
    const supervisores = await helper.consultarSupervisores(usuarioid, monitorv);
    event.reply("consultarSupervisoresResult", supervisores);

});

ipcMain.on('getAllEstatus', async(event, dato) => {
    const allEstatus = await helper.getAllEstatus();
    event.reply("getAllEstatusResult", allEstatus);
});

ipcMain.on('getAllColas', async(event, dato) => {
    const allColas = await helper.getAllColas(dato);
    event.reply("getAllColasResult", allColas);
});

ipcMain.on('getAllSupervisores', async(event, dato) => {
    const allSupervisores = await helper.getAllSupervisores(dato);
    event.reply("getAllSupervisoresResult", allSupervisores);

});

//Indicadores
ipcMain.on('conIndicadores', async(event, campana, cola, ID, sts, stsres, canalCon, idagnt, nombre) => {
    if (cola == []) {
        cola = '';
    }
    if (sts == "ALL") {
        sts = '';
    }
    if (sts == "LLAMADA") {
        sts = 'EN LLAMADA';
    }
    if (stsres == "ALL") {
        stsres = '';
    }
    if (campana == '') {
        campana = '';
    }
    if (idagnt == "") {
        idagnt == '';
    }
    if (nombre == "") {
        nombre = '';
    }
    const conIndicadores = await helper.conIndicadores(campana, cola, ID, sts, stsres, canalCon, idagnt, nombre);
    event.reply('conIndicadoresResult', conIndicadores);
});

ipcMain.on('getConsultarMetricas', async(event, cola, arrConexiones) => {
    if (cola == []) {
        cola = '';
    }
    const getConsultarMetricas = await helper.getConsultarMetricas(cola, event, arrConexiones);
    event.reply('getConsultarMetricasResult', getConsultarMetricas);
});

ipcMain.on('getConsultarMetricasdos', async(event, cola) => {
    if (cola == []) {
        cola = '';
    }
    const getConsultarMetricasdos = await helper.getConsultarMetricasdos(cola, event);
    event.reply('getConsultarMetricasResult', getConsultarMetricasdos);
});

//recesos
ipcMain.on('getConsultarReceso', async(event, agnt, valor, modulo) => {
    const receso = await helper.getConsultaReceso(agnt, valor, modulo);
    event.reply('getConsultarRecesoResult', receso)
});
//cerrar sesion agente
ipcMain.on('cerrarSesionAgt', async(event, agnt, modulo, motivos, fechaHoy, horaAc) => {
    const cerrarAgt = await helper.cerrarSesionAgt(agnt,modulo, motivos, fechaHoy, horaAc);
    event.reply('cerrarSesionAgtResult', cerrarAgt)
});

//Acciones del supervisor con las llamadas
ipcMain.on('accionesLlamadas', async(event, extAgnt, extEscucha, valor, marcador) => {
    const acciones = await helper.accionesLlamadas(extAgnt, extEscucha, valor, marcador)
    //event.reply('accionesLlamadasResult', acciones)
});

//consulta de agente en bstnstatusllamada tabla donde se guarda la configuracion
ipcMain.on('getAgenteVideo', async(event, usr, modulo) => {
    const usrVideo = await helper.getAgenteVideo(usr, modulo)
    event.reply('getAgenteVideoResult', usrVideo)
})

//configurar video
ipcMain.on('configurarVideo', async(event, video, usr, ext, modulo) => {
    const Cvideo = await helper.configurarVideo(video, usr, ext, modulo)
});

//indicadores
ipcMain.on('getindicadoresOut', async(event, campana, fechaHoy, horaAc) => {
    if (campana == '') {
        campana = '';
    }
    const indicadores = await helper.getindicadoresOut(campana, fechaHoy, horaAc)
    event.reply('getindicadoresOutResult', indicadores)
});

ipcMain.on('getindicadoresCb', async(event, campana, fechaHoy, horaAc) => {
    if (campana == '') {
        campana = '';
    }
    const indicadores = await helper.getindicadoresCb(campana, fechaHoy, horaAc)
    event.reply('getindicadoresCbResult', indicadores)
});

// guarda las rondas de llamadas
ipcMain.on('lnzaRondaCampana', async(event, campana, arrancar_llamadas, numeroRonda, supervisor) => {
    const indicadores = await helper.lnzaRondaCampana(campana, arrancar_llamadas, numeroRonda, supervisor)
    //event.reply('getindicadoresOutResult', indicadores)
});

//lanza las rondas de llamadas
ipcMain.on('consultarAgente', async(event, campana, arrancar_llamadas, numeroRonda) => {
    const consultarAgnt = await helper.consultarAgente(campana, arrancar_llamadas, numeroRonda)
});

ipcMain.on('getIdnAgnts', async(event, arrConexiones, cola) => {
    if (cola == '0') {
        cola = '';
    }
    const idnAgnts = await helper.consultarIdnAgentes(arrConexiones, cola, event);
    event.reply("getIdnAgntsResult", idnAgnts);
});

ipcMain.on('nuevasInteraccionesOmnicanal', async(event, datos) => {
    console.log('wbsckt')
    const interacciones = await helper.ConsultaInteracciones(datos);
    event.reply("ConsultaInteraccionesResult", interacciones);
});

ipcMain.on('insertarPreferencia', async(event, usuario, indicador) => {
    const preferencias = await helper.insertarPreferencia(usuario, indicador);
    event.reply("insertarPreferenciaResult", preferencias);
});


//Indicadores
ipcMain.on('indicadoresAgnt', async(event, campana, cola, ID, sts, stsres, canalCon, idagnt, nombre) => {
    if (cola == []) {
        cola = '';
    }
    if (sts == "ALL") {
        sts = '';
    }
    if (sts == "LLAMADA") {
        sts = 'EN LLAMADA';
    }
    if (stsres == "ALL") {
        stsres = '';
    }
    if (campana == '') {
        campana = '';
    }
    if (idagnt == "") {
        idagnt == '';
    }
    if (nombre == "") {
        nombre = '';
    }
    const indicadoresAgnt = await helper.indicadoresAgnt(campana, cola, ID, sts, stsres, canalCon, idagnt, nombre);
    event.reply('indicadoresAgntResult', indicadoresAgnt);
});

//Acciones del supervisor con las llamadas
ipcMain.on('getUrl', async(event, datos,) => {
    const acciones = await helper.getUrl(datos)
    event.reply('getUrlResult', acciones)
});

ipcMain.on('consultarConversacion', async(event, datos) => {
    const conversacion = await helper.consultarConversacion(datos, event);
    event.reply("consultarConversacionResult", conversacion);
});

ipcMain.on('cerrarSesionSupervisor', async(event, supervisor_firm, fechaHoy, horaAc) => {
    console.log(supervisor_firm)
    const cerrarSesion = await helper.cerrarSesionSupervisor(supervisor_firm, fechaHoy, horaAc);
    event.reply('cerrarSesionSupervisorResult', cerrarSesion)
});

ipcMain.on('AgentesxServidor', async(event, campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre) => {
    if (cola == []) {
        cola = '';
    }
    if (sts == "ALL") {
        sts = '';
    }
    if (sts == "LLAMADA") {
        sts = 'EN LLAMADA';
    }
    if (stsres == "ALL") {
        stsres = '';
    }
    if (campana == '') {
        campana = '';
    }
    const consultarAgentes = await helper.consultarAgentes(campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre);
    event.reply('AgentesxServidorResult', consultarAgentes);
});

ipcMain.on('consultasesion', async(event, id) => {
    const consulta = await helper.consultasesion(id);
    event.reply("consultasesionResult", consulta);

});

ipcMain.on('consultarInteraccionesEnEspera', async(event, canal) => {
    const consulta = await helper.consultarInteraccionesEnEspera(canal);
    event.reply("consultarInteraccionesEnEsperaResult", consulta);

});

ipcMain.on('consultarInformacionAgentes', async(event, canal, agenteBD) => {
    const consulta = await helper.consultarInformacionAgentes(canal,agenteBD);
    const consulta2 = await helper.consultarInformacionAgentesOcupadas(canal,agenteBD);
    for(var i=0;i<consulta.informacionAgentes.length;i++){ 
        const arrocupadas = consulta2.informacionAgentesOcupadas.filter(agentesOcupadas => agentesOcupadas.agente == consulta.informacionAgentes[i].agente);
        var ocupadas= 0; var disponibles=0; 
        try {ocupadas= arrocupadas[0].ocupadas;}  catch (err) { ocupadas=0;}  
        try {disponibles= parseInt(consulta.informacionAgentes[i].asignadas) - parseInt(ocupadas) }  catch (err) { disponibles=0;}    
        consulta.informacionAgentes[i].ocupadas=ocupadas;
        consulta.informacionAgentes[i].disponibles=disponibles;
        if(consulta.informacionAgentes[i].chat!="-"){
            try { consulta.informacionAgentes[i].chat=arrocupadas[0].chat;}  catch (err) { }  
        }
        if(consulta.informacionAgentes[i].facebook!="-"){
            try {consulta.informacionAgentes[i].facebook=arrocupadas[0].facebook;}  catch (err) { }  
        }
        if(consulta.informacionAgentes[i].twitter!="-"){
            try {consulta.informacionAgentes[i].twitter=arrocupadas[0].twitter;}  catch (err) { }  
        }
        
    }


    event.reply("consultarInformacionAgentesResult", consulta);

});

//Informacion del Agente
ipcMain.on('getindicadoresAgentes', async(event, campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre, ibdA, obdA) => {
    if (cola == []) {
        cola = '';
    }
    if (sts == "ALL") {
        sts = '';
    }
    if (sts == "LLAMADA") {
        sts = 'EN LLAMADA';
    }
    if (stsres == "ALL") {
        stsres = '';
    }
    if (campana == '') {
        campana = '';
    }
    const indicadoresAgentes = await helper.indicadoresAgentes(campana, cola, ID, sts, stsres,canalCon, canal_inicial, idagnt, nombre, ibdA, obdA);
    event.reply('getindicadoresAgentesResult', indicadoresAgentes);
});
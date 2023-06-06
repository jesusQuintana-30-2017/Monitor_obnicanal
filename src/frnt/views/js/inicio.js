const { ipcRenderer } = require('electron');
var xl = require('excel4node');
const $ = require('jquery');
require('popper.js');
require('bootstrap');
require('datatables.net-dt')();
const popper = document.querySelector('.my-popper');
var bootbox = require('bootbox');


//variables
var servidorF = ''
var arrConexiones = [];
var nodos = [];
var nodosRaiz = [];
var usuarioOk = {};
var time = 5000;
var timeInd = 5000;
var procesoID;
var supervisor_firm;
var supervisor_firma;
var arrancar_llamadas = "NO";
var numeroRonda ="01";
var segundos = 0;
var minutos = 0;
var horas = 0;
var centesimas = 0;
var bandera = 0;
var cronoval = 0;
var seleccionado_firstd;
var agenteSeleccionado;
var canalSeleccionado;
var marcadorSeleccionado;
var cronometroi;
var canalCon = 0;
var canalI = false;
var canalO = false;
var canalC = false;
var canalM = false;
var setconsulta;
var setconsultaM;
var enLlamadaO = 0;
var enLlamadaCb = 0;
var canal_inicial = 0;
var arr_pref = [];
var seleccionado_idllam;
var motivo_receso;
var socket;
var arr_multi = [];
var activost = 0;
var disponiblest =0;
var solAt = 0;
var solt = 0;
var rest = 0;
var arr_ind = [];
var metricas = new Object();
var numeromarcadores=1;
let socketport = parseInt(window.location.port) + 1;
var crm;
var capacitacion = 0;
var retro = 0;
var alimentos = 0;
var personales = 0;
var comision = 0;
var canalrs;
var monitorv = '';
var ibdA = 0;
var obdA = 0;

//variables metricas
var ivr = 0;
var enespera = 0;
var recibidas = 0;
var contestadas = 0;
var abandonadas = 0;
var poratendidas = 0;
var porabandono = 0;

ipcRenderer.send('getVersion', "")

ipcRenderer.on('getVersionResult',  async(event, vers) => {
  $("title").html("Monitor omnicanal primer nivel v" + vers)
  monitorv = '< '+vers;
})

ipcRenderer.send('conexion', '')
ipcRenderer.send('getUsuario', '')
ipcRenderer.send('getAllEstatus', '')

ipcRenderer.on('errorconexion', (event, data) => {
    alert("error ", data);
})

function onLoad() {
    window.onbeforeunload = function (e) {
        var e = e || window.event;
        if (e) {
            if(arrancarLlamadas=="SI")
            {
                if(NumeroRonda== "01")
                {
                    lnzRonda_1();
                }
                else if(NumeroRonda== "02")
                {
                    lnzRonda_2();
                }
                else if(NumeroRonda== "03")
                {
                    lnzRonda_3();
                }
                    return 'Debes detener la campaña antes de salir!';
            }
        }
    }
}

//cacha los resultados de la consulta de usuario e imprime su informacion en pantalla
ipcRenderer.on('getUsuarioResult', (event, datos) => {
    supervisor_firma = datos.usuario.usuarioid;
    //mandar idusuario a consultar supervisores
    ipcRenderer.send('consultarSupervisores', datos.usuario.usuarioid, monitorv)
    $("#usuario").html(datos.usuario.usuarioid);
    ipcRenderer.send('getUsuarioModulos', datos.usuario.usuarioid)
    ipcRenderer.send('getAllCampanas', datos.usuario.usuarioid)
})

//consultar supervisores
ipcRenderer.on('consultarSupervisoresResult', (event, datos) => {
    timeInd = parseInt(datos.timeInd[0].valor)*1000;
    supervisor_firm = datos.all[0].ID;
    canal_inicial = datos.canal;
    ipcRenderer.send('getAllColas', supervisor_firma)
    if (datos.all.length > 0) {
        var loop = setInterval(local, time);
        var loop2 = setInterval(metricas, timeInd);
        
        function local() {
            //arr_multi = [];
            //arr_ind = [];
            consultarAgntinb('', '', datos.all[0].ID, '', '', '', '')
            consultarAgntObd('', '', datos.all[0].ID, '', '', '', '')
            consultarAgntC('', '', datos.all[0].ID, '', '', '', '')
            consultarAgntM('', '', datos.all[0].ID, '', '', '', '')
            llenarIndicadores('', '', datos.all[0].ID, '', '', '', '');
            //consultasesion()
        }
        function metricas() {
            consultarMetricas('')
        }
        $('#btnConsultas').on('click', function() {
                clearInterval(loop);
                clearInterval(loop2);
            })
            //ipcRenderer.send('agDisponibles_',datos[0].ID)
        for (var i = 0; i < datos.all.length; i++) {
            $("#supervisorComboid").append("<option value='" + datos.all[i].ID + "'>" + datos.all[i].DSC + "</option>")
        }
        arr_pref = datos.preferencias;
        pintarPreferencias(datos.preferencias);
            
    } else {
        $("#supervisorComboid").append("<option value='NO APLICA'>NO APLICA</option>")

    }
    //ipcRenderer.send('nuevasInteraccionesOmnicanal', supervisor_firm)
    //ipcRenderer.send('getConsultarAgentes', '', '', supervisor_firm, '', '', canalCon, canal_inicial, '', '')
    conectarSocket();
})

//ipcRenderer.send('ConsultaInteracciones', supervisor_firm)

async function conectarSocket() {
    //console.log(supervisor_firm);
    if (crm == '172.16.42.112')
    {
        socket = new io.connect('http://172.16.41.109:'+ 2001, { query: 'username=' + supervisor_firm + '&puesto=COORDINADOR' });
    }
    else
    {
        socket = new io.connect('http://'+crm+':'+ 2001, { query: 'username=' + supervisor_firm + '&puesto=COORDINADOR' });
    }
    //console.log(socket);
    socket.on("disconnect", async function() {
        //console.log("client disconnected from server");
    });
    socket.on('connect', function() {
        //console.log("Successfully connected!");
    });
    // socket.on('logout-in-agente', function() {
    //     consultarAgntinb('', '', '', '', '', '')
    //     consultarAgntObd('', '', '', '', '', '')
    //     consultarAgntM('', '', '', '', '', '')
    // });

    // socket.on('solicitarRecesoSup', function() {
    //     consultarAgntinb('', '', '', '', '', '')
    //     consultarAgntObd('', '', '', '', '', '')
    //     consultarAgntM('', '', '', '', '', '')
    // });

    // socket.on('cambioEnllamadaAgenteSup', function() {
    //     consultarAgntinb('', '', '', '', '', '')
    //     consultarAgntObd('', '', '', '', '', '')
    //     consultarAgntM('', '', '', '', '', '')
    // });
}

function consultarAgntinb(campana, cola, supervisor, sts, stsrec, idagnt, nombre)
{
    ipcRenderer.send('getIdnAgnts', arrConexiones, cola)
    if (canalI == true) {
        // ivr = 0;
        // enespera = 0;
        // recibidas = 0;
        // contestadas = 0;
        // abandonadas = 0;
        // poratendidas = 0;
        // porabandono = 0;
        
        // var loop2 = setInterval(function(){
        //     if (arrConexiones[0] == "172.16.41.203") {
        //         ipcRenderer.send('getConsultarMetricasdos', cola, arrConexiones)
        //     }
        //     ipcRenderer.send('getConsultarMetricas', cola, arrConexiones)
        // }, timeInd);
        ipcRenderer.send('getConsultarAgentes', campana, cola, supervisor, sts, stsrec, canalCon, canal_inicial, idagnt, nombre)
    }
}

function consultarMetricas(cola)
{
    ipcRenderer.send('getIdnAgnts', arrConexiones, cola)
    if (canalI == true) {
        ivr = 0;
        enespera = 0;
        recibidas = 0;
        contestadas = 0;
        abandonadas = 0;
        poratendidas = 0;
        porabandono = 0;
        
        ipcRenderer.send('getConsultarMetricas', cola, arrConexiones)
    }
}

function consultarAgntObd(campana, cola, supervisor, sts, stsrec, idagnt, nombre)
{
    var f = new Date();
    var day = f.getDate();
    if (day < 10) {
    day = "0"+day
    }
    var month = f.getMonth() +1
    if (month < 10) {
    month = "0"+month
    }
    var year = f.getFullYear();

    var fechaHoy = year+'-'+month+'-'+day
    var hora = f.getHours();
    if (f.getHours() < 10) {
        hora = '0' + f.getHours();
    }
    var minutos = f.getMinutes();
    if (f.getMinutes() < 10) {
        minutos = '0' + f.getMinutes();
    }
    var segundos = f.getSeconds();
    if (f.getSeconds() < 10) {
        segundos = '0' + f.getSeconds();
    }
    var horaAc = hora +':'+minutos+':'+ segundos
    //console.log(canalO)
    if (canalO == true) {
        ipcRenderer.send('getConsultarAgentesO', campana, cola, supervisor, sts, stsrec, canalCon, canal_inicial, idagnt, nombre)
        ipcRenderer.send('getindicadoresOut', campana, fechaHoy, horaAc)
    }
}

function consultarAgntC(campana, cola, supervisor, sts, stsrec, idagnt, nombre)
{
    var f = new Date();
    var day = f.getDate();
    if (day < 10) {
    day = "0"+day
    }
    var month = f.getMonth() +1
    if (month < 10) {
    month = "0"+month
    }
    var year = f.getFullYear();

    var fechaHoy = year+'-'+month+'-'+day
    var hora = f.getHours();
    if (f.getHours() < 10) {
        hora = '0' + f.getHours();
    }
    var minutos = f.getMinutes();
    if (f.getMinutes() < 10) {
        minutos = '0' + f.getMinutes();
    }
    var segundos = f.getSeconds();
    if (f.getSeconds() < 10) {
        segundos = '0' + f.getSeconds();
    }
    var horaAc = hora +':'+minutos+':'+ segundos
    //console.log(canalC)
    if (canalC == true) {
        ipcRenderer.send('getConsultarAgentesC', campana, cola, supervisor, sts, stsrec, canalCon, canal_inicial, idagnt, nombre)
        ipcRenderer.send('getindicadoresCb', campana, fechaHoy, horaAc)
    }
}

function consultarAgntM(campana, cola, supervisor, sts, stsrec, idagnt, nombre)
{
    if (canalM == true) {
        ipcRenderer.send('getConsultarAgentesM', campana, cola, supervisor, sts, stsrec, canalCon, canal_inicial, idagnt, nombre)
        ipcRenderer.send('nuevasInteraccionesOmnicanal', supervisor_firm)
    }
}

//consultar agentes
ipcRenderer.on('getConsultarAgentesResult', (event, datos) => {
     var arr_inb = [];

    for (let a = 0; a < datos.in.length; a++) {
        arr_inb.push(datos.in[a])
        arr_multi.push(datos.in[a])
        arr_ind.push(datos.in[a])
    }

    for (let p = 0; p < datos.agv.length; p++) {
        arr_inb.push(datos.agv[p])
        arr_multi.push(datos.agv[p])
        arr_ind.push(datos.agv[p])
    }

    //console.log(arr_inb)
    llenarGrid(arr_inb);
    total_indicadores();
});

ipcRenderer.on('getConsultarAgentesMResult', (event, datos) => {
    
    let enLlamada = 0;
    let lMayor = 0;
    enLlamadaO = 0;
    let lMayorO = 0;
    var arr_F = [];
    var arr_W = [];
    var arr_T = [];
    var arr_M = [];
    var arr_CH = [];
    var arr_SMS = [];
    var arr_cb = []
    var arr_inb = [];
    var arr_outb = [];
    var capacitacion = 0;
    var retro = 0;
    var alimentos = 0;
    var personales = 0;
    var comision = 0;
    arr_multi = [];
    arr_ind = [];
    operacion = 0;
    activos = 0;
    disponibles = 0;
    solA = 0;
    sol = 0;
    res = 0;
    totali = 0;

     for (var c = 0; c < datos.agentemulti.length; c++)
     {
        if (datos.agentemulti[c].area == 'F') {
            arr_F.push(datos.agentemulti[c])            
        } else if (datos.agentemulti[c].area == 'W') {
            arr_W.push(datos.agentemulti[c])            
        } else if (datos.agentemulti[c].area == 'T') {
            arr_T.push(datos.agentemulti[c])            
        } else if (datos.agentemulti[c].area == 'M') {
            arr_M.push(datos.agentemulti[c])            
        } else if (datos.agentemulti[c].area == 'CH') {
            arr_CH.push(datos.agentemulti[c])            
        } else if (datos.agentemulti[c].area == 'SMS') {
            arr_SMS.push(datos.agentemulti[c])            
        }
     }
    llenarGridFacebook(arr_F);
    llenarGridWhatsApp(arr_W);
    llenarGridTwitter(arr_T);
    llenarGridMail(arr_M);
    llenarGridChat(arr_CH);
    llenarGridSMS(arr_SMS);
});

ipcRenderer.on('getConsultarAgentesOResult', (event, datos) => {
    //console.log('Out '+datos)
    enLlamadaO = 0;
    var arr_outb = [];

     for (let b = 0; b < datos.out.length; b++) {
        arr_outb.push(datos.out[b])
        arr_multi.push(datos.out[b])
        //sacamos informacion para pintar en los indicadores
        /*if (datos.out[b].sts === "EN LLAMADA") {
            activos++;
        }
        /*if (datos.out[b].sts == "NO CONECTADO") {
            noConectado++;
        }
        if (datos.out[b].permiso === "PERSONALES" && datos.out[b].stsrec === "RES") {
            personales++;
        }

        if (datos.out[b].permiso === "ALIMENTOS" && datos.out[b].stsrec === "RES") {
            alimentos++;
        }

        if (datos.out[b].permiso === "RETROALIMENTACION" && datos.out[b].stsrec === "RES") {
            retro++;
        }

        if (datos.out[b].permiso === "CAPACITACION" && datos.out[b].stsrec === "RES") {
            capacitacion++;
        }

        if ((datos.out[b].permiso === "COMISION  " || datos.out[b].permiso === "COMISION JORNADA LABORAL") && datos.out[b].stsrec === "RES") {
            comision++;
        }*/
        var ban = false;
        for(var x = 0; x < arr_ind.length; x++)
        {
          if (datos.out[b].id == arr_ind[x].id) {
            ban = true
          } else {
            ban = false;
            x = arr_ind.length;
          }  
        }

        if (ban == false) {
            arr_ind.push(datos.out[b])   
        }
     }

     /*for (let l = 0; l < arr_ind.length; l++) {
        // if (arr_ind[l].sts == "EN LLAMADA")
        // {
        //     activos++
        // }
        if (arr_ind[l].sts == "DISPONIBLE") {
            disponibles++;
        }
        if (arr_ind[l].stsrec == "RES") {
            res++;
        }
        if (arr_ind[l].stsrec == "SOL") 
        {
            sol++;
        }
        if (arr_ind[l].stsrec == "SOLAUT") 
        {
            solA++;
        }
    }*/

    /*operacion = parseInt(activos) + parseInt(disponibles);
    totali = parseInt(operacion) + parseInt(res);

    $("#agTotalI").text(totali)
    $("#agOperacion").text(operacion)
    //$("#agNoConectado").text(noConectado)
    $("#agLlamada").text(activos)
    $("#agDisponibles").text(disponibles)
    $("#solAut").text(solA)
    $("#Sol").text(sol)
    $("#Res").text(res)

    $("#lenAtencion").text(activos)
    $("#lMayor").text(lMayor)
    $("#ResPer").text(personales)
    $("#ResRetro").text(retro)
    $("#ResAli").text(alimentos)
    $("#ResCap").text(capacitacion)
    $("#ResCom").text(comision)*/

    llenarGridOutb(arr_outb);
    //llenarGridcb(arr_cb);
});

ipcRenderer.on('getConsultarAgentesCResult', (event, datos) => {
    enLlamadaO = 0;
    var arr_cb = [];

     for (var i = 0; i < datos.agnts.length; i++) {
        arr_cb.push(datos.agnts[i])
        arr_multi.push(datos.agnts[i])
        /*if (datos.agnts[i].sts == "EN LLAMADA") {
            activos++;
        }

        if (datos.agnts[i].permiso === "PERSONALES" && datos.agnts[i].stsrec === "RES") {
            personales++;
        }

        if (datos.agnts[i].permiso === "ALIMENTOS" && datos.agnts[i].stsrec === "RES") {
            alimentos++;
        }

        if (datos.agnts[i].permiso === "RETROALIMENTACION" && datos.agnts[i].stsrec === "RES") {
            retro++;
        }

        if (datos.agnts[i].permiso === "CAPACITACION" && datos.agnts[i].stsrec === "RES") {
            capacitacion++;
        }

        if ((datos.agnts[i].permiso === "COMISION  " || datos.agnts[i].permiso === "COMISION JORNADA LABORAL") && datos.agnts[i].stsrec === "RES") {
            comision++;
        }*/

        var ban = false;
        for(var x = 0; x < arr_ind.length; x++)
        {
          if (datos.agnts[i].id == arr_ind[x].id) {
            ban = true
          } else {
            ban = false;
            x = arr_ind.length;
          }  
        }

        if (ban == false) {
            arr_ind.push(datos.agnts[i])   
        }
    }

     

    /*for (let l = 0; l < arr_ind.length; l++) {
        // if (arr_ind[l].sts == "EN LLAMADA")
        // {
        //     activos++
        // }
        if (arr_ind[l].sts == "DISPONIBLE") {
            disponibles++;
        }
        if (arr_ind[l].stsrec == "RES") {
            res++;
        }
        if (arr_ind[l].stsrec == "SOL") 
        {
            sol++;
        }
        if (arr_ind[l].stsrec == "SOLAUT") 
        {
            solA++;
        }
    }*/

    /*operacion = parseInt(activos) + parseInt(disponibles);
    totali = parseInt(operacion) + parseInt(res);

    $("#agTotalI").text(totali)
    $("#agOperacion").text(operacion)
    $("#agLlamada").text(activos)
    $("#agDisponibles").text(disponibles)
    $("#solAut").text(solA)
    $("#Sol").text(sol)
    $("#Res").text(res)

    $("#lenAtencion").text(activos)
    $("#lMayor").text(lMayor)
    $("#ResPer").text(personales)
    $("#ResRetro").text(retro)
    $("#ResAli").text(alimentos)
    $("#ResCap").text(capacitacion)
    $("#ResCom").text(comision)*/
    llenarGridcb(arr_cb);
});

//Indicadores de llamada
ipcRenderer.on('getConsultarMetricasResult', async(event, datos) => {
    //console.log(datos)
    if (datos.res.enivr != undefined || datos.res.enivr != null) {
        if (datos.servidor != 0)
    {
        var arregloCadena1 = [];
        var separador = ".";
        arregloCadena1 = datos.servidor.split(separador);
        if (datos.mensaje == "Success") {
        //variables primer servidor
            var ivrD = 0;
            var enesperaD = 0;
            var recibidasD = 0;
            var contestadasD = 0;
            var abandonadasD = 0;
            var poratendidasD = 0;
            var porabandonoD = 0;
        //variables segundo servidor
            if (datos.res == {}) {
                $("#lbenivr").text("0");
                $("#lbenEspera").text("0");
                $("#lblrecibidas").text("0");
                $("#lbllContestadas").text("0");
                $("#lbllAbandonadas").text("0");
                //indicadores primer servidor
                $("#lbenivr"+arregloCadena1[3]).text("0");
                $("#lbenEspera"+arregloCadena1[3]).text("0");
                $("#lblrecibidas"+arregloCadena1[3]).text("0");
                $("#lbllContestadas"+arregloCadena1[3]).text("0");
                $("#lbllAbandonadas"+arregloCadena1[3]).text("0");
            } else {
                ivrD  =  datos.res.enivr;
                enesperaD = datos.res.enespera
                recibidasD = parseInt(datos.res.abandonadas) + parseInt(datos.res.contestadas)
                contestadasD = datos.res.contestadas;
                abandonadasD = datos.res.abandonadas;
                if (datos.res.contestadas == "0") {
                    poratendidasD = "0%"
                } else {
                    poratendidasD = ((parseInt(datos.res.contestadas) / (parseInt(datos.res.abandonadas) + parseInt(datos.res.contestadas))) * 100).toFixed(1) + "%";
                }
                if (datos.res.abandonadas == "0") {
                    porabandonoD  = "0%"
                } else {
                    porabandonoD = ((parseInt(datos.res.abandonadas) / (parseInt(datos.res.abandonadas) + parseInt(datos.res.contestadas))) * 100).toFixed(1) + "%";
                } 
                $("#lbenivr"+arregloCadena1[3]).text(ivrD);
                $("#lbenEspera"+arregloCadena1[3]).text(enesperaD);
                $("#lblrecibidas"+arregloCadena1[3]).text(recibidasD);
                $("#lbllContestadas"+arregloCadena1[3]).text(contestadasD + " - " + poratendidasD);
                $("#lbllAbandonadas"+arregloCadena1[3]).text(abandonadasD + " - " + porabandonoD);
                ivr = parseInt(ivr) + parseInt(ivrD);
                enespera = parseInt(enespera) + parseInt(enesperaD);
                recibidas = parseInt(recibidas) + parseInt(recibidasD);
                contestadas = parseInt(contestadas) + parseInt(contestadasD);
                abandonadas = parseInt(abandonadas) + parseInt(abandonadasD);
                if (parseFloat(poratendidasD) == 0 || parseFloat(poratendidas) == 0) {
                    poratendidas = parseFloat(poratendidas) + parseFloat(poratendidasD);
                }
                else
                {
                    poratendidas = (parseFloat(poratendidas) + parseFloat(poratendidasD))/2;
                }
                if (parseFloat(porabandonoD) == 0 || parseFloat(porabandono) == 0) {
                    porabandono = parseFloat(porabandono) + parseFloat(porabandonoD);
                } else {
                    porabandono = (parseFloat(porabandono) + parseFloat(porabandonoD))/2;
                }
            }
        } else {
            mostrarMensaje("", "Ocurrió un error de conexión");
        }
    }
    else
    {
        for (let i = 0; i < datos.res.length; i++) {
            var arregloCadena1 = [];
            var separador = ".";
            arregloCadena1 = datos.res[i].ip.split(separador);
            if (datos.mensaje == "Success") {
            //variables primer servidor
                var ivrD = 0;
                var enesperaD = 0;
                var recibidasD = 0;
                var contestadasD = 0;
                var abandonadasD = 0;
                var poratendidasD = 0;
                var porabandonoD = 0;
            //variables segundo servidor
                if (datos.res[i] == {}) {
                    $("#lbenivr").text("0");
                    $("#lbenEspera").text("0");
                    $("#lblrecibidas").text("0");
                    $("#lbllContestadas").text("0");
                    $("#lbllAbandonadas").text("0");
                    //indicadores primer servidor
                    $("#lbenivr"+arregloCadena1[3]).text("0");
                    $("#lbenEspera"+arregloCadena1[3]).text("0");
                    $("#lblrecibidas"+arregloCadena1[3]).text("0");
                    $("#lbllContestadas"+arregloCadena1[3]).text("0");
                    $("#lbllAbandonadas"+arregloCadena1[3]).text("0");
                } else {
                    ivrD  =  datos.res[i].enivr;
                    enesperaD = datos.res[i].enespera
                    recibidasD = parseInt(datos.res[i].abandonadas) + parseInt(datos.res[i].contestadas)
                    contestadasD = datos.res[i].contestadas;
                    abandonadasD = datos.res[i].abandonadas;
                    if (datos.res[i].contestadas == "0") {
                        poratendidasD = "0%"
                    } else {
                        poratendidasD = ((parseInt(datos.res[i].contestadas) / (parseInt(datos.res[i].abandonadas) + parseInt(datos.res[i].contestadas))) * 100).toFixed(1) + "%";
                    }
                    if (datos.res[i].abandonadas == "0") {
                        porabandonoD  = "0%"
                    } else {
                        porabandonoD = ((parseInt(datos.res[i].abandonadas) / (parseInt(datos.res[i].abandonadas) + parseInt(datos.res[i].contestadas))) * 100).toFixed(1) + "%";
                    } 
                    $("#lbenivr"+arregloCadena1[3]).text(ivrD);
                    $("#lbenEspera"+arregloCadena1[3]).text(enesperaD);
                    $("#lblrecibidas"+arregloCadena1[3]).text(recibidasD);
                    $("#lbllContestadas"+arregloCadena1[3]).text(contestadasD + " - " + poratendidasD);
                    $("#lbllAbandonadas"+arregloCadena1[3]).text(abandonadasD + " - " + porabandonoD);
                    ivr = parseInt(ivr) + parseInt(ivrD);
                    enespera = parseInt(enespera) + parseInt(enesperaD);
                    recibidas = parseInt(recibidas) + parseInt(recibidasD);
                    contestadas = parseInt(contestadas) + parseInt(contestadasD);
                    abandonadas = parseInt(abandonadas) + parseInt(abandonadasD);
                    if (parseFloat(poratendidasD) == 0 || parseFloat(poratendidas) == 0) {
                        poratendidas = parseFloat(poratendidas) + parseFloat(poratendidasD);
                    }
                    else
                    {
                        poratendidas = (parseFloat(poratendidas) + parseFloat(poratendidasD))/2;
                    }
                    if (parseFloat(porabandonoD) == 0 || parseFloat(porabandono) == 0) {
                        porabandono = parseFloat(porabandono) + parseFloat(porabandonoD);
                    } else {
                        porabandono = (parseFloat(porabandono) + parseFloat(porabandonoD))/2;
                    }
                }
            } else {
                mostrarMensaje("", "Ocurrió un error de conexión");
            }            
        }
    }
    }
    total_indicadores()
});

ipcRenderer.on('getConsultarMetricasResultdos', async(event, datos) => {
});

function total_indicadores() {
    var ivrt = 0
    var enesperat = 0;
    var recibidast = 0;
    var contestadast = 0;
    var poratendidast = 0;
    var abandonadast = 0;
    var porabandonot = 0;

    for (let a = 0; a < 2; a++) {
        var arregloCadena1 = [];
        var arregloCadena2 = [];
        var arregloCadena3 = [];
        var separador = ".";
        var separador2 = " - ";
        arregloCadena1 = arrConexiones[a].split(separador);
        ivrt += parseInt($("#lbenivr"+arregloCadena1[3]).text());
        enesperat += parseInt($("#lbenEspera"+arregloCadena1[3]).text());
        recibidast += parseInt($("#lblrecibidas"+arregloCadena1[3]).text());

        arregloCadena2 = $("#lbllContestadas"+arregloCadena1[3]).text().split(separador2);
        arregloCadena3 = $("#lbllAbandonadas"+arregloCadena1[3]).text().split(separador2);
        contestadast += parseInt(arregloCadena2[0]);
        abandonadast += parseInt(arregloCadena3[0]);

        if (contestadast == "0") {
            poratendidast = "0%"
        } else {
            poratendidast = ((parseInt(contestadast) / (parseInt(abandonadast) + parseInt(contestadast))) * 100).toFixed(1) + "%";
        }
        if (abandonadast == "0") {
            porabandonot  = "0%"
        } else {
            porabandonot = ((parseInt(abandonadast) / (parseInt(abandonadast) + parseInt(contestadast))) * 100).toFixed(1) + "%";
        } 
    }
    
    $("#lbenivr").text(ivrt);
    $("#lbenEspera").text(enesperat);
    $("#lblrecibidas").text(recibidast);
    $("#lbllContestadas").text(contestadast + " - " + poratendidast);
    $("#lbllAbandonadas").text(abandonadast + " - " + porabandonot);
}

ipcRenderer.on('getIdnAgntsResult', (event, datos) => {
    //console.log(datos)
    //llenarGridIdnAgentes(datos.idnAgnts);
    if (datos.ahtI[0].AHT == "null" || datos.ahtI[0].AHT == null) {
         $("#lblaht").text("00:00:00");
    } else {
        if (datos.ahtI[0].AHT != '00:00:00') 
        {
            $("#lblaht").text(datos.ahtI[0].AHT);
        }
    }
    if (datos.ahtO[0].AHT == "null" || datos.ahtO[0].AHT == null) {
        $("#lblahtO").text("00:00:00");
    } else {
        $("#lblahtO").text(datos.ahtO[0].AHT);
    }
    var arregloCadena1 = [];
    var separador = ".";
    arregloCadena1 = datos.marcador.split(separador);
    if (datos.ahtIs[0].AHT == "null" || datos.ahtIs[0].AHT == null) {
        $("#lblaht"+arregloCadena1[3]).text("00:00:00");
    } else {
        if (datos.ahtIs[0].AHT != '00:00:00') {
            $("#lblaht"+arregloCadena1[3]).text(datos.ahtIs[0].AHT);  
        } 
    }
    // if (datos.ahtOs[0].AHT == "null" || datos.ahtOs[0].AHT == null) {
    //    $("#lblahtO"+arregloCadena1[3]).text("00:00:00");
    // } else {
    //    $("#lblahtO").text(datos.ahtOs[0].AHT);
    // }
});

//Indicadores
ipcRenderer.on('conIndicadoresResult', async(event, datos) => {
    //console.log(datos)
    
    if (datos.in == 0) 
    {
        operacion = 0; 
        activos = 0; 
        disponibles = 0; 
        solA = 0; 
        sol = 0; 
        res = 0; 
    } 
    else 
    {
        if (datos.in[0].Disponible == null || datos.in[0].Disponible == "null") {
            operacion = 0; 
            activos = 0; 
            disponibles = 0; 
            solA = 0; 
            sol = 0; 
            res = 0; 
        } else {
            operacion = datos.in[0].Operacion
            activos = datos.in[0].llamada
            disponibles = datos.in[0].Disponible
            solA = datos.in[0].solAut
            sol = datos.in[0].Sol
            res = datos.in[0].Res
        }
    }

    for (let a = 0; a < datos.out.length; a++) {
        if (datos.out[a].sts == "DISPONIBLE") 
        {
            disponibles++;
        } 
        if (datos.out[a].sts == "EN LLAMADA") 
        {
            activos++;   
        } 
        if (datos.out[a].stsrec == "RES") 
        {
            res++;
        }
        if (datos.out[a].stsrec == "SOL") 
        {
            sol++;
        }
        if (datos.out[a].stsrec == "SOLAUT") 
        {
            solA++;
        }
    }

    disponiblest = disponibles;
    activost = activos;
    solt = sol;
    rest = rest;
    solAt = solA;
});

ipcRenderer.on('indicadoresAgntResult', async(event, datos) => {
    
});

//Interacciones
ipcRenderer.on('ConsultaInteraccionesResult', async(event, datos) => {
    for (var m = 0; m < datos.Enatnmc.length; m++) {      
        //console.log(datos.Enatnmc[m].CANAL)
        $("#lbelenatn"+datos.Enatnmc[m].CANAL).text(datos.Enatnmc[m].EN_ATN)
    }
    for (var m = 0; m < datos.Enespmc.length; m++) {      
        $("#lbelenesp"+datos.Enespmc[m].CANAL).text(datos.Enespmc[m].EN_ESP)
    }
    for (var m = 0; m < datos.Atnmc.length; m++) {      
        $("#lbelatn"+datos.Atnmc[m].CANAL).text(datos.Atnmc[m].ATN)
    }
    for (var m = 0; m < datos.Abnmc.length; m++) {      
        $("#lbelabn"+datos.Abnmc[m].CANAL).text(datos.Abnmc[m].ABN)
    }
    for (var m = 0; m < datos.totalesmc.length; m++) {
        var totalint = 0;
        totalint = parseInt($("#lbelenatn"+datos.totalesmc[m].CANAL).text()) + parseInt($("#lbelenesp"+datos.totalesmc[m].CANAL).text()) +
        parseInt($("#lbelatn"+datos.totalesmc[m].CANAL).text()) + parseInt($("#lbelabn"+datos.totalesmc[m].CANAL).text()) 
        
        $("#lbelusr"+datos.totalesmc[m].CANAL).text(totalint)
        if (totalint == 0) {
            $("#lbelnvls"+datos.totalesmc[m].CANAL).text('0%')
        }
        else{
            var avg = parseInt($("#lbelatn"+datos.totalesmc[m].CANAL).text())/parseInt(totalint)*100
            //console.log(avg)
            $("#lbelnvls"+datos.totalesmc[m].CANAL).text(avg.toFixed(1)+'%')
        }
    }
});

//Indicadores outbound
ipcRenderer.on('getindicadoresOutResult', async(event, datos) => {
    if (datos.universo[0].universo == null || datos.universo[0].universo == "null") {
        $("#lbeluni").text("0")
        $("#lbelreal").text("0")
        $("#lbelsucces").text("0")
        $("#lbelnoexi").text("0")
        $("#lbelrellamar").text("0")
        $("#lbelserv").text("0%")
        $("#lbelpendiente").text("0")

    } else {
        
        var avgLlamadas = 0;
        if (datos.exitosas[0].exitosas > 0) {
            avgLlamadas = parseFloat((datos.exitosas[0].exitosas/datos.realizadas[0].realizadas)*100)
        } else {
            avgLlamadas = 0;
        }
        $("#lbeluni").text(datos.universo[0].universo)
        $("#lbelreal").text(datos.realizadas[0].realizadas)        
        $("#lblatencioncb").text(enLlamadaO)
        $("#lbelserv").text(Number.parseFloat(avgLlamadas).toFixed(2)+'%')
        $("#lbelsucces").text(datos.exitosas[0].exitosas)
        $("#lbelnoexi").text(datos.noExitosas[0].noExitosas)
        $("#lbelrellamar").text(datos.rellamar[0].rellamar)
        $("#lbelpendiente").text(datos.pendientes[0].pendientes)
    }
});

ipcRenderer.on('getindicadoresCbResult', async(event, datos) => {
    if (datos.universo[0].universo == null || datos.universo[0].universo == "null") {
        $("#lbelunicb").text("0")
        $("#lbelrealcb").text("0")
        $("#lbelsuccescb").text("0")
        $("#lbelnoexicb").text("0")
        $("#lbelrellamarcb").text("0")
        $("#lbelservcb").text("0%")
        $("#lbelpendientecb").text("0")

    } else {
        var avgLlamadas = 0;
        if (datos.exitosas[0].exitosas > 0) {
            avgLlamadas = parseFloat((datos.exitosas[0].exitosas/datos.realizadas[0].realizadas)*100)
        } else {
            avgLlamadas = 0;
        }
        $("#lbelunicb").text(datos.universo[0].universo)
        $("#lbelrealcb").text(datos.realizadas[0].realizadas)
        $("#lblatencion").text(enLlamadaCb)
        $("#lbelservcb").text(Number.parseFloat(avgLlamadas).toFixed(2)+'%')
        $("#lbelsuccescb").text(datos.exitosas[0].exitosas)
        $("#lbelnoexicb").text(datos.noExitosas[0].Noexitosas)
        $("#lbelrellamarcb").text(datos.rellamar[0].rellamar)
        $("#lbelpendientecb").text(datos.pendientes[0].pendientes)
        $("#lblahtcb").text(datos.aht[0].aht)
    }
});

//llena el select #comboPerfil con los perfiles que le corresponden al usuario
ipcRenderer.on('getUsuarioModulosResult', (event, datos) => {
    $("#comboPerfil").html("");
    usuarioOk = datos;
    $("#usuario").html(datos.CNUSERID + " - " + datos.CNUSERDSC);
    datos.AREAS.forEach(area => {
        $("#comboPerfil").append("<option value='" + area.RPFARESID + "-" + area.RPFLINEA + "'>" + area.RPFARESIDC + "</option>")
    });
    var area = {}
    area.RPFARESID = datos.AREAS[0].RPFARESID;
    area.RPFLINEA = datos.AREAS[0].RPFLINEA;
    ipcRenderer.send('getModulosArea', area)
})

//llena el select #comboModulos con los modulos que le corresponden al usuario
ipcRenderer.on('getModulosAreaResult', (event, datos) => {
    $("#comboModulos").html("");
    datos.forEach(modulo => {
        $("#comboModulos").append("<option value='" + modulo.CNESMNID + "-" + modulo.RPFLINEA + "'>" + modulo.CNESMNDSC + "</option>")
    });
    var objModulo = { CNESMNID: datos[0].CNESMNID, RPFLINEA: datos[0].RPFLINEA };
    ipcRenderer.send('getArbol', objModulo)
})

//recibe el valor del #comboModulos y lo envia al ipc/Modulos
function cambioModulo() {
    var modulo = $("#comboModulos").val().split("-");
    var objModulo = { CNESMNID: modulo[0], RPFLINEA: modulo[1] };
    ipcRenderer.send('getArbol', objModulo)
}

//
ipcRenderer.on('getArbolResult', async(event, datos) => {
    nodos = datos;
    await normalizaNodos(datos);
    await generanodosRaiz();
    await dibujarBtnsCont()
})

//llena combo de campañas
ipcRenderer.on('getAllCampanasResult', async(event, datos) => {
    var banderaInt = 0;
    var ipm;
    for (let i = 0; i < datos.conexiones.length; i++) {
        if (datos.conexiones[i] != ipm)
        {
            ipm = datos.conexiones[i];
            banderaInt++;
            arrConexiones.push(datos.conexiones[i]);
            var arregloCadena1 = [];
            var separador = ".";
            arregloCadena1 = datos.conexiones[i].split(separador);
            $('#panelmd').append("<div class='custom-control custom-checkbox col-md-1 btnav'> "+
            "<input type='checkbox' class='custom-control-input cbcontrol' onchange='indicadoresMarcadores("+arregloCadena1[3]+")' value='"+arregloCadena1[3]+"' name='checksM' id='"+arregloCadena1[3]+"Check' checked>"+
            "<label class='custom-control-label' for='"+arregloCadena1[3]+"Check' style='float: right; top: 14%; font-size: 13px'>"+arregloCadena1[3]+"</label> </div>");
        }
    }
    var tcol = 11 - banderaInt;
    $('#column1').removeClass('col-md-11');
    $('#column1').addClass('col-md-'+tcol);
    crm = datos.crm;
    
    $("#campanaComboid").html("");
    datos.in.forEach(modulo => {
        $("#campanaComboid").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
    });
});

//llena combo de estatus
ipcRenderer.on('getAllEstatusResult', async(event, datos) => {
    $("#estatusComboid").html("");
    
    datos.agente.forEach(modulo => {
        $("#estatusComboid").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
        $("#stsCombo").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
    });
    datos.receso.forEach(modulo => {
        $("#estatusResComboid").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
        $("#stsRecCombo").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
        
    });
});

//llena combo colas de espera
ipcRenderer.on('getAllColasResult', async(event, datos) => {
    $("#colasComboid").html("");
    datos.forEach(modulo => {
        $("#colasComboid").append("<option value='" + modulo.ID + "'>" + modulo.DSC + "</option>")
    });
    $("#skillComboid").append("<option value='0'>Todos</option>")
});

//recibe el valor del #comboModulos y lo envia al ipc/Modulos
function cambioPerfil() {

    var perfil = $("#comboPerfil").val().split("-");
    var objPerfil = { RPFARESID: perfil[0], RPFLINEA: perfil[1] };
    ipcRenderer.send('getModulosArea', objPerfil)
}

function normalizaNodos(nodos) {
    nodos.splice(0, 1);
    for (var i = 0; i < nodos.length; i++) {
        nodos[i].RPFLINEA = i;
        nodos[i].RPFARESID = 0;
        nodos[i].RPFARES1ID = i;
        nodos[i].RPFTPES1PADREID = getPadreNormalizado(nodos[i], nodos).RPFARES1ID;
    }
}

function getPadreNormalizado(nodo) {
    if (nodo.CNESMN03 == "") {
        var nodoTemp = new Object();
        nodoTemp.RPFLINEA = -1;
        nodoTemp.RPFARESID = 0;
        nodoTemp.RPFARES1ID = -1;
        nodoTemp.RPFTPES1PADREID = -1;
        return nodoTemp;
    }
    var j = 1;
    while (nodo["CNESMN" + rellenaCeros(j, 2)] != "") {
        j++
    }
    for (var i = 0; i < nodos.length; i++) {
        var es = true;
        for (var k = 1; k < j - 1; k++) {
            var cnesk = "CNESMN" + rellenaCeros(k, 2);
            if (nodos[i][cnesk] != nodo[cnesk]) {
                es = false;
                break;
            }
        }
        var cnesk = "CNESMN" + rellenaCeros(j - 1, 2);
        if (nodos[i][cnesk] != "") {
            es = false;
        }
        if (es == true) {
            return nodos[i];
        }
    }
}

function generanodosRaiz() {
    nodosRaiz = [];
    for (var nodo in nodos) {
        var esRaiz = true;
        for (var nodoPrueba in nodos) {
            if (nodos[nodoPrueba].RPFARES1ID == nodos[nodo].RPFTPES1PADREID &&
                nodos[nodoPrueba].RPFARESID == nodos[nodo].RPFARESID) {
                esRaiz = false;
            }
        }
        if (esRaiz == true && tieneHijos(nodos[nodo]) == true) {
            nodosRaiz.push(nodos[nodo]);
        }
    }
}

function tieneHijos(nodoPadre) {
    for (var nodo in nodos) {
        if (nodoPadre.RPFARES1ID == nodos[nodo].RPFTPES1PADREID && nodoPadre.RPFARESID == nodos[nodo].RPFARESID) {
            if (nodos[nodo].CNESMNRUDS != "" || nodos[nodo].CNESMNRUTA != "") {
                return true;
            }
        }
    }
    return false;
}

function rellenaCeros(valor, noCeros) {
    var concat = valor;
    for (; concat.toString().length < noCeros;) {
        concat = "0" + concat.toString();
    }
    return concat;
}

function dibujarBtnsCont() {

    $("#accordionModulos").html("");
    var esPrimero = true;
    nodosRaiz.forEach(nodoRaiz => {

        var show = "show";
        if (!esPrimero) {
            show = "";
        }
        $("#accordionModulos").append(
            '               <div class="card">  ' +
            '               <div class="card-header px-0" id="heading-' + nodoRaiz.RPFLINEA + '">  ' +
            '                 <h2 class="mb-0" style="text-align: left;">  ' +
            '                   <button style="color: #495057;" class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse-' + nodoRaiz.RPFLINEA + '" aria-expanded="true" aria-controls="collapse-' + nodoRaiz.RPFLINEA + '">  ' +
            nodoRaiz.CNESDSOP +
            '                   </button>  ' +
            '                 </h2>  ' +
            '               </div>  ' +
            '             ' +
            '               <div id="collapse-' + nodoRaiz.RPFLINEA + '" class="collapse ' + show + '" aria-labelledby="heading-' + nodoRaiz.RPFLINEA + '" data-parent="#accordionModulos">  ' +
            '                 <div class="card-body p-1">  ' +
            '                 </div>  ' +
            '               </div>  ' +
            '            </div>  '
        );
        esPrimero = false;
        dibujarBtns(nodoRaiz)
    })
}

function dibujarBtns(nodoSeleccionada) {

    var nodosPintar = []
    for (var nodo in nodos) {

        if (nodoSeleccionada.RPFARES1ID == nodos[nodo].RPFTPES1PADREID && nodoSeleccionada.RPFARESID == nodos[nodo].RPFARESID) {
            nodosPintar.push(nodos[nodo]);
        }
    }

    $("#collapse-" + nodoSeleccionada.RPFLINEA).find(".card-body").html("");
    nodosPintar.forEach(nodoPintar => {

        if (nodoPintar.CNESMN1ICONO == "") {
            nodoPintar.CNESMN1ICONO = "file.svg";
        }
        if (nodoPintar.CNESMN1BGCOLO == "") {
            nodoPintar.CNESMN1BGCOLO = "#EEEEF7";
        }
        if (nodoPintar.CNESMN1TEXTCOLOR == "") {
            nodoPintar.CNESMN1TEXTCOLOR = "#000";
        }
        $("#collapse-" + nodoSeleccionada.RPFLINEA).find(".card-body").append(

            "   <button title='" + nodoPintar.CNESDSOP + "' onClick='verAplicacion(" + JSON.stringify(nodoPintar) + ")' " +
            " style='border:solid #DBDBDB 1px; background-color:" + nodoPintar.CNESMN1BGCOLO + ";color: " + nodoPintar.CNESMN1TEXTCOLOR + ";font-size: 13px;text-overflow: ellipsis; white-space: nowrap; " +
            " overflow: hidden; text-align: left; outline: none;' type='button' class='btn btn-dark  btn-lg py-1 mx-0 col-12'>  " +
            "   <img src='img/iconosMenu/" + nodoPintar.CNESMN1ICONO + "' alt='Icon' class='mr-2' style='padding: 5px;height: 40px;width: 40px;'>" +
            nodoPintar.CNESDSOP +
            "   </button>  "
        )


    })

}

function cerrarVentana() {

    if ($("#divOpen").hasClass("d-flex")) {
        $("#divOpen").removeClass("d-flex")
    }
    $("#divOpen").hide();
    $("#webview").remove();
    $("#divMonitor").show();
}

function verAplicacion(nodo) {
    abrirVentana()
    $("#divOpen").html(
        '<webview id="webview" src="' + nodo.CNESMNRUDS + '/' + nodo.CNESMNOBJ + '?CNUSERID=' + usuarioOk.CNUSERID + '" style="display:inline-flex; width:100%; height:100%;"></webview>'
    );
}

function abrirVentana() {
    $("#divOpen").show()
    $("#webview").remove()
    $("#divOpen").addClass("d-flex")
    $("#divMonitor").hide();
}

function modulosToggle() {
    $("#modulosCont").toggle()
}

function cerrarSesion() {
    if (arrancar_llamadas == "SI") {
        mostrarMensaje('', "Deten la ronda de llamadas que esta en progreso para poder salir")
    } else {
        var f = new Date();
        var day = f.getDate();
        if (day < 10) {
        day = "0"+day
        }
        var month = f.getMonth() +1
        if (month < 10) {
        month = "0"+month
        }
        var year = f.getFullYear();

        var fechaHoy = year+'-'+month+'-'+day
        var hora = f.getHours();
        if (f.getHours() < 10) {
            hora = '0' + f.getHours();
        }
        var minutos = f.getMinutes();
        if (f.getMinutes() < 10) {
            minutos = '0' + f.getMinutes();
        }
        var segundos = f.getSeconds();
        if (f.getSeconds() < 10) {
            segundos = '0' + f.getSeconds();
        }
        var horaAc = hora +':'+minutos+':'+ segundos
        ipcRenderer.send('cerrarSesionSupervisor', supervisor_firma,fechaHoy,horaAc)
    }
}

ipcRenderer.on('cerrarSesionSupervisorResult', async(event, datos) => {
    ipcRenderer.send('cerrarSesion_', "")
});


//funcion para consultar al agente
function consultarAgnt() {
    var campana = $('#campanaComboid').val();
    var estatus = $('#estatusComboid').val();
    var estatusres = $('#estatusResComboid').val();
    var supervisor = $('#supervisorComboid').val();
    var col_espera = $('#colasComboid').val();
    var skill = $('#skillComboid').val();
    clearInterval(setconsulta);
    clearInterval(setconsultaM);
    setconsulta = setInterval(function() {
        //ipcRenderer.send('getConsultarMetricas', col_espera)
        consultarAgntinb(campana, col_espera, supervisor, estatus, estatusres, $('#idAgntfil').val(), $('#nombreAgntb').val())
        consultarAgntObd(campana, col_espera, supervisor, estatus, estatusres, $('#idAgntfil').val(), $('#nombreAgntb').val())
        consultarAgntM(campana, col_espera, supervisor, estatus, estatusres, $('#idAgntfil').val(), $('#nombreAgntb').val())
        llenarIndicadores(campana, col_espera, supervisor, estatus, estatusres, $('#idAgntfil').val(), $('#nombreAgntb').val());
        //consultasesion();
    }, 5000);
    setconsultaM = setInterval(function() {
        consultarMetricas(col_espera)
    }, timeInd);
}

//botones de receso funcion al dar click
function recesos(valor) {
    var user_selec = $('#usrSel').val();
    if (user_selec == "") {
        mostrarMensaje('', "Selecciona un agente");

    } else {
        ipcRenderer.send('getConsultarReceso', user_selec, valor, seleccionado_firstd)
    }
}


ipcRenderer.on('getConsultarRecesoResult', (event, datos) => {
    //socket.emit('recesosEstatus', agenteSeleccionado)
    mostrarMensajeModal(datos.valido, datos.mensaje);
})

//funcion de escucha e interviene llamada, se activa con el onclick en uno de los dos botones. 
function llamadaAcc(valor) {
    var user_selec = $('#usrSel').val();
    var extAgnt = $('#extSel').val();
    var extEscucha = $('#extensiontxtid').val();
    var enLlamada = "";
    $('#tableagentes tbody').on('click', 'tr', function() {
        enLlamada = $(this).find("td:eq(3)").text();
    });
    //if-valida si esta seleccionado un agente
    if (user_selec == "") {
        //alert('Selecciona a un agente.')
        mostrarMensaje('', "Selecciona un agente");
    } else {
        //if valida si el supervisor escribio una extension para escuchar la llamada
        if (extEscucha == "") {
            document.getElementById("extensiontxtid").focus();
            document.getElementById("extensiontxtid").title = "Escriba una extensión";
            mostrarMensajeModal('', "Escriba una extensión");
        } else {
            if (marcadorSeleccionado != "") {
                ipcRenderer.send('accionesLlamadas', extAgnt, extEscucha, valor, marcadorSeleccionado) //envia los parametros para enlazar al archivo asterisk_cli en el servidor.
            } else {
                mostrarMensajeModal('',"Error al emitir la acción");
            }
        }
    }
}

//cerrar sesion agente

function abrirSesionModal()
{
    $('#modalAgnt').modal('hide');
    $('#ModalInformacionAgentes').modal('hide');
    $('#sesionModal').modal('show');
    if (seleccionado_firstd == "I")
    {
        document.getElementById('radioInb').checked = true
    }
    else if (seleccionado_firstd == "O")
    {
        document.getElementById('radioOutb').checked = true
    }else if (seleccionado_firstd == "ME")
    {
        document.getElementById('radioMe').checked = true
    }
}

function cerrarSesionAgt() {
    var motivo;
    var agnt = $('#usrSel').val();
    if (motivo_receso == "PERSONALES") {
        motivo = "REPS"
    } else if (motivo_receso == "RETROALIMENTACION") {
        motivo = "RALI"
    } else if (motivo_receso == "ALIMENTOS") {
        motivo = "REAL"
    } else if (motivo_receso == "CAPACITACION") {
        motivo = "CPTN"
    } else if (motivo_receso == "COMISION  ") {
        motivo = "COMI"
    }
    var canals = $("input[name='radioCanal']:checked").val();
    var f = new Date();
    var day = f.getDate();
    if (day < 10) {
    day = "0"+day
    }
    var month = f.getMonth() +1
    if (month < 10) {
    month = "0"+month
    }
    var year = f.getFullYear();

    var fechaHoy = year+'-'+month+'-'+day
    var hora = f.getHours();
    if (f.getHours() < 10) {
        hora = '0' + f.getHours();
    }
    var minutos = f.getMinutes();
    if (f.getMinutes() < 10) {
        minutos = '0' + f.getMinutes();
    }
    var segundos = f.getSeconds();
    if (f.getSeconds() < 10) {
        segundos = '0' + f.getSeconds();
    }
    var horaAc = hora +':'+minutos+':'+ segundos

    //socket.emit('cerrarSesionAgente', agenteSeleccionado)
    ipcRenderer.send('cerrarSesionAgt', agnt, canals, motivo, fechaHoy, horaAc)
    //cerrarSesionAgt
}

ipcRenderer.on('cerrarSesionAgtResult', (datos) => {   
    regresarMediosEscitosAgentes();
    cerrarSesionAgntes();
    $('#sesionModal').modal('hide');
})

function regresarMediosEscitosAgentes()
{
    if (seleccionado_firstd == "ME")
    {
        seleccionado_firstd="";
        consultarInformacionAgentes('F');
    }
}

function cerrarSesionAgntes()
{
    socket.emit('cerrarSesionAgente', agenteSeleccionado)
}

//mostrar modal de configurar video
function configurarVideo() {
    var agnt = $('#usrSel').val();
    if (agnt == "") {
        mostrarMensaje('', "Selecciona un agente por favor");
    } else {
        $('#exampleModal').modal("show");
        ipcRenderer.send('getAgenteVideo', agnt, seleccionado_firstd)
        $('#modalAgnt').modal("hide");
    }
}

ipcRenderer.on('getAgenteVideoResult', async(event, datos) => {
    if (datos.length > 0)
    {
        if (datos[0].configuraGrabacion == "numLlamadas") {

            document.getElementById("RnumLlamadas").checked = true;
            $("#numLLamadas").val(datos[0].valor);
            $('#numLLamadas').prop('disabled', false);
        } else if (datos[0].configuraGrabacion == "numTiempo") {
            document.getElementById("RnumTiempo").checked = true;
            var tiempo = datos[0].valor.split(':')
            $("#Horas").val(tiempo[0]);
            $("#minutos").val(tiempo[1]);
            $("#segundos").val(tiempo[2]);
            $('#Horas').prop('disabled', false);
        $('#minutos').prop('disabled', false);
        $('#segundos').prop('disabled', false);
        } else if (datos[0].configuraGrabacion == "numDias") {
            document.getElementById("RnumDias").checked = true;
            $("#numDias").val(datos[0].valor);
            $('#numDias').prop('disabled', false);
        } else if (datos[0].configuraGrabacion == "siempre") {
            document.getElementById("Rsiempre").checked = true;
        } else if (datos[0].configuraGrabacion == "no") {
            document.getElementById("Rno").checked = true;
        }
    }
})

function limpiarVideo() {
    document.getElementById("numLLamadas").value = "0";
    document.getElementById("Horas").value = "00";
    document.getElementById("minutos").value = "00";
    document.getElementById("segundos").value = "00";
    document.getElementById("numDias").value = "0";
    document.getElementById("Rno").checked = true;
}

function guardarVideo() {
    var video = {};
    var usr = $('#usrSel').val();
    var ext = $('#extSel').val();
    if (document.getElementById("RnumLlamadas").checked == true) {
        video = { ConfiguraGrabacion: "numLlamadas", Valor: $('#numLLamadas').val() }
    } else if (document.getElementById("RnumDias").checked == true) {
        video = { ConfiguraGrabacion: "numDias", Valor: $('#numDias').val() }
    } else if (document.getElementById("RnumTiempo").checked == true) {
        video = { ConfiguraGrabacion: "numTiempo", Valor: $('#Horas').val() + ":" + $('#minutos').val() + ":" + $('#segundos').val() }
    } else if (document.getElementById("Rsiempre").checked == true) {
        video = { ConfiguraGrabacion: "siempre", Valor: '' }
    } else if (document.getElementById("Rno").checked == true) {
        video = { ConfiguraGrabacion: "no", Valor: '' }
    }

    
    ipcRenderer.send('configurarVideo', video, usr, ext, seleccionado_firstd);
    $('#exampleModal').modal("hide");
    setTimeout(() => {
        mostrarMensaje('', "Configuracion guardada");
    }, 3000);

}


function mostrarMensaje(titulo, mensaje) {
    if (mensaje == "Ocurrió un error de conexión") {
        if ($('#alert_principal').hasClass('alert-success')) {
            $('#alert_principal').removeClass('alert-success');
        }
        $('#alert_principal').addClass('alert-danger');
    } else {
        if ($('#alert_principal').hasClass('alert-danger')) {
            $('#alert_principal').removeClass('alert-danger');
        }
        $('#alert_principal').addClass('alert-success');
    }
    $('#alert_principal').text(mensaje);
    $('#alert_principal').show();
    setTimeout(() => {
        $('#alert_principal').hide(2000);
    }, 3000);
}

function mostrarMensajeModal(titulo, mensaje) {
    $('#alert_modal').text(mensaje);
    $('#alert_modal').css('display','block');
    setTimeout(() => {
        $('#alert_modal').css('display','none');
    }, 3000);
}

function llenarGrid(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } if (datos == "DISPONIBLE" || "DIS") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var servidor = function(datos, type, row) {
        var arregloCadena1 = [];
        var separador = ".";
        arregloCadena1 = row.marcador.split(separador);
        return arregloCadena1[3];
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            }else if (row.sts == "Atendido") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }
            else if (row.sts == "En espera") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "En atención") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Abandonado") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Reasignar") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "NO CONECTADO") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else  {
                return "<div style='color:#fff'>NO DISPONIBLE</div>";;
            }
        }
        return this.datos;
    };
    
    if (screen.height < 279){
        var height = (screen.height - 120);
        $('#pills-gridP-tab').text('Inb');
        $('#pills-outb-tab').text('Outb');
        $('#pills-fbms-tab').text('Fb');
        $('#pills-wht-tab').text('What');
        $('#pills-twt-tab').text('Twt');
        $('#pills-iagente-tab').text('Ind');
    }
    else if (screen.height > 500 && screen.height < 709)
    {
        var height = (screen.height - 150);
        $('#pills-gridP-tab').text('Inb');
        $('#pills-outb-tab').text('Outb');
        $('#pills-fbms-tab').text('Fb');
        $('#pills-wht-tab').text('What');
        $('#pills-twt-tab').text('Twt');
        $('#pills-iagente-tab').text('Ind');
    }
    else if (screen.height > 710 && screen.height < 999){
        var height = (screen.height - 230);
        $('#pills-gridP-tab').text('Inbound');
        $('#pills-outb-tab').text('Outbound');
        $('#pills-fbms-tab').text('Facebook');
        $('#pills-wht-tab').text('WhatsApp');
        $('#pills-twt-tab').text('Twitter');
        $('#pills-iagente-tab').text('Indicadores');
    }
    else if (screen.height > 1000){
        var height = (screen.height - 310);
        $('#pills-gridP-tab').text('Inbound');
        $('#pills-outb-tab').text('Outbound');
        $('#pills-fbms-tab').text('Facebook');
        $('#pills-wht-tab').text('WhatsApp');
        $('#pills-twt-tab').text('Twitter');
        $('#pills-iagente-tab').text('Indicadores');
    }
    
    $('#tableagentes').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": false,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": true,
        "lengthMenu": [1],
        "columns": [
            { "data": "area"},
            { "data": "sts", render: Estatus },
            { "data": "marcador", render: servidor },
            //{ "data": "src"},
            //{ "data": "src",render: editFoto},
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "Telefono" },
            { "data": "nombreCliente" },
            { "data": "idllamada" },
            { "data": "permiso" },
            { "data": "ext" },
            { "data": "marcador" },
            { "data": "id" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-center' },
            { "orderable": false, "targets": 3, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-center' },
            { "orderable": false, "targets": 8, "className": 'dt-body-right' },
            { "orderable": false, "targets": 9, "className": 'dt-body-left' },
            { "orderable": false, "targets": 10, "className": 'dt-body-right' },
            { "orderable": false, "targets": 11, "className": 'dt-body-left' },
            { "orderable": false, "targets": 12, "className": 'dt-body-right' },
            { "orderable": false, "targets": 13, "className": 'dt-body-center' },
            { "orderable": false, "targets": 14, "className": 'dt-body-left' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE" || "DIS") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[4]).css("background-color", "#269EE3");
            }
            if (datos.sts == "NO CONECTADO") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[4]).css("background-color", "#ff0303");
            }
            if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#5ec375");
                $($(row).find("td")[4]).css("background-color", "#5ec375");
            }
            if (datos.sts == "") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[4]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 510) 
            {
                $($(row).find("td")[4]).css("background-color", "#ff0303");
            }
            else
            {
                //console.log(datos.segundos);
                if(parseInt(datos.segundos) < 0)
                {
                    var durllam = parseInt(datos.segundos)*-1
                    if (durllam > 510) {
                        $($(row).find("td")[4]).css("background-color", "#ff0303");
                    }
                }
            }
            if(datos.area == "O")
            {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            }
             if(datos.area == "I")
            {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'F')
            {
                $($(row).find("td")[0]).css("background-color", "#4267b2");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'T')
            {
                $($(row).find("td")[0]).css("background-color", "#1da1f2");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'W')
            {
                $($(row).find("td")[0]).css("background-color", "#1ebea5");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'M')
            {
                $($(row).find("td")[0]).css("background-color", "#e093a0");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'CH')
            {
                $($(row).find("td")[0]).css("background-color", "#eabe3f");
                $($(row).find("td")[0]).css("color", "white");
            }

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            }  if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            }  if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });
    
}

function llenarGridOutb(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "DISPONIBLE" || "DIS") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            }else if (row.sts == "Atendido") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }
            else if (row.sts == "En espera") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "En atención") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Abandonado") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Reasignar") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "NO CONECTADO") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    if (screen.height < 500)
        var height = (screen.height - 120);
    else if (screen.height > 500 && screen.height < 709)
        var height = (screen.height - 150);
    else if (screen.height > 710 && screen.height < 999)
        var height = (screen.height - 230);
    else if (screen.height > 1000)
        var height = (screen.height - 310);
    
    $('#tableagentesoutb').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": false,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": true,
        //"lengthMenu": datos.length,
        "columns": [
            { "data": "area"},
            { "data": "sts", render: Estatus },
            //{ "data": "src"},
            //{ "data": "src",render: editFoto},
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "Telefono" },
            { "data": "nombreCliente" },
            { "data": "idllamada" },
            { "data": "permiso" },
            { "data": "ext" },
            { "data": "id" },
            { "data": "marcador" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-right' },
            { "orderable": false, "targets": 8, "className": 'dt-body-left' },
            { "orderable": false, "targets": 9, "className": 'dt-body-right' },
            { "orderable": false, "targets": 10, "className": 'dt-body-left' },
            { "orderable": false, "targets": 11, "className": 'dt-body-right' },
            { "orderable": false, "targets": 12, "className": 'dt-body-left' },
            { "orderable": false, "targets": 13, "className": 'dt-body-center' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE" || "DIS") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[3]).css("background-color", "#269EE3");
            }
            if (datos.sts == "NO CONECTADO") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[3]).css("background-color", "#ff0303");
            }
            if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#5ec375");
                $($(row).find("td")[3]).css("background-color", "#5ec375");
            }
             if (datos.sts == "") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[3]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 510) {
                $($(row).find("td")[3]).css("background-color", "#ff0303");
            }
            else
            {
                //console.log(datos.segundos);
                if(parseInt(datos.segundos) < 0)
                {
                    var durllam = parseInt(datos.segundos)*-1
                    if (durllam > 510) {
                        $($(row).find("td")[3]).css("background-color", "#ff0303");
                    }
                }
            }
            if(datos.area == "O")
            {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            }
             if(datos.area == "I")
            {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'F')
            {
                $($(row).find("td")[0]).css("background-color", "#4267b2");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'T')
            {
                $($(row).find("td")[0]).css("background-color", "#1da1f2");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'W')
            {
                $($(row).find("td")[0]).css("background-color", "#1ebea5");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'M')
            {
                $($(row).find("td")[0]).css("background-color", "#e093a0");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'CH')
            {
                $($(row).find("td")[0]).css("background-color", "#eabe3f");
                $($(row).find("td")[0]).css("color", "white");
            }

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            }  if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            }  if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });
    
}

function llenarGridcb(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "DISPONIBLE" || "DIS") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            }else if (row.sts == "Atendido") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }
            else if (row.sts == "En espera") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "En atención") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Abandonado") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Reasignar") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    if (screen.height < 500)
        var height = (screen.height - 120);
    else if (screen.height > 500 && screen.height < 709)
        var height = (screen.height - 150);
    else if (screen.height > 710 && screen.height < 999)
        var height = (screen.height - 230);
    else if (screen.height > 1000)
        var height = (screen.height - 310);
    
    $('#tableagentescb').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": false,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": true,
        //"lengthMenu": datos.length,
        "columns": [
            { "data": "area"},
            { "data": "sts", render: Estatus },
            //{ "data": "src"},
            //{ "data": "src",render: editFoto},
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "Telefono" },
            { "data": "nombreCliente" },
            { "data": "idllamada" },
            { "data": "permiso" },
            { "data": "ext" },
            { "data": "id" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-right' },
            { "orderable": false, "targets": 8, "className": 'dt-body-left' },
            { "orderable": false, "targets": 9, "className": 'dt-body-right' },
            { "orderable": false, "targets": 10, "className": 'dt-body-left' },
            { "orderable": false, "targets": 11, "className": 'dt-body-right' },
            { "orderable": false, "targets": 12, "className": 'dt-body-left' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE" || "DIS") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[3]).css("background-color", "#269EE3");
            } if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#5ec375");
                $($(row).find("td")[3]).css("background-color", "#5ec375");
            }
         if (datos.sts == "") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[3]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 510) {
                $($(row).find("td")[3]).css("background-color", "#ff0303");
            }
            else
            {
                //console.log(datos.segundos);
                if(parseInt(datos.segundos) < 0)
                {
                    var durllam = parseInt(datos.segundos)*-1
                    if (durllam > 510) {
                        $($(row).find("td")[3]).css("background-color", "#ff0303");
                    }
                }
            }
            
            $($(row).find("td")[0]).css("background-color", "#6c757d");
            $($(row).find("td")[0]).css("color", "white");
            

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            } if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            } if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });
    
}

function llenarGridIdnAgentes(datos) {

    var valor = function(datos, type, row) {
        return row.AHT +"%";
    }

    if (screen.height < 500)
        var height = (screen.height - 120);
    else if (screen.height > 500 && screen.height < 709)
        var height = (screen.height - 150);
    else if (screen.height > 710 && screen.height < 999)
        var height = (screen.height - 230);
    else if (screen.height > 1000)
        var height = (screen.height - 310);
    
    $('#tableidnagentes').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": false,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": true,
        //"lengthMenu": datos.length,
        "columns": [
            { "data": "canal"},
            { "data": "idagente"},
            { "data": "nombreagente"},
            //{ "data": "src"},
            //{ "data": "src",render: editFoto},
            { "data": "ext" },
            { "data": "llamatendidas"},
            { "data": "duracion" },
            // { "data": "conexion" },
            // { "data": "recesos" },
            // { "data": "tiemporeceso" },
            { "data": 'AHT' },
            { "data": "horaejecucion" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-left' },
            { "orderable": false, "targets": 3, "className": 'dt-body-right' },
            { "orderable": false, "targets": 4, "className": 'dt-body-right' },
            { "orderable": false, "targets": 5, "className": 'dt-body-right' },
            { "orderable": false, "targets": 6, "className": 'dt-body-right' },
            { "orderable": false, "targets": 7, "className": 'dt-body-right' },
            // { "orderable": false, "targets": 8, "className": 'dt-body-right' },
            // { "orderable": false, "targets": 9, "className": 'dt-body-right' },
            // { "orderable": false, "targets": 10, "className": 'dt-body-right' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if(datos.canal == "O")
            {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.canal == 'I')
            {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }
        }
    });
    
}

function llenarGridFacebook(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "DISPONIBLE" || "DIS") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            }else if (row.sts == "Atendido") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }
            else if (row.sts == "En espera") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "En atención") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Abandonado") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Reasignar") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    if (screen.height < 500)
        var height = (screen.height - 120);
    else if (screen.height > 500 && screen.height < 709)
        var height = (screen.height - 150);
    else if (screen.height > 710 && screen.height < 999)
        var height = (screen.height - 230);
    else if (screen.height > 1000)
        var height = (screen.height - 310);
    
    $('#tablefacebook').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": false,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": true,
        //"lengthMenu": datos.length,
        "columns": [
            { "data": "area"},
            { "data": "sts", render: Estatus },
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
            { "data": "fechaAsignacion" },
            { "data": "horaAsignacion" },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "nombreCliente" },
            { "data": "Telefono" },
            { "data": "Sesion" },
            { "data": "id" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-center' },
            { "orderable": false, "targets": 8, "className": 'dt-body-center' },
            { "orderable": false, "targets": 9, "className": 'dt-body-left' },
            { "orderable": false, "targets": 10, "className": 'dt-body-right' },
            { "orderable": false, "targets": 11, "className": 'dt-body-right' },
            { "orderable": false, "targets": 12, "className": 'dt-body-right' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE" || "DIS") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[3]).css("background-color", "#269EE3");
            } else if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#5ec375");
                $($(row).find("td")[3]).css("background-color", "#5ec375");
            }
            else if (datos.sts == "") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[3]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 510) {
                $($(row).find("td")[3]).css("background-color", "#ff0303");
            }
            else
            {
                //console.log(datos.segundos);
                if(parseInt(datos.segundos) < 0)
                {
                    var durllam = parseInt(datos.segundos)*-1
                    if (durllam > 510) {
                        $($(row).find("td")[3]).css("background-color", "#ff0303");
                    }
                }
            }
            if(datos.area == "O")
            {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if(datos.area == "I")
            {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'F')
            {
                $($(row).find("td")[0]).css("background-color", "#4267b2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'T')
            {
                $($(row).find("td")[0]).css("background-color", "#1da1f2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'W')
            {
                $($(row).find("td")[0]).css("background-color", "#1ebea5");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'M')
            {
                $($(row).find("td")[0]).css("background-color", "#e093a0");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'CH')
            {
                $($(row).find("td")[0]).css("background-color", "#eabe3f");
                $($(row).find("td")[0]).css("color", "white");
            }

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            } else if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            } else if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });
    
}

function llenarGridWhatsApp(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "DISPONIBLE" || "DIS") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            }else if (row.sts == "Atendido") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }
            else if (row.sts == "En espera") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "En atención") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Abandonado") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Reasignar") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    if (screen.height < 500)
        var height = (screen.height - 120);
    else if (screen.height > 500 && screen.height < 709)
        var height = (screen.height - 150);
    else if (screen.height > 710 && screen.height < 999)
        var height = (screen.height - 230);
    else if (screen.height > 1000)
        var height = (screen.height - 310);
    
    $('#tablewhatsapp').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": false,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": true,
        //"lengthMenu": datos.length,
        "columns": [
            { "data": "area"},
            { "data": "sts", render: Estatus },
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
            { "data": "fechaAsignacion" },
            { "data": "horaAsignacion" },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "nombreCliente" },
            { "data": "Telefono" },
            { "data": "Sesion" },
            { "data": "id" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-left' },
            { "orderable": false, "targets": 8, "className": 'dt-body-right' },
            { "orderable": false, "targets": 9, "className": 'dt-body-right' },
            { "orderable": false, "targets": 10, "className": 'dt-body-right' },
            { "orderable": false, "targets": 11, "className": 'dt-body-right' },
            { "orderable": false, "targets": 12, "className": 'dt-body-right' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE" || "DIS") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[3]).css("background-color", "#269EE3");
            } else if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#5ec375");
                $($(row).find("td")[3]).css("background-color", "#5ec375");
            }
            else if (datos.sts == "") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[3]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 510) {
                $($(row).find("td")[3]).css("background-color", "#ff0303");
            }
            else
            {
                //console.log(datos.segundos);
                if(parseInt(datos.segundos) < 0)
                {
                    var durllam = parseInt(datos.segundos)*-1
                    if (durllam > 510) {
                        $($(row).find("td")[3]).css("background-color", "#ff0303");
                    }
                }
            }
            if(datos.area == "O")
            {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if(datos.area == "I")
            {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'F')
            {
                $($(row).find("td")[0]).css("background-color", "#4267b2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'T')
            {
                $($(row).find("td")[0]).css("background-color", "#1da1f2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'W')
            {
                $($(row).find("td")[0]).css("background-color", "#1ebea5");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'M')
            {
                $($(row).find("td")[0]).css("background-color", "#e093a0");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'CH')
            {
                $($(row).find("td")[0]).css("background-color", "#eabe3f");
                $($(row).find("td")[0]).css("color", "white");
            }

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            } else if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            } else if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });
    
}

function llenarGridTwitter(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "DISPONIBLE" || "DIS") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            }else if (row.sts == "Atendido") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }
            else if (row.sts == "En espera") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "En atención") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Abandonado") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Reasignar") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    if (screen.height < 500)
        var height = (screen.height - 120);
    else if (screen.height > 500 && screen.height < 709)
        var height = (screen.height - 150);
    else if (screen.height > 710 && screen.height < 999)
        var height = (screen.height - 230);
    else if (screen.height > 1000)
        var height = (screen.height - 310);
    
    $('#tabletwt').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": false,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": true,
        //"lengthMenu": datos.length,
        "columns": [
            { "data": "area"},
            { "data": "sts", render: Estatus },
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
            { "data": "fechaAsignacion" },
            { "data": "horaAsignacion" },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "nombreCliente" },
            { "data": "Telefono" },
            { "data": "Sesion" },
            { "data": "id" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-left' },
            { "orderable": false, "targets": 8, "className": 'dt-body-right' },
            { "orderable": false, "targets": 9, "className": 'dt-body-right' },
            { "orderable": false, "targets": 10, "className": 'dt-body-right' },
            { "orderable": false, "targets": 11, "className": 'dt-body-right' },
            { "orderable": false, "targets": 12, "className": 'dt-body-right' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE" || "DIS") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[3]).css("background-color", "#269EE3");
            } else if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#5ec375");
                $($(row).find("td")[3]).css("background-color", "#5ec375");
            }
            else if (datos.sts == "") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[3]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 510) {
                $($(row).find("td")[3]).css("background-color", "#ff0303");
            }
            else
            {
                //console.log(datos.segundos);
                if(parseInt(datos.segundos) < 0)
                {
                    var durllam = parseInt(datos.segundos)*-1
                    if (durllam > 510) {
                        $($(row).find("td")[3]).css("background-color", "#ff0303");
                    }
                }
            }
            if(datos.area == "O")
            {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if(datos.area == "I")
            {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'F')
            {
                $($(row).find("td")[0]).css("background-color", "#4267b2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'T')
            {
                $($(row).find("td")[0]).css("background-color", "#1da1f2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'W')
            {
                $($(row).find("td")[0]).css("background-color", "#1ebea5");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'M')
            {
                $($(row).find("td")[0]).css("background-color", "#e093a0");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'CH')
            {
                $($(row).find("td")[0]).css("background-color", "#eabe3f");
                $($(row).find("td")[0]).css("color", "white");
            }

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            } else if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            } else if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });
    
}

function llenarGridMail(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "DISPONIBLE" || "DIS") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            }else if (row.sts == "Atendido") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }
            else if (row.sts == "En espera") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "En atención") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Abandonado") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Reasignar") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    if (screen.height < 500)
        var height = (screen.height - 120);
    else if (screen.height > 500 && screen.height < 709)
        var height = (screen.height - 150);
    else if (screen.height > 710 && screen.height < 999)
        var height = (screen.height - 230);
    else if (screen.height > 1000)
        var height = (screen.height - 310);
    
    $('#tablemail').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": false,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": true,
        //"lengthMenu": datos.length,
        "columns": [
            { "data": "area"},
            { "data": "sts", render: Estatus },
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
               { "data": "fechaAsignacion" },
            { "data": "horaAsignacion" },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "nombreCliente" },
            { "data": "Telefono" },
            { "data": "Sesion" },
            { "data": "id" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-left' },
            { "orderable": false, "targets": 8, "className": 'dt-body-right' },
            { "orderable": false, "targets": 9, "className": 'dt-body-right' },
            { "orderable": false, "targets": 10, "className": 'dt-body-right' },
            { "orderable": false, "targets": 11, "className": 'dt-body-right' },
            { "orderable": false, "targets": 12, "className": 'dt-body-right' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE" || "DIS") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[3]).css("background-color", "#269EE3");
            } else if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#5ec375");
                $($(row).find("td")[3]).css("background-color", "#5ec375");
            }
            else if (datos.sts == "") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[3]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 510) {
                $($(row).find("td")[3]).css("background-color", "#ff0303");
            }
            else
            {
                //console.log(datos.segundos);
                if(parseInt(datos.segundos) < 0)
                {
                    var durllam = parseInt(datos.segundos)*-1
                    if (durllam > 510) {
                        $($(row).find("td")[3]).css("background-color", "#ff0303");
                    }
                }
            }
            if(datos.area == "O")
            {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if(datos.area == "I")
            {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'F')
            {
                $($(row).find("td")[0]).css("background-color", "#4267b2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'T')
            {
                $($(row).find("td")[0]).css("background-color", "#1da1f2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'W')
            {
                $($(row).find("td")[0]).css("background-color", "#1ebea5");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'M')
            {
                $($(row).find("td")[0]).css("background-color", "#e093a0");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'CH')
            {
                $($(row).find("td")[0]).css("background-color", "#eabe3f");
                $($(row).find("td")[0]).css("color", "white");
            }

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            } else if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            } else if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });
    
}

function llenarGridChat(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "DISPONIBLE" || "DIS") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            }else if (row.sts == "Atendido") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }
            else if (row.sts == "En espera") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "En atención") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Abandonado") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Reasignar") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    if (screen.height < 500)
        var height = (screen.height - 120);
    else if (screen.height > 500 && screen.height < 709)
        var height = (screen.height - 150);
    else if (screen.height > 710 && screen.height < 999)
        var height = (screen.height - 230);
    else if (screen.height > 1000)
        var height = (screen.height - 310);
    
    $('#tablechat').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": false,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": true,
        //"lengthMenu": datos.length,
        "columns": [
            { "data": "area"},
            { "data": "sts", render: Estatus },
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
               { "data": "fechaAsignacion" },
            { "data": "horaAsignacion" },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "nombreCliente" },
            { "data": "Telefono" },
            { "data": "Sesion" },
            { "data": "id" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-left' },
            { "orderable": false, "targets": 8, "className": 'dt-body-right' },
            { "orderable": false, "targets": 9, "className": 'dt-body-right' },
            { "orderable": false, "targets": 10, "className": 'dt-body-right' },
            { "orderable": false, "targets": 11, "className": 'dt-body-right' },
            { "orderable": false, "targets": 12, "className": 'dt-body-right' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE" || "DIS") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[3]).css("background-color", "#269EE3");
            } else if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#5ec375");
                $($(row).find("td")[3]).css("background-color", "#5ec375");
            }
            else if (datos.sts == "") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[3]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 510) {
                $($(row).find("td")[3]).css("background-color", "#ff0303");
            }
            else
            {
                //console.log(datos.segundos);
                if(parseInt(datos.segundos) < 0)
                {
                    var durllam = parseInt(datos.segundos)*-1
                    if (durllam > 510) {
                        $($(row).find("td")[3]).css("background-color", "#ff0303");
                    }
                }
            }
            if(datos.area == "O")
            {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if(datos.area == "I")
            {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'F')
            {
                $($(row).find("td")[0]).css("background-color", "#4267b2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'T')
            {
                $($(row).find("td")[0]).css("background-color", "#1da1f2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'W')
            {
                $($(row).find("td")[0]).css("background-color", "#1ebea5");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'M')
            {
                $($(row).find("td")[0]).css("background-color", "#e093a0");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'CH')
            {
                $($(row).find("td")[0]).css("background-color", "#eabe3f");
                $($(row).find("td")[0]).css("color", "white");
            }

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            } else if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            } else if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });
    
}

function llenarGridSMS(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } else if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "DISPONIBLE" || "DIS") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } else if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            }else if (row.sts == "Atendido") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }
            else if (row.sts == "En espera") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "En atención") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Abandonado") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Reasignar") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    if (screen.height < 500)
        var height = (screen.height - 120);
    else if (screen.height > 500 && screen.height < 709)
        var height = (screen.height - 150);
    else if (screen.height > 710 && screen.height < 999)
        var height = (screen.height - 230);
    else if (screen.height > 1000)
        var height = (screen.height - 310);
    
    $('#tablesms').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": false,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": true,
        //"lengthMenu": datos.length,
        "columns": [
            { "data": "area"},
            { "data": "sts", render: Estatus },
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
            { "data": "fechaAsignacion" },
            { "data": "horaAsignacion" },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "nombreCliente" },
            { "data": "Telefono" },
            { "data": "Sesion" },
            { "data": "id" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-left' },
            { "orderable": false, "targets": 8, "className": 'dt-body-right' },
            { "orderable": false, "targets": 9, "className": 'dt-body-right' },
            { "orderable": false, "targets": 10, "className": 'dt-body-right' },
            { "orderable": false, "targets": 11, "className": 'dt-body-right' },
            { "orderable": false, "targets": 12, "className": 'dt-body-right' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE" || "DIS") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[3]).css("background-color", "#269EE3");
            } else if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#5ec375");
                $($(row).find("td")[3]).css("background-color", "#5ec375");
            }
            else if (datos.sts == "") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[3]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 510) {
                $($(row).find("td")[3]).css("background-color", "#ff0303");
            }
            else
            {
                //console.log(datos.segundos);
                if(parseInt(datos.segundos) < 0)
                {
                    var durllam = parseInt(datos.segundos)*-1
                    if (durllam > 510) {
                        $($(row).find("td")[3]).css("background-color", "#ff0303");
                    }
                }
            }
            if(datos.area == "O")
            {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if(datos.area == "I")
            {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'F')
            {
                $($(row).find("td")[0]).css("background-color", "#4267b2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'T')
            {
                $($(row).find("td")[0]).css("background-color", "#1da1f2");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'W')
            {
                $($(row).find("td")[0]).css("background-color", "#1ebea5");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'M')
            {
                $($(row).find("td")[0]).css("background-color", "#e093a0");
                $($(row).find("td")[0]).css("color", "white");
            }
            else if (datos.area == 'CH')
            {
                $($(row).find("td")[0]).css("background-color", "#eabe3f");
                $($(row).find("td")[0]).css("color", "white");
            }

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            } else if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            } else if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });
    
}

//funcion de seleccion del agente
$(document).ready(function() {
    var table = $('#tableagentes').DataTable();

    $('#tableagentes tbody').on('click', 'tr', function() {
        seleccionado_firstd = $(this).find("td:eq(0)").text();
        seleccionado_idllam = $(this).find("td:eq(10)").text();
        motivo_receso = $(this).find("td:eq(11)").text();
        agenteSeleccionado = $(this).find("td:eq(14)").text();
        marcadorSeleccionado = $(this).find("td:eq(13)").text();
        $("#marcador").val($(this).find("td:eq(13)").text());
        $("#motivoPermiso").val($(this).find("td:eq(11)").text());
        $("#cliente").val($(this).find("td:eq(9)").text());
        $("#telefono").val($(this).find("td:eq(8)").text());
        $("#idllamada").val($(this).find("td:eq(10)").text());
        document.getElementById("usrSel").value = $(this).find("td:eq(14)").text();
        document.getElementById("extSel").value = $(this).find("td:eq(12)").text();
        document.getElementById("nombreSel").value = $(this).find("td:eq(2)").text();
        $("#usragente").val($(this).find("td:eq(14)").text());
        $("#extusr").val($(this).find("td:eq(12)").text());
        $("#agente").val($(this).find("td:eq(3)").text());
        $(this).addClass('selected').siblings().removeClass('selected');
        const filterU = arr_multi.filter(function(element){
            return element.id == agenteSeleccionado;
        });
        $("#comboColasid").val(filterU[0].skill)
        var value = $(this).find('td:first').html();
        $('#modalAgnt').modal('show');
    });
});

$(document).ready(function() {
    var table = $('#tableagentesoutb').DataTable();

    $('#tableagentesoutb tbody').on('click', 'tr', function() {
        seleccionado_firstd = $(this).find("td:eq(0)").text();
        seleccionado_idllam = $(this).find("td:eq(9)").text();
        motivo_receso = $(this).find("td:eq(10)").text();
        agenteSeleccionado = $(this).find("td:eq(12)").text();
        marcadorSeleccionado = $(this).find("td:eq(13)").text();
        $("#marcador").val($(this).find("td:eq(13)").text());
        $("#motivoPermiso").val($(this).find("td:eq(10)").text());
        $("#cliente").val($(this).find("td:eq(8)").text());
        $("#telefono").val($(this).find("td:eq(7)").text());
        $("#idllamada").val($(this).find("td:eq(9)").text());
        document.getElementById("usrSel").value = $(this).find("td:eq(12)").text();
        document.getElementById("extSel").value = $(this).find("td:eq(11)").text();
        document.getElementById("nombreSel").value = $(this).find("td:eq(2)").text();
        $("#usragente").val($(this).find("td:eq(12)").text());
        $("#extusr").val($(this).find("td:eq(11)").text());
        $("#agente").val($(this).find("td:eq(2)").text());
        $(this).addClass('selected').siblings().removeClass('selected');
        const filterU = arr_multi.filter(function(element){
            return element.id == agenteSeleccionado;
        });
        var value = $(this).find('td:first').html();
        $('#modalAgnt').modal('show');
    });
});

$(document).ready(function() {
    var table = $('#tablefacebook').DataTable();
    canalrs = 'F';
    $('#tablefacebook tbody').on('click','tr',function(e)
  {
    var table = $('#tablefacebook').DataTable();
    var data = table.row(this).data();

    if (data == undefined){
        data =  $('#tablefacebook').DataTable().row( { selected: true } ).data();
    }
    if (data != undefined){ 
        seleccionado_firstd = data.area;
        agenteSeleccionado =data.id;
        $("#clienteM").val(data.nombreCliente);
        $("#telefonoM").val(data.Telefono);
        $("#idllamadaM").val(data.Sesion);
        $("#usragenteM").val(data.id);
        $("#agenteM").val(data.nom);
        canalrs = 'F';
        seleccionado_idllam = data.Sesion;
        $(this).addClass('selected').siblings().removeClass('selected');
        $('#modalAgntM').modal('show');
    }

  }); 
 
});

$(document).ready(function() {
    var table = $('#tablewhatsapp').DataTable();
    $('#tablewhatsapp tbody').on('click','tr',function(e)
  {
    var table = $('#tablewhatsapp').DataTable();
    var data = table.row(this).data();

    if (data == undefined){
        data =  $('#tablefacebook').DataTable().row( { selected: true } ).data();
    }tablewhatsapp
    if (data != undefined){ 
        seleccionado_firstd = data.area;
        agenteSeleccionado =data.id;
        $("#clienteM").val(data.nombreCliente);
        $("#telefonoM").val(data.Telefono);
        $("#idllamadaM").val(data.Sesion);
        $("#usragenteM").val(data.id);
        $("#agenteM").val(data.nom);
        canalrs = 'W';
        seleccionado_idllam = data.Sesion;
        $(this).addClass('selected').siblings().removeClass('selected');
        $('#modalAgntM').modal('show');
    }

  });  
});

$(document).ready(function() {
    var table = $('#tabletwt').DataTable();
    
    $('#tabletwt tbody').on('click','tr',function(e)
  {
    var table = $('#tabletwt').DataTable();
    var data = table.row(this).data();

    if (data == undefined){
        data =  $('#tabletwt').DataTable().row( { selected: true } ).data();
    }
    if (data != undefined){ 
        seleccionado_firstd = data.area;
        agenteSeleccionado =data.id;
        $("#clienteM").val(data.nombreCliente);
        $("#telefonoM").val(data.Telefono);
        $("#idllamadaM").val(data.Sesion);
        $("#usragenteM").val(data.id);
        $("#agenteM").val(data.nom);
        canalrs = 'T';
        seleccionado_idllam = data.Sesion;
        $(this).addClass('selected').siblings().removeClass('selected');
        $('#modalAgntM').modal('show');
    }

  });  
});

$(document).ready(function() {
    var table = $('#tablemail').DataTable();
    canalrs = 'M';
    $('#tablemail tbody').on('click','tr',function(e)
  {
    var table = $('#tablemail').DataTable();
    var data = table.row(this).data();

    if (data == undefined){
        data =  $('#tablemail').DataTable().row( { selected: true } ).data();
    }
    if (data != undefined){ 
        seleccionado_firstd = data.area;
        agenteSeleccionado =data.id;
        $("#clienteM").val(data.nombreCliente);
        $("#telefonoM").val(data.Telefono);
        $("#idllamadaM").val(data.Sesion);
        $("#usragenteM").val(data.id);
        $("#agenteM").val(data.nom);
        canalrs = 'M';
        seleccionado_idllam = data.Sesion;
        $(this).addClass('selected').siblings().removeClass('selected');
        $('#modalAgntM').modal('show');
    }

  });  
});

$(document).ready(function() {
    var table = $('#tablechat').DataTable();
    canalrs = 'CH';
    $('#tablechat tbody').on('click','tr',function(e)
  {
    var table = $('#tablechat').DataTable();
    var data = table.row(this).data();

    if (data == undefined){
        data =  $('#tablechat').DataTable().row( { selected: true } ).data();
    }
    if (data != undefined){ 
        seleccionado_firstd = data.area;
        agenteSeleccionado =data.id;
        $("#clienteM").val(data.nombreCliente);
        $("#telefonoM").val(data.Telefono);
        $("#idllamadaM").val(data.Sesion);
        $("#usragenteM").val(data.id);
        $("#agenteM").val(data.nom);
        seleccionado_idllam = data.Sesion;
        canalrs = 'CH';
        $(this).addClass('selected').siblings().removeClass('selected');
        $('#modalAgntM').modal('show');
    }

  });  
});

$(document).ready(function() {
    var table = $('#tablesms').DataTable();
    $('#tablesms tbody').on('click','tr',function(e)
  {
    var table = $('#tablesms').DataTable();
    var data = table.row(this).data();

    if (data == undefined){
        data =  $('#tablesms').DataTable().row( { selected: true } ).data();
    }
    if (data != undefined){ 
        seleccionado_firstd = data.area;
        agenteSeleccionado =data.id;
        $("#clienteM").val(data.nombreCliente);
        $("#telefonoM").val(data.Telefono);
        $("#idllamadaM").val(data.Sesion);
        $("#usragenteM").val(data.id);
        $("#agenteM").val(data.nom);
        canalrs = 'S';
        seleccionado_idllam = data.Sesion;
        $(this).addClass('selected').siblings().removeClass('selected');
        $('#modalAgntM').modal('show');
    }

  }); 
 
});

function lnzRonda_1 () 
{
    cronoval = 1;
    var campana = $('#campanaComboid').val();
    var supervisor = $('#supervisorComboid').val();
    if (campana == '') {
        mostrarMensaje('','Selecione una campaña')
    } 
    else 
    {
        if (arrancar_llamadas == "NO") 
        {
            bandera = 0;
            numeroRonda = "01";
            document.getElementById("play1").className="icon-stop2";
            document.getElementById("play1").style="color: red; font-size: 15px;";
            var play2 = document.getElementById("ronda2");
            play2.disabled = true;
            var play3 = document.getElementById("ronda3");
            play3.disabled = true;
            arrancar_llamadas = "SI"
            cronometroi = setInterval(cronometro, 10);
        } 
        else 
        {
            bandera = 1;
            numeroRonda = "01";
            document.getElementById("play1").className="icon-play3";
            document.getElementById("play1").style="color: #565656; font-size: 15px;";
            var play2 = document.getElementById("ronda2");
            play2.disabled = false;
            var play3 = document.getElementById("ronda3");
            play3.disabled = false;
            $("#lblRonda1").text("Terminada");
            arrancar_llamadas = "NO"
        } 
        ipcRenderer.send("lnzaRondaCampana", campana, arrancar_llamadas, numeroRonda, supervisor_firma);
    }  
}

function lnzRonda_2 () {
    cronoval = 2;
    var campana = $('#campanaComboid').val();
    var supervisor = $('#supervisorComboid').val();
    if (campana == '') 
    {
        mostrarMensaje('', 'Selecione una campaña')
    } 
    else 
    {
        if (arrancar_llamadas == "NO") 
        {
            bandera = 0;
            numeroRonda = "02";
            document.getElementById("play2").className="icon-stop2";
            document.getElementById("play2").style="color: red; font-size: 15px;";
            var play2 = document.getElementById("ronda1");
            play2.disabled = true;
            var play3 = document.getElementById("ronda3");
            play3.disabled = true;
            arrancar_llamadas = "SI"
            clearInterval(cronometroi);
            cronometroi = setInterval(cronometro, 10);
        } 
        else 
        {
            bandera = 1;
            numeroRonda = "02";
            document.getElementById("play2").className="icon-play3";
            document.getElementById("play2").style="color: #565656; font-size: 15px;";
            var play2 = document.getElementById("ronda1");
            play2.disabled = false;
            var play3 = document.getElementById("ronda3");
            play3.disabled = false;
            $("#lblRonda2").text("Terminada");
            arrancar_llamadas = "NO"
        }
        ipcRenderer.send("lnzaRondaCampana", campana, arrancar_llamadas, numeroRonda, supervisor_firma);
    }
}

function lnzRonda_3 () {
    cronoval = 3;
    var campana = $('#campanaComboid').val();
    if (campana == '') 
    {
        mostrarMensaje('', "Seleccione una campaña")
    } 
    else 
    {
        if (arrancar_llamadas == "NO") 
        {
            bandera = 0;
            numeroRonda = "03";
            document.getElementById("play3").className="icon-stop2";
            document.getElementById("play3").style="color: red; font-size: 15px;";
            var play2 = document.getElementById("ronda2");
            play2.disabled = true;
            var play3 = document.getElementById("ronda1");
            play3.disabled = true;
            arrancar_llamadas = "SI"
            clearInterval(cronometroi);
            cronometroi = setInterval(cronometro, 10);
        } 
        else 
        {
            bandera = 1;
            numeroRonda = "03";
            document.getElementById("play3").className="icon-play3";
            document.getElementById("play3").style="color: #565656; font-size: 15px;";
            var play2 = document.getElementById("ronda2");
            play2.disabled = false;
            var play3 = document.getElementById("ronda1");
            play3.disabled = false;
            $("#lblRonda3").text("Terminada")
            arrancar_llamadas = "NO"
        }
        ipcRenderer.send("lnzaRondaCampana", campana, arrancar_llamadas, numeroRonda, supervisor_firma);    
    }
}

function cronometro () 
{
    if (bandera == 0 )
    {
        if (centesimas < 99) 
        {
            centesimas++;
            if (centesimas < 10) 
            { 
                centesimas = "0"+centesimas 
            }
        }
        if (centesimas == 99) 
        {
            centesimas = -1;
        }
        if (centesimas == 0) 
        {
            segundos ++;
            if (segundos < 10) 
            { 
                segundos = "0"+segundos 
            }
        }
        if (segundos == 60) 
        {
            segundos = 0;
        }
        if ( (centesimas == 0)&&(segundos == 0) ) 
        {
            minutos++;
            if (minutos < 10) 
            { 
                minutos = "0"+minutos 
            }
        }
        if (minutos == 60) 
        {
            minutos = 0;
        }
        if ( (centesimas == 0)&&(segundos == 0)&&(minutos == 0) ) 
        {
            horas ++;
            if (horas < 10)
            {
                horas = "0"+horas
            }
        }
        if(segundos==0)
        {
            segundos = "00";
        }
        if(minutos==0)
        {
            minutos = "00";
        }
        if(horas==0)
        {
            horas = "00";
        }
        if (cronoval == 1) 
        {
            document.getElementById("lblRonda1").innerHTML = "Corriendo TIEMPO"+" "+minutos+":"+segundos;
        } 
        else if (cronoval == 2) 
        {
            document.getElementById("lblRonda2").innerHTML = "Corriendo TIEMPO"+" "+minutos+":"+segundos;
        }
        else if (cronoval == 3)
        {
            document.getElementById("lblRonda3").innerHTML = "Corriendo TIEMPO"+" "+minutos+":"+segundos;
        }
    }
    else
    {
        /*document.getElementById("lblcrono").innerHTML="";
        document.getElementById("lblcrono2").innerHTML="";
        document.getElementById("lblcrono3").innerHTML="";*/
        minutos = 0;
        segundos = 0;
        horas = 0;
        centesimas = 0;
    }
}

function bloquearCanal(canal) {
    if ($('#2Check').prop('checked') == true) {
        canalI = true;
        ibdA = 1;
    } 
    else
    {
        canalI = false;
        ibdA = 0;
    }
    if ($('#3Check').prop('checked') == true) {
        canalO = true;
        obdA = 1;
    }
    else
    {
        canalO = false;
        obdA = 0;
    }
    if ($('#4Check').prop('checked') == true) {
        canalC = true;
    }
    else
    {
        canalC = false;
    }
    if ($('#FCheck').prop('checked') == true || $('#TCheck').prop('checked') == true || $('#WCheck').prop('checked') == true || $('#MCheck').prop('checked') == true ||
     $('#CCheck').prop('checked') == true || $('#SCheck').prop('checked') == true) {
        canalM = true;
    }
    else
    {
        canalM = false;
    }

    if (canal == 0) {
        if ($('#gridSwitch').prop('checked')) {
            $('#divindicadores').css('display','none')
        }else{
            $('#divindicadores').css('display','block')
             
            // var arrDocumentos = $('[name="checkInd"]:checked').map(function(){
            //     return this.value;
            //   }).get();
            // if (arrDocumentos.length == 0) {
            //     document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 98%';
            // } else if (arrDocumentos.length == 1) {
            //     document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 80%';
            // } else if (arrDocumentos.length == 2) {
            //     document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 66%';   
            // } else if (arrDocumentos.length == 3) {
            //     document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 50%';
            // } else if( arrDocumentos.length >= 4){
            //     document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 98%';
            // }
        }
    } 
    else if (canal != 0 || canal != "0")
    {
        $('#indicador'+ canal).css('display','none')
        if(canal==2 && numeromarcadores==2)
        {
            $('#indicador'+ canal+'30').css('display','none');
            $('#indicador'+ canal+'34').css('display','none');
        }
        if(canal == 1 && numeromarcadores==2)
        {
            $('#indicadorM230').css('display','none');
            $('#indicadorM234').css('display','none');
        }
        $('#'+canal+'Check').prop('checked',false);
        $('#listab'+canal).css('display','block');
        $('.nav-link').removeClass('active');
        // var arrDocumentos = $('[name="checkInd"]:checked').map(function(){
        //     return this.value;
        //   }).get();
        //   var arrDocumentos = $('[name="checkInd"]:checked').map(function(){
        //     return this.value;
        //   }).get();
        // if (arrDocumentos.length == 0) {
        //     document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 98%';
        // } else if (arrDocumentos.length == 1) {
        //     if ($('#2Check').prop('checked') == true && numeromarcadores==2) {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 50%';    
        //     } else {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 80%';
        //     }
        // } else if (arrDocumentos.length == 2) {
        //     if ($('#2Check').prop('checked') == true && numeromarcadores==2) {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 98%';
        //     } else {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 66%';   
        //     }
        // } else if (arrDocumentos.length == 3) {
        //     if ($('#2Check').prop('checked') == true && numeromarcadores==2) {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 80%';
        //     } else {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 50%';
        //     }
        // } else if( arrDocumentos.length >= 4){
        //     document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 98%';
        // }
        ipcRenderer.send('insertarPreferencia', supervisor_firma, canal)
        indicadoresMarcadores('');
    }
}

ipcRenderer.on('insertarPreferenciaResult', async(event, datos) => {
    arr_pref = datos.preferencias;
    pintarPreferencias(datos.preferencias)
});

function pintarPreferencias(preferencias)
{
    if (preferencias.length == 0) {
        $('#indicador1').css('display','block')
        $('#indicador2').css('display','block')
        $('#indicador145').css('display','none');
        $('#indicador142').css('display','none');
        $('#indicador239').css('display','none');
        $('#indicador236').css('display','none');
        $('#indicador237').css('display','none');
        $('#indicador238').css('display','none');
        $('#indicador216').css('display','none');
        $('#indicador130').css('display','none');
        $('#indicadorM230').css('display','none');
        $('#indicadorM234').css('display','none');
        $('#indicadorM235').css('display','none');
        $('#indicadorM239').css('display','none');
        $('#indicadorM236').css('display','none');
        $('#indicadorM237').css('display','none');
        $('#indicadorM238').css('display','none');
        $('#indicadorM216').css('display','none');
        $('#indicadorM130').css('display','none');
        for(var i= 0; i < arrConexiones.length; i++)
        {
            var arregloCadena1 = [];
            var separador = ".";
            arregloCadena1 = arrConexiones[i].split(separador);
            $('#indicador'+ arregloCadena1[3]).css('display','block')
            $('#indicadorM'+ arregloCadena1[3]).css('display','block')
        }
        $('#indicador3').css('display','block')
        $('#indicador4').css('display','block')
        $('#indicadorF').css('display','block')
        $('#indicadorW').css('display','block')
        $('#indicadorT').css('display','block')
        $('#indicadorM').css('display','block')
        $('#indicadorC').css('display','block')
        $('#indicadorS').css('display','block')
        $('#1Check').prop('checked',true);
        $('#2Check').prop('checked',true);
        $('#3Check').prop('checked',true);
        $('#4Check').prop('checked',true);
        $('#FCheck').prop('checked',true);
        $('#WCheck').prop('checked',true);
        $('#TCheck').prop('checked',true);
        $('#MCheck').prop('checked',true);
        $('#CCheck').prop('checked',true);
        $('#SCheck').prop('checked',true);
        $('#listab2').css('display','block');
        $('#listab3').css('display','block');
        $('#listab4').css('display','block');
        $('#listabF').css('display','block');
        $('#listabW').css('display','block');
        $('#listabT').css('display','block');
        $('#listabM').css('display','block');
        $('#listabC').css('display','block');
        $('#listabS').css('display','block');
    } else {
        $('#indicador1').css('display','none')
        $('#indicador2').css('display','none')
        $('#indicador145').css('display','none');
        $('#indicador142').css('display','none');
        $('#indicador239').css('display','none');
        $('#indicador236').css('display','none');
        $('#indicador237').css('display','none');
        $('#indicador238').css('display','none');
        $('#indicador216').css('display','none');
        $('#indicador130').css('display','none');
        $('#indicadorM230').css('display','none');
        $('#indicadorM234').css('display','none');
        $('#indicadorM235').css('display','none');
        $('#indicadorM239').css('display','none');
        $('#indicadorM236').css('display','none');
        $('#indicadorM237').css('display','none');
        $('#indicadorM238').css('display','none');
        $('#indicadorM216').css('display','none');
        $('#indicadorM130').css('display','none');
        $('#indicador3').css('display','none')
        $('#indicador4').css('display','none')
        $('#indicadorF').css('display','none')
        $('#indicadorW').css('display','none')
        $('#indicadorT').css('display','none')
        $('#indicadorM').css('display','none')
        $('#indicadorC').css('display','none')
        $('#indicadorS').css('display','none')
        $('#1Check').prop('checked',false);
        $('#2Check').prop('checked',false);
        $('#3Check').prop('checked',false);
        $('#4Check').prop('checked',false);
        $('#FCheck').prop('checked',false);
        $('#WCheck').prop('checked',false);
        $('#TCheck').prop('checked',false);
        $('#MCheck').prop('checked',false);
        $('#CCheck').prop('checked',false);
        $('#SCheck').prop('checked',false);
        $('#listab2').css('display','none');
        $('#listab3').css('display','none');
        $('#listab4').css('display','none');
        $('#listabF').css('display','none');
        $('#listabW').css('display','none');
        $('#listabT').css('display','none');
        $('#listabM').css('display','none');
        $('#listabC').css('display','none');
        $('#listabS').css('display','none');

        var resta = 0;
        for (let i = 0; i < preferencias.length; i++) {
            if (i == 0) {
                if (preferencias[i].dsc == 1) {
                    resta = 1;
                }
            } 
            var tamaño = 100/(parseInt(preferencias.length) - resta);
            $('#indicador'+ preferencias[i].dsc).css('display','block')
            if(preferencias[i].dsc==2)
            {
                for(var a = 0; a >= arrConexiones.length; a++)
                {
                    var arregloCadena1 = [];
                    var separador = ".";
                    arregloCadena1 = arrConexiones[a].split(separador);
                    $('#indicador'+ arregloCadena1).css('display','block')
                }
            }
            if (preferencias[i].dsc == 1 && numeromarcadores == 2) {
                for(var x= 0; x >= arrConexiones.length; x++)
                {
                    var arregloCadena1 = [];
                    var separador = ".";
                    arregloCadena1 = arrConexiones[i].split(separador);
                    $('#indicadorM'+ arregloCadena1).css('display','block')
                }
            }
            $('#'+preferencias[i].dsc+'Check').prop('checked',true);
            $('#listab'+ preferencias[i].dsc).css('display','block');
            $('#listab'+ preferencias[i].dsc).css('width',tamaño+'%');
            
        }
        indicadoresMarcadores('')
        // var arrDocumentos = $('[name="checkInd"]:checked').map(function(){
        //     return this.value;
        //   }).get();
        //   if (arrDocumentos.length == 0) {
        //     document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 98%';
        // } else if (arrDocumentos.length == 1) {
        //     if ($('#2Check').prop('checked') == true && numeromarcadores==2) {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 50%';    
        //     } else {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 80%';
        //     }
        // } else if (arrDocumentos.length == 2) {
        //     if ($('#2Check').prop('checked') == true && numeromarcadores==2) {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 98%';
        //     } else {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 66%';   
        //     }
        // } else if (arrDocumentos.length == 3) {
        //     if ($('#2Check').prop('checked') == true && numeromarcadores==2) {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 80%';
        //     } else {
        //         document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 50%';
        //     }
        // } else if( arrDocumentos.length >= 4){
        //     document.getElementById('divgrid').style='margin-left: 1%;top:-4px; width: 98%';
        // }
 
    }
    if ($('#2Check').prop('checked') == true) {
        canalI = true;
        ibdA = 1;
    } 
    if ($('#3Check').prop('checked') == true) {
        canalO = true;
        obdA = 1;
    }
    if ($('#4Check').prop('checked') == true) {
        canalC = true;
    }
    if ($('#FCheck').prop('checked') == true || $('#TCheck').prop('checked') == true || $('#WCheck').prop('checked') == true || $('#MCheck').prop('checked') == true ||
     $('#CCheck').prop('checked') == true || $('#SCheck').prop('checked') == true) {
        canalM = true;
    }

    /*consultarAgntinb('', '', '', '', '', '')
    consultarAgntObd('', '', '', '', '', '')
    consultarAgntM('', '', '', '', '', '')*/
    return;
}

function monitoreo()
{
    
    $('#modalAgnt').modal("hide");
    $('#modalAgntM').modal("hide");
    var datos = new Object();
    datos.agente = agenteSeleccionado;
    datos.supervisor = supervisor_firma;
    datos.idllam = seleccionado_idllam;
    datos.canal = seleccionado_firstd;

    ipcRenderer.send('monitoreo', datos)
}

function habilitarInputs()
{
    if ($('#RnumLlamadas').prop('checked')) {
        $('#numLLamadas').prop('disabled', false);
        $('#Horas').prop('disabled', true);
        $('#minutos').prop('disabled', true);
        $('#segundos').prop('disabled', true);
        $('#numDias').prop('disabled', true);
    } else if ($('#RnumTiempo').prop('checked')) {
        $('#numLLamadas').prop('disabled', true);
        $('#Horas').prop('disabled', false);
        $('#minutos').prop('disabled', false);
        $('#segundos').prop('disabled', false);
        $('#numDias').prop('disabled', true);
    } else if ($('#RnumDias').prop('checked')) {
        $('#numLLamadas').prop('disabled', true);
        $('#Horas').prop('disabled', true);
        $('#minutos').prop('disabled', true);
        $('#segundos').prop('disabled', true);
        $('#numDias').prop('disabled', false);
    } else {
        $('#numLLamadas').prop('disabled', true);
        $('#Horas').prop('disabled', true);
        $('#minutos').prop('disabled', true);
        $('#segundos').prop('disabled', true);
        $('#numDias').prop('disabled', true);
    }
}

function exportarExcel()
{
    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Agentes');
    var ws2 = wb.addWorksheet('Sheet 2');

    // Create a reusable style
    var style = wb.createStyle({
    font: {
        color: '#000000',
        size: 12,
        bold: true,
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    var style2 = wb.createStyle({
        font: {
            color: '#000000',
            size: 12,
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

    ws.cell(1, 1)
    .string("Canal")
    .style(style);
    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 1)
        .string(arr_multi[i].area)
        .style(style2);    
    }

    ws.cell(1, 2)
    .string("Estatus")
    .style(style);
    
    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 2)
        .string(arr_multi[i].sts)
        .style(style2);    
    }

    ws.cell(1, 3)
    .string("Servidor")
    .style(style);
    
    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        var arregloCadena1 = [];
        var separador = ".";
        arregloCadena1 = arr_multi[i].marcador.split(separador);
        ws.cell(ini, 3)
        .string(arregloCadena1[3])
        .style(style2);    
    }

    ws.cell(1, 4)
    .string("Nombre")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 4)
        .string(arr_multi[i].nom)
        .style(style2);    
    }

    ws.cell(1, 5)
    .string("Estatus Receso")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 5)
        .string(arr_multi[i].stsrec)
        .style(style2);    
    }

    ws.cell(1, 6)
    .string("Fecha")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 6)
        .string(arr_multi[i].fecha)
        .style(style2);    
    }

    ws.cell(1, 7)
    .string("Hora")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 7)
        .string(arr_multi[i].hora)
        .style(style2);    
    }

    ws.cell(1, 8)
    .string("Duración")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 8)
        .string(arr_multi[i].duracion)
        .style(style2);    
    }

    ws.cell(1, 9)
    .string("Teléfono")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        if (arr_multi[i].telefono == null || arr_multi[i].telefono == "null") 
        {
            ws.cell(ini, 9)
            .string('')
            .style(style2);    
        }
        else
        {
            ws.cell(ini, 9)
            .string(arr_multi[i].Telefono)
            .style(style2);    
        }
    }

    ws.cell(1, 10)
    .string("Cliente")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 10)
        .string(arr_multi[i].nombreCliente)
        .style(style2);    
    }

    ws.cell(1, 11)
    .string("Id llamada")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 11)
        .string(arr_multi[i].idllamada)
        .style(style2);    
    }

    ws.cell(1, 12)
    .string("Motivo permiso")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 12)
        .string(arr_multi[i].permiso)
        .style(style2);    
    }

    ws.cell(1, 13)
    .string("Extensión")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 13)
        .string(arr_multi[i].ext)
        .style(style2);    
    }

    ws.cell(1, 14)
    .string("Marcador")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 14)
        .string(arr_multi[i].marcador)
        .style(style2);    
    }
    
    ws.cell(1, 15)
    .string("Agente")
    .style(style);

    for (var i = 0; i < arr_multi.length; i++) {
        var ini = parseInt(i)+2
        ws.cell(ini, 15)
        .string(arr_multi[i].id)
        .style(style2);    
    }
    
    var f = new Date();
    var day = f.getDate();
    if (day < 10) {
    day = "0"+day
    }
    var month = f.getMonth() +1
    if (month < 10) {
    month = "0"+month
    }
    var year = f.getFullYear();

    var fechaHoy = year+'-'+month+'-'+day
    var hora = f.getHours();
    if (f.getHours() < 10) {
        hora = '0' + f.getHours();
    }
    var minutos = f.getMinutes();
    if (f.getMinutes() < 10) {
        minutos = '0' + f.getMinutes();
    }
    var segundos = f.getSeconds();
    if (f.getSeconds() < 10) {
        segundos = '0' + f.getSeconds();
    }
    var filename = "AgentesExport_"+day+month+year+"_"+hora+minutos+segundos+'.xlsx'
    wb.write(process.env.USERPROFILE+'/Downloads/'+filename, function(err){
        if (err) {
            mostrarMensaje('','No se pudo exportar a Excel')
            //console.log(err)
        } else {
            mostrarMensaje('', 'Archivo guardado en Descargas')
        }
    });    
}

function mostrarBarra()
{
    if ($('#masid').prop('checked') == true) {
        $('#panelM').css('display','block');
    } else {
        $('#panelM').css('display','none');
    }
}

function indicadoresMarcadores(resultado)
{
    //console.log(arrConexiones)
    for(var i= 0; i < arrConexiones.length; i++)
        {
            var arregloCadena1 = [];
            var separador = ".";
            arregloCadena1 = arrConexiones[i].split(separador);
            //console.log(arregloCadena1)
            $('#indicador'+ arregloCadena1[3]).css('display','none')
            $('#indicadorM'+ arregloCadena1[3]).css('display','none')
        }
        $('#indicador1').css('display','none')
        $('#indicador2').css('display','none')

    var arrDocumentos = $('[name="checksM"]:checked').map(function(){
        return this.value;
    }).get();
    for (var i = 0; i < arrDocumentos.length; i++) {
        
        //if(arrDocumentos[i].selected ==true){              
           if (arrDocumentos[i] == 1)
           {
            if ($('#2Check').prop('checked') == true)
            {
                $('#indicador2').css('display','block')
            }
            if ($('#1Check').prop('checked') == true) {
                $('#indicador1').css('display','block')
            } 
           }
           else
           {
            //console.log(arrDocumentos[i])
            if ($('#2Check').prop('checked') == true)
            {
                $('#indicador'+arrDocumentos[i]).css('display','block')
            }
            if ($('#1Check').prop('checked') == true) {
                $('#indicadorM'+arrDocumentos[i]).css('display','block')
            } 
           }
        //}
    }
}

function llenarGridservidor(servidor)
{
    servidorF = servidor;
    var arrGridservidor = [];
    for (let i = 0; i < arr_multi.length; i++) {
        var arregloCadena1 = [];
        var separador = ".";
        arregloCadena1 = arr_multi[i].marcador.split(separador);
        if (servidor == arregloCadena1[3]) {
         arrGridservidor.push(arr_multi[i]);   
        }       
    }
    $('#divTabla').css('display','none');
    $('#loaderModal').css('display','block');
    $('#tituloGridModal').text('Agentes '+ servidor);
    $('#Modalgrid').modal('show');
    setTimeout(function(){ 
        $('#divTabla').css('display','block');
        $('#loaderModal').css('display','none');
        llenarGridModal(arrGridservidor);
    }, 10000);
}

function ConsultarGrid()
{
    $('#divTabla').css('display','none');
    $('#loaderModal').css('display','block');
    var campana = '';
    var sts = $('#stsCombo').val();
    var stsrec = $('#stsRecCombo').val();
    var supervisor = $('#supervisorComboid').val();
    var cola = '';
    ipcRenderer.send('AgentesxServidor', campana, cola, supervisor, sts, stsrec, '', '', '', '')
}

ipcRenderer.on('AgentesxServidorResult', async(event, datos) => {
    var arrGridservidor = [];
    for (let i = 0; i < datos.in.length; i++) {
        var arregloCadena1 = [];
        var separador = ".";
        arregloCadena1 = datos.in[i].marcador.split(separador);
        if (servidorF == arregloCadena1[3]) {
         arrGridservidor.push(datos.in[i]);   
        }       
    }
    for (let a = 0; a < datos.agv.length; a++) {
        var arregloCadena1 = [];
        var separador = ".";
        arregloCadena1 = datos.agv[a].marcador.split(separador);
        if (servidorF == arregloCadena1[3]) {
         arrGridservidor.push(datos.agv[a]);   
        }       
    }
    $('#divTabla').css('display','block');
    $('#loaderModal').css('display','none');
    llenarGridModal(arrGridservidor)
});

function llenarGridModal(datos) {

    var editFoto = function(datos, type, row) {
        if (type === 'display') {
            if (row.src == "") {
                //return ' <img alt="Agente" src="" class="img-circle" width="40" height="40"></img>';
            } else {
                return ' <img alt="Agente" src="data:image/bmp;base64,' + row.src + '" class="img-circle" width="40" height="40"></img>';
            }
        }
        return this.datos;
    };

    var Estatus = function(datos, type, row) {
        if (type === 'display') {
            if (row.stsrec == "SOL") {
                return "<i class='icon-user-plus' style='color:#fff; font-size: 30px;'></i>";
            } if (row.stsrec == "SOLAUT") {
                return "<i class='icon-smile' style='color:#fff; font-size: 30px;'></i>";
            } if (row.stsrec == "RES") {
                return "<i class='icon-clock' style='color:#fff; font-size: 30px;'></i>";
            } if (datos == "DISPONIBLE" || "DIS") {
                return "<i class='icon-user-check' style='color:#fff; font-size: 30px;'></i>";
            } if (datos == "EN LLAMADA") {
                return "<i class='icon-phone' style='color:#fff; font-size: 30px;'></i>";
            } {
                return "NO DISPONIBLE";
            }
        }
        return this.datos;
    };

    var servidor = function(datos, type, row) {
        var arregloCadena1 = [];
        var separador = ".";
        arregloCadena1 = row.marcador.split(separador);
        return arregloCadena1[3];
    };

    var EstatusLlam = function(datos, type, row) {
        if (type === 'display') {
            if (row.sts == "DISPONIBLE") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "EN LLAMADA") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else if (row.sts == "RECESO") {
                return "<div>" + row.sts + "</div>";
            }else if (row.sts == "Atendido") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }
            else if (row.sts == "En espera") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "En atención") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Abandonado") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            }else if (row.sts == "Reasignar") {
                return "<div style='color:#fff'>" + row.sts + "</div>";
            } else  {
                return "<div style='color:#fff'>NO DISPONIBLE</div>";;
            }
        }
        return this.datos;
    };
    
    if (screen.height < 279){
        var height = (screen.height - 120);
        $('#pills-gridP-tab').text('Inb');
        $('#pills-outb-tab').text('Outb');
        $('#pills-fbms-tab').text('Fb');
        $('#pills-wht-tab').text('What');
        $('#pills-twt-tab').text('Twt');
        $('#pills-iagente-tab').text('Ind');
    }
    else if (screen.height > 500 && screen.height < 709)
    {
        var height = (screen.height - 150);
        $('#pills-gridP-tab').text('Inb');
        $('#pills-outb-tab').text('Outb');
        $('#pills-fbms-tab').text('Fb');
        $('#pills-wht-tab').text('What');
        $('#pills-twt-tab').text('Twt');
        $('#pills-iagente-tab').text('Ind');
    }
    else if (screen.height > 710 && screen.height < 999){
        var height = (screen.height - 230);
        $('#pills-gridP-tab').text('Inbound');
        $('#pills-outb-tab').text('Outbound');
        $('#pills-fbms-tab').text('Facebook');
        $('#pills-wht-tab').text('WhatsApp');
        $('#pills-twt-tab').text('Twitter');
        $('#pills-iagente-tab').text('Indicadores');
    }
    else if (screen.height > 1000){
        var height = (screen.height - 310);
        $('#pills-gridP-tab').text('Inbound');
        $('#pills-outb-tab').text('Outbound');
        $('#pills-fbms-tab').text('Facebook');
        $('#pills-wht-tab').text('WhatsApp');
        $('#pills-twt-tab').text('Twitter');
        $('#pills-iagente-tab').text('Indicadores');
    }
    
    $('#tableModal').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": true,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": false,
        "lengthMenu": [10],
        "columns": [
            { "data": "area"},
            { "data": "sts", render: Estatus },
            { "data": "marcador", render: servidor },
            { "data": "ext" },
            { "data": "skill" },
            //{ "data": "src"},
            //{ "data": "src",render: editFoto},
            { "data": "nom" },
            { "data": "stsrec", render: EstatusLlam },
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "duracion" },
            { "data": "Telefono" },
            { "data": "nombreCliente" },
            { "data": "idllamada" },
            { "data": "supervisor" },
            { "data": "permiso" },
            { "data": "marcador" },
            { "data": "id" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-center' },
            { "orderable": false, "targets": 2, "className": 'dt-body-center' },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-left', "width": "250px" },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-center' },
            { "orderable": false, "targets": 8, "className": 'dt-body-center' },
            { "orderable": false, "targets": 9, "className": 'dt-body-center' },
            { "orderable": false, "targets": 10, "className": 'dt-body-left' },
            { "orderable": false, "targets": 11, "className": 'dt-body-right' },
            { "orderable": false, "targets": 12, "className": 'dt-body-left' },
            { "orderable": false, "targets": 13, "className": 'dt-body-right' },
            { "orderable": false, "targets": 14, "className": 'dt-body-center' },
            { "orderable": false, "targets": 15, "className": 'dt-body-left' },
            { "orderable": false, "targets": 16, "className": 'dt-body-left' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        },
        rowCallback: function(row, datos) {
            if (datos.sts == "DISPONIBLE" || "DIS") {
                $($(row).find("td")[1]).css("background-color", "#269EE3");
                $($(row).find("td")[6]).css("background-color", "#269EE3");
            }
            if (datos.sts == "EN LLAMADA") {
                $($(row).find("td")[1]).css("background-color", "#5ec375");
                $($(row).find("td")[6]).css("background-color", "#5ec375");
            }
            if (datos.sts == "") {
                $($(row).find("td")[1]).css("background-color", "#43B51F");
                $($(row).find("td")[6]).css("background-color", "#43B51F");
            }

            if (parseInt(datos.segundos) > 510) {
                $($(row).find("td")[6]).css("background-color", "#ff0303");
            }
            else
            {
                //console.log(datos.segundos);
                if(parseInt(datos.segundos) < 0)
                {
                    var durllam = parseInt(datos.segundos)*-1
                    if (durllam > 510) {
                        $($(row).find("td")[3]).css("background-color", "#ff0303");
                    }
                }
            }
            if(datos.area == "O")
            {
                $($(row).find("td")[0]).css("background-color", "black");
                $($(row).find("td")[0]).css("color", "white");
            }
             if(datos.area == "I")
            {
                $($(row).find("td")[0]).css("background-color", "#5b81a7");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'F')
            {
                $($(row).find("td")[0]).css("background-color", "#4267b2");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'T')
            {
                $($(row).find("td")[0]).css("background-color", "#1da1f2");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'W')
            {
                $($(row).find("td")[0]).css("background-color", "#1ebea5");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'M')
            {
                $($(row).find("td")[0]).css("background-color", "#e093a0");
                $($(row).find("td")[0]).css("color", "white");
            }
             if (datos.area == 'CH')
            {
                $($(row).find("td")[0]).css("background-color", "#eabe3f");
                $($(row).find("td")[0]).css("color", "white");
            }

            if (datos.stsrec == "SOL") {
                $($(row).find("td")[1]).css("background-color", "#B046B8");
            }  if (datos.stsrec == "SOLAUT") {
                $($(row).find("td")[1]).css("background-color", "#4d8855");
            }  if (datos.stsrec == "RES") {
                $($(row).find("td")[1]).css("background-color", "#FF8000");
            }
        }

    });   
}

function mostrarConversacion() {
    var params = new Object();

    params.canal = canalrs;
    params.sesion = $('#idllamadaM').val();
    
    ipcRenderer.send('conversaciones', params)   
}

function consultasesion() {
    ipcRenderer.send('consultasesion', supervisor_firma)
}

ipcRenderer.on('consultasesionResult', async(event, datos) => {
    if(datos.length == 0)
    {
        ipcRenderer.send('cerrarSesion_', "")
    }
});

function consultarInteraccionesEnEspera(canal, lcanal) {
    $('#Modalinteracciones').modal('show');
    $('#modaltituloIE').text('Interacciones '+ lcanal +' en espera')
    $('#divTablaIE').css('display','none');
    $('#loaderModalIE').css('display','block'); 
    $('#theadinteracciones').removeClass('colorTHeadF');
    $('#theadinteracciones').removeClass('colorTHeadW');
    $('#theadinteracciones').removeClass('colorTHeadT');
    $('#theadinteracciones').removeClass('colorTHeadCH');
    $('#theadinteracciones').removeClass('colorTHeadM');
    $('#theadinteracciones').removeClass('colorTHeadSMS');
    $('#theadinteracciones').addClass('colorTHead'+canal);
    ipcRenderer.send('consultarInteraccionesEnEspera', canal)
}

ipcRenderer.on('consultarInteraccionesEnEsperaResult', async(event, datos) => {
    llenarGridModalIE(datos.enespera) 
    setTimeout(function(){ 
        $('#divTablaIE').css('display','block');
        $('#loaderModalIE').css('display','none');
        llenarGridModalIE(datos.enespera) 
    }, 10000);
});


// metodo para consultar la disponibilidad de los asesores medios escritos conectados
function consultarInformacionAgentes(canal) {
    $('#idAgntme').val("");
    $('#ModalInformacionAgentes').modal('show');
    $('#modaltituloInformacionAgentes').text('Asesores medios escritos')
    $('#divTablaInformacionAgentes').css('display','none');
    $('#loaderModalInformacionAgentes').css('display','block'); 
   
    $('#theadInformacionAgentes').addClass('bg-dark');
    consultarInformacionAgentesbd(canal);
   
}

function consultarInformacionAgentesbd(canal) {    
    $('#divTablaInformacionAgentes').css('display','none');
    $('#loaderModalInformacionAgentes').css('display','block'); 
    ipcRenderer.send('consultarInformacionAgentes', canal, $('#idAgntme').val())
}


ipcRenderer.on('consultarInformacionAgentesResult', async(event, datos) => {
    $('#divTablaInformacionAgentes').css('display','block');
    $('#loaderModalInformacionAgentes').css('display','none');
    llenarGridModalInformacionAgentes(datos.informacionAgentes) ;  
     /*setTimeout(function(){ 
        $('#divTablaInformacionAgentes').css('display','block');
        $('#loaderModalInformacionAgentes').css('display','none');
        llenarGridModalInformacionAgentes(datos.informacionAgentes) 
    }, 5000);*/
});


function llenarGridModalIE(datos) {
  
    if (screen.height < 279){
        var height = (screen.height - 120);
        $('#pills-gridP-tab').text('Inb');
        $('#pills-outb-tab').text('Outb');
        $('#pills-fbms-tab').text('Fb');
        $('#pills-wht-tab').text('What');
        $('#pills-twt-tab').text('Twt');
        $('#pills-iagente-tab').text('Ind');
    }
    else if (screen.height > 500 && screen.height < 709)
    {
        var height = (screen.height - 150);
        $('#pills-gridP-tab').text('Inb');
        $('#pills-outb-tab').text('Outb');
        $('#pills-fbms-tab').text('Fb');
        $('#pills-wht-tab').text('What');
        $('#pills-twt-tab').text('Twt');
        $('#pills-iagente-tab').text('Ind');
    }
    else if (screen.height > 710 && screen.height < 999){
        var height = (screen.height - 230);
        $('#pills-gridP-tab').text('Inbound');
        $('#pills-outb-tab').text('Outbound');
        $('#pills-fbms-tab').text('Facebook');
        $('#pills-wht-tab').text('WhatsApp');
        $('#pills-twt-tab').text('Twitter');
        $('#pills-iagente-tab').text('Indicadores');
    }
    else if (screen.height > 1000){
        var height = (screen.height - 310);
        $('#pills-gridP-tab').text('Inbound');
        $('#pills-outb-tab').text('Outbound');
        $('#pills-fbms-tab').text('Facebook');
        $('#pills-wht-tab').text('WhatsApp');
        $('#pills-twt-tab').text('Twitter');
        $('#pills-iagente-tab').text('Indicadores');
    }
    
    $('#tableInteracciones').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": true,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": false,
        "scrollY": false,
        "lengthMenu": [10],
        "columns": [
            { "data": "area"},
            { "data": "nombreCliente"},
            { "data": "fecha" },
            { "data": "hora" },
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-left' },
            { "orderable": false, "targets": 2, "className": 'dt-body-center' },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' }
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        }

    });
}


function llenarGridModalInformacionAgentes(datos) {
    
    $('#tableInformacionAgentes').DataTable({
        "info": true,
        "data": datos,
        "pagingType": "simple",
        "searching": false,
        "destroy": true,
        //"responsive": {details: true},
        "responsive": true,
        "select": true,
        "paging": true,
        "autoWidth": true,
        "ordering": false,
        "lengthChange": false,
        "scrollX": true,
        "scrollY": true,
        "lengthMenu": [100],
        "deferRender": true,
        "columns": [
            { "defaultContent": "" +
                     "<button data-toggle='tooltip' data-placemen='bottom' title='Cerrar sesión'  type='button' class='cerrarSesion botones-icon btn  btn-danger active '><span class='icon-user-minus'></span></button>" 
           },
            { "data": "agente"},
            { "data": "nombre_agente"},
            { "data": "asignadas" },
            { "data": "disponibles" },
            { "data": "facebook" },
            { "data": "twitter" },
            { "data": "chat" },          
            { "data": "ocupadas" },    
            { "data": "proximossalir" },        
        ],
        "columnDefs": [
            { "orderable": false, "targets": 0, "className": 'dt-body-center' },
            { "orderable": false, "targets": 1, "className": 'dt-body-left' },
            { "orderable": false, "targets": 2, "className": 'dt-body-center' },
            { "orderable": false, "targets": 3, "className": 'dt-body-center' },
            { "orderable": false, "targets": 4, "className": 'dt-body-center' },
            { "orderable": false, "targets": 5, "className": 'dt-body-center' },
            { "orderable": false, "targets": 6, "className": 'dt-body-center' },
            { "orderable": false, "targets": 7, "className": 'dt-body-center' },
            { "orderable": false, "targets": 8, "className": 'dt-body-center' },
            { "orderable": false, "targets": 9, "className": 'dt-body-center' },
        ],

        "language": {
            select: {
                rows: ""
            },
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ning&uacute;n dato disponible en esta tabla",
            "sInfo": "   _TOTAL_ registros",
            "sInfoEmpty": "  0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }

        

        }

    });
    
    eventos_tableInformacionAgentes("#tableInformacionAgentes tbody", $('#tableInformacionAgentes').DataTable());
     
}

eventos_tableInformacionAgentes= function(tbody, table){ 
    $(tbody).on("click", "button.cerrarSesion", function(e){
        
        var data;
        data = table.row($(this).parents("tr")).data();

        if (data == undefined){
            data =  $('#tableInformacionAgentes').DataTable().row( { selected: true } ).data();
        }
        if (data != undefined){
            var d =  $('#tableInformacionAgentes').DataTable().row( { selected: true } ).data();	      
            var mensaje;
            $('#usrSel').val(data.agente);
            motivo_receso="";
            agenteSeleccionado=data.agente;
            seleccionado_firstd="ME"; 
            
            abrirSesionModal();

          /*  var dialog = bootbox.dialog({
                title: '<span style="color: black;">Aviso</span>' ,
                message: decodeURIComponent("<p>¿Esta seguro que desea cerrar la sesión?"),
                size: 'medium',
                buttons: {
                    cancel: {
                        label: "Cancelar",
                        className: 'btn-secondary',	         
                        callback: function(){
                            console.log('Custom cancel clicked'); 
                        }
                    },
                    noclose: {
                        label: "Aceptar",
                        className: 'btn-warning',
                        callback: function(){
                            data
                            cerrarSesionAgt();
                        }
                    }
                }
            }); */

                        }
        
    });
    

}


cerrarMediosEscritosInteraccion= function(){  
            seleccionado_firstd="ME"; 
            abrirSesionModal();
}

function llenarIndicadores(campana, cola, supervisor, sts, stsrec, idagnt, nombre) {
    if (canalI == true || canalO == true) {
        ipcRenderer.send('getindicadoresAgentes', campana, cola, supervisor, sts, stsrec, canalCon, canal_inicial, idagnt, nombre, ibdA, obdA)
    }
/*
    let enLlamada = 0;
    let lMayor = 0;
    enLlamadaO = 0;
    let lMayorO = 0;
    var arr_F = [];
    var arr_W = [];
    var arr_T = [];
    var arr_M = [];
    var arr_CH = [];
    var arr_SMS = [];
    var arr_cb = []
    var arr_inb = [];
    var arr_outb = [];
    arr_multi = [];
    //arr_ind = [];
    
    //230 y 234
    capacitacion = 0;
    retro = 0;
    alimentos = 0;
    personales = 0;
    comision = 0;
    operacion = 0;
    activos = 0;
    noConectado = 0;
    disponibles = 0;
    solA = 0;
    sol = 0;
    res = 0;
    totali = 0;

    arr_ind.sort(function (a, b) {
        if (a.area > b.area) {
          return 1;
        }
        if (a.area < b.area) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

    let hash = {};
    arr_ind = arr_ind.filter(o => hash[o.id] ? false : hash[o.id] = true);
    
    for (var i = 0; i < arr_ind.length; i++) {
        if (arr_ind[i].segundos > 510) {
            lMayor = lMayor + 1;
        }
        else
            {
                if(parseInt(arr_ind[i].segundos) < 0)
                {
                    var durllam = parseInt(arr_ind[i].segundos)*-1
                    if (durllam > 510) {
                        lMayor = lMayor + 1;
                    }
                }
            }
        //sacamos informacion para pintar en los indicadores
        if (arr_ind[i].sts === "EN LLAMADA") {
            activos = activos + 1;
        }
        

        if (arr_ind[i].permiso === "PERSONALES" && arr_ind[i].stsrec === "RES") {
            personales++;
        }

        if (arr_ind[i].permiso === "ALIMENTOS" && arr_ind[i].stsrec === "RES") {
            alimentos++;
        }

        if (arr_ind[i].permiso === "RETROALIMENTACION" && arr_ind[i].stsrec === "RES") {
            retro++;
        }
        
        if (arr_ind[i].permiso === "CAPACITACION" && arr_ind[i].stsrec === "RES") {
            capacitacion++;
            
        }

        if ((arr_ind[i].permiso === "COMISION  " || arr_ind[i].permiso === "COMISION JORNADA LABORAL") && arr_ind[i].stsrec === "RES") {
            comision++;
        }
    }

    for (let l = 0; l < arr_ind.length; l++) {
        // if (arr_ind[l].sts == "EN LLAMADA")
        // {
        //     activos++
        // }
        if (arr_ind[l].sts == "DISPONIBLE") {
            disponibles++;
        }
        //if (arr_ind[l].sts == "NO CONECTADO") {
         //   noConectado++;
        //}
        if (arr_ind[l].stsrec == "RES") {
            res++;
        }
        if (arr_ind[l].stsrec == "SOL") 
        {
            sol++;
        }
        if (arr_ind[l].stsrec == "SOLAUT") 
        {
            solA++;
        } 
    }

    for (let x = 0; x < arrConexiones.length; x++) {
        var disponiblesD = 0;
        var resD = 0;
        var solD = 0;
        var solAD = 0;

        var activosD = 0;
        var noConectadoD = 0;
        var personalesD = 0;
        var alimentosD = 0;
        var retroD = 0;
        var capacitacionD = 0;
        var comisionD = 0;
        var lMayorD = 0;

        for (var i = 0; i < arr_ind.length; i++) {            
            if (arr_ind[i].marcador == arrConexiones[x]) {
                if (arr_ind[i].sts === "EN LLAMADA") {
                    activosD++;
                }
        
                if (arr_ind[i].permiso === "PERSONALES" && arr_ind[i].stsrec === "RES") {
                    personalesD++;
                }
        
                if (arr_ind[i].permiso === "ALIMENTOS" && arr_ind[i].stsrec === "RES") {
                    alimentosD++;
                }
        
                if (arr_ind[i].permiso === "RETROALIMENTACION" && arr_ind[i].stsrec === "RES") {
                    retroD++;
                }
                
                if (arr_ind[i].permiso === "CAPACITACION" && arr_ind[i].stsrec === "RES") {
                    capacitacionD++;
                    
                }
        
                if ((arr_ind[i].permiso === "COMISION  " || arr_ind[i].permiso === "COMISION JORNADA LABORAL") && arr_ind[i].stsrec === "RES") {
                    comisionD++;
                }
                if (arr_ind[i].segundos > 510) {
                    lMayorD = lMayorD + 1;
                }
                else
                {
                    if(parseInt(arr_ind[i].segundos) < 0)
                    {
                        var durllam = parseInt(arr_ind[i].segundos)*-1
                        if (durllam > 510) {
                            lMayorD = lMayorD + 1;
                        }
                    }
                }
            }

        }
        for (let l = 0; l < arr_ind.length; l++) {
            if (arr_ind[l].marcador == arrConexiones[x]) {
                if (arr_ind[l].sts == "DISPONIBLE") {
                    disponiblesD++;
                }
                //if (arr_ind[l].sts == "NO CONECTADO") {
                  //  noConectadoD++;
                //}
                if (arr_ind[l].stsrec == "RES") {
                    resD++;
                }
                if (arr_ind[l].stsrec == "SOL") 
                {
                    solD++;
                }
                if (arr_ind[l].stsrec == "SOLAUT") 
                {
                    solAD++;
                }
            }
        }
        var operacionD = parseInt(activosD) + parseInt(disponiblesD) + parseInt(noConectadoD);
        var totaliD = parseInt(operacionD) + parseInt(resD);

        var arregloCadena1 = [];
        var separador = ".";
        arregloCadena1 = arrConexiones[x].split(separador);
        $("#agTotalI"+arregloCadena1[3]).text(totaliD)
        //$("#agNoConectado"+arregloCadena1[3]).text(noConectadoD)
        $("#agOperacion"+arregloCadena1[3]).text(operacionD)
        $("#agLlamada"+arregloCadena1[3]).text(activosD)
        $("#agDisponibles"+arregloCadena1[3]).text(disponiblesD)
        $("#solAut"+arregloCadena1[3]).text(solAD)
        $("#Sol"+arregloCadena1[3]).text(solD)
        $("#Res"+arregloCadena1[3]).text(resD)

        $("#lenAtencion"+arregloCadena1[3]).text(activosD)
        $("#ResPer"+arregloCadena1[3]).text(personalesD)
        $("#ResRetro"+arregloCadena1[3]).text(retroD)
        $("#ResAli"+arregloCadena1[3]).text(alimentosD)
        $("#ResCap"+arregloCadena1[3]).text(capacitacionD)
        $("#ResCom"+arregloCadena1[3]).text(comisionD)
        $("#lMayor"+arregloCadena1[3]).text(lMayorD)
    }

    operacion = parseInt(activos) + parseInt(disponibles) + parseInt(noConectado);
    totali = parseInt(operacion) + parseInt(res);

    $("#agTotalI").text(totali)
    //$("#agNoConectado").text(noConectado)
    $("#agOperacion").text(operacion)
    $("#agLlamada").text(activos)
    $("#agDisponibles").text(disponibles)
    $("#solAut").text(solA)
    $("#Sol").text(sol)
    $("#Res").text(res)

    $("#lenAtencion").text(activos)
    $("#lMayor").text(lMayor)
    $("#ResPer").text(personales)
    $("#ResRetro").text(retro)
    $("#ResAli").text(alimentos)
    $("#ResCap").text(capacitacion)
    $("#ResCom").text(comision)
    arr_ind = []
    arr_multi = []*/
}

ipcRenderer.on('getindicadoresAgentesResult',  async(event, dato) => {
    console.log(dato);
    var arregloCadena1 = [];
    var separador = ".";
    for (let i = 0; i < arrConexiones.length; i++) {
        arregloCadena1 = arrConexiones[i].split(separador);
        $("#agTotalI"+arregloCadena1[3]).text('0')
        //$("#agNoConectado"+arregloCadena1[3]).text('0')
        $("#agOperacion"+arregloCadena1[3]).text('0')
        $("#agLlamada"+arregloCadena1[3]).text('0')
        $("#agDisponibles"+arregloCadena1[3]).text('0')
        $("#solAut"+arregloCadena1[3]).text('0')
        $("#Sol"+arregloCadena1[3]).text('0')
        $("#Res"+arregloCadena1[3]).text('0')

        $("#lenAtencion"+arregloCadena1[3]).text('0')
        $("#ResPer"+arregloCadena1[3]).text('0')
        $("#ResRetro"+arregloCadena1[3]).text('0')
        $("#ResAli"+arregloCadena1[3]).text('0')
        $("#ResCap"+arregloCadena1[3]).text('0')
        $("#ResCom"+arregloCadena1[3]).text('0')
        $("#lMayor"+arregloCadena1[3]).text('0') 
    }
    for (let x = 0; x < dato.detalle.length; x++) {
            arregloCadena1 = dato.detalle[x].marcador.split(separador);
            $("#agTotalI"+arregloCadena1[3]).text(dato.detalle[x].tot)
            //$("#agNoConectado"+arregloCadena1[3]).text(dato.detalle[x].noConectadoD)
            $("#agOperacion"+arregloCadena1[3]).text(dato.detalle[x].op)
            $("#agLlamada"+arregloCadena1[3]).text(dato.detalle[x].ac)
            $("#agDisponibles"+arregloCadena1[3]).text(dato.detalle[x].dis)
            $("#solAut"+arregloCadena1[3]).text(dato.detalle[x].solA)
            $("#Sol"+arregloCadena1[3]).text(dato.detalle[x].sol)
            $("#Res"+arregloCadena1[3]).text(dato.detalle[x].res)
    
            $("#lenAtencion"+arregloCadena1[3]).text(dato.detalle[x].ac)
            $("#ResPer"+arregloCadena1[3]).text(dato.detalle[x].per)
            $("#ResRetro"+arregloCadena1[3]).text(dato.detalle[x].retro)
            $("#ResAli"+arregloCadena1[3]).text(dato.detalle[x].alimentos)
            $("#ResCap"+arregloCadena1[3]).text(dato.detalle[x].cptn)
            $("#ResCom"+arregloCadena1[3]).text(dato.detalle[x].com)
            $("#lMayor"+arregloCadena1[3]).text(dato.detalle[x].mayor)           
    }

    $("#agTotalI").text('0')
    $("#agTotalI").text(dato.total[0].tot)
    //$("#agNoConectado").text('0')
    //$("#agNoConectado").text(dato.total[0].noConectado)
    $("#agOperacion").text('0')
    $("#agOperacion").text(dato.total[0].op)
    $("#agLlamada").text('0')
    $("#agLlamada").text(dato.total[0].ac)
    $("#agDisponibles").text('0')
    $("#agDisponibles").text(dato.total[0].dis)
    $("#solAut").text('0')
    $("#solAut").text(dato.total[0].solA)
    $("#Sol").text('0')
    $("#Sol").text(dato.total[0].sol)
    $("#Res").text('0')
    $("#Res").text(dato.total[0].res)

    $("#lenAtencion").text('0')
    $("#lenAtencion").text(dato.total[0].ac)
    $("#lMayor").text('0')
    $("#lMayor").text(dato.total[0].mayor)
    $("#ResPer").text('0')
    $("#ResPer").text(dato.total[0].per)
    $("#ResRetro").text('0')
    $("#ResRetro").text(dato.total[0].retro)
    $("#ResAli").text('0')
    $("#ResAli").text(dato.total[0].ali)
    $("#ResCap").text('0')
    $("#ResCap").text(dato.total[0].cptn)
    $("#ResCom").text('0')
    $("#ResCom").text(dato.total[0].com)

  })
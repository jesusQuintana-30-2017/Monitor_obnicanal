const { ipcRenderer } = require('electron');
const open = require('opn');

const $ = require('jquery');
require('popper.js');
require('bootstrap');

var versionA = '';
var versionN = '';
var url = '';
var bandera = true;



// lee el valor del campo usuario en el log in y lo busca en la base de datos
function consultarNombre() {

    if ($("#inputUsuario").val() != "") {

        $(".loader").show()
        $(".alert").remove();
        ipcRenderer.send('consultarNombre', $("#inputUsuario").val()) //envia la orden para realizar la consulta pasa el valor del input usuario como parametro
        $("#nombreUsuario").html("")

    }


}

//se cacha el resultado obtenido de la consulta en la base de datos 
ipcRenderer.on('consultarNombreResult', (event, usuario) => {


    if (usuario != null) {

        $("#nombreUsuario").html(usuario.SSUSRDSC) //retorna el tipo de usuario (maestro, agente, etc...) y lo imprime en la vista del login

    } else {

        $(".alert").remove();
        $("#inputUsuario").before(

            '<div class="alert alert-danger" role="alert" style="background: transparent; border: none;">' +
            'Usuario no encontrado' +
            '</div>'

        );
    }
    $(".loader").hide()


})

function cancelar() {

    ipcRenderer.send('cerrarVentana', "")

}
//valida las credenciales del usuario
function login() {
    ipcRenderer.send('geturls');
    // var usr = $("#inputUsuario").val();
    // if (usr.trim() != '') {
    //     ipcRenderer.send('consultasesion', usr);    
    // }
}

ipcRenderer.on('consultasesionResult', (event, datos) => {
    if (datos.length == 0) 
    {
        ipcRenderer.send('geturls');
    }
    else
    {
        $("#modalSesion").modal({ backdrop: 'static', keyboard: false}, 'show' );
    }
})

function cerrarSesiones(){
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
        var usr = $("#inputUsuario").val();
        $(".loader").show()
        $("#btnLogin").hide()
        ipcRenderer.send('cerrarSesionSupervisor', usr,fechaHoy,horaAc)
}

ipcRenderer.on('cerrarSesionSupervisorResult', async(event, datos) => {
    $("#modalSesion").modal( 'hide' );
    setTimeout(function(){ 
        $(".loader").hide()
        $("#btnLogin").show()
    }, 5000);
});


ipcRenderer.on('geturlsresult', (event, urls) => {
    let datos = {};
    datos.usuarioid = $("#inputUsuario").val();
    datos.pssw = $("#inputContrasena").val();
    datos.url = urls.login;
    if (datos.usuarioid != "") {
        $(".loader").show()
        $("#btnLogin").hide()
        ipcRenderer.send('validarUsuario', datos)
    }
})


var inputcontra = document.getElementById("inputContrasena");
inputcontra.addEventListener("keyup", function(event) {
    if (event.keyCode == 13 && bandera == true) {
        event.preventDefault();
        login();
    }
})

//envia la instruccion de abrir la pantalla de configuracion
function abrirConf() {
    ipcRenderer.send('abrirPantallaConf', "");
}

function abrirConfMarcador() {
    ipcRenderer.send('abrirConfMarcador', "");
}



//cacha el resultado de si las credenciales del usuario son validas 
ipcRenderer.on('validarUsuarioResult', (event, datos) => {

    if (datos.valido) {
        /*
        $(".alert").remove();
        $("#textoInicio").after(

          '<div class="alert alert-primary" role="alert">'+
          datos.mensaje +
          '</div>'

        );
        */
        let datos = {};
        console.log(datos);
        datos.usuarioid = $("#inputUsuario").val();
        datos.pssw = $("#inputContrasena").val();
        ipcRenderer.send('setUsuario', datos)


    } else {

        $(".alert").remove();
        $("#inputUsuario").before(

            '<div class="alert alert-danger" role="alert" style="background: transparent; border: none;">' +
            datos.mensaje +
            '</div>'

        );
        $(".loader").hide()
        $("#btnLogin").show()

    }

})

ipcRenderer.send('getVersion', "")

ipcRenderer.on('getVersionResult',  async(event, vers) => {
    versionA = vers;
    $("#version").html("Versión " + vers)
})

ipcRenderer.send('consultaVersion', '');
ipcRenderer.send('limpiarCache', '');

ipcRenderer.on('consultaVersionResult', (event, datos) => {
    if (datos.version[0].valor != versionA) {
        $("#versionlbl").html(datos.version[0].valor);
        $("#modalVersion").modal({ backdrop: 'static', keyboard: false}, 'show' );
        $("#btnLogin").hide()
        console.log(datos)
        versionN = datos.version[0].valor;
        url = datos.version[1].valor;
        bandera = false;
    }   
})

function descargarVersion() {
    $("#mensajeV").css('display', 'none');
    $("#loader").css('display', 'block');
    setTimeout(function(){ 
        var valido = fileExists(url)
        if (valido != false) {           
            $("#loader").css('display', 'none');
            $("#modalVersion").modal('hide');
            //$("#modalVersion").modal({ backdrop: 'static', keyboard: false}, 'show' );
            //window.open(url);
            open('https://www.google.com/')
            open(url);
        }
        else
        {
            $("#mensajeV").html('');
            $("#mensajeV").html('No se encontró el archivo de descarga, favor de comunicarse con el area de soporte');
            $("#loader").css('display', 'none');
            $("#mensajeV").css('display', 'block');
        }
    }, 1000);
}

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}
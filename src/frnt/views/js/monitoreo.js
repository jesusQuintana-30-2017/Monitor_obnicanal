const { ipcRenderer } = require('electron');
const $ = require('jquery');
require('popper.js');
require('bootstrap');
require('datatables.net-dt')();
require('datatables.net-responsive-dt')();

ipcRenderer.send('getParams', '')

function onLoad() {
    
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


ipcRenderer.on('getParamsResult', (event, datos) => {
    ipcRenderer.send('getUrl', datos)
})

ipcRenderer.on('getUrlResult', (event, url) => {
    if (url == 0) {
        mostrarMensaje('', 'No se encontro id de interaccion');
    } else {
        var frame = $('#srcMonitoreo'); 
        frame.attr('src',url).show();
    }
})
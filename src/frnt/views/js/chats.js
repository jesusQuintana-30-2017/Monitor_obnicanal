const { ipcRenderer } = require('electron');
const $ = require('jquery');
require('popper.js');
require('bootstrap');
require('datatables.net-dt')();
require('datatables.net-responsive-dt')();

ipcRenderer.send('getParamsC', '')

function onLoad() {
    
}

ipcRenderer.on('getParamsCResult', (event, datos) => {
    var frame = $('#srchats'); 
    var url = "https://c3.crmspartacus.com:2031/mensajes?canal="+datos.canal+"&sesion="+datos.sesion
    console.log(url)
    frame.attr('src',url).show();
})

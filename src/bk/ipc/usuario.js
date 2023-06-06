const { ipcMain} = require('electron');

const helper = require('../helpers/usuario');

ipcMain.on('CerrarSesion', async(event, idAgente) => {
  const obj = await helper.CerrarSesion(idAgente); 
  event.reply("CerrarSesionResult", obj);
});

ipcMain.on('consultaVersion', async(event, idAgente) => {
  const obj = await helper.consultaVersion(); 
  event.reply("consultaVersionResult", obj);
});
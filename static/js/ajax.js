const { ipcRenderer } = require('electron');

ipcRenderer.send('request-mainprocess-action');

ipcRenderer.on('mainprocess-response', (event, arg) => {
    console.log(arg);
});
var $ = jQuery = require("./jquery-2.1.4.min.js");

const Electron = require('electron');
const ipcRenderer = Electron.ipcRenderer;

$(function () {
    ipcRenderer.on('tw', function(event, arg) {
        var txtElem = $('#tw');
        var txt = txtElem.val();
        event.sender.send('rep', txt);
        txtElem.val("");
    });
});

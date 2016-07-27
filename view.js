var $ = jQuery = require("./jquery-2.1.4.min.js");

const Electron = require('electron');
const ipcRenderer = Electron.ipcRenderer;

const KeyCodeEnter = 13;

$(document).on('keydown', '#tw', function(event) {
    if (event.ctrlKey && event.keyCode === KeyCodeEnter) {
        var txtElem = $('#tw');
        var txt = txtElem.val();
        ipcRenderer.send('rep', txt);
        txtElem.val("");
        return false;
    }
});

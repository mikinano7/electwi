var $ = jQuery = require("./jquery-2.1.4.min.js");

const Electron = require('electron');
const ipcRenderer = Electron.ipcRenderer;

const KeyCodeEnter = 13;
const KeyCodeF1 = 112;

$(document).on('keydown', '#tw', function(event) {
    if (event.ctrlKey && event.keyCode === KeyCodeEnter) {
        var txtElem = $('#tw');
        var txt = txtElem.val();
        ipcRenderer.send('post', txt);
        txtElem.val("");
        return false;
    }
});

$(document).on('keydown', 'body', function(event) {
    if (event.keyCode === KeyCodeF1) {
        ipcRenderer.send('timeline', '');
        return false;
    }
});

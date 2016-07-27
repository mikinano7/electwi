var $ = jQuery = require("./jquery-2.1.4.min.js");

const Electron = require('electron');
const ipcRenderer = Electron.ipcRenderer;

$(function() {
    ipcRenderer.on('tweet', function(event, arg) {
        var response = JSON.parse(arg);
        var tlElement = $('#timeline');
        tlElement.prepend('<p>'+response.text+'</p>');
    });
});

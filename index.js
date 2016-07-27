'use strict';

const Electron = require('electron');
const {app, BrowserWindow, ipcMain} = Electron;
const Config = require('config');
const Twitter = require('twitter');

const client = new Twitter({
    consumer_key: Config.consumer_key,
    consumer_secret: Config.consumer_secret,
    access_token_key: Config.access_token_key,
    access_token_secret: Config.access_token_secret
});

let win;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

app.on('ready', function() {
    win = new BrowserWindow({
        width: 160,
        height: 120,
        frame: false,
        resizable: false,
        transparent: true
    });
    win.setAlwaysOnTop(true);
    win.loadURL('file://' + __dirname + '/index.html');

    win.on('closed', function() {
        win = null;
    });

    ipcMain.on('rep', function(event, arg) {
        client.post('statuses/update', {status: arg}, function(error, tweet, response){
            if (error) console.log(error);
        });
    });
});

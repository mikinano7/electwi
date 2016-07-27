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
const tlClient = client;

let win;
let tlWin;

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

    ipcMain.on('post', function(event, arg) {
        client.post('statuses/update', {status: arg}, function(error, tweet, response){
            if (error) console.log(error);
        });
    });

    ipcMain.on('timeline', function(event, arg) {
        tlWin = new BrowserWindow({
            width: 500,
            height: 300,
            frame: false,
            resizable: false,
            transparent: false
        });
        tlWin.setAlwaysOnTop(true);
        tlWin.loadURL('file://' + __dirname + '/timeline.html');

        var streamObj = null;
        tlWin.on('closed', function() {
            streamObj.destroy();
            tlWin = null;
        });

        tlClient.stream('user', null, function(stream) {
            stream.on('data', function(data) {
                streamObj = stream;
                if (data.text !== undefined) {
                    tlWin.webContents.send('tweet', JSON.stringify(data));
                }
            });
        });
    });
});

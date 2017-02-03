'use strict';

const Electron = require('electron');
const {app, BrowserWindow, ipcMain} = Electron;
const Config = require('config');
const fs = require('fs');
const Twitter = require('twitter');

let client;
let win;
let tlWin;
let authWin;
let twitterWin;

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

    fs.stat('config/tokens.json', function(err, stat){
        if (err == null) {
            const twitterTokens = JSON.parse(fs.readFileSync('config/tokens.json', 'utf8'));
            client = new Twitter({
                consumer_key: Config.consumer_key,
                consumer_secret: Config.consumer_secret,
                access_token_key: twitterTokens.oauth_access_token,
                access_token_secret: twitterTokens.oauth_access_token_secret
            });
        } else {
            authWin = new BrowserWindow({width: 600, height: 300});
            authWin.loadURL('file://' + __dirname + '/authenticate.html');

            authWin.on('closed', function() {
                authWin = null;
            });
        }
    });

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

        client.stream('user', null, function(stream) {
            stream.on('data', function(data) {
                streamObj = stream;
                if (data.text !== undefined) {
                    tlWin.webContents.send('tweet', JSON.stringify(data));
                }
            });
        });
    });

    // TwitterのPINコード認証ページ
    ipcMain.on('input_pin', function(event, arg){
        twitterWin = new BrowserWindow({width: 800, height: 600});
        twitterWin.loadURL('https://twitter.com/oauth/authenticate?oauth_token=' + arg);

        twitterWin.on('closed', function(){
            twitterWin = null;
        });
    });

    // Twitterのトークン書き込み
    ipcMain.on('tokens', function(event, arg){
        if (twitterWin != null) {
            twitterWin.close();
        }
        authWin.close();

        fs.writeFile('config/tokens.json', JSON.stringify(arg));
        win.reload();
    });
});

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 577,
    height: 700,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    },
    frame: false,
    icon: path.join(__dirname, 'static/img/icon.png')
  })

  // Set window position
  mainWindow.setPosition(100, 100)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const fs = require('fs')
const https = require('https')
const axios = require('axios').default
const get_api_key = require(path.join(__dirname, 'static/js/riot_api'))
const api_key = get_api_key()
const json_reader = require(path.join(__dirname, 'static/js/json_reader'))

const agent = new https.Agent({
  rejectUnauthorized: false
})

let champion_obj = json_reader.get_champion_obj() // '123' : { 'champion_name': 'Nunu', 'ult_cool': [ 110, 100, 90] }
let spell_obj = json_reader.get_spell_obj() // '456' : { 'spell_name': 'SummonerFlash', 'spell_cool': 300 }

// Champion data 요청
ipcMain.on('request-champion', (event) => {
  event.sender.send('response-champion', champion_obj)
})

// Spell data 요청
ipcMain.on('request-spell', (event) => {
  event.sender.send('response-spell', spell_obj)
})

// 실행 중인 LOL Client의 live data 요청
ipcMain.on('request-live', (event) => {

  let live_url = 'https://127.0.0.1:2999/liveclientdata/allgamedata'

  axios.get(live_url, { httpsAgent: agent }).then(response => {
    event.sender.send('response-live', response.data, true)
  }).catch(err => {
    console.log(err)
    event.sender.send('response-live', 'ERROR live : 게임을 실행하고 버튼을 다시 눌러주세요.', false)
  })

})

// 소환사명으로 소환사 ID 받기
ipcMain.on('request-summoner', (event, summoner_name) => {

  let summoner_url = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summoner_name + '?api_key=' + api_key

  axios.get(summoner_url, { httpsAgent: agent }).then(response => {
    event.sender.send('response-summoner', response.data, true)
  }).catch(err => {
    console.log(err)
    event.sender.send('response-summoner', 'ERROR summoner : 게임을 실행하고 버튼을 다시 눌러주세요.', false)
  })

})

// 해당 게임의 match 정보 요청
ipcMain.on('request-match', (event, summoner_id) => {

  let match_url = 'https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' + summoner_id + '?api_key=' + api_key

  axios.get(match_url, { httpsAgent: agent }).then(response => {
    event.sender.send('response-match', response.data, true)
  }).catch(err => {
    console.log(err)
    event.sender.send('response-match', 'ERROR match : 게임을 진행 중이지 않습니다.', false)
  })

})

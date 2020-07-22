// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    // width: 577,
    height: 700,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'static/js/preload.js'),
      nodeIntegration: true
    },
    frame: false
  })

  // Set window position
  mainWindow.setPosition(100, 100)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const https = require('https')
const axios = require('axios').default
const api_key = 'RGAPI-465eb062-6660-4a3e-89fe-eb12523706a3'

const agent = new https.Agent({
  rejectUnauthorized: false
})

// 실행 중인 LOL Client의 live data 요청
ipcMain.on('request-live', (event) => {

  let live_url = 'https://127.0.0.1:2999/liveclientdata/allgamedata'

  axios.get(live_url, { httpsAgent: agent }).then(function (response) {
    event.sender.send('response-live', response.data, true)
  }).catch(function (err) {
    console.log(err)
    event.sender.send('response-live', '게임을 실행하고 버튼을 다시 눌러주세요.', false)
  })

})

// 해당 게임의 match 정보 요청
ipcMain.on('request-match', (event, summoner_id) => {

  let match_url = 'https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' + summoner_id + '?api_key=' + api_key

  axios.get(match_url, { httpsAgent: agent }).then(response => {
    event.sender.send('response-match', response.data, true)
  }).catch( err => {
    console.log(err)
    event.sender.send('response-match', '게임을 진행 중이지 않습니다.', false)
  })

})

const fs = require('fs')

let id_name_array = []
const id_name_file_path = './static/etc/champion_id.txt'

fs.readFile(id_name_file_path, 'utf8', (err, data) => {
  id_name_array = data.split('\r\n')
  console.log(id_name_array)

  for (let index = 0; index < id_name_array.length; index++) {
    let element = id_name_array[index].split(' ')
    id_name_array[index] = [Number(element[0]), element[1]]
    // console.log(typeof(id_name_array[index][0]))
  }

  id_name_array.sort((a, b) => a[0] - b[0])

  var file = fs.createWriteStream(id_name_file_path + '1')

  file.on('err', err => { /* err handling */ })
  
  id_name_array.forEach( element => {
    file.write(element[0] + ' ' + element[1] + '\n')
  })
  
  file.end()
})

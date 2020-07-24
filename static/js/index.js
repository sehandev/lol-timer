'use strict'

const { ipcRenderer } = require('electron')

let player_id

document.getElementById('reload-btn').onclick = () => {
    window.location.reload()
}

function axios_live() {
    ipcRenderer.send('request-live')
}

ipcRenderer.on('response-live', (event, data, is_ok) => {
    if (is_ok) {
        let player_name = data.activePlayer.summonerName
        document.getElementById('active-player-btn').innerText = player_name
        document.getElementById('active-player-btn').classList.remove('disabled')
        event.sender.send('request-summoner', player_name, true)
    } else {
        // error
        console.log(data)
    }
})

ipcRenderer.on('response-summoner', (_, data, is_ok) => {
    if (is_ok) {
        player_id = data.id

        document.getElementById('active-player-btn').onclick = () => {
            window.location.href = 'spell.html?id=' + player_id
        }
    } else {
        // error
        console.log(data)
    }
})

axios_live()
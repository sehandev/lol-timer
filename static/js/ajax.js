'use strict'

const { ipcRenderer } = require('electron')

let player_id
let champion_id_map = {}

function axios_live() {
    ipcRenderer.send('request-live')
}

function axios_match() {
    ipcRenderer.send('request-match', player_id)
}

function axios_championID() {
    ipcRenderer.send('request-championID')
}

ipcRenderer.on('response-live', (event, data, is_ok) => {
    if (is_ok) {
        let player_list = data.allPlayers
        console.log(player_list)
    } else {
        // error
        console.log(data)
    }
})

ipcRenderer.on('response-match', (_, data, is_ok) => {
    if (is_ok) {
        let participants = data.participants
        let player = participants.find(element => element.summonerId == player_id)
        document.getElementById('summoner-name').innerText = player.summonerName
        let team_id = player.teamId // 아군 team id

        let enemy_array = participants.filter(element => element.teamId != team_id)
        for (let i = 0; i < enemy_array.length; i++) {

            let champion_name = champion_id_map[enemy_array[i].championId]
            set_champion(i, champion_name)

            let perk_array = enemy_array[i].perks.perkIds
            check_perk(i, perk_array)

            let spell1_id = enemy_array[i].spell1Id
            let spell2_id = enemy_array[i].spell2Id

        }
    } else {
        // error
        console.log(data)
    }
})

ipcRenderer.on('response-championID', (_, data) => {
    champion_id_map = data
})

function init() {
    player_id = window.location.search.substring(4)
    axios_live()
    axios_championID()
    axios_match()
}

init()
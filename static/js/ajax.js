'use strict'

const { ipcRenderer } = require('electron')

let player_id
let champion_obj = {} // 123 : [ 'champion_name': 'Nunu', 'ult_cool': [ 110, 100, 90] ]

function axios_live() {
    ipcRenderer.send('request-live')
}

function axios_match() {
    ipcRenderer.send('request-match', player_id)
}

function axios_champion() {
    ipcRenderer.send('request-champion')
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

ipcRenderer.on('response-champion', (_, data) => {
    champion_obj = data
})

function init() {
    player_id = window.location.search.substring(4)
    axios_live()
    axios_match()
    axios_champion()

    // 10초마다 level, spell 갱신
    setInterval(() => {
        axios_live()
    }, 10000)
}

init()
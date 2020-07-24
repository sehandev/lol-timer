'use strict'

const { ipcRenderer } = require('electron')

let player_id
let champion_obj = {} // '123' : { 'champion_name': 'Nunu', 'ult_cool': [ 110, 100, 90 ] }
let spell_obj = {} // '456' : { 'spell_name': 'SummonerFlash', 'spell_cool': 300 }
let item_obj = {} // '789' : { 'item_name': '슈렐리아의 몽상', 'item_description': '... 재사용 대기시간 감소 +10% ...', 'item_tags': ['CooldownReduction'], 'cool': 10 }

function axios_live() {
    ipcRenderer.send('request-live')
}

function axios_match() {
    ipcRenderer.send('request-match', player_id)
}

function axios_champion() {
    ipcRenderer.send('request-champion')
}

function axios_spell() {
    ipcRenderer.send('request-spell')
}

function axios_item() {
    ipcRenderer.send('request-item')
}

ipcRenderer.on('response-live', (event, data, is_ok) => {
    if (is_ok) {
        let player_list = data.allPlayers
        for (let i = 0; i < summoner_array.length; i++) {
            let summoner = player_list.find(element => element.summonerName == summoner_array[i].summoner_name)
            summoner_array[i].level = Number(summoner.level) - 1
        }
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

            summoner_array[i].summoner_name = enemy_array[i].summonerName
            let champion_name = champion_obj[enemy_array[i].championId].champion_name
            set_champion(i, enemy_array[i].championId, champion_name)

            let perk_array = enemy_array[i].perks.perkIds
            check_perk(i, perk_array)

            set_spellD(i, spell_obj[enemy_array[i].spell1Id])
            set_spellF(i, spell_obj[enemy_array[i].spell2Id])
        }

        // 10초마다 level, spell 갱신
        setInterval(() => {
            axios_live()
        }, 10000)
    } else {
        // error
        console.log(data)
    }
})

ipcRenderer.on('response-champion', (_, data) => {
    champion_obj = data
})

ipcRenderer.on('response-spell', (_, data) => {
    spell_obj = data
})

ipcRenderer.on('response-item', (_, data) => {
    item_obj = data
})

function init() {
    axios_champion()
    axios_spell()
    axios_item()
    player_id = window.location.search.substring(4)
    axios_match()

}

init()
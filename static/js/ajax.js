
'use strict'

const { ipcRenderer } = require('electron')

// let summoner_id = 'ABfqliRE1NUIx1ETg1CQykZC2ef4qXs_60rXMLY4onkoEw'
// let summoner_id = 'wsn3H2bhGEN7B_bYR5IKGp-jz2AVdwvhOadqsIhbMiNv01U'
let summoner_id = 'nhtGsyA0ViqHvycOzIfejoprjFQZdA3dskS6ZH8KPRQYTF0'

let champion_id_map = {}


function axios_live() {
    ipcRenderer.send('request-live')
}

function axios_match() {
    ipcRenderer.send('request-match', summoner_id)
}

function axios_championID() {
    ipcRenderer.send('request-championID')
}


ipcRenderer.on('response-live', (_, data, is_ok) => {
    if (is_ok) {
        console.log(data)
    } else {
        // error
        console.log(data)
    }
})

ipcRenderer.on('response-match', (_, data, is_ok) => {
    if (is_ok) {
        let participants = data.participants
        let team_id = participants.find(element => element.summonerId == summoner_id).teamId // 아군 team id

        let enemy_array = participants.filter(element => element.teamId != team_id)
        for (let i = 0; i < enemy_array.length; i++) {

            let champion_name = champion_id_map[enemy_array[i].championId]
            set_champion_img(i, champion_name)

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
    console.log(data)
    champion_id_map = data
})

let rune_array = {
    8106: '궁극의사냥꾼',
    8210: '깨달음',
    8360: '봉인풀린주문서',
    8347: '우주적통찰력',
    5007: '공격'
}

// check_perk : 착용 중인 rune(perk) 중 재사용대기시간에 영향을 주는 5개 확인하기
function check_perk(index, perk_array) {

    Object.entries(rune_array).forEach(element => {
        // element : ['8106', '궁극의사냥꾼']
        if (perk_array.includes(Number(element[0]))) {
            console.log(element[1])
            rune_map.set(element[1], true)
        }
    })
    check_disabled_rune(index + 1)


    // TEST
    rune_map.set('궁극의사냥꾼', false)
    rune_map.set('깨달음', false)
    rune_map.set('봉인풀린주문서', false)
    rune_map.set('우주적통찰력', false)
    rune_map.set('공격', false)
}

function test() {
    // axios_live()
    axios_championID()
    axios_match()
}

test()
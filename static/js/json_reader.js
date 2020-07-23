'use strict'

const path = require('path')
const fs = require('fs')

module.exports = get_champion_obj

function get_champion_obj() {
    const champion_json_path = path.join(__dirname, '../json/championFull.json')
    let champion_obj = {}
    let data = fs.readFileSync(champion_json_path, 'utf8')
    let data_obj = JSON.parse(data).data

    Object.entries(data_obj).forEach(element => {
        let champion_name = element[0]
        let champion_id = element[1].key
        let spells = element[1].spells
        let ult_cool = spells[spells.length - 1].cooldown

        champion_obj[champion_id] = {
            'champion_name': champion_name,
            'ult_cool': ult_cool
        }
    })

    return champion_obj
}
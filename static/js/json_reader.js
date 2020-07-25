"use strict";
const path = require('path');
const fs = require('fs');
module.exports = { get_champion_obj, get_spell_obj, get_item_obj };
const champion_json_path = path.join(__dirname, '../json/championFull');
const spell_json_path = path.join(__dirname, '../json/summoner');
const item_json_path = path.join(__dirname, '../json/item');
function get_champion_obj() {
    return JSON.parse(fs.readFileSync(champion_json_path + '_custom.json', 'utf8'));
}
function get_spell_obj() {
    return JSON.parse(fs.readFileSync(spell_json_path + '_custom.json', 'utf8'));
}
function get_item_obj() {
    return JSON.parse(fs.readFileSync(item_json_path + '_custom.json', 'utf8'));
}
function make_champion_obj() {
    let champion_obj = {};
    let data = fs.readFileSync(champion_json_path + '.json', 'utf8');
    let data_obj = JSON.parse(data).data;
    Object.entries(data_obj).forEach(element => {
        let champion_name = element[0];
        let champion_id = element[1].key;
        let spells = element[1].spells;
        let ult_cool = spells[spells.length - 1].cooldown;
        // level에 따라 변동이 있는 재사용대기시간을 체크하기 위해 18개로 복제
        let new_ult_cool = [];
        if (ult_cool.length == 1 || ult_cool.length == 6) {
            // Jayce : 1, Udyr : 6
            for (let i = 0; i < 18; i++) {
                new_ult_cool.push(ult_cool[0]);
            }
        }
        else if (ult_cool.length == 3) {
            // almost every champions
            for (let i = 1; i < 6; i++) {
                new_ult_cool.push(0);
            }
            for (let i = 6; i < 11; i++) {
                new_ult_cool.push(ult_cool[0]);
            }
            for (let i = 11; i < 16; i++) {
                new_ult_cool.push(ult_cool[1]);
            }
            for (let i = 16; i <= 18; i++) {
                new_ult_cool.push(ult_cool[2]);
            }
        }
        else if (ult_cool.length == 4) {
            // champions who can use ult from level 1
            for (let i = 1; i < 6; i++) {
                new_ult_cool.push(ult_cool[0]);
            }
            for (let i = 6; i < 11; i++) {
                new_ult_cool.push(ult_cool[1]);
            }
            for (let i = 11; i < 16; i++) {
                new_ult_cool.push(ult_cool[2]);
            }
            for (let i = 16; i <= 18; i++) {
                new_ult_cool.push(ult_cool[3]);
            }
        }
        champion_obj[champion_id] = {
            'champion_name': champion_name,
            'ult_cool': new_ult_cool
        };
    });
    const champion_data = JSON.stringify(champion_obj);
    fs.writeFileSync(champion_json_path + '_custom.json', champion_data, 'utf8');
    return champion_obj;
}
function make_spell_obj() {
    let spell_obj = {};
    let data = fs.readFileSync(spell_json_path + '.json', 'utf8');
    let data_obj = JSON.parse(data).data;
    Object.entries(data_obj).forEach(element => {
        let spell_name = element[0];
        let spell_id = element[1].key;
        // level에 따라 변동이 있는 재사용대기시간을 체크하기 위해 18개로 복제
        let spell_cool = [];
        if (element[1].cooldown.length == 1) {
            for (let i = 0; i < 18; i++) {
                spell_cool.push(element[1].cooldown[0]);
            }
        }
        else {
            spell_cool = element[1].cooldown;
        }
        spell_obj[spell_id] = {
            'spell_name': spell_name,
            'spell_cool': spell_cool
        };
    });
    const spell_data = JSON.stringify(spell_obj);
    fs.writeFileSync(spell_json_path + '_custom.json', spell_data, 'utf8');
    return spell_obj;
}
function make_item_obj() {
    let item_obj = {};
    let data = fs.readFileSync(item_json_path + '.json', 'utf8');
    let data_obj = JSON.parse(data).data;
    Object.entries(data_obj).forEach(element => {
        let item_id = element[0];
        let item_name = element[1].name;
        let item_description = element[1].description;
        // 재사용대기시간 감소 효과가 있는 item
        if (item_description.includes('재사용 대기시간 감소 +') || item_description.includes('재사용 대기시간이 추가로 ')) {
            let cool1 = Number(item_description.split('재사용 대기시간 감소 +').pop().split('%')[0]);
            let cool2 = Number(item_description.split('재사용 대기시간이 추가로 ').pop().split('% 감소합니다')[0]);
            if (Number.isNaN(cool2)) {
                cool2 = 0;
            }
            item_obj[item_id] = {
                'item_name': item_name,
                'item_description': item_description,
                'cool': cool1 + cool2
            };
        }
    });
    const item_data = JSON.stringify(item_obj);
    fs.writeFileSync(item_json_path + '_custom.json', item_data, 'utf8');
    return item_obj;
}
// make_champion_obj()
// make_spell_obj()
make_item_obj();

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.champion_obj = void 0;
const electron_1 = require("electron");
const spell = __importStar(require("./spell"));
let player_id;
let spell_obj; // '456' : { 'spell_name': 'SummonerFlash', 'spell_cool': 300 }
let item_obj; // '789' : { 'item_name': '슈렐리아의 몽상', 'item_description': '... 재사용 대기시간 감소 +10% ...', 'item_tags': ['CooldownReduction'], 'cool': 10 }
function axios_live() {
    electron_1.ipcRenderer.send('request-live');
}
function axios_match() {
    electron_1.ipcRenderer.send('request-match', player_id);
}
function axios_champion() {
    electron_1.ipcRenderer.send('request-champion');
}
function axios_spell() {
    electron_1.ipcRenderer.send('request-spell');
}
function axios_item() {
    electron_1.ipcRenderer.send('request-item');
}
electron_1.ipcRenderer.on('response-live', (event, data, is_ok) => {
    if (is_ok) {
        let player_list = data.allPlayers;
        spell.set_kill_summoner_arr(data.events.Events);
        for (let i = 0; i < spell.summoner_array.length; i++) {
            let summoner = player_list.find((element) => element.summonerName == spell.summoner_array[i].summoner_name);
            spell.summoner_array[i].level = Number(summoner.level) - 1;
            spell.calculate_rune_cool(i);
            spell.summoner_array[i].fix_cool = 0;
            summoner.items.forEach((element) => {
                let cooldown_item = item_obj[element.itemID];
                if (cooldown_item) {
                    spell.summoner_array[i].fix_cool += Number(cooldown_item.cool);
                }
            });
            spell.set_fix_cooldown(i);
            spell.set_spellD(i, spell_obj[spell.summoner_array[i].spellD_id], spell.summoner_array[i].spellD_id);
            spell.set_spellF(i, spell_obj[spell.summoner_array[i].spellF_id], spell.summoner_array[i].spellF_id);
        }
    }
    else {
        // error
        console.log(data);
    }
});
electron_1.ipcRenderer.on('response-match', (_, data, is_ok) => {
    if (is_ok) {
        let participants = data.participants;
        let player = participants.find((element) => element.summonerId == player_id);
        document.getElementById('summoner-name').innerText = player.summonerName;
        let team_id = player.teamId; // 아군 team id
        for (let i = 0, index = 0; i < participants.length; i++) {
            if (participants[i].teamId != team_id) {
                let enemy = participants[i];
                spell.summoner_array[index].summoner_name = enemy.summonerName;
                let champion_name = exports.champion_obj[enemy.championId].champion_name;
                spell.set_champion(index, enemy.championId, champion_name);
                let perk_array = enemy.perks.perkIds;
                spell.check_perk(index, perk_array);
                spell.set_spellD(index, spell_obj[enemy.spell1Id], enemy.spell1Id);
                spell.set_spellF(index, spell_obj[enemy.spell2Id], enemy.spell2Id);
                index++;
            }
        }
        // 10초마다 level, spell 갱신
        axios_live();
        setInterval(() => {
            axios_live();
        }, 10000);
    }
    else {
        // error
        console.log(data);
    }
});
electron_1.ipcRenderer.on('response-champion', (_, data) => {
    exports.champion_obj = data;
});
electron_1.ipcRenderer.on('response-spell', (_, data) => {
    spell_obj = data;
});
electron_1.ipcRenderer.on('response-item', (_, data) => {
    item_obj = data;
});
function ajax_init() {
    axios_champion();
    axios_spell();
    axios_item();
    player_id = window.location.search.substring(4);
    axios_match();
}
ajax_init();

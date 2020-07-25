"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ajax_1 = require("./ajax");
const spell_1 = require("./spell");
function timer_init() {
    for (let i = 0; i < 5; i++) {
        document.getElementById('champion-btn-' + spell_1.summoner_array[i].index).onclick = () => {
            start_ult_timer(spell_1.summoner_array[i]);
        };
        document.getElementById('spellD-btn-' + spell_1.summoner_array[i].index).onclick = () => {
            start_spellD_timer(spell_1.summoner_array[i]);
        };
        document.getElementById('spellF-btn-' + spell_1.summoner_array[i].index).onclick = () => {
            start_spellF_timer(spell_1.summoner_array[i]);
        };
    }
    setInterval(() => {
        tick_update();
    }, 1000);
}
function start_ult_timer(summoner) {
    summoner.ult = ajax_1.champion_obj[summoner.champion_id].ult_cool[summoner.level];
    summoner.ult_time = Math.floor(summoner.ult * (1 - summoner.final_ult_cool * 0.01) * (1 - summoner.rune_ult_cool * 0.01));
    document.getElementById('champion-img-' + summoner.index).classList.add('ult-disabled');
    document.getElementById('ult-timer-' + summoner.index).innerText = String(summoner.ult_time);
}
function start_spellD_timer(summoner) {
    summoner.spellD_time = Math.floor(summoner.spellD * (1 - summoner.final_spell_cool * 0.01));
    document.getElementById('spellD-img-' + summoner.index).classList.add('spell-disabled');
    document.getElementById('spellD-timer-' + summoner.index).innerText = String(summoner.spellD_time);
}
function start_spellF_timer(summoner) {
    summoner.spellF_time = Math.floor(summoner.spellF * (1 - summoner.final_spell_cool * 0.01));
    document.getElementById('spellF-img-' + summoner.index).classList.add('spell-disabled');
    document.getElementById('spellF-timer-' + summoner.index).innerText = String(summoner.spellF_time);
}
function tick_update() {
    for (let index = 0; index < 5; index++) {
        if (spell_1.summoner_array[index].ult_time > 0) {
            spell_1.summoner_array[index].ult_time -= 1;
            document.getElementById('ult-timer-' + spell_1.summoner_array[index].index).innerText = String(spell_1.summoner_array[index].ult_time);
        }
        else {
            document.getElementById('champion-img-' + spell_1.summoner_array[index].index).classList.remove('ult-disabled');
            document.getElementById('ult-timer-' + spell_1.summoner_array[index].index).innerText = String("");
        }
        if (spell_1.summoner_array[index].spellD_time > 0) {
            spell_1.summoner_array[index].spellD_time -= 1;
            document.getElementById('spellD-timer-' + spell_1.summoner_array[index].index).innerText = String(spell_1.summoner_array[index].spellD_time);
        }
        else {
            document.getElementById('spellD-img-' + spell_1.summoner_array[index].index).classList.remove('spell-disabled');
        }
        if (spell_1.summoner_array[index].spellF_time > 0) {
            spell_1.summoner_array[index].spellF_time -= 1;
            document.getElementById('spellF-timer-' + spell_1.summoner_array[index].index).innerText = String(spell_1.summoner_array[index].spellF_time);
        }
        else {
            document.getElementById('spellF-img-' + spell_1.summoner_array[index].index).classList.remove('spell-disabled');
        }
    }
}
timer_init();

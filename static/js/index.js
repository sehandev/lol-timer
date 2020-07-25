"use strict";
const electron = require('electron');
document.getElementById('reload-btn').onclick = () => {
    window.location.reload();
};
function axios_start() {
    electron.ipcRenderer.send('request-start');
}
electron.ipcRenderer.on('response-start', (event, data, is_ok) => {
    if (is_ok) {
        let player_name = data.activePlayer.summonerName;
        document.getElementById('active-player-btn').innerText = player_name;
        document.getElementById('active-player-btn').classList.remove('disabled');
        event.sender.send('request-summoner', player_name, true);
    }
    else {
        // error
        console.log(data);
    }
});
electron.ipcRenderer.on('response-summoner', (_, data, is_ok) => {
    if (is_ok) {
        document.getElementById('active-player-btn').onclick = () => {
            window.location.href = 'spell.html?id=' + data.id;
        };
    }
    else {
        // error
        console.log(data);
    }
});
axios_start();

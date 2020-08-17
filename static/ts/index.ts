const electron = require("electron")
const opn = require("opn")

document.getElementById("reload-btn")!.onclick = () => {
    window.location.reload()
}

document.getElementById("opgg-btn")!.onclick = () => {
    opn("https://www.op.gg/")
}

document.getElementById("porogg-btn")!.onclick = () => {
    opn("https://poro.gg/")
}

function axios_start() {
    electron.ipcRenderer.send("request-start")
}

electron.ipcRenderer.on("response-start", (event: any, data: { activePlayer: { summonerName: string } }, is_ok: boolean) => {
    if (is_ok) {
        let player_name = data.activePlayer.summonerName
        document.getElementById("active-player-btn")!.innerText = player_name
        document.getElementById("active-player-btn")!.classList.remove("disabled")
        event.sender.send("request-summoner", player_name, true)
    } else {
        // error
        console.log(data)
    }
})

electron.ipcRenderer.on("response-summoner", (_: any, data: { id: string }, is_ok: any) => {
    if (is_ok) {
        document.getElementById("active-player-btn")!.onclick = () => {
            window.location.href = "spell.html?id=" + data.id
        }
    } else {
        // error
        console.log(data)
    }
})

axios_start()

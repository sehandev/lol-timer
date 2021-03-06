const { ipcRenderer } = require("electron");

interface champion_object {
  [key: string]: { champion_name: string; ult_cool: number[] };
}
interface spell_object {
  [key: string]: { spell_name: string; spell_cool: number[] };
}
interface item_object {
  [key: string]: {
    item_name: string;
    item_description: string;
    item_tags: string[];
    cool: number;
  };
}

let player_id: string;
let champion_obj: champion_object; // '123' : { 'champion_name': 'Nunu', 'ult_cool': [ 110, 100, 90 ] }
let spell_obj: spell_object; // '456' : { 'spell_name': 'SummonerFlash', 'spell_cool': 300 }
let item_obj: item_object; // '789' : { 'item_name': '슈렐리아의 몽상', 'item_description': '... 재사용 대기시간 감소 +10% ...', 'item_tags': ['CooldownReduction'], 'cool': 10 }

function axios_live() {
  ipcRenderer.send("request-live");
}

function axios_match() {
  ipcRenderer.send("request-match", player_id);
}

function axios_champion() {
  ipcRenderer.send("request-champion");
}

function axios_spell() {
  ipcRenderer.send("request-spell");
}

function axios_item() {
  ipcRenderer.send("request-item");
}

ipcRenderer.on("response-live", (event: any, data: any, is_ok: boolean) => {
  if (is_ok) {
    let player_list = data.allPlayers;
    set_kill_summoner_arr(data.events.Events);
    for (let i = 0; i < summoner_array.length; i++) {
      let summoner = player_list.find(
        (element: { summonerName: string }) =>
          element.summonerName == summoner_array[i].summoner_name
      );
      summoner_array[i].level = Number(summoner.level) - 1;

      calculate_rune_cool(i);

      summoner_array[i].fix_cool = 0;
      summoner.items.forEach((element: { itemID: number }) => {
        let cooldown_item = item_obj[element.itemID];
        if (cooldown_item) {
          summoner_array[i].fix_cool += Number(cooldown_item.cool);
        }
      });
      set_fix_cooldown(i);

      set_spellD(
        i,
        spell_obj[summoner_array[i].spellD_id],
        summoner_array[i].spellD_id
      );
      set_spellF(
        i,
        spell_obj[summoner_array[i].spellF_id],
        summoner_array[i].spellF_id
      );
    }
  } else {
    // error
    console.log(data);
  }
});

ipcRenderer.on("response-match", (_: any, data: any, is_ok: boolean) => {
  if (is_ok) {
    let participants = data.participants;
    let player = participants.find(
      (element: { summonerId: string }) => element.summonerId == player_id
    );
    document.getElementById("summoner-name")!.innerText = player.summonerName;
    let team_id = player.teamId; // 아군 team id

    for (let i = 0, index = 0; i < participants.length; i++) {
      if (participants[i].teamId != team_id) {
        let enemy: {
          summonerName: string;
          championId: string;
          perks: { perkIds: number[] };
          spell1Id: number;
          spell2Id: number;
        } = participants[i];
        summoner_array[index].summoner_name = enemy.summonerName;
        let champion_name = champion_obj[enemy.championId].champion_name;
        set_champion(index, enemy.championId, champion_name);

        let perk_array = enemy.perks.perkIds;
        check_perk(index, perk_array);

        set_spellD(index, spell_obj[enemy.spell1Id], enemy.spell1Id);
        set_spellF(index, spell_obj[enemy.spell2Id], enemy.spell2Id);

        index++;
      }
    }

    // 1초마다 level, spell 갱신
    axios_live();
    setInterval(() => {
      axios_live();
    }, 1000);
  } else {
    // error
    console.log(data);
  }
});

ipcRenderer.on("response-champion", (_: any, data: champion_object) => {
  champion_obj = data;
});

ipcRenderer.on("response-spell", (_: any, data: spell_object) => {
  spell_obj = data;
});

ipcRenderer.on("response-item", (_: any, data: item_object) => {
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

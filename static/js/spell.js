'use strict'

let summoner_array = []

function set_champion(index, champion_name) {
    if (champion_name != undefined) {
        summoner_array[index].champion_name = champion_name
        summoner_array[index].ult = champion_obj.ult_cool[summoner_array[index].level]
        document.getElementById('champion-img-' + summoner_array[index].index).src = './static/img/champion/' + champion_name + '.png'
    }
}

// spell_obj : { 'spell_name' : 'SummonerBarrier', 'spell_cool' : 180 }
function set_spellD(index, spell_obj) {
    let spell_name = spell_obj.spell_name
    if (spell_name != undefined) {
        summoner_array[index].spellD_name = spell_name
        summoner_array[index].spellD = spell_obj.spell_cool[summoner_array[index].level]
        document.getElementById('spellD-btn-' + summoner_array[index].index).innerHTML = `<img id="spellD-img-` + summoner_array[index].index + `" class="spell-img">`
        document.getElementById('spellD-img-' + summoner_array[index].index).src = './static/img/spell/' + spell_name + '.png'
    }
}

// spell_obj : { 'spell_name' : 'SummonerBarrier', 'spell_cool' : 180 }
function set_spellF(index, spell_obj) {
    let spell_name = spell_obj.spell_name
    if (spell_name != undefined) {
        summoner_array[index].spellF_name = spell_name
        summoner_array[index].spellF = spell_obj.spell_cool[summoner_array[index].level]
        document.getElementById('spellF-btn-' + summoner_array[index].index).innerHTML = `<img id="spellF-img-` + summoner_array[index].index + `" class="spell-img">`
        document.getElementById('spellF-img-' + summoner_array[index].index).src = './static/img/spell/' + spell_name + '.png'
    }
}
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
            summoner_array[index].rune_map[element[1]] = true
        }
    })
    check_disabled_rune(index)
}

// check_disabled_rune : rune이 비활성화 상태라면 class를 추가해서 css 추가
function check_disabled_rune(index) {
    Object.entries(summoner_array[index].rune_map).forEach(element => {
        let rune_name = element[0]
        let rune_active = element[1]

        if (!rune_active) {
            document.getElementById('rune-' + rune_name + '-' + summoner_array[index].index).classList.add('disabled-rune')
        } else {
            document.getElementById('rune-' + rune_name + '-' + summoner_array[index].index).classList.remove('disabled-rune')
        }
    })
    calculate_rune_cool(index)
}

// calculate_rune_cool : rune_cool (rune으로 인한 재사용대기시간) 계산
function calculate_rune_cool(index) {
    let rune_map = summoner_array[index].rune_map
    if (rune_map['궁극의사냥꾼']) {
        summoner_array[index].rune_cool += 5
    }
    if (rune_map['깨달음']) {
        summoner_array[index].rune_cool += 10
    }
    if (rune_map['봉인풀린주문서']) {
        // TODO : 봉인풀린주문서 rune의 효과 조사 필요
    }
    if (rune_map['우주적통찰력']) {
        summoner_array[index].rune_cool += 5
        summoner_array[index].final_spell_cool += 5
        set_final_spell_cooldown(index)
    }
    if (rune_map['공격']) {
        // TODO : 원래는 level에 따라서 증가하지만 시간으로 대체
        summoner_array[index].rune_cool += 0
    }

    set_fix_cooldown(index)
}

// check_fix_cool_range : 설정한 재사용대기시간이 정상 범위를 벗어나지 않게 수정
function check_fix_cool_range(fix_cool) {
    if (fix_cool < 0) {
        return 0
    } else if (fix_cool > 40) {
        return 40
    }
    return fix_cool
}

// set_fix_cooldown : fix-cool (사용자 설정 재사용대기시간) 반영
function set_fix_cooldown(index) {
    summoner_array[index].fix_cool = check_fix_cool_range(summoner_array[index].fix_cool)
    document.getElementById('fix-cool-' + summoner_array[index].index).innerText = summoner_array[index].fix_cool
    set_final_ult_cooldown(index)
}

// check_final_ult_cool_range : 궁극기 재사용대기시간이 정상 범위를 벗어나지 않게 수정
function check_final_ult_cool_range(ult_cool) {
    if (ult_cool < 0) {
        return 0
    } else if (ult_cool > 45) {
        return 45
    }
    return ult_cool
}

// set_final_ult_cooldown : 궁극기 재사용대기시간 반영
function set_final_ult_cooldown(index) {
    let final_ult_cool = summoner_array[index].rune_cool + summoner_array[index].fix_cool
    final_ult_cool = check_final_ult_cool_range(final_ult_cool)
    summoner_array[index].final_ult_cool = final_ult_cool
    document.getElementById('final-ult-cool-' + summoner_array[index].index).innerText = final_ult_cool
}

// set_final_spell_cooldown : spell 재사용대기시간 반영
function set_final_spell_cooldown(index) {
    document.getElementById('final-spell-cool-' + summoner_array[index].index).innerText = summoner_array[index].final_spell_cool
}


function init() {

    for (let i = 0; i < 5; i++) {
        let summoner = {
            index: i + 1,
            level: 1,
            ult: 5, // 궁극기 재사용대기시간
            ult_time: 0, // 궁극기 남은 시간
            spellD: 10, // D spell 재사용대기시간
            spellD_time: 0, // D spell 남은 시간
            spellD_name: "", // D spell 이름
            spellF: 20, // F spell 재사용대기시간
            spellF_time: 0, // F spell 남은 시간
            spellF_name: "", // F spell 이름
            rune_map: { // rune 활성화 여부
                '궁극의사냥꾼': false,
                '깨달음': false,
                '봉인풀린주문서': false,
                '우주적통찰력': false,
                '공격': false
            },
            rune_cool: 0, // rune으로 인한 재사용대기시간
            fix_cool: 0, // 사용자 설정 재사용대기시간
            max_rune_cool: 40, // 최대 재사용대기시간
            final_ult_cool: 0, // 최종 궁극기 재사용대기시간
            final_spell_cool: 0 // 최종 spell 재사용대기시간
        }
        summoner_array.push(summoner)
    }

    // 재사용대기시간 수정 btn click event listner
    for (let i = 0; i < 5; i++) {
        document.getElementById('fix-btn-p5-' + summoner_array[i].index).onclick = () => {
            summoner_array[i].fix_cool += 5
            set_fix_cooldown(i)
        }
        document.getElementById('fix-btn-p10-' + summoner_array[i].index).onclick = () => {
            summoner_array[i].fix_cool += 10
            set_fix_cooldown(i)
        }
        document.getElementById('fix-btn-s5-' + summoner_array[i].index).onclick = () => {
            summoner_array[i].fix_cool -= 5
            set_fix_cooldown(i)
        }
        document.getElementById('fix-btn-s10-' + summoner_array[i].index).onclick = () => {
            summoner_array[i].fix_cool -= 10
            set_fix_cooldown(i)
        }
    }
}

init()
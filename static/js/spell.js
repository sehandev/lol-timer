'use strict'

let timer_ult = 70 // 궁극기 남은 시간
let timer_d = 360 // D spell 남은 시간
let timer_f = 300 // F spell 남은 시간

let rune_map = new Map() // rune 활성화 여부
rune_map.set('궁극의사냥꾼', false)
rune_map.set('깨달음', false)
rune_map.set('봉인풀린주문서', false)
rune_map.set('우주적통찰력', false)
rune_map.set('공격', false)

let rune_cool = 0 // rune으로 인한 재사용대기시간
let fix_cool = 0 // 사용자 설정 재사용대기시간
let final_ult_cool = 0 // 최종 궁극기 재사용대기시간
let final_spell_cool = 0 // 최종 spell 재사용대기시간

// check_disabled_rune : rune이 비활성화 상태라면 class를 추가해서 css 추가
function check_disabled_rune() {
    rune_map.forEach( (value, key) => {
        if (!value) {
            document.getElementById('rune-' + key).classList.add('disabled-rune');
        }
    })
}

// calculate_rune_cool : rune_cool (rune으로 인한 재사용대기시간) 계산
function calculate_rune_cool() {
    if (rune_map.get('궁극의사냥꾼')) {
        rune_cool += 10
    }
    if (rune_map.get('깨달음')) {
        rune_cool += 10
    }
    if (rune_map.get('봉인풀린주문서')) {
        // TODO : 봉인풀린주문서 rune의 효과 조사 필요
        final_spell_cool += 0
    }
    if (rune_map.get('우주적통찰력')) {
        rune_cool += 5
        final_spell_cool += 5
    }
    if (rune_map.get('공격')) {
        // TODO : 원래는 level에 따라서 증가하지만 시간으로 대체
        rune_cool += 0
    }
}

// set_fix_cooldown : fix-cool (사용자 설정 재사용대기시간) 반영
function set_fix_cooldown() {
    document.getElementById('fix-cool').innerHTML = fix_cool;
}

// set_final_cooldown : 궁극기, spell 재사용대기시간 반영
function set_final_cooldown() {

    // 궁극기 재사용대기시간 반영
    final_ult_cool = rune_cool + fix_cool
    document.getElementById('final-ult-cool').innerHTML = final_ult_cool;
    
    // spell 재사용대기시간 반영
    document.getElementById('final-spell-cool').innerHTML = final_spell_cool;
}

function test() {
    rune_map.set('깨달음', true)
    rune_map.set('우주적통찰력', true)
}

test()
check_disabled_rune()
calculate_rune_cool()
set_fix_cooldown()
set_final_cooldown()
"use strict";
window.$ = window.jQuery = require('jquery')(window).Bootstrap = require('bootstrap');
// 닫기 버튼 누르면 앱 종료
document.getElementById('close-btn').addEventListener('click', e => {
    window.close();
});

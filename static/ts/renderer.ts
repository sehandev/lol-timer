;(<any>window).$ = (<any>window).jQuery = require("jquery")(<any>window).Bootstrap = require("bootstrap")

// 닫기 버튼 누르면 앱 종료
document.getElementById("close-btn")!.addEventListener("click", (e) => {
    window.close()
})

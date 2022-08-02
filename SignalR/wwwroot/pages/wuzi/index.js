// 棋盘
const chess = document.getElementById("canvas")
const pencil = chess.getContext("2d")
pencil.strokeStyle = "#4d4d4d"
//画板的鼠标点击事件
function clickLoc(e) {
    return {
        x: Math.floor(e.offsetX / 30),
        y: Math.floor(e.offsetY / 30),
    }
}
chess.onclick = function (e) {
    if (app.keyCode == app.activeCode) {
        let loc = clickLoc(e)
        let message = {
            category: "Server_ChessPut_Wuzi",
            from: app.keyCode,
            to: app.serverInfos.code,
            contents: JSON.stringify({
                loc: {
                    x: loc.x,
                    y: loc.y,
                    color: app.hostPlayer.order
                }
            }),
            remarks: "",
        }
        sendMessage(message)
    }
}

// 棋子数据
function initialMap() {
    drawMap()
}
// 画棋盘
function drawMap() {
    let size = app.gameInfos.rules.size
    for (let i = 0; i < size; i++) {
        // 竖线
        pencil.moveTo(15 + i * 30, 15)
        pencil.lineTo(15 + i * 30, size * 30 - 15)
        pencil.stroke()
        // 横线
        pencil.moveTo(15, 15 + i * 30)
        pencil.lineTo(size * 30 - 15, 15 + i * 30)
        pencil.stroke()
    }
}
// 清空棋盘
function redrawMap() {
    // 当canvas的高度或者宽度重新设置时将清空画布
    chess.height = chess.height
    drawMap()
}

// 画棋子
function putChess(i, j, color) {
    pencil.beginPath()
    pencil.arc(15 + i * 30, 15 + j * 30, 13, 0, Math.PI * 2, false)
    pencil.closePath()
    pencil.stroke()
    // 设置渐变色 径向渐变
    var grd = pencil.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 10, 15 + i * 30 + 2, 15 + j * 30 - 2, 0)
    switch (color) {
        case 0: { // 黑棋
            grd.addColorStop(0, "#0a0a0a")
            grd.addColorStop(1, "#636767")
            break
        }
        case 1: { // 白棋
            grd.addColorStop(0, "#d1d1d1")
            grd.addColorStop(1, "#f9f9f9")
            break
        }
    }
    pencil.fillStyle = grd // 设置填充色
    pencil.fill()
    //
    app.lastLoc = { x: i, y: j }
}
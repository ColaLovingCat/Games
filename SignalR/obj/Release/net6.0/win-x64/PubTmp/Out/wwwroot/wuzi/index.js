function changeOnLine(code) {
    let playerInfo = app.players.find(player => player.code == code)
    playerInfo.isOnline = true
}

// 棋盘
const chess = document.getElementById("canvas")
const pencil = chess.getContext("2d")
pencil.strokeStyle = "#4d4d4d"
//画板的鼠标点击事件
chess.onclick = function (e) {
    let loc = clickLoc(e)
    chessColor = app.hostPlayer.order
    if (chessMap[loc.x][loc.y].value < 0) {
        // 画棋子
        putChess(loc.x, loc.y, chessColor)
        chessMap[loc.x][loc.y].value = chessColor
        //
        let temp = checkWin(loc.x, loc.y)
        if (temp) {
            chessColor == 1 ? alert("黑棋赢") : alert("白棋赢")
        }
    }
}
function clickLoc(e) {
    return {
        x: Math.floor(e.offsetX / 30),
        y: Math.floor(e.offsetY / 30),
    }
}

// 棋子数据
var chessMap = []
function initialMap() {
    chessMap = []
    //
    let size = app.gameInfos.rules.size
    for (let i = 0; i < size; i++) {
        chessMap[i] = []
        for (let j = 0; j < size; j++) {
            chessMap[i][j] = {
                value: -1,
                loc: {
                    x: j,
                    y: i,
                },
            }
        }
    }
    // 
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

chessColor = 0 // 1-black|
// 画棋子
function putChess(i, j, color) {
    if (app.keyCode == app.activeCode) {
        drawChess(i, j, color)
        // 下一个玩家
        let nextPlayer = app.otherPlayers[0]
        let message = {
            category: "single",
            from: app.keyCode,
            to: nextPlayer.code,
            contents: JSON.stringify({
                loc: { i, j, color }
            }),
            remarks: "Chess_Draw",
        }
        sendMessage(message)
        //
        app.activeCode = nextPlayer.code
    }
}
function drawChess(i, j, color) {
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
}
// 判断赢
function checkWin(i, j) {
    let result = false
    //
    var count = [0, 0, 0, 0, 0, 0, 0, 0]
    var state = [1, 1, 1, 1, 1, 1, 1, 1]
    let color = chessMap[i][j].value
    for (var step = 1; step < 5; step++) {
        if (state[0] == 1 && i - step >= 0 && j - step >= 0) {
            if (chessMap[i - step][j - step].value == color) { count[0]++; } else { state[0] = 2; } //遇到相异的颜色或者没有棋子
        }
        if (state[1] == 1 && i - step >= 0) {
            if (chessMap[i - step][j].value == color) { count[1]++; } else { state[1] = 2; }
        }
        if (state[2] == 1 && i - step >= 0 && j + step < 15) {
            if (chessMap[i - step][j + step].value == color) { count[2]++; } else { state[2] = 2; }
        }
        if (state[3] == 1 && j + step < 15) {
            if (chessMap[i][j + step].value == color) { count[3]++; } else { state[3] = 2; }
        }
        if (state[4] == 1 && i + step < 15 && j + step < 15) {
            if (chessMap[i + step][j + step].value == color) { count[4]++; } else { state[4] = 2; }
        }
        if (state[5] == 1 && i + step < 15) {
            if (chessMap[i + step][j].value == color) { count[5]++; } else { state[5] = 2; }
        }
        if (state[6] == 1 && i + step < 15 && j - step >= 0) {
            if (chessMap[i + step][j - step].value == color) { count[6]++; } else { state[6] = 2; }
        }
        if (state[7] == 1 && j - step >= 0) {
            if (chessMap[i][j - step].value == color) { count[7]++; } else { state[7] = 2; }
        }
    }
    if ((count[0] + count[4] + 1) >= 5 || (count[1] + count[5] + 1) >= 5 || (count[2] + count[6] + 1) >= 5 || (count[3] + count[7] + 1) >= 5) {
        result = true
    }
    return result
}
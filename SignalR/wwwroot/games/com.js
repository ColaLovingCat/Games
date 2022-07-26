// 通讯信息的处理
function handleMessage(mes) {
    if (mes.to == app.keyCode || mes.to == 'all') { // 需要我处理的信息
        switch (mes.category) {
            // 有人在收集房间列表
            case "RoomList_Request": {
                // 当我是房主且房间为激活状态且等待状态时，回发房间信息
                if (checkRoom()) {
                    let host = app.players.find(item => item.code == app.serverInfos.code)
                    let message = {
                        category: "RoomList_Response",
                        from: app.keyCode,
                        to: mes.from,
                        contents: JSON.stringify({
                            server: app.serverInfos,
                            len: app.players.length,
                            host,
                        }),
                        remarks: "",
                    }
                    sendMessage(message)
                }
                break
            }
            // 别人返回房间信息
            case "RoomList_Response": {
                let { server, len, host } = JSON.parse(mes.contents)
                app.serverList.push({
                    code: server.code,
                    name: server.name,
                    hostName: host.showName,
                    isLock: server.password != "",
                    limit: server.limit,
                    currentCount: len,
                })
                break
            }
            // 有人通过房间名模糊加入房间
            case "RoomName_Search": {
                // 当我是房主且房间为激活状态且等待状态时
                if (checkRoom()) {
                    // 当房间名相同时
                    if (app.serverInfos.name == mes.contents) {

                    }
                }
                break
            }
            // 有人精确申请加入房间
            case "RoomInvolve_Request": {
                // 有空位
                if (app.players.length < app.serverInfos.limit) {
                    const { playerName, password } = JSON.parse(mes.contents)
                    // 当服务器需要密码但密码不对
                    if (app.serverInfos.password != "" && app.serverInfos.password != password) {
                        let message = {
                            category: "RoomInvolve_Response",
                            from: app.keyCode,
                            to: mes.from,
                            contents: JSON.stringify({
                                isSuccess: false,
                                message: "密码不对",
                            }),
                            remarks: "",
                        }
                        sendMessage(message)
                    }
                    else {
                        // 创建玩家
                        let playerInfos = createPlayer(app.players.length, playerName, app.gameInfos.type, mes.from, false)
                        app.players.push(playerInfos)
                        // 回复
                        app.players.map(player => {
                            if (player.keyCode != app.keyCode) {
                                let message = {
                                    category: "RoomInvolve_Response",
                                    from: app.keyCode,
                                    to: mes.from,
                                    contents: JSON.stringify({
                                        isSuccess: true,
                                    }),
                                    remarks: "",
                                }
                                sendMessage(message)
                            }
                        })
                        // 通知玩家更新玩家列表
                        app.players.map(player => {
                            if (player.keyCode != app.keyCode) {
                                let message = {
                                    category: "Player_Refresh",
                                    from: app.keyCode,
                                    to: mes.from,
                                    contents: JSON.stringify({
                                        server: app.serverInfos,
                                        players: app.players
                                    }),
                                    remarks: "",
                                }
                                sendMessage(message)
                            }
                        })
                    }
                }
                // 没位置了
                else {
                    let message = {
                        category: "RoomInvolve_Response",
                        from: app.keyCode,
                        to: mes.from,
                        contents: JSON.stringify({
                            isSuccess: false,
                            message: "房间已满",
                        }),
                        remarks: "",
                    }
                    sendMessage(message)
                }
                break
            }
            // 申请加入房间的回复
            case "RoomInvolve_Response": {
                let isSuccess = JSON.parse(mes.contents)
                // 成功
                if (isSuccess) {
                    app.gameStatus.step = "waiting"
                    app.roomStatus = "waiting"
                }
                // 失败
                else {
                    app.gameStatus.step = "setting"
                }
                break
            }
            // [游戏界面] 房主来同步玩家信息
            case "Player_Refresh": {
                let { server, players } = JSON.parse(mes.contents)
                app.serverInfos = server
                app.players = players
                break
            }
            // [服务器界面] 有人请求服务器信息
            case "ServerInfo_Request": {
                if (checkServer()) {
                    if (app.serverInfos.code == mes.to) {
                        //
                        onlinePlayer(mes.from)
                        log(mes.from, "已加入游戏并请求服务器信息")
                        // 标记不同游戏玩家所需信息
                        if (!app.playerMark) {
                            markPlayer()
                            app.playerMark = true
                        }
                        // 发送信息
                        returnServer(mes.from)
                    }
                }
                break
            }
            // 服务器返回房间信息
            case "ServerInfo_Response": {
                if (!checkServer()) {
                    let { server, game, players, gaming } = JSON.parse(mes.contents)
                    if (app.gameInfos.type == game.type) {
                        app.serverInfos = server
                        app.gameInfos = game
                        app.players = players
                        //
                        if (gaming) {
                            recoverGamingInfos(gaming)
                        }
                        else {
                            // 房主同步完服务器信息
                            if (server.code == app.keyCode) {
                                // 房主通知其他玩家进入游戏
                                app.players.map(player => {
                                    if (player.code != app.keyCode) {
                                        let message = {
                                            category: "GameStart_Request",
                                            from: app.keyCode,
                                            to: player.code,
                                            contents: "",
                                            remarks: "",
                                        }
                                        sendMessage(message)
                                    }
                                })
                            }
                            // 玩家同步完服务器信息
                            else {
                                let message = {
                                    category: "Server_GameReady",
                                    from: app.keyCode,
                                    to: mes.from,
                                    contents: "",
                                    remarks: "",
                                }
                                sendMessage(message)
                            }
                        }
                    }
                }
                break
            }
            // 房主要求玩家进入游戏
            case "GameStart_Request": {
                // 携带个人keyCode和hostCode跳转
                if (app.gameStatus.step == "waiting") {
                    window.open("pages/" + app.gameInfos.type + "/index.html?keyCode=" + app.keyCode + "&hostCode=" + app.serverInfos.code, "_self")
                }
                break
            }
            // [服务器界面] 服务器接受到玩家已准备好的信息
            case "Server_GameReady": {
                let mark = true
                app.players.map(player => {
                    if (!player.isOnline) { mark = false }
                })
                if (mark) {
                    log(app.serverInfos.code, "所有玩家进入完毕")
                    // 当有玩家重新进入时
                    if (app.gamingInfos) {
                        log(mes.from, "我重新进来了")
                        nextLoop(app.activeCode)
                    }
                    else {
                        // 初始化游戏信息
                        initialGamingInfos()
                        // 决定第一回合起始玩家
                        app.lastWinnerCode == "" ? nextLoop(app.serverInfos.code) : nextLoop(app.lastWinnerCode)
                    }
                }
                break
            }
            // [服务器界面] 服务器接受到玩家回合结束
            case "Game_LoopEnd": {
                loop(mes.from, "该玩家回合已结束")
                nextLoop(mes.contents)
                break
            }
            // [游戏界面] 服务器接受到玩家回合结束
            case "Game_Loop": {
                app.activeCode = mes.contents
                break
            }
            // [游戏界面] 游戏结束了
            case "Game_End": {
                let playerInfo = app.players.find(player => player.code == mes.contents)
                showSuccess(playerInfo.showName + "赢了!")
                //
                app.gameStatus.step = "end"
                break
            }
        }
    }
}

// 单独游戏的信息处理
function handleWuzi(mes) {
    if (mes.to == app.keyCode || mes.to == 'all') { // 需要我处理的信息
        if (mes.category.split("_")[0] == "Server" ? checkServer() : !checkServer()) {
            switch (mes.category) {
                // [服务器界面] 有玩家落子了
                case "Server_ChessPut": {
                    // 接受到玩家的落子并更新至其他玩家
                    let { loc } = JSON.parse(mes.contents)
                    log(mes.from, "我落子在:" + loc.x + ";" + loc.y)
                    if (app.gamingInfos.chessMap[loc.x][loc.y].value > -1) {

                    }
                    else {
                        app.gamingInfos.chessMap[loc.x][loc.y].value = loc.color
                        app.players.map(player => {
                            log(player.code, "我已更新落子")
                            let message = {
                                category: "Game_ChessUpdate",
                                from: app.serverInfos.code,
                                to: player.code,
                                contents: JSON.stringify({
                                    loc
                                }),
                                remarks: "",
                            }
                            sendMessage(message)
                        })
                        // 这次落子胜利
                        if (WUZI_CheckWin(loc.x, loc.y)) {
                            log(mes.from, "我赢了")
                            app.players.map(player => {
                                log(player.code, "我收到有人赢了")
                                let message = {
                                    category: "Game_End",
                                    from: app.serverInfos.code,
                                    to: player.code,
                                    contents: mes.from,
                                    remarks: "",
                                }
                                sendMessage(message)
                            })
                        }
                        // 下个回合
                        else {
                            let palyerIndex = app.players.findIndex(player => player.code == mes.from)
                            let nextIndex = palyerIndex + 1 < app.players.length ? palyerIndex + 1 : 0
                            nextLoop(app.players[nextIndex].code)
                        }
                    }
                    break
                }
                // [游戏界面] 更新落子
                case "Game_ChessUpdate": {
                    let { loc } = JSON.parse(mes.contents)
                    putChess(loc.x, loc.y, loc.color)
                    break
                }
            }
        }
    }
}

// 当前为正在等待别人加入Room的状态
function checkRoom() {
    return app.serverInfos.type == 'multi' // 多人房
        && app.serverInfos.code == app.keyCode // 我是房主
        && app.serverInfos.isActive // 激活状态
        && app.gameStatus.step == 'waiting' // 正在等待别人加入
}
function checkServer() {
    return app.serverInfos.type == 'multi' // 多人房
        && app.serverInfos.code == app.keyCode // 我是房主
        && app.serverInfos.isActive // 激活状态
        && app.gameStatus.step == 'server' // 已经开始
}

// 下一回合
function nextLoop(code) {
    log(code, "轮到我了")
    app.players.map(player => {
        log(player.code, "我知道是谁的回合了")
        let message = {
            category: "Game_Loop",
            from: app.serverInfos.code,
            to: player.code,
            contents: code,
            remarks: "",
        }
        sendMessage(message)
    })
}

// 标记不同游戏玩家所需信息
function markPlayer() {
    app.players.map(player => {
        switch (app.gameInfos.type) {
            case "wuzi": {
                Object.assign(player, {
                    totalCount: 0, // 总共下了几步棋
                })
                break
            }
            case "uno": {
                Object.assign(player, {
                    pokers: [], // 手牌
                    clearUsed: null,
                    pokersUsed: [],
                })
                break
            }
            case "sanguokill": {
                Object.assign(player, {
                    pokers: [], // 手牌
                })
                break
            }
        }
    })
}
function onlinePlayer(code) {
    let playerInfo = app.players.find(player => player.code == code)
    playerInfo.isOnline = true
}
function offlinePlayer() {
    let message = {
        category: "ServerInfo_GameOffline",
        from: app.keyCode,
        to: hostCode,
        contents: "",
        remarks: "",
    }
    sendMessage(message)
}

// 获取服务器信息
function getinfoServer() {
    let hostCode = ExWeb.query("hostCode") ? ExWeb.query("hostCode") : app.keyCode // 我是玩家或房主
    let message = {
        category: "ServerInfo_Request",
        from: app.keyCode,
        to: hostCode,
        contents: "",
        remarks: "",
    }
    sendMessage(message)
}
function returnServer(code) {
    let gameInfos = ExObject.copy(app.gameInfos)
    gameInfos.ruleList = null
    //
    let message = {
        category: "ServerInfo_Response",
        from: app.serverInfos.code,
        to: code,
        contents: JSON.stringify({
            server: app.serverInfos,
            players: app.players,
            game: gameInfos,
            gaming: app.gamingInfos,
        }),
        remarks: "",
    }
    sendMessage(message)
    //
    if (app.gamingInfos) {
        nextLoop(app.activeCode)
    }
}
function recoverGamingInfos(infos) {
    switch (app.gameInfos.type) {
        case "wuzi": {
            const { chessMap } = infos
            chessMap.map((line, i) => {
                line.map((item, j) => {
                    if (item.value > -1) {
                        putChess(i, j, item.value)
                    }
                })
            })
            break
        }
    }
}

// 日志信息
function log(code, content) {
    app.serverRoom.logs.unshift({ code, content })
}
function clearLog() {
    app.serverRoom.logs = []
}

// 初始化游戏存储信息
function initialGamingInfos() {
    log(app.serverInfos.code, "初始化游戏所需信息")
    switch (app.gameInfos.type) {
        case "wuzi": {
            WUZI_InitialGamingInfos()
            break
        }
        case "uno": {
            UNO_InitialGamingInfos()
            // 开始发牌
            let firstCount = app.gameInfos.rulesPoker.initialCount * app.players.length
            while (firstCount > 0) {
                app.players.map(player => {
                    putPokers(1, player.code)
                    firstCount--;
                })
            }
            break
        }
    }
}

// 五子棋
function WUZI_InitialGamingInfos() {
    app.gamingInfos = {
        chessMap: [], // 棋盘信息
    }
    //
    let size = app.gameInfos.rules.size
    for (let i = 0; i < size; i++) {
        app.gamingInfos.chessMap[i] = []
        for (let j = 0; j < size; j++) {
            app.gamingInfos.chessMap[i][j] = {
                value: -1,
                loc: {
                    x: j,
                    y: i,
                },
            }
        }
    }
}
function WUZI_CheckWin(i, j) {
    let result = false, chessMap = app.gamingInfos.chessMap
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

// UNO
function UNO_InitialGamingInfos() {
    app.gamingInfos = {
        pokers: [], // 牌堆
        pokersUsed: [], // 墓地
        pokersLast: [], // 上几张牌的记录
        //
        status: "", // 特殊状态 +2|+4|ban
        step: 1, // 回合方向
    }
    //
    app.gamingInfos.pokers = shufflePokers(createPokers("uno"))
    console.log("Testing: ", app.gamingInfos.pokers)
}
// 给相应玩家相应数量的牌
function putPokers(count, code) {
    let result = []
    //
    for (let loop = 0; loop < count; loop++) {
        // 从牌堆中拿出最后一张牌
        let poker = objCopy(app.gamingInfos.pokers.pop())
        //
        app.players.map(player => {
            if (player.code == code) {
                log(code, "我拿到了" + count + "张牌：" + poker.name)
                let message = {
                    category: "Game_PutPoker",
                    from: app.serverInfos.code,
                    to: player.code,
                    contents: JSON.stringify({
                        poker,
                    }),
                    remarks: "",
                }
                sendMessage(message)
            }
            else {
                log(code, "我知道别人拿到了牌")
                let message = {
                    category: "Game_RefreshPokers",
                    from: app.serverInfos.code,
                    to: player.code,
                    contents: JSON.stringify({
                        players: app.players
                    }),
                    remarks: "",
                }
                sendMessage(message)
            }
        })
        //
        result.push(poker)
        // 牌堆已经用完了
        if (app.gameInfos.pokers.length < 1) {
            app.gameInfos.pokers = shufflePokers(ExArr.copy(app.gameInfos.pokersUsed))
            app.gameInfos.pokersUsed = []
        }
    }
    //
    return result
}
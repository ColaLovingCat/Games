function selectType(type) {
    console.log("[Game]: ", "***** 切换模式 *****")
    app.serverInfos.type = type
    switch (type) {
        case "single": {
            break
        }
        case "multi": {
            break
        }
    }
}
//
function createGame() {
    console.log("[Game]: ", "***** 创建房间 *****")
    if (app.serverInfos.type == "single") {
        console.log("[Game]: ", "***** 单机房间 *****")
        // 生成本机玩家并标记
        let playerInfo = createPlayer(0, null, app.gameInfos.type, false)
        app.players.push(playerInfo)
        // 标记房主
        app.serverInfos.hostCode = playerInfo.code
    }
    else {
        console.log("[Game]: ", "***** 多人房间 *****")
        // 通讯，检查名字是否有重复
        console.log("[Game]: ", "***** 检查房间名称 *****")
        let temp = checkRoomName(app.createInfos.name)
        if (temp) {
            // 生成本机玩家并标记
            let playerInfo = createPlayer(0, app.createInfos.playerName, app.gameInfos.type, app.keyCode, false)
            app.players.push(playerInfo)
            // 激活房间
            app.serverInfos = {
                type: "multi",
                //
                isActive: true,
                code: app.keyCode,
                name: app.createInfos.name,
                password: app.createInfos.password,
                limit: app.gameInfos.playerCount,
                hostCode: playerInfo.code, // 房主
            }
            console.log("[Game]: ", "***** 创建成功 *****")
            showRoom("host")
        }
        else {

        }
    }
}
// 检测房间名是否有效
function checkRoomName(name) {
    return true
}
function showRoom(type) {
    app.gameStatus.showRoom = type
}

// 
function getlistServers() {
    console.log("[Game]: ", "***** 加载房间 *****")
    app.serverList = []
    sendMessage({
        category: "board", // board|
        from: app.keyCode,
        to: "all",
        contents: "",
        remarks: "Rom_GetList",
    })
}
function addGame() {
    let message = {
        category: "single",
        from: app.keyCode,
        to: app.addInfos.code,
        contents: app.addInfos.playerName,
        remarks: "Involve_Request"
    }
    sendMessage(message)
    //
    console.log("[Game]: ", "***** 等待主机 *****")
    showRoom("wait")
}

function goGame() {
    console.log("[Game]: ", "***** 开始游戏 *****")
    window.open(app.gameInfos.type + "/index.html?keyCode=" + app.keyCode)
}


const gameList = [
    { // 五子棋
        type: "wuzi",
        playerCount: 2,
        rules: {
            size: 25, // 棋盘大小
            first: 0, // 先手
        },
        ruleList: [
            {
                title: "棋盘大小",
                key: "size",
                configs: [
                    { value: 25, text: "25" },
                    { value: 15, text: "15" },
                ]
            },
            {
                title: "先手",
                key: "first",
                configs: [
                    { value: 0, text: "黑棋" },
                    { value: 1, text: "白棋" },
                ]
            },
        ]
    },
    {
        type: "gupai",
        playerCount: 4,
        rules: {
            isForce: 0, // 不可出牌时是否强制抓牌
            isEnd: 100, // 游戏结束条件
        },
    },
]
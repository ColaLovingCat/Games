// 切换游戏规则
function changeRule(key, value) {
    console.info("[Game]: ", "***** 切换规则 *****")
    app.gameInfos.rules[key] = value
}

// 切换模式
function changeType(model) {
    console.info("[Game]: ", "***** 切换模式 *****")
    if (app.gameInfos.model.indexOf(model) > -1) {
        app.serverInfos.model = model
    }
    else {
        showError("无法切换到该模式")
    }
}

// 
function createGame() {
    if (app.serverInfos.model == "single") {
        console.info("[Game]: ", "***** 创建单机 *****")
        // 生成本机玩家并标记
        let playerInfo = createPlayer(0, null, app.gameInfos.type, app.keyCode, false)
        app.players.push(playerInfo)
        // 标记房主
        app.serverInfos.name = "单人房"
        app.serverInfos.code = playerInfo.code
        // 开始游戏
        startGame()
    }
    else {
        console.info("[Game]: ", "***** 多人房间 *****")
        // 通讯，检查名字是否有重复
        let temp = checkRoomName(app.createInfos.name)
        if (temp) {
            // 生成本机玩家
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
            }
            console.info("[Game]: ", "***** 房间创建成功 *****")
            // 进入房间页面
            app.gameStatus.step = "waiting"
            app.roomStatus = "waiting"
        }
        else {

        }
    }
}
// 检测房间名是否有效
function checkRoomName(name) {
    let result = true
    console.info("[Game]: ", "***** 检查房间名称 *****")
    return result
}

// 加入游戏
function addGame() {
    if (app.addInfos.code == "") {
        console.info("[Game]: ", "***** 搜索房间 *****")
        let message = {
            category: "Room_NameSearch",
            from: app.keyCode,
            to: "all",
            contents: JSON.stringify({
                infos: app.addInfos
            }),
            remarks: ""
        }
        sendMessage(message)
    }
    else {
        let message = {
            category: "Room_InvolveRequest",
            from: app.keyCode,
            to: app.addInfos.code,
            contents: JSON.stringify({
                infos: app.addInfos
            }),
            remarks: ""
        }
        sendMessage(message)
        console.info("[Game]: ", "***** 发送申请 *****")
        //
        app.gameStatus.step = "waiting"
        app.roomStatus = "search"
    }
}

// 开始游戏
function startGame() {
    console.info("[Game]: ", "***** 开始游戏 *****")
    // 携带keyCode跳转游戏界面
    window.open("pages/" + app.gameInfos.type + "/index.html?keyCode=" + app.serverInfos.code)
    // 当前页面转为server
    app.gameStatus.step = "server"
}

// 进入等待
function showRoom(type) {
    app.gameStatus.step = type
}
// 
function getlistRooms() {
    console.info("[Game]: ", "***** 搜索房间列表 *****")
    app.serverList = []
    sendMessage({
        category: "Room_ListRequest",
        from: app.keyCode,
        to: "all",
        contents: "",
        remarks: "",
    })
}
function refreshRoom() {
    getlistRooms()
}
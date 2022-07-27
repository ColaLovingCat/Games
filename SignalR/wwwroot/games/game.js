/**
 * @summary 创建用户
 * @params keyCode 默认为 player+(index + 1)
 * @params isRobot 默认为 机器人
 */
function createPlayer(index, name, type, keyCode = null, isRobot = true) {
    let result = {
        code: keyCode ? keyCode : "player" + (index + 1),
        order: index, // 排序
        type: isRobot ? "robot" : "user", // user|robot
        isOnline: false, // 是否在线
        isActive: false, // 激活
        status: "", // 状态 ban|plus
        //
        showName: name ? name : "player" + (index + 1),
        img: "player" + (index + 1) + ".png", // 头像
        //
        isResponse: true, // 轮询时标识位
        //
        isHost: false, // 房主
    }
    return result
}

/**
 * @summary 区分用户组别-当前用户/其余用户组
 * @param players
 * @param playerCode 当前用户code
 */
function groupPlayers(players, playerCode) {
    let result = {
        playerInfo: {},
        otherPlayers: [],
    }
    //
    let playerInfo = players.find(item => item.code == playerCode)
    result.playerInfo = playerInfo ? playerInfo : {}
    //
    let before = [], after = []
    let mark = true
    players.map(player => {
        if (player.code != playerCode) {
            if (mark) {
                after.push(player)
            }
            else {
                before.push(player)
            }
        }
        else {
            mark = false
        }
    })
    result.otherPlayers = before.concat(after)
    //
    return result
}

const gameList = [
    // chess
    { // 五子棋
        type: "wuzi",
        showName: "五子棋",
        isActive: true,
        //
        category: "chess",
        playerCount: 2,
        model: "multi",
        rules: {
            size: 25,
            first: 0,
            canRegret: false,
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
            {
                title: "可以悔棋",
                key: "canRegret",
                configs: [
                    { value: false, text: "否" },
                    { value: true, text: "是" },
                ]
            },
        ]
    },
    { // 象棋
        type: "CNchess",
        showName: "象棋",
        isActive: false,
        //
        category: "chess",
        playerCount: 2,
        model: "multi",
        rules: {
        },
        ruleList: [
        ]
    },
    // poker
    { // UNO
        type: "uno",
        showName: "UNO",
        isActive: false,
        //
        category: "poker",
        playerCount: 4,
        model: "single",
        rulesPoker: {
            initialCount: 7, // 起始手牌数
        },
        rules: {
            isPlus: true, // plus牌是否可叠加
            isForce: 0, // 不可出牌时
            isAuto: false, // 自动出牌
        },
        ruleList: [
            {
                title: "+2/+4牌可叠加",
                key: "isPlus",
                configs: [
                    { value: true, text: "开启" },
                    { value: false, text: "关闭" },
                ]
            },
            {
                title: "无法出牌时",
                key: "isForce",
                configs: [
                    { value: 0, text: "可跳过" },
                    { value: 1, text: "强制抓1张牌" },
                    { value: 2, text: "强制抓牌至可出" },
                ]
            },
            {
                title: "托管",
                key: "isAuto",
                configs: [
                    { value: true, text: "开启" },
                    { value: false, text: "关闭" },
                ]
            },
        ],
    },
    { // 斗地主
        type: "doudizhu",
        showName: "斗地主",
        isActive: false,
        //
        category: "poker",
        playerCount: 3,
        model: "multi",
        rules: {},
        ruleList: []
    },
    { // 麻将
        type: "mahjong",
        showName: "麻将",
        isActive: false,
        //
        category: "poker",
        playerCount: 4,
        model: "multi",
        rules: {
            type: "", // 类别
        },
        ruleList: [
            {
                title: "规则类别",
                key: "type",
                configs: [
                    { value: "普通", text: "普通" },
                    { value: "川麻", text: "川麻" },
                    { value: "日麻", text: "日麻" },
                ]
            },
        ]
    },
    { // 西洋骨牌
        type: "domino",
        showName: "西洋骨牌",
        isActive: false,
        //
        category: "poker",
        playerCount: 4,
        model: "single",
        rules: {
            isForce: 0, // 不可出牌时是否强制抓牌
            isEnd: 100, // 游戏结束条件
        },
        ruleList: [
        ],
    },
    { // 三国杀
        type: "threekill",
        showName: "三国杀",
        isActive: false,
        //
        category: "poker",
        playerCount: 8,
        model: "multi",
        rules: {
            isForce: 0, // 不可出牌时是否强制抓牌
            isEnd: 100, // 游戏结束条件
        },
        ruleList: [

        ],
    },
    { // 蜘蛛纸牌
        type: "spider",
        showName: "蜘蛛纸牌",
        isActive: false,
        //
        category: "poker",
        playerCount: 1,
        model: "single",
        rules: {
        },
        ruleList: [
        ]
    },
    // map
    { // 飞行棋
        type: "ludo",
        showName: "飞行棋",
        isActive: false,
        //
        category: "map",
        playerCount: 4,
        model: "multi",
        rules: {
        },
        ruleList: [
        ]
    },
    { // 大富翁
        type: "monopoly",
        showName: "大富翁",
        isActive: false,
        //
        category: "map",
        playerCount: 4,
        model: "multi",
        rules: {
        },
        ruleList: [
        ]
    },
    // other
    { // 扫雷
        type: "mine",
        showName: "扫雷",
        isActive: true,
        //
        category: "others",
        playerCount: 1,
        model: "single",
        rules: {
            size: 24,
            level: 1,
        },
        ruleList: [
        ]
    },
    { // 贪吃蛇
        type: "snack",
        showName: "贪吃蛇",
        isActive: false,
        //
        category: "others",
        playerCount: 1,
        model: "single",
        rules: {
            level: 1, // 起始难度
        },
        ruleList: [
        ]
    },
    { // 俄罗斯方块
        type: "tetris",
        showName: "俄罗斯方块",
        isActive: false,
        //
        category: "others",
        playerCount: 1,
        model: "single",
        rules: {
        },
        ruleList: [
        ]
    },
    { // 消消乐
        type: "xiaoxiaole",
        showName: "消消乐",
        isActive: true,
        //
        category: "others",
        playerCount: 1,
        model: "single",
        rules: {
        },
        ruleList: [
        ]
    },
]

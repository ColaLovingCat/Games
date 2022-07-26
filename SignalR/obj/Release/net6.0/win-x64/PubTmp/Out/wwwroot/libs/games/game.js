/**
 * @summary 创建用户
 * @param 创建用户
 */
function createPlayer(index, name, type, keyCode, isRobot = true) {
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
        isHost: false, // 房主
    }
    switch (type) {
        case "wuzi": {
            Object.assign(result, {
                totalCount: 0, // 总共下了几步棋
            })
            break
        }
        case "poker": {
            Object.assign(result, {
                pokers: [], // 手牌
                //
                clearUsed: null,
                pokersUsed: [],
            })
            break
        }
    }
    return result
}

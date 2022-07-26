/**
 * @summary 创建用户
 * @param 创建用户
 */
function createPlayer(index, name, isRobot = true) {
    return {
        code: "player" + (index + 1),
        order: index, // 排序
        type: isRobot ? "robot" : "user", // user|robot
        isActive: false, // 激活
        status: "", // 状态 ban|plus
        pokers: [], // 手牌
        //
        showName: name ? name : "player" + (index + 1),
        img: "player" + (index + 1) + ".png", // 头像
        //
        isHost: false, // 房主
        clearUsed: null,
        pokersUsed: [],
    }
}

/**
 * @summary 洗牌算法
 */
function shufflePokers(pokers) {
    let len = pokers.length
    pokers.map((poker, index) => {
        let changeIndex = index
        do {
            // 随机交换两张牌
            changeIndex = ExNumber.createRand(0, len)
        } while (changeIndex == index)
        pokers = ExArray.exchangeEle(pokers, index, changeIndex)
    })
    return pokers
}

/**
 * @summary 从牌堆中随机获取相应数量的牌
 */
function getPokers(pokers, count) {
    let result = {
        pokers: [],
        selected: []
    }
    //
    return result
}
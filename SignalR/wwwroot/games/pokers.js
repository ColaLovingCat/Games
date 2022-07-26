const pokerInfos = {
    uno: {
        decks: 2, // 副牌
        numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Ban", "Dir", "Plus", "Color", "PlusPlus"],
        colors: ["red", "yellow", "green", "blue"],
        discards: [119, 118, 117, 116, 111, 110, 109, 108, 7, 5, 3, 1], // 剔除
    }
}
function createPokers(type) {
    let result = []
    //
    pokerInfos[type].numbers.map((number, numberIndex) => {
        pokerInfos[type].colors.map((color, colorIndex) => {
            let _order = numberIndex * 10 + colorIndex
            let _color = color
            let _orderColor = colorIndex * 100 + numberIndex
            // 万能牌
            if (number == "Color" || number == "PlusPlus") {
                _order = numberIndex * 10
                _color = "blue_green_red_yellow"
                _orderColor = pokerInfos[type].colors.length * 100 + numberIndex
            }
            //
            for (let loop = 0; loop < pokerInfos[type].decks; loop++) {
                let poker = {
                    code: _order, // 索引
                    name: number + "_" + _color, // 标识
                    img: "poker-" + _order + ".png", // 图片
                    //
                    order: _orderColor, // 用于排序
                    orderNumber: numberIndex, // 用于比大小
                    orderColor: colorIndex, // 用于比花色
                    //
                    isCover: true, // 是否盖住
                    isSelected: false, // 是否选中
                    ownerInfo: null, // 拥有者信息
                }
                result.push(poker)
            }
        })
    })
    // 剔除不需要的牌
    pokerInfos[type].discards.map(index => {
        result.splice(index, 1);
    })
    //
    return result
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
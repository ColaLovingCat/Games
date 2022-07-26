function initialGame() {
    app.pokers = createPokers("uno")
}





const gameOptions = {
    bitHost: { // 斗地主
        decks: 1,
        discards: [],
        playerCout: 3,
        //
        isSingle: false,
        singleInfo: {
            initialCount: 0,
        },
        leftCount: 3,
        //
        pokerRules: {
            "A": { weight: 1, allNum: 1, minL: 5, maxL: 12 },
            "AA": { weight: 1, allNum: 2, minL: 3, maxL: 10 },
            "AAA": { weight: 1, allNum: 3, minL: 1, maxL: 6 },
            "AAAA": { weight: 2, allNum: 4, minL: 1, maxL: 1 },
            "AAAB": { weight: 1, allNum: 4, minL: 1, maxL: 5 },
            "AAABB": { weight: 1, allNum: 5, minL: 1, maxL: 4 },
            "AAAABC": { weight: 1, allNum: 6, minL: 1, maxL: 1 },
            "AB": { weight: 3, allNum: 2, minL: 1, maxL: 1 },
        }
    },
    uno: { // UNO
        decks: 2,
        discards: [119, 118, 117, 116, 111, 110, 109, 108, 7, 5, 3, 1],
        playerCout: 4,
        //
        isSingle: true,
        singleInfo: {
            initialCount: 7,
        },
        leftCount: 0,
        //
        pokerRules: {
            isPlus: true, // plus牌是否可叠加
            isForce: true, // 不可出牌时是否强制抓牌
            isAuto: false, // 自动出牌
        },
    }
}
// 获取牌的信息
function getinfoPoker(order) {
    let numberIndex = parseInt(order / 10);
    let color = colors[order % 10];
    let colorOder = colors.length * 100 + numberIndex;
    //
    if (numberIndex > 12) { color = "red_yellow_green_blue"; }
    //
    return {
        name: "poker_" + numbers[numberIndex] + "_" + color,
        number: numbers[numberIndex],
        color: color,
        img: "poker-" + order + ".png",
        order: order,
        colorOrder: colorOder,
        //
        isCover: false,
        isSelected: false,
        ownerInfo: {},
    }
}

// 检查牌是否有可出
function checkRule(poker, lastInfo, mark = false) {
    switch (lastInfo.poker.number) {
        case "PlusPlus": {
            if (lastInfo.plus != 0) {
                if (mark && poker.number.indexOf(lastInfo.poker.number) != -1) { // PlusPlus
                    return true;
                }
            }
            else {
                if (poker.color.indexOf(lastInfo.poker.color) != -1) { // 匹配颜色
                    return true;
                }
            }
            break;
        }
        case "Plus": {
            if (lastInfo.plus != 0) {
                if (mark && poker.number.indexOf(lastInfo.poker.number) != -1) { // PlusPlus|Plus
                    return true;
                }
            }
            else {
                if (poker.number.indexOf(lastInfo.poker.number) != -1) { // PlusPlus|Plus
                    return true;
                }
                if (poker.color.indexOf(lastInfo.poker.color) != -1) { // 匹配颜色
                    return true;
                }
            }
            break;
        }
        case "Ban": {
            if (lastInfo.ban) {
                if (poker.number.indexOf(lastInfo.poker.number) != -1) {
                    return true;
                }
                if (poker.color.indexOf(lastInfo.poker.color) != -1) {
                    return true;
                }
            }
            break;
        }
        case "Color": {
            if (poker.color.indexOf(lastInfo.poker.color) != -1) {
                return true;
            }
            break;
        }
        default: {
            if (poker.number.indexOf(lastInfo.poker.number) != -1) {
                return true;
            }
            if (poker.color.indexOf(lastInfo.poker.color) != -1) {
                return true;
            }
            break;
        }
    }
    return false;
}





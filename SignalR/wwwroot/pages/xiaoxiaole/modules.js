const emojis = ['😅', '🥵', '🤡', '🥶', '🤢']

// 存放所有棋子
let cells = []
// 选中的棋子
let cell1 = null
let cell2 = null

// 棋盘
class GameMap {
    // 构造宽高格子数和格子尺寸
    constructor(x, y, size, canvas) {
        this.x = x
        this.y = y
        this.size = size
        // 存放棋子
        this.types = emojis.length
        // 棋盘容器
        this.matrix = []
        //
        this.useSwap = false
        // 积分
        this.score = 0
        this.combo = 0
        // 画布可操作
        this.handleable = true
        // 画布元素
        this.canvas = canvas
    }

    // 初始化棋盘，填充 undefined
    genMatrix() {
        const { x, y } = this
        const row = new Array(x).fill(undefined)
        const matrix = new Array(y).fill(undefined).map(item => row)
        this.matrix = matrix
        return this
    }

    // 随机填满
    genRandoms() {
        this.matrix = this.matrix.map(row => row.map(item => this.getRandom()))
        return this
    }
    // 获取随机棋子
    getRandom() {
        return Math.floor(Math.random() * this.types)
    }

    // 用点阵生成Dom对象暂存
    init() {
        cells = []
        const { x, y } = this
        for (let i = 0; i < y; i++) {
            for (let j = 0; j < x; j++) {
                // 棋子种类
                const type = this.matrix[i][j]
                // undefined则自动补充emerge
                cells.push(new Cell({
                    type: (type == undefined) ? this.getRandom() : type,
                    position: [j, i],
                    status: (type == undefined) ? 'emerge' : 'common',
                    left: undefined,
                    top: undefined,
                    right: undefined,
                    bottom: undefined,
                    instance: undefined
                }))
            }
        }
        // DOM对象暂存
        cells.forEach(cell => {
            // 生成instance对象
            cell.genCell(this.size)
            // 记录四方棋子信息
            const [row, col] = cell.position
            cell.left = cells.find(_cell => {
                const [_row, _col] = _cell.position
                return (_row == row - 1) && (_col == col)
            })
            cell.right = cells.find(_cell => {
                const [_row, _col] = _cell.position
                return (_row == row + 1) && (_col == col)
            })
            cell.top = cells.find(_cell => {
                const [_row, _col] = _cell.position
                return (_row == row) && (_col == col - 1)
            })
            cell.bottom = cells.find(_cell => {
                const [_row, _col] = _cell.position
                return (_row == row) && (_col == col + 1)
            })
        })
        return this
    }
    // 渲染Dom
    genCellMap() {
        this.canvas.innerHTML = ''
        cells.forEach(cell => {
            this.canvas.append(cell.instance)
        })
        return this
    }

    // 棋子崩塌
    genCollapse() {
        return new Promise((resolve, reject) => {
            // 锁住操作
            this.handleable = false
            // 标记将会崩塌的棋子
            this.markCollapseCells()
            // 积分
            let count = this.getCountCollapse()
            if (count > 0) {
                this.combo++
                this.score += count * this.combo
                console.log("Testing: ", count, this.combo, this.score)
            }
            else {
                this.combo = 0
            }
            // 将标记的棋子缩小
            setTimeout(() => {
                cells.forEach(cell => {
                    if (cell.status == 'collapse') {
                        cell.instance.style.transform = 'scale(0)'
                    }
                });
            }, 0);
            // 延迟0.5s
            setTimeout(() => {
                resolve('ok')
            }, 500);
        });
    }
    // 标记将会崩塌的棋子
    markCollapseCells() {
        cells.forEach(cell => {
            const { left, right, top, bottom, type } = cell
            const status = 'collapse'
            // 横排三个
            if (left?.type == type && right?.type == type) {
                left.status = status
                cell.status = status
                right.status = status
            }
            // 竖排三个
            if (top?.type == type && bottom?.type == type) {
                top.status = status
                cell.status = status
                bottom.status = status
            }
        })
        return this
    }
    // 崩塌棋子的数量
    getCountCollapse() {
        let temp = cells.filter(cell => cell.status == 'collapse')
        return temp.length
    }

    // 棋子下坠
    genDownfall() {
        let _this = this
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                cells.forEach(cell => {
                    // 棋子本身不崩塌且下面包含已崩塌的棋子
                    if (cell.status != 'collapse') {
                        // 计算下坠高度
                        let downfallRange = 0
                        let bottom = cell.bottom
                        while (bottom) {
                            if (bottom.status == 'collapse') {
                                downfallRange += 1
                            }
                            bottom = bottom.bottom
                        }
                        //
                        cell.instance.style.top = (parseInt(cell.instance.style.top) + _this.size * downfallRange) + 'px'
                    }
                });
            }, 0)
            // 延迟0.5s
            setTimeout(() => {
                resolve('ok')
            }, 500)
        })
    }

    // 补充棋子
    genEmerge() {
        return new Promise((resolve, reject) => {
            this.regenCellMap()
            //
            setTimeout(() => {
                cells.forEach(cell => {
                    if (cell.status == 'emerge') {
                        cell.instance.style.transform = 'scale(1)'
                    }
                });
            }, 100);
            setTimeout(() => { resolve('ok'); }, 500);
        });
    }
    regenCellMap() {
        const size = this.size
        const findInstance = (x, y) => {
            return cells.find(item => {
                const { offsetLeft, offsetTop } = item.instance
                return (item.status != 'collapse' && (x == offsetLeft / size) && (y == offsetTop / size));
            })?.instance
        }
        // 剔除已崩塌的棋子后，生成新棋盘
        this.genMatrix()
        this.matrix = this.matrix.map((row, rowIndex) => row.map((item, itemIndex) => findInstance(itemIndex, rowIndex)?.type))
        // 渲染Dom
        this.init()
        this.genCellMap()
    }

    // 循环
    async genLoop() {
        await this.genCollapse()
        let status = cells.some(cell => cell.status == 'collapse')
        // 存在崩塌的棋子则循环
        while (cells.some(cell => cell.status == 'collapse')) {
            await this.genDownfall()
            await this.genEmerge()
            await this.genCollapse()
        }
        //
        this.handleable = true
        return status
    }

    // 点击棋子
    clickCell(ele) {
        if (this.handleable) {
            const _cell = cells.find(item => item.instance == ele)
            if (!this.useSwap) {
                ele.className = 'active'
                cell1 = _cell
            } else {
                cell2 = _cell
                cell1.instance.className = ''
                if (['left', 'top', 'bottom', 'right'].some(item => cell1[item] == cell2)) {
                    (async () => {
                        await this.genSwap(cell1, cell2)
                        let res = await this.genLoop()
                        if (!res) {
                            await this.genSwap(cell1, cell2)
                        }
                    })()
                }
            }
            this.useSwap = !this.useSwap
        }
    }
    // 交换棋子
    genSwap(firstCell, secondCell) {
        return new Promise((resolve, reject) => {
            const { instance: c1, type: t1 } = firstCell
            const { instance: c2, type: t2 } = secondCell
            const { left: x1, top: y1 } = c1.style
            const { left: x2, top: y2 } = c2.style
            setTimeout(() => {
                c1.style.left = x2
                c1.style.top = y2
                c2.style.left = x1
                c2.style.top = y1
            }, 0);
            setTimeout(() => {
                firstCell.instance = c2
                firstCell.type = t2
                secondCell.instance = c1
                secondCell.type = t1
                resolve('ok')
            }, 500);
        });
    }

    // 随机交换位置
    genShuffle() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const len = this.x * this.y
                const arr = new Array(len).fill(0).map((_, i) => i)
                const shuffle = arr => arr.sort(() => 0.5 - Math.random())
                const shuffleArray = shuffle(arr)
                //
                cells.forEach((cell, index) => {
                    const newPosition = shuffleArray[index]
                    cell.instance.style.top = Math.floor(newPosition / this.x) * this.size + 'px'
                    cell.instance.style.left = newPosition % this.x * this.size + 'px'
                });
            }, 0);
            //
            setTimeout(() => {
                this.regenCellMap()
                this.genCellMap()
                this.genLoop()
                resolve('ok')
            }, 500);
        });
    }
}

// 棋子
class Cell {
    constructor(options) {
        const { type, position, left, top, right, bottom, status, instance } = options;
        // 棋子种类
        this.type = type;
        // [m,n]
        this.position = position;
        // 'common' 普通| 'collapse' 崩塌| 'emerge' 冒出
        this.status = status;
        // 记录四个方位的棋子信息
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        // Dom对象
        this.instance = instance;
    }

    genCell(size) {
        const cell = document.createElement('div')
        cell.type = this.type;
        const [x, y] = this.position;
        cell.style.cssText =
            `
            position:absolute;
            left:${size * x}px;
            top:${size * y}px;
            width:${size}px;
            height:${size}px;
            border:5px solid transparent;
            border-radius: 5px;
            transform:scale(${this.status == 'emerge' ? '0' : '1'});
            transition:0.5s;
            display:flex;
            justify-content:center;
            align-items:center
            `;
        cell.innerHTML = `<span style="cursor:pointer; font-size:${size * 0.7}px;">${emojis[this.type]}</span>`;
        //
        this.instance = cell;
    }
}
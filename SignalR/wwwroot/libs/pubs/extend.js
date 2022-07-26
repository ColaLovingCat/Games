ExString = {
    /** 
    * @summary 生成uuid，默认可生成标准uuid
    * @param len 字符长度
    * @param radix 字符范围
    */
    uuid: function (len = null, radix = null) {
        let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
        let s = [], i;
        radix = radix || chars.length;
        if (len) {
            // Compact form
            for (i = 0; i < len; i++) s[i] = chars[0 | Math.random() * radix]
        }
        else {
            // rfc4122, version 4 form
            let r
            // rfc4122 requires these characters
            s[8] = s[13] = s[18] = s[23] = '-';
            s[14] = '4';
            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!s[i]) {
                    r = 0 | Math.random() * 16;
                    s[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return s.join('')
    },
}

ExNumber = {
    /** 
     * @summary 创建随机数，包含左右值
     */
    createRand: function (min, max, point = 0) {
        if (point === 0) {
            return Math.round(min + Math.random() * (max - min));
        }
        else {
            let up = Math.pow(10, point);
            return min + Math.round(Math.random() * (max - min) * up) / up;
        }
    },
}

ExArray = {
    /** 
    * @summary 检查索引是否可用
    */
    checkIndex: function (arr, index) {
        return index > -1 && index < arr.length
    },
    /** 
    * @summary 将json对象转为请求参数格式
    */
    copy: function (arr) {
        return deepCopyArr(arr)
    },
    /**
     * @summary 交换在数组的位置
     */
    exchangeEle: function (arr, index1, index2) {
        if (this.checkIndex(arr, index1) && this.checkIndex(arr, index2)) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        }
        return arr
    },
    /**
     * @summary 切换数组中该值的状态，没有则添加，有则删除
     */
    switchEle: function (arr, value) {
        let tempIndex = this.checkExist(arr, value)
        if (this.checkExist(arr, value) == -1) { // 未找到
            arr.push(value)
        }
        else { // 删除元素
            arr.splice(tempIndex, 1)
        }
    },
    switchEleby: function (arr, obj, prop) {
        let tempIndex = arr.findIndex(item => {
            return item[prop] == obj[prop]
        })
        if (tempIndex == -1) {  // 未找到
            arr.push(obj)
        }
        else { // 删除元素
            arr.splice(tempIndex, 1)
        }
    },
    /**
     * @summary 排序
     */
    sort: function (arr, sortBy = "asc") {
        arr.sort((a, b) => {
            if (sortBy == "asc") {
                return a - b
            }
            else {
                return b - a
            }
        })
        return arr
    },
    sortEleby: function (arr, func, sortBy = "asc") {
        arr.sort((a, b) => {
            if (sortBy == "asc") {
                return func(a) - func(b)
            }
            else {
                return func(b) - func(a)
            }
        })
        return arr
    },
    /**
     * @summary forEach
     */
    forEach: function (arr, func) {
        for (let loop = 0; loop < arr.length; loop++) {
            func.call(arr, arr[loop], loop)
        }
    },
    /**
    * @summary 两数组联查
    * @param type 0-简单合并| 1-交集| 2-并集 |3-差集
    */
    intersect: function (arr1, arr2, type = 0) {
        switch (type) {
            case 1: return arr1.filter(item => arr2.includes(item))
            case 2: return arr1.concat(arr2.filter(item => !arr1.includes(item)))
            case 3: return arr1.filter(item => !arr2.includes(item))
            default: return arr1.concat(arr2)
        }
    },
}

ExObject = {
    /** 
     * @summary 
     */
    copy: function (arr) {
        return deepCopyObj(arr)
    },
}

ExWeb = {
    /** 
     * @summary 浏览器类型
     */
    browser: function () {
        let userAgent = navigator.userAgent
        console.log(userAgent)
        try {
            let isFF = userAgent.indexOf("Firefox") > -1; // Firefox
            let isEdge = userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1 // IE的Edge
            let isOpera = userAgent.indexOf("Opera") > -1; // Opera
            let isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; // Chrome
            let isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; // Safari
            let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
            if (!isIE) isIE = userAgent.indexOf("Trident") > -1; // IE
            //
            if (isIE) {
                let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                if (reIE.test(userAgent)) {
                    let fIEVersion = parseFloat(RegExp["$1"]);
                    if (fIEVersion == 7) {
                        return "IE7";
                    } else if (fIEVersion == 8) {
                        return "IE8";
                    } else if (fIEVersion == 9) {
                        return "IE9";
                    } else if (fIEVersion == 10) {
                        return "IE10";
                    } else if (fIEVersion == 11) {
                        return "IE11";
                    } else {
                        return "";
                    }//IE版本过低
                    return "IE";
                }
                reIE = new RegExp("Trident/(\\d+\\.\\d+);");
                if (reIE.test(userAgent)) {
                    let fIEVersion = parseFloat(RegExp["$1"]);
                    if (fIEVersion == 7) {
                        return "IE11";
                    } else if (fIEVersion == 6) {
                        return "IE10";
                    } else if (fIEVersion == 5) {
                        return "IE9";
                    } else if (fIEVersion == 4) {
                        return "IE8";
                    }//IE版本过低
                    return "IE";
                }
            }
            if (isOpera) {
                return "Opera";
            }
            if (isEdge) {
                return "Edge";
            }
            if (isFF) {
                return "Firefox";
            }
            if (isSafari) {
                return "Safari";
            }
            if (isChrome) {
                return "Chrome";
            }
            return "";
        }
        catch (e) {
            return "Error";
        }
    },
    /** 
     * @summary 判断是android还是ios还是web
     */
    device: function () {
        var ua = navigator.userAgent.toLowerCase()
        if (ua.indexOf("iphone os") > -1 || ua.indexOf("ipad") > -1) { // ios
            return 'iOS'
        }
        if (ua.indexOf("android") > -1) {
            return 'Android'
        }
        return 'Web'
    },
    /** 
     * @summary url地址信息
     */
    url: function () {
        let localHost = document.location
        //
        let reg = new RegExp("^(http|https)://", "i")
        if (reg.test(localHost.href)) {
            return {
                type: 'server',  // 地址
                url: localHost.href,  // 地址
                server: localHost.origin, // 服务器+端口
                protocol: localHost.protocol, // 协议
                host: localHost.hostname, // 服务器
                port: localHost.port, // 端口
                path: localHost.pathname, // 页面路径
                param: localHost.search, // 参数
            };
        }
        else {
            return {
                type: 'file',
                path: localHost.href, // 页面路径
            }
        }
    },
    /** 
     * @summary 请求参数集
     */
    params: function () {
        let sHref = window.location.href
        let args = sHref.split('?')
        if (args[0] === sHref) {
            return ''
        }
        let hrefarr = args[1].split('#')[0].split('&')
        let obj = {}
        for (let i = 0; i < hrefarr.length; i++) {
            let temp = hrefarr[i].split('=')
            obj[temp[0]] = temp[1]
        }
        return obj
    },
    /** 
     * @summary 获取单一请求参数
     */
    query: function (prop) {
        let result = null
        let reg = new RegExp("(^|&)" + prop + "=([^&]*)(&|$)", "i") // 不区分大小写
        let host = window.location.search.substr(1)
        if (reg.test(host)) {
            let r = host.match(reg)
            result = r ? decodeURI(r[2]) : null
        }
        return result;
    },
    /** 
     * @summary 视口尺寸
     */
    viewSize: function () {
        if (window.innerWidth) {
            return {
                w: window.innerWidth,
                h: window.innerHeight
            }
        } else {
            // ie8及其以下
            if (document.compatMode === "BackCompat") {
                // 怪异模式
                return {
                    w: document.body.clientWidth,
                    h: document.body.clientHeight
                }
            } else {
                // 标准模式
                return {
                    w: document.documentElement.clientWidth,
                    h: document.documentElement.clientHeight
                }
            }
        }
    },
    /** 
     * @summary 关闭窗口
     */
    close: function () {
        window.opener = null;
        window.open('', '_self');
        window.close();
    },
}

/** 
* @summary 深拷贝
*/
function deepCopyArr(arr) {
    return arr.concat();
}
/** 
* @summary 深拷贝
*/
function deepCopyObj(obj) {
    let objCopy = {};
    for (let item in obj) {
        switch (typeof obj[item]) {
            case 'object': {
                if (obj[item] instanceof Array) {
                    objCopy[item] = deepCopyArr(obj[item]);
                }
                else {
                    objCopy[item] = deepCopyObj(obj[item]);
                }
                break
            }
            default: {
                objCopy[item] = obj[item];
                break
            }
        }
    }
    return objCopy;
}
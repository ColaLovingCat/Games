function showSuccess(message) {
    showNotify("success", message)
}
function showInfo(message) {
    showNotify("info", message)
}
function showError(message) {
    showNotify("error", message)
}

const Box_Notify = document.getElementById("notify")
function showNotify(status, message) {
    let ele = document.createElement("div")
    ele.className = "notify-item item-" + status
    ele.innerHTML = message
    Box_Notify.appendChild(ele)
    setTimeout(() => {
        ele.style.top = "-50px"
        setTimeout(() => {
            Box_Notify.removeChild(ele)
        }, 200)
    }, 3000)
}
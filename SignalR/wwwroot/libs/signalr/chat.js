"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build()

// 建立连接
function startCon() {
    connection.start().then(function () {
        console.log("[SignalR]: ", "Start")
        afterStart()
    }).catch(function (err) {
        return console.error(err.toString())
    })
    connection.on("ReceiveMessage", function (message) {
        console.log("[SignalR] Receive: ", message)
        getMessage(message)
    })
}

/**
 * 
 * @param {string} category 类别
 * @param {string} from 
 * @param {string} to 
 * @param {string} contents 
 * @param {string} remarks 
 */
function sendMessage(message) {
    console.log("[SignalR] Send: ", message)
    connection.invoke("SendMessage", message).catch(function (err) {
        return console.error(err.toString())
    })
    event.preventDefault()
}
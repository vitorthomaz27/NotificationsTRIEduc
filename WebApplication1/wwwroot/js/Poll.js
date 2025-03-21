﻿"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/pollHub").build();
var chartBlock = '\u1234';

connection.on("ReceiveMessage", function (user, message, myChannelId, myChannelVal) {

    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var pollResultMsg = user + " votou em '" + myChannelVal + "'.";

    var ulPoll = document.getElementById("messagesList");
    var liPollResult = document.createElement("li");
    liPollResult.textContent = pollResultMsg;

    ulPoll.insertBefore(liPollResult, ulPoll.childNodes[0]);

    document.getElementById(myChannelId + 'Block').innerHTML += chartBlock;
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = "";

    if (!user) {
        user = "[Anônimo]";
    }

    if ($('input:radio[name=myChannel]').is(':checked')) {
        var myChannelId = $('input[name=myChannel]:checked').attr('id');
        var myChannelVal = $('input[name=myChannel]:checked').val();
        connection.invoke("SendMessage", user, message, myChannelId, myChannelVal).catch(function (err) {
            return console.error(err.toString());
        });
    } else {
        return console.log("Não possui nenhum tipo de votação selecionado.");
    }

    event.preventDefault();
});

// Função para exibir notificação de alteração no banco
function showDatabaseNotification(message) {
    const notificationContainer = document.getElementById("notification-container");

    if (!notificationContainer) return;

    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `<strong>Sistema:</strong> ${message}`;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000); // Remove após 5 segundos
}
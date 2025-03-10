"use strict";

// Estabelece a conexão com o SignalR Hub
var connection = new signalR.HubConnectionBuilder().withUrl("/pollHub").build();

// Escuta o evento de notificação vindo do servidor
connection.on("ReceiveMessage", function (user, message, myChannelId, myChannelVal) {
    // Cria uma mensagem fixa de notificação
    var simpleNotificationMsg = "notificação";

    // Insere a notificação na lista de notificações
    var notificationList = document.getElementById("notificationList");
    var liNotification = document.createElement("li");
    liNotification.textContent = simpleNotificationMsg;
    notificationList.insertBefore(liNotification, notificationList.childNodes[0]);

    // Exibe a notificação na aba
    showNotificationTab();
});

// Inicia a conexão com o SignalR Hub
connection.start().catch(function (err) {
    console.error("Erro ao conectar com o SignalR Hub: ", err.toString());
});

// Função para mostrar a aba de notificações, caso não esteja visível
function showNotificationTab() {
    var notificationsTab = document.getElementById("notifications-tab");
    var notificationsTabContent = document.getElementById("notifications");

    // Verifica se a aba de notificações está ativa, caso contrário, ativa
    if (!notificationsTab.classList.contains("active")) {
        notificationsTab.classList.add("active");
        notificationsTabContent.classList.add("show", "active");
    }
}

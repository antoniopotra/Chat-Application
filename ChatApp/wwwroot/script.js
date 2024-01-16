'use strict';

var SIGNALR_URL = '/chathub';
var connection = null;

var loginButton = document.getElementById('loginButton');
var sendButton = document.getElementById('sendButton');
var usernameInput = document.getElementById('usernameInput');
var statusSpan = document.getElementById('statusSpan');
var chatForm = document.getElementById('chatForm');
var chatBody = document.getElementById('chatBody');
var chatFooter = document.getElementById('chatFooter');
var onlineStatus = document.getElementById('onlineStatus');
var messageList = document.getElementById('messageList');
var textareaMessage = document.getElementById('textareaMessage');
var chatUsername = document.getElementById('chatUsername');

loginButton.addEventListener('click', connect);
usernameInput.addEventListener('keydown', (keypress) => {
    if (keypress.key == 'Enter') {
        connect();
    }
});

sendButton.addEventListener('click', sendMessage);
textareaMessage.addEventListener('keypress', (keypress) => {
    if (keypress.key == 'Enter') {
        sendMessage();
    }
});

function connect() {
    if (checkValue(usernameInput.value)) {
        setStatus('Please enter username');
        return;
    }

    const onSuccess = () => {
        connection.invoke('SetUsername', usernameInput.value);
        initalizeSignalREvents();
        setConnected();
        setStatus('Connected succesfully.');

        textareaMessage.focus();
    };
    const onError = (error) => {
        setDisconnected();
        setStatus('Something went wrong: ' + error);
    };

    connection = new signalR.HubConnectionBuilder()
        .withUrl(SIGNALR_URL)
        .build();
    connection.start()
        .then(onSuccess)
        .catch(onError);
}

function sendMessage() {
    if (checkValue(textareaMessage.value)) {
        setStatus('Please enter message');
        return;
    }

    connection.invoke('SendMessage', textareaMessage.value);
    textareaMessage.value = '';
    textareaMessage.focus();
}

function initalizeSignalREvents() {
    const onJoin = (username, count) => {
        addMessage(username + ' joined');
        setOnlineCount(count);
        chatBody.scrollTop = chatBody.scrollHeight;
    };
    const onNewMessage = (username, message) => {
        var messageElement = document.createElement('li');
        messageElement.textContent = message;
        var messageInfo = document.createElement('b');
        messageInfo.textContent = username + ': ';
        messageElement.insertAdjacentElement('afterbegin', messageInfo);
        messageList.insertAdjacentElement('beforeend', messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    };
    const onLeft = (username, count) => {
        addMessage(username + ' left');
        setOnlineCount(count);
        chatBody.scrollTop = chatBody.scrollHeight;
    };
    const onClose = (error) => {
        setDisconnected();
        setStatus(error);
    };

    connection.on('OnJoin', onJoin);
    connection.on('OnLeft', onLeft);
    connection.on('OnNewMessage', onNewMessage);
    connection.onclose(onClose);
}

function addMessage(content) {
    var messageElement = document.createElement('li');
    messageElement.textContent = content;
    messageElement.className = 'text-center';
    messageList.insertAdjacentElement('beforeend', messageElement);
}

function setOnlineCount(count) {
    if (count == 1) {
        onlineStatus.textContent = count + ' user online';
    } else {
        onlineStatus.textContent = count + ' users online';
    }
}

function setConnected() {
    chatUsername.textContent = usernameInput.value;
    onlineStatus.classList.remove('d-none');
    chatForm.classList.add('d-none');
    chatBody.classList.remove('d-none');
    chatFooter.classList.remove('d-none');
}

function setDisconnected() {
    chatUsername.textContent = 'Chat Room';
    onlineStatus.classList.add('d-none');
    chatForm.classList.remove('d-none');
    chatBody.classList.add('d-none');
    chatFooter.classList.add('d-none');
}

function setStatus(message) {
    statusSpan.textContent = message;
    setTimeout(function () {
        statusSpan.textContent = null;
    }, 1500);
}

function checkValue(value) {
    return value == null || value.trim() == '';
}

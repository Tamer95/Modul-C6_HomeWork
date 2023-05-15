
const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const locationButton = document.getElementById('location-button');

// Создание WebSocket-подключения
const socket = new WebSocket('wss://echo-ws-service.herokuapp.com');

// Обработчик события открытия соединения
socket.onopen = () => {
    console.log('WebSocket соединение установлено.');
};

// Обработчик события получения сообщения
socket.onmessage = (event) => {
    const message = event.data;
    appendMessageToChat(message);
};

// Обработчик события закрытия соединения
socket.onclose = () => {
    console.log('WebSocket соединение закрыто.');
};

// Функция отправки сообщения на сервер
function sendMessage() {
    const message = messageInput.value;
    socket.send(message);
    appendMessageToChat(message);
    messageInput.value = '';
}

// Функция добавления сообщения в окно чата
function appendMessageToChat(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Обработчик клика на кнопку "Отправить"
sendButton.addEventListener('click', () => {
    sendMessage();
});

// Обработчик нажатия клавиши Enter в поле ввода сообщения
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Обработчик клика на кнопку "Геолокация"
locationButton.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const mapLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=16`;
            socket.send(mapLink);
            appendMessageToChat(`Моя геолокация: ${mapLink}`);
        }, (error) => {
            console.log('Ошибка получения геолокации:', error.message);
        });
    } else {
        console.log('Геолокация не поддерживается в вашем браузере.');
    }
});
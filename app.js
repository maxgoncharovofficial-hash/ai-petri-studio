// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Настройка Telegram Web App
    tg.ready();
    tg.expand();
    
    // Показываем контент после загрузки
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        
        updateStatus('Мини-ап готов к работе');
    }, 1000);
});

// Функция обновления статуса
function updateStatus(text) {
    const statusElement = document.getElementById('status-text');
    if (statusElement) {
        statusElement.textContent = text;
    }
}

// Функция для отправки данных в Telegram
function sendToTelegram(data) {
    if (tg && tg.sendData) {
        tg.sendData(JSON.stringify(data));
    }
}

// Экспорт функций для использования в других модулях
window.ThreadsZAVOD = {
    updateStatus,
    sendToTelegram,
    tg
}; 
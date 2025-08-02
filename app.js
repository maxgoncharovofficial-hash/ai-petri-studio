// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Настройка Telegram Web App
    tg.ready();
    tg.expand();
    
    // Инициализация обработчиков событий
    initializeCardHandlers();
    
    // Анимация появления карточек
    animateCards();
});

// Инициализация обработчиков для карточек
function initializeCardHandlers() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardId = this.id;
            handleCardClick(cardId);
        });
        
        // Добавляем эффект при нажатии
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Обработка кликов по карточкам
function handleCardClick(cardId) {
    switch(cardId) {
        case 'personality-card':
            handlePersonality();
            break;
        case 'threads-zavod-card':
            handleThreadsZavod();
            break;
        case 'threads-card':
            handleThreads();
            break;
        case 'midjourney-card':
            handleMidjourney();
            break;
        case 'projects-card':
            handleProjects();
            break;
        case 'settings-card':
            handleSettings();
            break;
        case 'profile-card':
            handleProfile();
            break;
        default:
            console.log('Неизвестная карточка:', cardId);
    }
}

// Обработчики для каждой карточки
function handlePersonality() {
    console.log('РАСПАКОВКА ЛИЧНОСТИ clicked');
    sendToTelegram({
        action: 'personality',
        message: 'Открыт раздел РАСПАКОВКА ЛИЧНОСТИ'
    });
}

function handleThreadsZavod() {
    console.log('THREADS ZAVOD clicked');
    // Здесь будет логика для THREADS ZAVOD
    sendToTelegram({
        action: 'threads_zavod',
        message: 'Открыт раздел THREADS ZAVOD'
    });
}

function handleThreads() {
    console.log('THREADS clicked');
    sendToTelegram({
        action: 'threads',
        message: 'Открыт раздел THREADS'
    });
}

function handleMidjourney() {
    console.log('MidJourney AI clicked');
    sendToTelegram({
        action: 'midjourney',
        message: 'Открыт раздел MidJourney AI'
    });
}

function handleProjects() {
    console.log('Мои проекты clicked');
    sendToTelegram({
        action: 'projects',
        message: 'Открыт раздел Мои проекты'
    });
}

function handleSettings() {
    console.log('Настройки clicked');
    sendToTelegram({
        action: 'settings',
        message: 'Открыт раздел Настройки'
    });
}

function handleProfile() {
    console.log('Профиль clicked');
    sendToTelegram({
        action: 'profile',
        message: 'Открыт раздел Профиль'
    });
}

// Анимация появления карточек
function animateCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Функция для отправки данных в Telegram
function sendToTelegram(data) {
    if (tg && tg.sendData) {
        tg.sendData(JSON.stringify(data));
    }
}

// Функция для показа уведомлений
function showNotification(message) {
    if (tg && tg.showAlert) {
        tg.showAlert(message);
    }
}

// Функция для показа подтверждения
function showConfirm(message, callback) {
    if (tg && tg.showConfirm) {
        tg.showConfirm(message, callback);
    }
}

// Экспорт функций для использования в других модулях
window.ThreadsZAVOD = {
    handlePersonality,
    handleThreadsZavod,
    handleThreads,
    handleMidjourney,
    handleProjects,
    handleSettings,
    handleProfile,
    sendToTelegram,
    showNotification,
    showConfirm,
    tg
};

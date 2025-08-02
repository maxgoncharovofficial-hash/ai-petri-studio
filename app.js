// Инициализация Telegram Web App
let tg = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Проверяем доступность Telegram Web App
        if (window.Telegram && window.Telegram.WebApp) {
            tg = window.Telegram.WebApp;
            
            // Настройка Telegram Web App
            tg.ready();
            tg.expand();
            
            console.log('Telegram Web App инициализирован успешно');
        } else {
            console.warn('Telegram Web App недоступен');
        }
    } catch (error) {
        console.error('Ошибка инициализации Telegram Web App:', error);
    }
    
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
    
    // Haptic feedback
    try {
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    } catch (error) {
        console.error('Ошибка haptic feedback:', error);
    }
    
    // Показываем уведомление
    try {
        if (tg && tg.showAlert) {
            tg.showAlert('Открываю раздел РАСПАКОВКА ЛИЧНОСТИ...');
        } else {
            alert('Открываю раздел РАСПАКОВКА ЛИЧНОСТИ...');
        }
    } catch (error) {
        console.error('Ошибка показа уведомления:', error);
        alert('Открываю раздел РАСПАКОВКА ЛИЧНОСТИ...');
    }
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
    try {
        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify(data));
        } else {
            console.warn('Telegram Web App недоступен для отправки данных');
        }
    } catch (error) {
        console.error('Ошибка отправки данных в Telegram:', error);
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

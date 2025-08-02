// Инициализация Telegram Web App
let tg = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Проверяем доступность Telegram Web App
        if (window.Telegram && window.Telegram.WebApp) {
            tg = window.Telegram.WebApp;
            console.log('Telegram Web App найден:', tg);

            // Настройка Telegram Web App
            tg.ready();
            console.log('tg.ready() выполнен');
            tg.expand();
            console.log('tg.expand() выполнен');

            console.log('Telegram Web App инициализирован успешно');
            console.log('Доступные методы:', Object.keys(tg));
        } else {
            console.warn('Telegram Web App недоступен');
            console.log('window.Telegram:', window.Telegram);
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
            console.log('Haptic feedback выполнен');
        }
    } catch (error) {
        console.error('Ошибка haptic feedback:', error);
    }
    
    // Отправляем данные в бота для перехода в раздел распаковки личности
    try {
        if (tg && tg.sendData) {
            const data = {
                action: 'personality_unpack',
                message: 'Открыт раздел РАСПАКОВКА ЛИЧНОСТИ'
            };
            console.log('Отправляем данные в бота:', data);
            tg.sendData(JSON.stringify(data));
            console.log('Данные отправлены успешно');
        } else {
            console.log('sendData недоступен, показываем alert');
            alert('Открываю раздел РАСПАКОВКА ЛИЧНОСТИ...');
        }
    } catch (error) {
        console.error('Ошибка отправки данных:', error);
        alert('Открываю раздел РАСПАКОВКА ЛИЧНОСТИ...');
    }
}

// Обработчики для подразделов распаковки личности
function handleProductSection() {
    console.log('Распаковка продукта clicked');
    try {
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    } catch (error) {
        console.error('Ошибка haptic feedback:', error);
    }
    
    try {
        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify({
                action: 'unpack_product',
                message: 'Открыт раздел Распаковка продукта'
            }));
        }
    } catch (error) {
        console.error('Ошибка отправки данных:', error);
    }
}

function handleAudienceSection() {
    console.log('Распаковка аудитории clicked');
    try {
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    } catch (error) {
        console.error('Ошибка haptic feedback:', error);
    }
    
    try {
        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify({
                action: 'unpack_audience',
                message: 'Открыт раздел Распаковка аудитории'
            }));
        }
    } catch (error) {
        console.error('Ошибка отправки данных:', error);
    }
}

function handleCasesSection() {
    console.log('Распаковка кейсов clicked');
    try {
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    } catch (error) {
        console.error('Ошибка haptic feedback:', error);
    }
    
    try {
        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify({
                action: 'unpack_cases',
                message: 'Открыт раздел Распаковка кейсов'
            }));
        }
    } catch (error) {
        console.error('Ошибка отправки данных:', error);
    }
}

function handlePersonalityLiteSection() {
    console.log('Распаковка личности Lite clicked');
    try {
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    } catch (error) {
        console.error('Ошибка haptic feedback:', error);
    }
    
    try {
        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify({
                action: 'unpack_personality_lite',
                message: 'Открыт раздел Распаковка личности Lite'
            }));
        }
    } catch (error) {
        console.error('Ошибка отправки данных:', error);
    }
}

function handlePersonalityProSection() {
    console.log('Распаковка личности Pro clicked');
    try {
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    } catch (error) {
        console.error('Ошибка haptic feedback:', error);
    }
    
    try {
        if (tg && tg.sendData) {
            tg.sendData(JSON.stringify({
                action: 'unpack_personality_pro',
                message: 'Открыт раздел Распаковка личности Pro'
            }));
        }
    } catch (error) {
        console.error('Ошибка отправки данных:', error);
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

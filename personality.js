// Personality Page JavaScript

// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Настройка Telegram Web App
    tg.ready();
    tg.expand();
    
    // Инициализация обработчиков событий
    initializeSectionHandlers();
    
    // Анимация появления элементов
    animateElements();
});

// Инициализация обработчиков для секций
function initializeSectionHandlers() {
    const sections = document.querySelectorAll('.section-card');
    
    sections.forEach(section => {
        section.addEventListener('click', function() {
            const sectionId = this.id;
            handleSectionClick(sectionId);
        });
        
        // Добавляем эффект при нажатии
        section.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        section.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Обработка кликов по секциям
function handleSectionClick(sectionId) {
    switch(sectionId) {
        case 'product-section':
            handleProductSection();
            break;
        case 'audience-section':
            handleAudienceSection();
            break;
        case 'cases-section':
            handleCasesSection();
            break;
        case 'personality-lite-section':
            handlePersonalityLiteSection();
            break;
        case 'personality-pro-section':
            handlePersonalityProSection();
            break;
        default:
            console.log('Неизвестная секция:', sectionId);
    }
}

// Обработчики для каждого раздела
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

// Функция возврата на главную страницу
function goBack() {
    console.log('Back button clicked');
    sendToTelegram({
        action: 'back_to_main',
        message: 'Возврат на главную страницу'
    });
    window.location.href = 'index.html';
}

// Анимация появления элементов
function animateElements() {
    const elements = document.querySelectorAll('.progress-section, .section-card, .advice-section');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
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

// Функция обновления прогресса
function updateProgress(filledQuestions, totalQuestions) {
    const percentage = Math.round((filledQuestions / totalQuestions) * 100);
    const progressFill = document.querySelector('.progress-fill');
    const statValue = document.querySelector('.stat-value');
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    if (statValue) {
        statValue.textContent = filledQuestions + '/' + totalQuestions;
    }
}

// Экспорт функций для использования в других модулях
window.PersonalityPage = {
    handleProductSection,
    handleAudienceSection,
    handleCasesSection,
    handlePersonalityLiteSection,
    handlePersonalityProSection,
    goBack,
    sendToTelegram,
    showNotification,
    showConfirm,
    updateProgress,
    tg
}; 
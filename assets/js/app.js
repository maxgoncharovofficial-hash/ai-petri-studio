// AiPetri Studio - Main Application JavaScript v30.31

// === TELEGRAM WEB APP INTEGRATION ===
const isTelegramWebApp = typeof window.Telegram !== 'undefined' && window.Telegram.WebApp;

// Универсальная система инициализации
function initializeApp() {
    console.log('🚀 Initializing AiPetri Studio...');
    console.log('📱 Telegram Web App detected:', isTelegramWebApp);
    
    if (isTelegramWebApp) {
        initTelegramWebApp();
    } else {
        initStandardWebApp();
    }
}

// Telegram инициализация
function initTelegramWebApp() {
    console.log('🤖 Initializing Telegram Web App...');
    
    try {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Применяем тему Telegram
        applyTelegramTheme();
        
        // Персонализация через данные пользователя
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            updateUserInterface(user);
        }
        
        // Настройка Telegram кнопок
        setupTelegramUI();
        
        console.log('✅ Telegram Web App initialized successfully');
    } catch (error) {
        console.warn('⚠️ Telegram Web App init failed, fallback to standard:', error);
        initStandardWebApp();
    }
}

// Стандартная веб-инициализация (fallback)
function initStandardWebApp() {
    console.log('🌐 Initializing Standard Web App...');
    document.body.classList.add('standard-mode');
    console.log('✅ Standard Web App initialized');
}

// Применение темы Telegram
function applyTelegramTheme() {
    if (!isTelegramWebApp) return;
    
    const WebApp = Telegram.WebApp;
    document.body.classList.add('telegram-mode');
    
    // Применяем цвета темы
    document.documentElement.style.setProperty('--tg-theme-bg-color', WebApp.backgroundColor || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-text-color', WebApp.textColor || '#000000');
    document.documentElement.style.setProperty('--tg-theme-hint-color', WebApp.hintColor || '#999999');
    document.documentElement.style.setProperty('--tg-theme-link-color', WebApp.linkColor || '#0088cc');
    document.documentElement.style.setProperty('--tg-theme-button-color', WebApp.buttonColor || '#0088cc');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', WebApp.buttonTextColor || '#ffffff');
}

// Персонализация интерфейса
function updateUserInterface(user) {
    console.log('👤 Personalizing for user:', user.first_name);
    
    // Добавляем имя пользователя в заголовок если есть элемент
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle && user.first_name) {
        headerTitle.textContent = `Привет, ${user.first_name}! 👋`;
    }
}

// Настройка Telegram UI
function setupTelegramUI() {
    if (!isTelegramWebApp) return;
    
    // BackButton для главной страницы не нужен
    Telegram.WebApp.BackButton.hide();
    
    console.log('🎨 Telegram UI configured (main page)');
}

// Универсальный хэптик-фидбек
function triggerHapticFeedback(type = 'medium') {
    if (isTelegramWebApp) {
        try {
            Telegram.WebApp.HapticFeedback.impactOccurred(type);
        } catch (error) {
            console.warn('Haptic feedback failed:', error);
        }
    }
}

// Обработчики для каждой карточки с Telegram интеграцией
function handlePersonality() {
    console.log('РАСПАКОВКА ЛИЧНОСТИ clicked');
    triggerHapticFeedback('light');
    window.location.href = 'pages/personality.html';
}

function handleThreadsZavod() {
    console.log('THREADS ZAVOD clicked');
    triggerHapticFeedback('light');
    window.location.href = 'pages/threads.html';
}



function handleContentCreation() {
    console.log('СОЗДАНИЕ КОНТЕНТА clicked');
    triggerHapticFeedback('light');
    alert('Раздел СОЗДАНИЕ КОНТЕНТА в разработке');
}

function handleMonitoring() {
    console.log('МОНИТОРИНГ clicked');
    triggerHapticFeedback('light');
    alert('Раздел МОНИТОРИНГ в разработке');
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Приложение инициализировано');
    
    // Запускаем универсальную инициализацию
    initializeApp();
    
    // Добавляем обработчики кликов для карточек
    const personalityCard = document.getElementById('personality-card');
    if (personalityCard) {
        personalityCard.addEventListener('click', handlePersonality);
        personalityCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handlePersonality();
        });
    }
    

    
    const threadsZavodCard = document.getElementById('threads-zavod-card');
    if (threadsZavodCard) {
        threadsZavodCard.addEventListener('click', handleThreadsZavod);
        threadsZavodCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handleThreadsZavod();
        });
    }
    
    // Добавляем анимацию для карточек
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
});

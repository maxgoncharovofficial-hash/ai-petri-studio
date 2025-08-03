// Threads ZAVOD Navigation JavaScript
// Главная страница с карточками разделов

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Threads ZAVOD main page loaded');
    
    initializeBackButton();
    initializeCards();
    loadMainPageData();
});

// === КНОПКА НАЗАД ===
function initializeBackButton() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Back button clicked - going to index.html');
            window.location.href = '../index.html';
        });
        
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Back button touched - going to index.html');
            window.location.href = '../index.html';
        });
    } else {
        console.error('Back button not found!');
    }
}

// === КАРТОЧКИ РАЗДЕЛОВ ===
function initializeCards() {
    console.log('Initializing cards...');
    
    const connectionCard = document.getElementById('connection-section');
    const autopilotCard = document.getElementById('autopilot-section');
    const createCard = document.getElementById('create-section');
    
    console.log('Cards found:', {
        connection: !!connectionCard,
        autopilot: !!autopilotCard,
        create: !!createCard
    });
    
    if (connectionCard) {
        console.log('Adding listeners to connection card');
        connectionCard.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Connection section clicked - navigating...');
            window.location.href = 'threads-connection.html';
        });
        
        connectionCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Connection section touched - navigating...');
            window.location.href = 'threads-connection.html';
        });
    } else {
        console.error('Connection card not found!');
    }
    
    if (autopilotCard) {
        console.log('Adding listeners to autopilot card');
        autopilotCard.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Autopilot section clicked - navigating...');
            window.location.href = 'threads-autopilot.html';
        });
        
        autopilotCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Autopilot section touched - navigating...');
            window.location.href = 'threads-autopilot.html';
        });
    } else {
        console.error('Autopilot card not found!');
    }
    
    if (createCard) {
        console.log('Adding listeners to create card');
        createCard.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Create section clicked - navigating...');
            window.location.href = 'threads-create.html';
        });
        
        createCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Create section touched - navigating...');
            window.location.href = 'threads-create.html';
        });
    } else {
        console.error('Create card not found!');
    }
}

// === ЗАГРУЗКА ДАННЫХ ГЛАВНОЙ СТРАНИЦЫ ===
function loadMainPageData() {
    console.log('Loading main page data...');
    
    // Обновляем статусы карточек
    updateConnectionStatus();
    updateAutopilotStatus();
    updateCreateStatus();
}

function updateConnectionStatus() {
    const connectionData = getFromStorage('threads_connection');
    const scheduleData = getFromStorage('threads_schedule');
    const statusElement = document.getElementById('connection-status');
    
    if (connectionData && connectionData.connected && scheduleData) {
        statusElement.textContent = '[Настроен]';
        statusElement.style.color = '#28a745';
        
        // Убираем приоритет если настроено
        const connectionCard = document.getElementById('connection-section');
        connectionCard.classList.remove('priority');
    } else if (connectionData && connectionData.connected) {
        statusElement.textContent = '[Подключен]';
        statusElement.style.color = '#ffc107';
    } else {
        statusElement.textContent = '[Настроить]';
        statusElement.style.color = '#dc3545';
    }
}

function updateAutopilotStatus() {
    const autopilotData = getFromStorage('threads_autopilot');
    const connectionData = getFromStorage('threads_connection');
    const statusElement = document.getElementById('autopilot-status');
    
    if (autopilotData && autopilotData.active && connectionData && connectionData.connected) {
        statusElement.textContent = '[Активен]';
        statusElement.style.color = '#28a745';
    } else if (connectionData && connectionData.connected) {
        statusElement.textContent = '[Готов]';
        statusElement.style.color = '#ffc107';
    } else {
        statusElement.textContent = '[Неактивен]';
        statusElement.style.color = '#6c757d';
    }
}

function updateCreateStatus() {
    const drafts = getFromStorage('threads_drafts') || [];
    const scheduled = getFromStorage('threads_scheduled_posts') || [];
    const statusElement = document.getElementById('create-counter');
    
    const totalContent = drafts.length + scheduled.length;
    
    if (totalContent > 0) {
        statusElement.textContent = `[${totalContent} готово]`;
        statusElement.style.color = '#28a745';
    } else {
        statusElement.textContent = '[0 черновиков]';
        statusElement.style.color = '#6c757d';
    }
}

// === УТИЛИТЫ ЛОКАЛЬНОГО ХРАНИЛИЩА ===
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log('Data saved to storage:', key);
    } catch (error) {
        console.error('Error saving to storage:', error);
    }
}

function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from storage:', error);
        return null;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        console.log('Data removed from storage:', key);
    } catch (error) {
        console.error('Error removing from storage:', error);
    }
}

// === ОТЛАДКА ===
console.log('Threads main navigation loaded successfully');

// Экспорт функций для отладки
window.threadsMainDebug = {
    saveToStorage,
    getFromStorage,
    removeFromStorage,
    loadMainPageData
};
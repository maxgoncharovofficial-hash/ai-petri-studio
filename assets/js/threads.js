// Threads ZAVOD Navigation JavaScript
// Главная страница с карточками разделов

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Threads ZAVOD main page loaded');
    
    initializeBackButton();
    initializeCards();
    loadMainPageData();
    updateMainPageStats();
});

// === КНОПКА НАЗАД ===
function initializeBackButton() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
        
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            window.location.href = '../index.html';
        });
    }
}

// === КАРТОЧКИ РАЗДЕЛОВ ===
function initializeCards() {
    const connectionCard = document.getElementById('connection-section');
    const autopilotCard = document.getElementById('autopilot-section');
    const createCard = document.getElementById('create-section');
    
    if (connectionCard) {
        connectionCard.addEventListener('click', function() {
            console.log('Connection section clicked');
            window.location.href = 'threads-connection.html';
        });
        
        connectionCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            window.location.href = 'threads-connection.html';
        });
    }
    
    if (autopilotCard) {
        autopilotCard.addEventListener('click', function() {
            console.log('Autopilot section clicked');
            window.location.href = 'threads-autopilot.html';
        });
        
        autopilotCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            window.location.href = 'threads-autopilot.html';
        });
    }
    
    if (createCard) {
        createCard.addEventListener('click', function() {
            console.log('Create section clicked');
            window.location.href = 'threads-create.html';
        });
        
        createCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            window.location.href = 'threads-create.html';
        });
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

// === ОБНОВЛЕНИЕ СТАТИСТИКИ ГЛАВНОЙ СТРАНИЦЫ ===
function updateMainPageStats() {
    updateMainAutopilotStatus();
    updateMainScheduledCount();
    updateMainDraftsCount();
}

function updateMainAutopilotStatus() {
    const autopilotData = getFromStorage('threads_autopilot');
    const connectionData = getFromStorage('threads_connection');
    const scheduleData = getFromStorage('threads_schedule');
    const statusElement = document.getElementById('main-autopilot-status');
    
    if (autopilotData && autopilotData.active && 
        connectionData && connectionData.connected && 
        scheduleData) {
        statusElement.textContent = '🟢 Активен';
        statusElement.style.color = '#28a745';
    } else if (connectionData && connectionData.connected && scheduleData) {
        statusElement.textContent = '🟡 Готов к запуску';
        statusElement.style.color = '#ffc107';
    } else if (connectionData && connectionData.connected) {
        statusElement.textContent = '🔶 Требует настройки';
        statusElement.style.color = '#fd7e14';
    } else {
        statusElement.textContent = '🔴 Не настроен';
        statusElement.style.color = '#dc3545';
    }
}

function updateMainScheduledCount() {
    const scheduled = getFromStorage('threads_scheduled_posts') || [];
    const queue = getFromStorage('threads_queue_posts') || [];
    const statusElement = document.getElementById('main-scheduled-count');
    
    const totalScheduled = scheduled.length + queue.length;
    statusElement.textContent = totalScheduled;
}

function updateMainDraftsCount() {
    const drafts = getFromStorage('threads_drafts') || [];
    const statusElement = document.getElementById('main-drafts-count');
    
    statusElement.textContent = drafts.length;
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
    updateMainPageStats,
    loadMainPageData
};
};
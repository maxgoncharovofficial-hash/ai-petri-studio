// Threads Autopilot Page JavaScript
// Управление автопилотом и просмотр расписания

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Threads Autopilot page loaded');
    
    initializeBackButton();
    initializeAutopilot();
    initializeNavigation();
    loadAutopilotData();
    updateAIRequirements();
});

// === КНОПКА НАЗАД ===
function initializeBackButton() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'threads.html';
        });
        
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            window.location.href = 'threads.html';
        });
    }
}

// === НАВИГАЦИЯ ===
function initializeNavigation() {
    const connectionButton = document.getElementById('go-to-connection');
    const createButton = document.getElementById('go-to-create');
    const personalityButton = document.getElementById('go-to-personality');
    const setupButton = document.getElementById('setup-autopilot');
    
    if (connectionButton) {
        connectionButton.addEventListener('click', function() {
            window.location.href = 'threads-connection.html';
        });
    }
    
    if (createButton) {
        createButton.addEventListener('click', function() {
            window.location.href = 'threads-create.html';
        });
    }
    
    if (personalityButton) {
        personalityButton.addEventListener('click', function() {
            window.location.href = 'personality.html';
        });
    }
    
    if (setupButton) {
        setupButton.addEventListener('click', function() {
            window.location.href = 'threads-connection.html';
        });
    }
}

// === АВТОПИЛОТ ===
function initializeAutopilot() {
    const pauseButton = document.getElementById('pause-autopilot');
    const skipButton = document.getElementById('skip-post');
    const createButton = document.getElementById('create-now');
    const calendarButton = document.getElementById('view-calendar');
    const settingsButton = document.getElementById('modify-settings');
    
    if (pauseButton) {
        pauseButton.addEventListener('click', toggleAutopilot);
    }
    
    if (skipButton) {
        skipButton.addEventListener('click', skipNextPost);
    }
    
    if (createButton) {
        createButton.addEventListener('click', createPostNow);
    }
    
    if (calendarButton) {
        calendarButton.addEventListener('click', toggleCalendarView);
    }
    
    if (settingsButton) {
        settingsButton.addEventListener('click', function() {
            window.location.href = 'threads-connection.html';
        });
    }
}

function loadAutopilotData() {
    const autopilotData = getFromStorage('threads_autopilot');
    const connectionData = getFromStorage('threads_connection');
    const scheduleData = getFromStorage('threads_schedule');
    
    // Проверяем настроен ли автопилот
    if (!connectionData?.connected || !scheduleData) {
        showSetupRequired();
        return;
    }
    
    showActiveAutopilot();
    updateAutopilotStatus();
    updateScheduleDisplay();
    updateQueueCount();
    updateStatistics();
}

function showSetupRequired() {
    document.getElementById('setup-required').style.display = 'block';
    document.getElementById('active-autopilot').style.display = 'none';
}

function showActiveAutopilot() {
    document.getElementById('setup-required').style.display = 'none';
    document.getElementById('active-autopilot').style.display = 'block';
}

function updateAutopilotStatus() {
    const autopilotData = getFromStorage('threads_autopilot');
    const connectionData = getFromStorage('threads_connection');
    const statusDot = document.getElementById('autopilot-dot');
    const statusText = document.getElementById('autopilot-status');
    const accountElement = document.getElementById('autopilot-account');
    
    if (autopilotData && autopilotData.active) {
        statusDot.textContent = '🟢';
        statusText.textContent = 'Активен';
    } else {
        statusDot.textContent = '🔴';
        statusText.textContent = 'Неактивен';
    }
    
    if (connectionData && connectionData.connected) {
        accountElement.textContent = `@${connectionData.username}`;
    } else {
        accountElement.textContent = 'Не подключен';
    }
}

function updateScheduleDisplay() {
    const scheduleData = getFromStorage('threads_schedule');
    const todayContainer = document.getElementById('today-posts');
    const tomorrowContainer = document.getElementById('tomorrow-posts');
    
    if (!scheduleData) {
        todayContainer.innerHTML = '<div class="post-item">Расписание не настроено</div>';
        tomorrowContainer.innerHTML = '<div class="post-item">Расписание не настроено</div>';
        return;
    }
    
    // Генерируем посты на сегодня
    const today = new Date();
    const todayPosts = generateDayPosts(today, scheduleData);
    todayContainer.innerHTML = todayPosts;
    
    // Генерируем посты на завтра
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPosts = generateDayPosts(tomorrow, scheduleData);
    tomorrowContainer.innerHTML = tomorrowPosts;
}

function generateDayPosts(date, scheduleData) {
    const currentTime = new Date();
    let html = '';
    
    scheduleData.postingTimes.forEach((time, index) => {
        const [hours, minutes] = time.split(':').map(Number);
        const postTime = new Date(date);
        postTime.setHours(hours, minutes, 0, 0);
        
        let status = '⏳ Ожидание';
        let content = 'Пост готов к публикации';
        
        // Определяем статус поста
        if (date.toDateString() === currentTime.toDateString()) {
            if (postTime < currentTime) {
                status = '✅ Опубликовано';
                content = 'Пост опубликован';
            } else {
                const timeDiff = postTime - currentTime;
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                
                if (hours > 0) {
                    content = `Через ${hours}ч ${minutes}мин`;
                } else {
                    content = `Через ${minutes}мин`;
                }
            }
        }
        
        html += `
            <div class="post-item">
                <span class="post-time">${time}</span>
                <span class="post-status">${status}</span>
                <span class="post-content">${content}</span>
            </div>
        `;
    });
    
    return html || '<div class="post-item">Нет запланированных постов</div>';
}

function updateQueueCount() {
    const queueElement = document.getElementById('queue-count');
    const scheduledPosts = getFromStorage('threads_scheduled_posts') || [];
    const queuePosts = getFromStorage('threads_queue_posts') || [];
    
    queueElement.textContent = scheduledPosts.length + queuePosts.length;
}

function updateStatistics() {
    const publishedPosts = getFromStorage('threads_published_posts') || [];
    const scheduledPosts = getFromStorage('threads_scheduled_posts') || [];
    const queuePosts = getFromStorage('threads_queue_posts') || [];
    
    // Обновляем статистику
    document.getElementById('total-published').textContent = publishedPosts.length;
    
    // Посты сегодня
    const today = new Date().toDateString();
    const todayPublished = publishedPosts.filter(post => 
        new Date(post.publishedAt).toDateString() === today
    ).length;
    document.getElementById('today-published').textContent = todayPublished;
    
    // Запланированные
    document.getElementById('scheduled-posts').textContent = scheduledPosts.length + queuePosts.length;
    
    // Успешность (заглушка)
    document.getElementById('success-rate').textContent = '98%';
}

function toggleAutopilot() {
    const autopilotData = getFromStorage('threads_autopilot') || {};
    autopilotData.active = !autopilotData.active;
    
    saveToStorage('threads_autopilot', autopilotData);
    updateAutopilotStatus();
    
    const action = autopilotData.active ? 'запущен' : 'приостановлен';
    alert(`Автопилот ${action}`);
}

function skipNextPost() {
    alert('Следующий пост пропущен');
    // Здесь будет логика пропуска поста
}

function createPostNow() {
    window.location.href = 'threads-create.html';
}

function toggleCalendarView() {
    const calendarSection = document.getElementById('calendar-section');
    if (calendarSection.style.display === 'none') {
        calendarSection.style.display = 'block';
        generatePublishingCalendar();
    } else {
        calendarSection.style.display = 'none';
    }
}

function generatePublishingCalendar() {
    const container = document.getElementById('publishing-calendar');
    // Заглушка календаря
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #6c757d;">
            <div style="font-size: 48px; margin-bottom: 16px;">📅</div>
            <div>Календарь публикаций</div>
            <div style="font-size: 14px; margin-top: 8px;">В разработке</div>
        </div>
    `;
}

// === ПРОВЕРКА ТРЕБОВАНИЙ ИИ ===
function updateAIRequirements() {
    const productData = getFromStorage('product_data');
    const audienceData = getFromStorage('audience_data');
    const liteData = getFromStorage('personality_lite_data');
    const proData = getFromStorage('personality_pro_data');
    
    // Обновляем статусы требований
    updateRequirement('req-product', productData && Object.keys(productData).length > 1);
    updateRequirement('req-audience', audienceData && Object.keys(audienceData).length > 1);
    updateRequirement('req-style', liteData && Object.keys(liteData).length > 1);
    updateRequirement('req-expertise', proData && Object.keys(proData).length > 1);
    
    // Обновляем прогресс ИИ
    updateAIProgress();
}

function updateRequirement(elementId, isMet) {
    const element = document.getElementById(elementId);
    if (element) {
        const statusElement = element.querySelector('.req-status');
        statusElement.textContent = isMet ? '✅' : '❌';
    }
}

function updateAIProgress() {
    const requirements = [
        getFromStorage('product_data'),
        getFromStorage('audience_data'),
        getFromStorage('personality_lite_data'),
        getFromStorage('personality_pro_data')
    ];
    
    const metCount = requirements.filter(req => req && Object.keys(req).length > 1).length;
    const progress = Math.round((metCount / requirements.length) * 100);
    
    document.getElementById('ai-progress-fill').style.width = `${progress}%`;
    document.getElementById('ai-progress-text').textContent = `${progress}%`;
}

function goToSection(section) {
    const routes = {
        'product': 'product.html',
        'audience': 'audience.html',
        'personality-lite': 'personality-lite.html',
        'personality-pro': 'personality-pro.html'
    };
    
    if (routes[section]) {
        window.location.href = routes[section];
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

// === ОТЛАДКА ===
console.log('Threads Autopilot JavaScript loaded successfully');
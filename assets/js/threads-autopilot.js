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
    updateQueueCount();
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
    const editScheduleButton = document.getElementById('edit-schedule');
    
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
    
    if (editScheduleButton) {
        editScheduleButton.addEventListener('click', openScheduleEditor);
    }
    
    // Инициализация модального окна
    initializeScheduleModal();
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
    const pauseButton = document.getElementById('pause-autopilot');
    
    if (autopilotData && autopilotData.active) {
        statusDot.textContent = '🟢';
        statusText.textContent = 'Активен';
        if (pauseButton) {
            pauseButton.innerHTML = '⏸️ Приостановить автопилот';
            pauseButton.classList.remove('active');
        }
    } else {
        statusDot.textContent = '🔴';
        statusText.textContent = 'Неактивен';
        if (pauseButton) {
            pauseButton.innerHTML = '▶️ Запустить автопилот';
            pauseButton.classList.add('active');
        }
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
    const scheduleData = getFromStorage('threads_schedule');
    
    if (scheduleData && scheduleData.postingTimes) {
        // Считаем посты на сегодня как готовые в очереди
        const todayPostsCount = scheduleData.postingTimes.length;
        queueElement.textContent = todayPostsCount;
    } else {
        queueElement.textContent = '0';
    }
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

// === РЕДАКТОР РАСПИСАНИЯ ===
function openScheduleEditor() {
    const modal = document.getElementById('schedule-modal');
    if (modal) {
        modal.style.display = 'flex';
        loadCurrentSchedule();
    }
}

function closeScheduleEditor() {
    const modal = document.getElementById('schedule-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function initializeScheduleModal() {
    const modal = document.getElementById('schedule-modal');
    const closeBtn = document.getElementById('close-schedule-modal');
    const cancelBtn = document.getElementById('cancel-schedule');
    const saveBtn = document.getElementById('save-schedule');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeScheduleEditor);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeScheduleEditor);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveNewSchedule);
    }
    
    // Клик вне модального окна закрывает его
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeScheduleEditor();
            }
        });
    }
    
    // Переключение типа расписания
    const typeButtons = document.querySelectorAll('.type-button');
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const type = this.dataset.type;
            if (type === 'daily') {
                document.getElementById('daily-schedule').style.display = 'block';
                document.getElementById('custom-schedule').style.display = 'none';
            } else {
                document.getElementById('daily-schedule').style.display = 'none';
                document.getElementById('custom-schedule').style.display = 'block';
            }
        });
    });
    
    // Изменение количества постов в день
    const dailyPostsInput = document.getElementById('daily-posts');
    if (dailyPostsInput) {
        dailyPostsInput.addEventListener('change', updateDailyTimeSlots);
    }
    
    // Добавление времени
    const addTimeBtn = document.getElementById('add-daily-time');
    if (addTimeBtn) {
        addTimeBtn.addEventListener('click', addTimeSlot);
    }
    
    // Инициализация временных слотов
    updateDailyTimeSlots();
}

function loadCurrentSchedule() {
    const scheduleData = getFromStorage('threads_schedule');
    if (scheduleData && scheduleData.postingTimes) {
        const dailyPostsInput = document.getElementById('daily-posts');
        if (dailyPostsInput) {
            dailyPostsInput.value = scheduleData.postingTimes.length;
            updateDailyTimeSlots();
            
            // Заполняем времена
            setTimeout(() => {
                const timeSlots = document.querySelectorAll('.time-slot input[type="time"]');
                scheduleData.postingTimes.forEach((time, index) => {
                    if (timeSlots[index]) {
                        timeSlots[index].value = time;
                    }
                });
            }, 100);
        }
    }
}

function updateDailyTimeSlots() {
    const container = document.getElementById('daily-time-slots');
    const count = parseInt(document.getElementById('daily-posts').value) || 6;
    
    if (!container) return;
    
    container.innerHTML = '';
    
    // Стандартные времена для разного количества постов
    const defaultTimes = {
        1: ['12:00'],
        2: ['10:00', '16:00'],
        3: ['09:00', '13:00', '18:00'],
        4: ['09:00', '12:00', '15:00', '18:00'],
        5: ['09:00', '12:00', '15:00', '17:00', '19:00'],
        6: ['09:00', '13:00', '15:00', '16:00', '18:00', '19:00'],
        7: ['09:00', '11:00', '13:00', '15:00', '17:00', '18:00', '19:00'],
        8: ['09:00', '11:00', '13:00', '14:00', '15:00', '17:00', '18:00', '19:00'],
        9: ['09:00', '10:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        10: ['09:00', '10:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
    };
    
    const times = defaultTimes[count] || defaultTimes[6];
    
    times.forEach((time, index) => {
        addTimeSlot(time);
    });
}

function addTimeSlot(defaultTime = '12:00') {
    const container = document.getElementById('daily-time-slots');
    if (!container) return;
    
    const timeSlot = document.createElement('div');
    timeSlot.className = 'time-slot';
    timeSlot.innerHTML = `
        <span>Время публикации:</span>
        <input type="time" value="${defaultTime}">
        <button class="remove-time" onclick="removeTimeSlot(this)">Удалить</button>
    `;
    
    container.appendChild(timeSlot);
}

function removeTimeSlot(button) {
    const timeSlot = button.closest('.time-slot');
    if (timeSlot) {
        timeSlot.remove();
        
        // Обновляем счетчик постов
        const count = document.querySelectorAll('.time-slot').length;
        document.getElementById('daily-posts').value = count;
    }
}

function saveNewSchedule() {
    const timeSlots = document.querySelectorAll('.time-slot input[type="time"]');
    const postingTimes = Array.from(timeSlots).map(input => input.value).filter(time => time);
    
    if (postingTimes.length === 0) {
        alert('❌ Добавьте хотя бы одно время публикации');
        return;
    }
    
    // Сортируем времена по возрастанию
    postingTimes.sort();
    
    const newScheduleData = {
        postsPerDay: postingTimes.length,
        startDate: new Date().toISOString(),
        postingTimes: postingTimes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Сохраняем новое расписание
    saveToStorage('threads_schedule', newScheduleData);
    
    // Очищаем старые логи
    clearOldScheduleLogs();
    
    // Обновляем отображение
    updateScheduleDisplay();
    updateStatistics();
    updateQueueCount();
    
    // Закрываем модальное окно
    closeScheduleEditor();
    
    alert('✅ Расписание успешно обновлено!');
}

function clearOldScheduleLogs() {
    // Очищаем старые данные расписания
    localStorage.removeItem('threads_today_posts');
    localStorage.removeItem('threads_tomorrow_posts');
    localStorage.removeItem('threads_queue_posts');
    
    console.log('Old schedule logs cleared');
}

// === ОТЛАДКА ===
console.log('Threads Autopilot JavaScript loaded successfully');
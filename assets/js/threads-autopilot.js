// Threads Autopilot Page JavaScript
// Управление автопилотом и просмотр расписания

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Threads Autopilot page loaded');
    
    initializeBackButton();
    initializeAutopilot();
    initializeNavigation();
    initializeTabs();
    initializeScheduleManager();
    initializePostsGenerator();
    initializeQueueManager();
    initializeControlButtons();
    loadAutopilotData();
    updateAIRequirements();
    updateQueueCount();
    updateTodayPosts();
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
    
    // Защита от отсутствующих элементов
    if (todayContainer) {
        if (!scheduleData) {
            todayContainer.innerHTML = '<div class="post-item">Расписание не настроено</div>';
        } else {
            const today = new Date();
            const todayPosts = generateDayPosts(today, scheduleData);
            todayContainer.innerHTML = todayPosts;
        }
    }
    
    if (tomorrowContainer) {
        if (!scheduleData) {
            tomorrowContainer.innerHTML = '<div class="post-item">Расписание не настроено</div>';
        } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowPosts = generateDayPosts(tomorrow, scheduleData);
            tomorrowContainer.innerHTML = tomorrowPosts;
        }
    }
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
    const queuePosts = getFromStorage('threads_queue_posts') || [];
    
    // Считаем реальное количество постов в очереди
    queueElement.textContent = queuePosts.length;
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
    const wasActive = autopilotData.active;
    
    if (wasActive) {
        stopAutopilot();
    } else {
        startAutopilot();
    }
    
    updateAutopilotStatus();
    
    const action = !wasActive ? 'запущен' : 'приостановлен';
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

// === АВТОМАТИЧЕСКАЯ ПУБЛИКАЦИЯ ===

/**
 * Проверка и выполнение запланированных публикаций
 */
async function checkScheduledPosts() {
    const scheduleData = getFromStorage('threads_schedule');
    const connectionData = getFromStorage('threads_connection');
    
    if (!scheduleData || !connectionData?.connected) {
        console.log('No schedule or connection data available');
        return;
    }

    // Инициализируем API если еще не инициализирован
    if (!window.threadsAPI.accessToken && connectionData.accessToken) {
        await window.ThreadsIntegration.initFromStorage();
    }

    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    // Проверяем каждое время в расписании
    for (const scheduledTime of scheduleData.postingTimes) {
        if (shouldPostNow(scheduledTime, currentTime)) {
            await executeScheduledPost(scheduledTime);
        }
    }
}

/**
 * Проверка, нужно ли публиковать пост сейчас
 */
function shouldPostNow(scheduledTime, currentTime) {
    // Проверяем точное совпадение времени (с точностью до минуты)
    return scheduledTime === currentTime;
}

/**
 * Выполнение запланированной публикации
 */
async function executeScheduledPost(scheduledTime) {
    try {
        // Получаем контент для публикации
        const postContent = await generatePostContent();
        
        if (!postContent) {
            console.warn(`No content available for post at ${scheduledTime}`);
            return;
        }

        // Публикуем пост
        const result = await window.ThreadsIntegration.publishScheduledPost({
            text: postContent.text,
            scheduledTime: scheduledTime,
            replyControl: postContent.replyControl || 'everyone'
        });

        if (result.success) {
            console.log(`Successfully published post at ${scheduledTime}:`, result.postId);
            
            // Обновляем статистику
            updatePublishedCount();
            updateQueueCount();
            
            // Показываем уведомление
            showPublicationNotification('success', `Пост опубликован в ${scheduledTime}`, postContent.text);
        } else {
            console.error(`Failed to publish post at ${scheduledTime}:`, result.error);
            showPublicationNotification('error', `Ошибка публикации в ${scheduledTime}`, result.error);
        }

    } catch (error) {
        console.error('Error in executeScheduledPost:', error);
        showPublicationNotification('error', 'Ошибка автопилота', error.message);
    }
}

/**
 * Генерация контента для публикации
 */
async function generatePostContent() {
    // Сначала пробуем получить из очереди готовых постов
    const queuedPosts = getFromStorage('threads_queue_posts') || [];
    
    if (queuedPosts.length > 0) {
        const post = queuedPosts.shift();
        saveToStorage('threads_queue_posts', queuedPosts);
        return post;
    }

    // Если очереди нет, генерируем контент на основе данных пользователя
    return await generateContentFromUserData();
}

/**
 * Генерация контента на основе данных пользователя
 */
async function generateContentFromUserData() {
    const productData = getFromStorage('product_data');
    const audienceData = getFromStorage('audience_data');
    const personalityData = getFromStorage('personality_lite_data') || getFromStorage('personality_pro_data');

    if (!productData && !audienceData && !personalityData) {
        return {
            text: "🚀 Автоматический пост от AiPetri Studio! Настройте свой контент в разделе 'Личность' для персонализированных публикаций.",
            replyControl: 'everyone'
        };
    }

    // Простая генерация контента на основе данных
    const templates = [
        "💡 {insight} - что думаете?",
        "🎯 Сегодня фокусируюсь на {focus}",
        "📈 {tip} - делитесь опытом!",
        "🔥 {question}",
        "✨ {inspiration}"
    ];

    const insights = [
        "Качество важнее количества",
        "Постоянство - ключ к успеху", 
        "Инновации начинаются с вопросов",
        "Сообщество сильнее индивидуальности"
    ];

    const focuses = [
        "росте и развитии",
        "создании ценности",
        "построении связей",
        "изучении нового"
    ];

    const tips = [
        "Лучше сделать маленький шаг, чем стоять на месте",
        "Обратная связь - подарок для роста",
        "Экспериментируйте и анализируйте результаты"
    ];

    const questions = [
        "Что вас мотивирует продолжать, когда сложно?",
        "Какой один совет изменил вашу жизнь?",
        "Что для вас значит успех?"
    ];

    const inspirations = [
        "Каждый день - новая возможность стать лучше",
        "Ваш уникальный опыт может помочь другим",
        "Маленькие шаги ведут к большим результатам"
    ];

    const contentSets = { insights, focuses, tips, questions, inspirations };
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    let content = template;

    // Заменяем плейсхолдеры на реальный контент
    Object.keys(contentSets).forEach(key => {
        const placeholder = `{${key.slice(0, -1)}}`;
        if (content.includes(placeholder)) {
            const items = contentSets[key];
            const randomItem = items[Math.floor(Math.random() * items.length)];
            content = content.replace(placeholder, randomItem);
        }
    });

    return {
        text: content,
        replyControl: 'everyone'
    };
}

/**
 * Показ уведомления о публикации
 */
function showPublicationNotification(type, title, message) {
    // Можно использовать системные уведомления, если разрешены
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
            icon: '/favicon.ico'
        });
    }
    
    // Также выводим в консоль
    console.log(`${type.toUpperCase()}: ${title} - ${message}`);
}

/**
 * Обновление счетчика опубликованных постов
 */
function updatePublishedCount() {
    const publishedPosts = getFromStorage('threads_published_posts') || [];
    const today = new Date().toDateString();
    const todayPublished = publishedPosts.filter(post => 
        new Date(post.publishedAt).toDateString() === today
    ).length;
    
    const element = document.getElementById('today-published');
    if (element) {
        element.textContent = todayPublished;
    }
}

/**
 * Запуск автопилота
 */
function startAutopilot() {
    const autopilotData = getFromStorage('threads_autopilot') || {};
    autopilotData.active = true;
    autopilotData.startedAt = new Date().toISOString();
    
    saveToStorage('threads_autopilot', autopilotData);
    
    // Проверяем посты каждую минуту
    if (window.autopilotInterval) {
        clearInterval(window.autopilotInterval);
    }
    
    window.autopilotInterval = setInterval(checkScheduledPosts, 60000); // каждую минуту
    
    console.log('Autopilot started');
}

/**
 * Остановка автопилота
 */
function stopAutopilot() {
    const autopilotData = getFromStorage('threads_autopilot') || {};
    autopilotData.active = false;
    autopilotData.stoppedAt = new Date().toISOString();
    
    saveToStorage('threads_autopilot', autopilotData);
    
    if (window.autopilotInterval) {
        clearInterval(window.autopilotInterval);
        window.autopilotInterval = null;
    }
    
    console.log('Autopilot stopped');
}

// Автоматический запуск автопилота при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const autopilotData = getFromStorage('threads_autopilot');
        if (autopilotData?.active) {
            startAutopilot();
        }
    }, 2000); // Даем время на инициализацию

    // Запрашиваем разрешение на уведомления
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});

// === ТАБОВАЯ СИСТЕМА ===
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Убираем активный класс со всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');
            
            // Показываем соответствующий контент
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// === УПРАВЛЕНИЕ РАСПИСАНИЕМ ===
function initializeScheduleManager() {
    // Кнопки выбора количества постов
    const countButtons = document.querySelectorAll('.count-btn');
    countButtons.forEach(button => {
        button.addEventListener('click', function() {
            countButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const count = parseInt(this.dataset.count);
            generateSchedulePreview(count);
        });
    });
    
    // Кнопки режима распределения времени
    const distButtons = document.querySelectorAll('.dist-btn');
    distButtons.forEach(button => {
        button.addEventListener('click', function() {
            distButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const mode = this.dataset.mode;
            const count = getSelectedPostsCount();
            generateSchedulePreview(count, mode);
            
            // Управляем видимостью кнопки регенерации
            const regenerateBtn = document.getElementById('regenerate-schedule');
            if (regenerateBtn) {
                if (mode === 'random') {
                    regenerateBtn.style.display = 'inline-block';
                } else {
                    regenerateBtn.style.display = 'none';
                }
            }
        });
    });
    
    // Пользовательский ввод количества
    const customCountInput = document.getElementById('custom-count');
    if (customCountInput) {
        customCountInput.addEventListener('input', function() {
            const count = parseInt(this.value);
            if (count >= 1 && count <= 10) {
                countButtons.forEach(btn => btn.classList.remove('active'));
                generateSchedulePreview(count);
            }
        });
    }
    
    // Кнопки действий
    const regenerateBtn = document.getElementById('regenerate-schedule');
    const applyBtn = document.getElementById('apply-schedule');
    
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            const count = getSelectedPostsCount();
            const mode = getSelectedDistributionMode();
            generateSchedulePreview(count, mode);
        });
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applySchedule);
    }
    
    // Инициализация с текущими настройками
    generateSchedulePreview(6);
}

function getSelectedPostsCount() {
    const activeButton = document.querySelector('.count-btn.active');
    if (activeButton) {
        return parseInt(activeButton.dataset.count);
    }
    
    const customInput = document.getElementById('custom-count');
    if (customInput && customInput.value) {
        return parseInt(customInput.value);
    }
    
    return 6; // по умолчанию
}

function getSelectedDistributionMode() {
    const activeButton = document.querySelector('.dist-btn.active');
    return activeButton ? activeButton.dataset.mode : 'auto';
}

function generateSchedulePreview(count, mode = 'auto') {
    const preview = document.getElementById('schedule-preview');
    if (!preview) return;
    
    if (mode === 'manual') {
        // Для ручного режима показываем поля ввода времени
        let html = `
            <h5>Ручная настройка времени (${count} ${count === 1 ? 'пост' : count < 5 ? 'поста' : 'постов'} в день):</h5>
            <div class="manual-time-inputs">
        `;
        
        for (let i = 0; i < count; i++) {
            html += `
                <div class="time-input-row">
                    <label>Пост ${i + 1}:</label>
                    <input type="time" class="manual-time-input" data-index="${i}" value="09:00">
                </div>
            `;
        }
        
        html += `
            </div>
            <p style="margin-top: 16px; color: #6c757d; font-size: 14px;">
                Режим: ${getModeDisplayName(mode)} | Укажите точное время для каждого поста
            </p>
        `;
        
        preview.innerHTML = html;
        return;
    }
    
    const times = generatePostingTimes(count, mode);
    
    let html = `
        <h5>Предварительное расписание (${count} ${count === 1 ? 'пост' : count < 5 ? 'поста' : 'постов'} в день):</h5>
        <table class="schedule-table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Время</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    times.forEach((time, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td class="schedule-time">${time}</td>
                <td><span style="color: #28a745;">📅 Запланировано</span></td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        <p style="margin-top: 16px; color: #6c757d; font-size: 14px;">
            Режим: ${getModeDisplayName(mode)} | 
            Интервал: ${calculateInterval(times)} | 
            Период: с ${times[0]} до ${times[times.length - 1]}
        </p>
    `;
    
    preview.innerHTML = html;
}

function generatePostingTimes(count, mode = 'auto') {
    const times = [];
    
    switch (mode) {
        case 'auto':
            // Оптимальное распределение в течение дня
            const optimalTimes = {
                1: ['14:00'],
                2: ['10:00', '16:00'],
                3: ['09:00', '13:00', '18:00'],
                4: ['09:00', '12:00', '15:00', '18:00'],
                5: ['09:00', '12:00', '15:00', '17:00', '19:00'],
                6: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'],
                7: ['09:00', '10:30', '12:00', '14:00', '16:00', '17:30', '19:00'],
                8: ['09:00', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'],
                9: ['09:00', '10:00', '11:00', '12:30', '14:00', '15:30', '17:00', '18:00', '19:00'],
                10: ['09:00', '10:00', '11:00', '12:00', '13:30', '15:00', '16:00', '17:00', '18:00', '19:00']
            };
            return optimalTimes[count] || optimalTimes[6];
            
        case 'random':
            // Случайное распределение
            const startHour = 9;
            const endHour = 19;
            const availableHours = [];
            
            for (let hour = startHour; hour <= endHour; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    availableHours.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
                }
            }
            
            // Перемешиваем и берем нужное количество
            const shuffled = availableHours.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count).sort();
            
        case 'manual':
        default:
            // Равномерное распределение
            const start = 9 * 60; // 9:00 в минутах
            const end = 19 * 60;  // 19:00 в минутах
            const interval = (end - start) / (count - 1);
            
            for (let i = 0; i < count; i++) {
                const totalMinutes = start + (interval * i);
                const hours = Math.floor(totalMinutes / 60);
                const minutes = Math.round(totalMinutes % 60);
                times.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
            }
            return times;
    }
}

function getModeDisplayName(mode) {
    const modes = {
        'auto': '🤖 Автоматический (оптимальный)',
        'manual': '✋ Равномерное распределение',
        'random': '🎲 Случайное время'
    };
    return modes[mode] || mode;
}

function calculateInterval(times) {
    if (times.length < 2) return 'N/A';
    
    const first = timeToMinutes(times[0]);
    const last = timeToMinutes(times[times.length - 1]);
    const totalMinutes = last - first;
    const intervals = times.length - 1;
    const avgInterval = Math.round(totalMinutes / intervals);
    
    const hours = Math.floor(avgInterval / 60);
    const minutes = avgInterval % 60;
    
    if (hours > 0) {
        return `≈${hours}ч ${minutes}мин`;
    } else {
        return `≈${minutes}мин`;
    }
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function applySchedule() {
    const count = getSelectedPostsCount();
    const mode = getSelectedDistributionMode();
    
    let times;
    
    if (mode === 'manual') {
        // Для ручного режима собираем времена из полей ввода
        const timeInputs = document.querySelectorAll('.manual-time-input');
        times = Array.from(timeInputs).map(input => input.value).sort();
        
        // Проверяем что все поля заполнены
        if (times.some(time => !time)) {
            alert('Пожалуйста, укажите время для всех постов');
            return;
        }
    } else {
        times = generatePostingTimes(count, mode);
    }
    
    const scheduleData = {
        postsPerDay: count,
        startDate: new Date().toISOString(),
        postingTimes: times,
        distributionMode: mode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Сохраняем расписание
    saveToStorage('threads_schedule', scheduleData);
    
    // Обновляем UI
    updateScheduleDisplay();
    updateQueueCount();
    updateTodayPosts(); // Обновляем список сегодняшних постов
    
    alert(`✅ Расписание применено! ${count} ${count === 1 ? 'пост' : count < 5 ? 'поста' : 'постов'} в день.`);
}

// === ГЕНЕРАТОР ПОСТОВ ===
function initializePostsGenerator() {
    // Кнопка генерации
    const generateBtn = document.getElementById('generate-posts');
    if (generateBtn) {
        generateBtn.addEventListener('click', generatePosts);
    }
}

async function generatePosts() {
    const generateBtn = document.getElementById('generate-posts');
    const countSelect = document.getElementById('generate-count');
    const postsContainer = document.getElementById('generated-posts');
    
    const count = parseInt(countSelect.value) || 5;
    
    // Проверяем подключение OpenAI
    if (!window.openAIService || !window.openAIService.isServiceConnected()) {
        alert('⚠️ Сначала подключите OpenAI в разделе "Подключение"');
        return;
    }
    
    // Показываем процесс генерации
    generateBtn.textContent = '🔄 Генерируем с ИИ...';
    generateBtn.disabled = true;
    
    try {
        const posts = [];
        
        // Получаем данные пользователя для контекста
        const userData = {
            product: getFromStorage('product_data'),
            audience: getFromStorage('audience_data'),
            personality: getFromStorage('personality_data')
        };
        
        for (let i = 0; i < count; i++) {
            try {
                // Используем OpenAI для генерации
                const result = await window.openAIService.generatePost(null, userData);
                
                if (result.success) {
                    posts.push({
                        id: Date.now() + i,
                        text: result.text,
                        source: 'openai',
                        createdAt: new Date().toISOString()
                    });
                } else {
                    throw new Error('Не удалось сгенерировать пост');
                }
                
                // Небольшая задержка между запросами
                if (i < count - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
            } catch (error) {
                console.warn(`Ошибка генерации поста ${i + 1}:`, error);
                // В случае ошибки используем fallback
                const fallbackContent = await generateContentFromUserData('mixed');
                posts.push({
                    id: Date.now() + i,
                    text: fallbackContent.text,
                    source: 'fallback',
                    createdAt: new Date().toISOString()
                });
            }
        }
        
        displayGeneratedPosts(posts);
        
    } catch (error) {
        alert('Ошибка генерации: ' + error.message);
    }
    
    generateBtn.textContent = '🧵 Сгенерировать Threads';
    generateBtn.disabled = false;
}

function displayGeneratedPosts(posts) {
    const container = document.getElementById('generated-posts');
    if (!container) return;
    
    container.style.display = 'block';
    
    let html = `<h5>Сгенерированные посты (${posts.length}):</h5>`;
    
    posts.forEach((post, index) => {
        html += `
            <div class="generated-post" data-post-id="${post.id}">
                <div class="post-text">${post.text}</div>
                <div class="post-actions">
                    <button class="post-action-btn edit" onclick="editPost(${post.id})">✏️ Изменить</button>
                    <button class="post-action-btn queue" onclick="addPostToQueue(${post.id})">➕ В очередь</button>
                    <button class="post-action-btn delete" onclick="deleteGeneratedPost(${post.id})">🗑️ Удалить</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Сохраняем сгенерированные посты
    saveToStorage('generated_posts', posts);
}

// === УПРАВЛЕНИЕ ОЧЕРЕДЬЮ ===
function initializeQueueManager() {
    const clearBtn = document.getElementById('clear-queue');
    const addBtn = document.getElementById('add-to-queue');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearQueue);
    }
    
    if (addBtn) {
        addBtn.addEventListener('click', addManualPost);
    }
    
    // Загружаем очередь
    displayQueue();
}

function displayQueue() {
    const container = document.getElementById('queue-list');
    const queuePosts = getFromStorage('threads_queue_posts') || [];
    
    if (!container) return;
    
    if (queuePosts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #6c757d; padding: 40px;">
                <p>📝 Очередь публикаций пуста</p>
                <p>Добавьте посты через генератор или вручную</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    queuePosts.forEach((post, index) => {
        html += `
            <div class="queue-item" data-post-id="${post.id}">
                <div class="queue-number">${index + 1}</div>
                <div class="queue-content">${post.text}</div>
                <div class="queue-actions">
                    <button class="queue-action-btn publish-now" onclick="publishPostNow(${post.id})">🚀 Опубликовать</button>
                    <button class="queue-action-btn edit" onclick="editQueuePost(${post.id})">✏️</button>
                    <button class="queue-action-btn move-up" onclick="moveQueuePost(${post.id}, 'up')" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="queue-action-btn move-down" onclick="moveQueuePost(${post.id}, 'down')" ${index === queuePosts.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="queue-action-btn delete" onclick="deleteQueuePost(${post.id})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function clearQueue() {
    if (confirm('Очистить всю очередь публикаций?')) {
        saveToStorage('threads_queue_posts', []);
        displayQueue();
        updateQueueCount();
    }
}

function addManualPost() {
    const text = prompt('Введите текст поста:');
    if (text && text.trim()) {
        const queuePosts = getFromStorage('threads_queue_posts') || [];
        queuePosts.push({
            id: Date.now(),
            text: text.trim(),
            addedAt: new Date().toISOString()
        });
        
        saveToStorage('threads_queue_posts', queuePosts);
        displayQueue();
        updateQueueCount();
    }
}

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ ONCLICK ===
window.editPost = function(postId) {
    const posts = getFromStorage('generated_posts') || [];
    const post = posts.find(p => p.id === postId);
    if (post) {
        const newText = prompt('Изменить текст поста:', post.text);
        if (newText !== null) {
            post.text = newText;
            saveToStorage('generated_posts', posts);
            displayGeneratedPosts(posts);
        }
    }
};

window.addPostToQueue = function(postId) {
    const posts = getFromStorage('generated_posts') || [];
    const post = posts.find(p => p.id === postId);
    if (post) {
        const queuePosts = getFromStorage('threads_queue_posts') || [];
        queuePosts.push({
            id: Date.now(),
            text: post.text,
            addedAt: new Date().toISOString()
        });
        
        saveToStorage('threads_queue_posts', queuePosts);
        displayQueue();
        updateQueueCount();
        alert('Пост добавлен в очередь!');
    }
};

window.deleteGeneratedPost = function(postId) {
    const posts = getFromStorage('generated_posts') || [];
    const filtered = posts.filter(p => p.id !== postId);
    saveToStorage('generated_posts', filtered);
    displayGeneratedPosts(filtered);
};

window.editQueuePost = function(postId) {
    const queuePosts = getFromStorage('threads_queue_posts') || [];
    const post = queuePosts.find(p => p.id === postId);
    if (post) {
        const newText = prompt('Изменить текст поста:', post.text);
        if (newText !== null) {
            post.text = newText;
            saveToStorage('threads_queue_posts', queuePosts);
            displayQueue();
        }
    }
};

window.deleteQueuePost = function(postId) {
    const queuePosts = getFromStorage('threads_queue_posts') || [];
    const filtered = queuePosts.filter(p => p.id !== postId);
    saveToStorage('threads_queue_posts', filtered);
    displayQueue();
    updateQueueCount();
};

window.publishPostNow = async function(postId) {
    try {
        // Проверяем подключение к Threads API
        const connectionData = getFromStorage('threads_connection');
        if (!connectionData || !connectionData.connected || !connectionData.accessToken) {
            alert('❌ Threads API не подключен. Перейдите в раздел "Подключение" и настройте API.');
            return;
        }
        
        // Инициализируем API если не инициализирован
        if (!window.threadsAPI || !window.threadsAPI.accessToken) {
            if (window.threadsAPI) {
                await window.threadsAPI.initialize(connectionData.accessToken);
            } else {
                alert('❌ Threads API не загружен. Обновите страницу.');
                return;
            }
        }
        
        // Находим пост в очереди
        const queuePosts = getFromStorage('threads_queue_posts') || [];
        const post = queuePosts.find(p => p.id === postId);
        
        if (!post) {
            alert('❌ Пост не найден в очереди');
            return;
        }
        
        // Подтверждение публикации
        if (!confirm(`Опубликовать пост сейчас?\n\n"${post.text.substring(0, 100)}..."`)) {
            return;
        }
        
        // Показываем статус публикации
        const button = document.querySelector(`[onclick="publishPostNow(${postId})"]`);
        if (button) {
            button.textContent = '⏳ Публикуем...';
            button.disabled = true;
        }
        
        // Публикуем через Threads API
        const result = await window.threadsAPI.createTextPost(post.text);
        
        if (result.success) {
            // Удаляем пост из очереди
            const updatedQueue = queuePosts.filter(p => p.id !== postId);
            saveToStorage('threads_queue_posts', updatedQueue);
            
            // Обновляем счетчик опубликованных постов
            updatePublishedCount();
            
            // Показываем уведомление об успешной публикации
            showPublicationNotification('success', `✅ Пост успешно опубликован! ID: ${result.postId}`);
            
            // Обновляем интерфейс
            displayQueue();
            updateQueueCount();
            
        } else {
            throw new Error(result.error || 'Неизвестная ошибка при публикации');
        }
        
    } catch (error) {
        console.error('Ошибка публикации:', error);
        
        // Восстанавливаем кнопку
        const button = document.querySelector(`[onclick="publishPostNow(${postId})"]`);
        if (button) {
            button.textContent = '🚀 Опубликовать';
            button.disabled = false;
        }
        
        // Показываем ошибку
        showPublicationNotification('error', `❌ Ошибка публикации: ${error.message}`);
    }
};

window.moveQueuePost = function(postId, direction) {
    const queuePosts = getFromStorage('threads_queue_posts') || [];
    const index = queuePosts.findIndex(p => p.id === postId);
    
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < queuePosts.length) {
        [queuePosts[index], queuePosts[newIndex]] = [queuePosts[newIndex], queuePosts[index]];
        saveToStorage('threads_queue_posts', queuePosts);
        displayQueue();
    }
};

// === ОБНОВЛЕНИЕ СЕГОДНЯШНИХ ПОСТОВ ===
function updateTodayPosts() {
    const container = document.getElementById('today-posts');
    if (!container) return;
    
    const scheduleData = getFromStorage('threads_schedule');
    
    if (!scheduleData || !scheduleData.postingTimes || scheduleData.postingTimes.length === 0) {
        container.innerHTML = '<p style="color: #6c757d; text-align: center; padding: 20px;">Расписание не настроено</p>';
        return;
    }
    
    let html = '';
    scheduleData.postingTimes.forEach((time, index) => {
        html += `
            <div class="post-item" data-time="${time}">
                <span class="post-time">${time}</span>
                <span class="post-status">⏳ Ожидание</span>
                <span class="post-content">Пост готов к публикации</span>
                <button class="post-delete-btn" onclick="removeScheduledPost('${time}')" title="Удалить">🗑️</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// === УДАЛЕНИЕ ЗАПЛАНИРОВАННОГО ПОСТА ===
window.removeScheduledPost = function(timeToRemove) {
    const scheduleData = getFromStorage('threads_schedule');
    if (!scheduleData || !scheduleData.postingTimes) return;
    
    // Удаляем время из расписания
    scheduleData.postingTimes = scheduleData.postingTimes.filter(time => time !== timeToRemove);
    scheduleData.postsPerDay = scheduleData.postingTimes.length;
    scheduleData.updatedAt = new Date().toISOString();
    
    // Сохраняем обновленное расписание
    saveToStorage('threads_schedule', scheduleData);
    
    // Обновляем UI
    updateTodayPosts();
    updateQueueCount();
    updateScheduleDisplay();
    
    alert(`✅ Пост на ${timeToRemove} удален из расписания`);
};

// === ИНИЦИАЛИЗАЦИЯ КНОПОК УПРАВЛЕНИЯ ===
function initializeControlButtons() {
    const clearScheduleBtn = document.getElementById('clear-schedule');
    
    console.log('Initializing control buttons, clear button found:', !!clearScheduleBtn);
    
    if (clearScheduleBtn) {
        clearScheduleBtn.addEventListener('click', clearSchedule);
        console.log('Clear schedule button initialized');
    } else {
        console.warn('Clear schedule button not found');
    }
}

// === ОЧИСТКА РАСПИСАНИЯ ===
function clearSchedule() {
    if (confirm('Вы уверены, что хотите полностью очистить расписание?')) {
        // Удаляем данные расписания
        localStorage.removeItem('threads_schedule');
        
        // Обновляем отображение
        updateTodayPosts();
        updateQueueCount();
        updateScheduleDisplay();
        
        alert('✅ Расписание очищено!');
    }
}

// === ОТЛАДКА ===
console.log('Threads Autopilot JavaScript loaded successfully');
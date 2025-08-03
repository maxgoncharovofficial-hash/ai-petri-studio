// Threads ZAVOD JavaScript
// Полная реализация MVP функциональности

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
let currentTab = 'connection';
let selectedDate = null;
let selectedTimes = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Названия месяцев
const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// Дни недели
const dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Threads ZAVOD loaded');
    
    initializeTabs();
    initializeBackButton();
    initializeConnection();
    initializeCalendar();
    initializeAutopilot();
    initializeCreatePost();
    loadSavedData();
    
    // Обновляем счетчики требований ИИ
    updateAIRequirements();
});

// === УПРАВЛЕНИЕ ВКЛАДКАМИ ===
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
        
        // Мобильная поддержка
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    console.log('Switching to tab:', tabId);
    
    // Убираем активные классы
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Добавляем активные классы
    document.getElementById(`tab-${tabId}`).classList.add('active');
    document.getElementById(`content-${tabId}`).classList.add('active');
    
    currentTab = tabId;
    
    // Обновляем содержимое вкладки
    if (tabId === 'autopilot') {
        updateAutopilotTab();
    } else if (tabId === 'create') {
        updateCreateTab();
    }
}

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

// === ПОДКЛЮЧЕНИЕ АККАУНТА ===
function initializeConnection() {
    const connectButton = document.getElementById('connect-button');
    const scheduleButton = document.getElementById('schedule-button');
    const launchButton = document.getElementById('launch-autopilot');
    const modifyButton = document.getElementById('modify-schedule');
    
    if (connectButton) {
        connectButton.addEventListener('click', connectAccount);
    }
    
    if (scheduleButton) {
        scheduleButton.addEventListener('click', showScheduleSetup);
    }
    
    if (launchButton) {
        launchButton.addEventListener('click', launchAutopilot);
    }
    
    if (modifyButton) {
        modifyButton.addEventListener('click', modifySchedule);
    }
    
    // Инициализация настройки расписания
    initializeScheduleSetup();
}

function connectAccount() {
    console.log('Connecting Threads account...');
    
    // Симуляция подключения (в реальном приложении здесь будет OAuth)
    setTimeout(() => {
        const connectionData = {
            connected: true,
            username: 'your_username',
            connectedAt: new Date().toISOString()
        };
        
        saveToStorage('threads_connection', connectionData);
        updateConnectionStatus(connectionData);
        
        // Активируем шаг 2
        const stepSchedule = document.getElementById('step-schedule');
        const scheduleButton = document.getElementById('schedule-button');
        
        stepSchedule.classList.remove('disabled');
        scheduleButton.classList.remove('disabled');
        scheduleButton.textContent = '⚙️ Настроить расписание';
        
        alert('✅ Аккаунт Threads успешно подключен!');
    }, 1000);
}

function updateConnectionStatus(data) {
    const statusElement = document.getElementById('connection-status');
    const usernameElement = document.getElementById('connected-username');
    
    if (data.connected) {
        statusElement.textContent = `✅ Подключено: @${data.username}`;
        statusElement.style.color = '#28a745';
        
        if (usernameElement) {
            usernameElement.textContent = `@${data.username}`;
        }
    }
}

// === НАСТРОЙКА РАСПИСАНИЯ ===
function initializeScheduleSetup() {
    const postsInput = document.getElementById('posts-per-day');
    const saveButton = document.getElementById('save-schedule');
    const addTimeButton = document.getElementById('add-time-button');
    const selectDateButton = document.getElementById('select-another-date');
    
    if (postsInput) {
        postsInput.addEventListener('change', updatePostsPerDay);
    }
    
    if (saveButton) {
        saveButton.addEventListener('click', saveSchedule);
    }
    
    if (addTimeButton) {
        addTimeButton.addEventListener('click', showTimeSelector);
    }
    
    if (selectDateButton) {
        selectDateButton.addEventListener('click', () => {
            document.getElementById('selected-date-info').style.display = 'none';
            generateCalendar();
        });
    }
    
    // Инициализация селектора времени
    initializeTimeSelector();
}

function showScheduleSetup() {
    const scheduleSetup = document.getElementById('schedule-setup');
    scheduleSetup.style.display = 'block';
    
    // Генерируем календарь
    generateCalendar();
    
    // Прокручиваем к настройкам
    scheduleSetup.scrollIntoView({ behavior: 'smooth' });
}

function updatePostsPerDay() {
    const postsInput = document.getElementById('posts-per-day');
    const count = parseInt(postsInput.value) || 2;
    
    console.log('Posts per day updated:', count);
    
    // Сохраняем в временные данные
    saveToStorage('threads_temp_posts_count', count);
    
    // Обновляем отображение времени если дата выбрана
    if (selectedDate) {
        updatePostingTimes();
    }
}

// === КАЛЕНДАРЬ ===
function initializeCalendar() {
    generateCalendar();
}

function generateCalendar() {
    const container = document.getElementById('calendar-container');
    if (!container) return;
    
    console.log('Generating calendar for:', monthNames[currentMonth], currentYear);
    
    const calendar = createCalendarHTML();
    container.innerHTML = calendar;
    
    // Добавляем обработчики событий
    addCalendarEventListeners();
}

function createCalendarHTML() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Понедельник = 0
    
    let html = `
        <div class="calendar-header">
            <button class="calendar-nav" id="prev-month">◀️</button>
            <div class="calendar-month">${monthNames[currentMonth]} ${currentYear}</div>
            <button class="calendar-nav" id="next-month">▶️</button>
        </div>
        <table class="calendar-table">
            <thead>
                <tr>
    `;
    
    // Заголовки дней недели
    dayNames.forEach(day => {
        html += `<th>${day}</th>`;
    });
    
    html += `
                </tr>
            </thead>
            <tbody>
    `;
    
    // Генерируем недели
    let date = 1;
    let today = new Date();
    
    for (let week = 0; week < 6; week++) {
        html += '<tr>';
        
        for (let day = 0; day < 7; day++) {
            if (week === 0 && day < startingDayOfWeek) {
                html += '<td></td>';
            } else if (date > daysInMonth) {
                html += '<td></td>';
            } else {
                const currentDate = new Date(currentYear, currentMonth, date);
                const isToday = currentDate.toDateString() === today.toDateString();
                const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();
                const isPast = currentDate < today.setHours(0, 0, 0, 0);
                
                let classes = 'calendar-day';
                if (isToday) classes += ' today';
                if (isSelected) classes += ' selected';
                if (isPast) classes += ' disabled';
                
                html += `
                    <td>
                        <button class="${classes}" data-date="${currentYear}-${currentMonth + 1}-${date}" ${isPast ? 'disabled' : ''}>
                            ${date}
                        </button>
                    </td>
                `;
                date++;
            }
        }
        
        html += '</tr>';
        
        if (date > daysInMonth) break;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    return html;
}

function addCalendarEventListeners() {
    // Навигация по месяцам
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar();
        });
    }
    
    // Выбор даты
    const dayButtons = document.querySelectorAll('.calendar-day:not(.disabled)');
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dateStr = this.getAttribute('data-date');
            selectDate(dateStr);
        });
    });
}

function selectDate(dateStr) {
    console.log('Date selected:', dateStr);
    
    const [year, month, day] = dateStr.split('-').map(Number);
    selectedDate = new Date(year, month - 1, day);
    
    // Обновляем календарь
    generateCalendar();
    
    // Показываем информацию о выбранной дате
    showSelectedDateInfo();
}

function showSelectedDateInfo() {
    const dateInfo = document.getElementById('selected-date-info');
    const dateText = document.getElementById('selected-date-text');
    
    if (selectedDate) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        dateText.textContent = selectedDate.toLocaleDateString('ru-RU', options);
        dateInfo.style.display = 'block';
        
        // Обновляем времена постов
        updatePostingTimes();
    }
}

function updatePostingTimes() {
    const postsCount = parseInt(document.getElementById('posts-per-day').value) || 2;
    const timesContainer = document.getElementById('posting-times');
    
    // Получаем сохраненные времена или используем дефолтные
    const savedTimes = getFromStorage('threads_temp_times') || [];
    const defaultTimes = ['10:00', '18:00'];
    
    selectedTimes = savedTimes.length > 0 ? savedTimes : defaultTimes.slice(0, postsCount);
    
    let html = '';
    selectedTimes.forEach((time, index) => {
        html += `
            <div class="time-item">
                <span class="time-text">Пост ${index + 1}: ${time}</span>
                <button class="time-remove" onclick="removeTime(${index})" title="Удалить время">×</button>
            </div>
        `;
    });
    
    timesContainer.innerHTML = html;
    
    // Показываем кнопку добавления времени если нужно
    const addButton = document.getElementById('add-time-button');
    addButton.style.display = selectedTimes.length < postsCount ? 'block' : 'none';
}

function removeTime(index) {
    selectedTimes.splice(index, 1);
    saveToStorage('threads_temp_times', selectedTimes);
    updatePostingTimes();
}

// === СЕЛЕКТОР ВРЕМЕНИ ===
function initializeTimeSelector() {
    const timeButtons = document.querySelectorAll('.time-button');
    const manualButton = document.getElementById('use-manual-time');
    
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const time = this.getAttribute('data-time');
            selectTime(time);
        });
    });
    
    if (manualButton) {
        manualButton.addEventListener('click', useManualTime);
    }
}

function showTimeSelector() {
    const timeSelector = document.getElementById('time-selector');
    timeSelector.style.display = 'block';
    timeSelector.scrollIntoView({ behavior: 'smooth' });
}

function selectTime(time) {
    console.log('Time selected:', time);
    
    if (!selectedTimes.includes(time)) {
        selectedTimes.push(time);
        selectedTimes.sort(); // Сортируем по времени
        
        saveToStorage('threads_temp_times', selectedTimes);
        updatePostingTimes();
        
        // Скрываем селектор времени
        document.getElementById('time-selector').style.display = 'none';
    }
}

function useManualTime() {
    const manualInput = document.getElementById('manual-time-input');
    const time = manualInput.value;
    
    if (time && !selectedTimes.includes(time)) {
        selectTime(time);
        manualInput.value = '';
    }
}

// === СОХРАНЕНИЕ РАСПИСАНИЯ ===
function saveSchedule() {
    if (!selectedDate || selectedTimes.length === 0) {
        alert('Пожалуйста, выберите дату и время для публикаций');
        return;
    }
    
    const postsCount = parseInt(document.getElementById('posts-per-day').value) || 2;
    
    const scheduleData = {
        postsPerDay: postsCount,
        startDate: selectedDate.toISOString(),
        postingTimes: selectedTimes,
        createdAt: new Date().toISOString()
    };
    
    console.log('Saving schedule:', scheduleData);
    
    // Сохраняем расписание
    saveToStorage('threads_schedule', scheduleData);
    
    // Показываем завершенную настройку
    showSetupComplete(scheduleData);
}

function showSetupComplete(scheduleData) {
    // Скрываем форму настройки
    document.getElementById('schedule-setup').style.display = 'none';
    
    // Показываем завершенную настройку
    const setupComplete = document.getElementById('setup-complete');
    
    // Обновляем информацию
    document.getElementById('daily-posts-count').textContent = scheduleData.postsPerDay;
    document.getElementById('start-date').textContent = new Date(scheduleData.startDate).toLocaleDateString('ru-RU');
    document.getElementById('posting-schedule').textContent = scheduleData.postingTimes.join(', ');
    
    setupComplete.style.display = 'block';
    setupComplete.scrollIntoView({ behavior: 'smooth' });
}

function launchAutopilot() {
    console.log('Launching autopilot...');
    
    // Сохраняем статус автопилота
    saveToStorage('threads_autopilot', {
        active: true,
        launchedAt: new Date().toISOString()
    });
    
    // Переключаемся на вкладку автопилота
    switchTab('autopilot');
    
    alert('🚀 Автопилот запущен! Переходим к управлению...');
}

function modifySchedule() {
    // Показываем форму настройки снова
    document.getElementById('setup-complete').style.display = 'none';
    document.getElementById('schedule-setup').style.display = 'block';
    
    // Загружаем сохраненные данные
    loadScheduleData();
}

// === АВТОПИЛОТ ===
function initializeAutopilot() {
    const pauseButton = document.getElementById('pause-autopilot');
    const skipButton = document.getElementById('skip-post');
    const createButton = document.getElementById('create-now');
    const calendarButton = document.getElementById('view-calendar');
    
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
        calendarButton.addEventListener('click', viewPublishingCalendar);
    }
}

function updateAutopilotTab() {
    const autopilotData = getFromStorage('threads_autopilot');
    const connectionData = getFromStorage('threads_connection');
    const scheduleData = getFromStorage('threads_schedule');
    
    // Обновляем статус
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
    
    // Обновляем расписание на сегодня и завтра
    updateScheduleDisplay();
    
    // Обновляем очередь
    updateQueueCount();
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
    queueElement.textContent = scheduledPosts.length;
}

function toggleAutopilot() {
    const autopilotData = getFromStorage('threads_autopilot') || {};
    autopilotData.active = !autopilotData.active;
    
    saveToStorage('threads_autopilot', autopilotData);
    updateAutopilotTab();
    
    const action = autopilotData.active ? 'запущен' : 'приостановлен';
    alert(`Автопилот ${action}`);
}

function skipNextPost() {
    alert('Следующий пост пропущен');
    // Здесь будет логика пропуска поста
}

function createPostNow() {
    switchTab('create');
    alert('Создание нового поста...');
}

function viewPublishingCalendar() {
    alert('Календарь публикаций (в разработке)');
    // Здесь будет показ календаря с отметками активных дней
}

// === СОЗДАНИЕ ПОСТОВ ===
function initializeCreatePost() {
    const aiButton = document.getElementById('ai-generate');
    const manualButton = document.getElementById('write-manual');
    const templateButton = document.getElementById('use-template');
    const textarea = document.getElementById('post-content');
    const publishButtons = document.querySelectorAll('.publish-button');
    
    if (aiButton) {
        aiButton.addEventListener('click', () => selectCreationMethod('ai'));
    }
    
    if (manualButton) {
        manualButton.addEventListener('click', () => selectCreationMethod('manual'));
    }
    
    if (templateButton) {
        templateButton.addEventListener('click', () => selectCreationMethod('template'));
    }
    
    if (textarea) {
        textarea.addEventListener('input', updateCharCounter);
    }
    
    publishButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.id.replace('publish-', '');
            handlePublishAction(action);
        });
    });
}

function selectCreationMethod(method) {
    console.log('Creation method selected:', method);
    
    const editorSection = document.getElementById('editor-section');
    const textarea = document.getElementById('post-content');
    
    // Показываем редактор
    editorSection.style.display = 'block';
    
    if (method === 'ai') {
        generateAIPost();
    } else if (method === 'template') {
        loadTemplate();
    } else {
        textarea.value = '';
        textarea.focus();
    }
    
    // Обновляем активную кнопку
    document.querySelectorAll('.method-button').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(`${method === 'ai' ? 'ai-generate' : method === 'manual' ? 'write-manual' : 'use-template'}`).classList.add('selected');
}

function generateAIPost() {
    const textarea = document.getElementById('post-content');
    
    // Симуляция ИИ генерации
    textarea.value = 'Генерация поста...';
    
    setTimeout(() => {
        const aiPosts = [
            'Сегодня хочу поделиться важной мыслью о развитии бизнеса. Ключ к успеху - это постоянное обучение и адаптация к изменениям рынка. 📈',
            'Утром размышлял о том, как важно находить баланс между работой и отдыхом. Продуктивность приходит не от количества часов, а от качества работы. ⚖️',
            'Клиент сегодня сказал фразу, которая меня вдохновила: "Ваш продукт не просто решает проблему, он меняет жизнь". Это лучшая мотивация продолжать! 💪'
        ];
        
        const randomPost = aiPosts[Math.floor(Math.random() * aiPosts.length)];
        textarea.value = randomPost;
        updateCharCounter();
    }, 2000);
}

function loadTemplate() {
    const textarea = document.getElementById('post-content');
    
    const templates = [
        'Поделюсь опытом: [ваш опыт]\n\nЧто из этого можно извлечь:\n• [пункт 1]\n• [пункт 2]\n• [пункт 3]\n\nА у вас есть подобный опыт? 🤔',
        'Проблема: [описание проблемы]\n\nРешение: [ваше решение]\n\nРезультат: [достигнутый результат]\n\nТакой подход может помочь и вам! 💡',
        'Сегодня [что произошло]\n\nЭто напомнило мне о важности [урок/вывод]\n\nСогласны? Что думаете? 🤝'
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    textarea.value = randomTemplate;
    updateCharCounter();
}

function updateCharCounter() {
    const textarea = document.getElementById('post-content');
    const counter = document.getElementById('char-count');
    
    if (textarea && counter) {
        const count = textarea.value.length;
        counter.textContent = count;
        
        // Меняем цвет при превышении лимита
        if (count > 450) {
            counter.style.color = '#dc3545';
        } else if (count > 400) {
            counter.style.color = '#ffc107';
        } else {
            counter.style.color = '#6c757d';
        }
    }
}

function updateCreateTab() {
    // Обновляем счетчики
    updateDraftsCount();
    updateScheduledCount();
}

function updateDraftsCount() {
    const drafts = getFromStorage('threads_drafts') || [];
    document.getElementById('drafts-count').textContent = drafts.length;
}

function updateScheduledCount() {
    const scheduled = getFromStorage('threads_scheduled_posts') || [];
    document.getElementById('scheduled-count').textContent = scheduled.length;
}

function handlePublishAction(action) {
    const textarea = document.getElementById('post-content');
    const content = textarea.value.trim();
    
    if (!content) {
        alert('Введите текст поста');
        return;
    }
    
    console.log('Publish action:', action, 'Content:', content);
    
    switch (action) {
        case 'now':
            publishNow(content);
            break;
        case 'schedule':
            showSchedulingCalendar(content);
            break;
        case 'queue':
            addToQueue(content);
            break;
    }
}

function publishNow(content) {
    // Симуляция публикации
    alert('📤 Пост опубликован!');
    
    // Очищаем редактор
    document.getElementById('post-content').value = '';
    updateCharCounter();
    
    // Сохраняем в историю опубликованных постов
    const publishedPosts = getFromStorage('threads_published_posts') || [];
    publishedPosts.unshift({
        content: content,
        publishedAt: new Date().toISOString(),
        method: 'manual'
    });
    saveToStorage('threads_published_posts', publishedPosts);
}

function showSchedulingCalendar(content) {
    const calendar = document.getElementById('scheduling-calendar');
    calendar.style.display = 'block';
    
    // Сохраняем контент для планирования
    saveToStorage('threads_temp_post_content', content);
    
    // Генерируем календарь для планирования
    generateScheduleCalendar();
    
    calendar.scrollIntoView({ behavior: 'smooth' });
}

function generateScheduleCalendar() {
    const container = document.getElementById('schedule-calendar-container');
    if (!container) return;
    
    // Используем ту же логику что и для основного календаря
    const calendar = createCalendarHTML();
    container.innerHTML = calendar;
    
    // Добавляем обработчики для планирования
    addScheduleCalendarEventListeners();
}

function addScheduleCalendarEventListeners() {
    const dayButtons = document.querySelectorAll('#schedule-calendar-container .calendar-day:not(.disabled)');
    
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dateStr = this.getAttribute('data-date');
            selectScheduleDate(dateStr);
        });
    });
}

function selectScheduleDate(dateStr) {
    console.log('Schedule date selected:', dateStr);
    
    const [year, month, day] = dateStr.split('-').map(Number);
    const scheduleDate = new Date(year, month - 1, day);
    
    // Показываем селектор времени для планирования
    showScheduleTimeSelector();
    
    // Сохраняем выбранную дату
    saveToStorage('threads_temp_schedule_date', scheduleDate.toISOString());
}

function showScheduleTimeSelector() {
    const timeSection = document.getElementById('schedule-time-section');
    const timeGrid = document.querySelector('.schedule-time-grid');
    
    // Генерируем кнопки времени
    const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    
    let html = '';
    times.forEach(time => {
        html += `<button class="time-button" data-schedule-time="${time}">${time}</button>`;
    });
    
    timeGrid.innerHTML = html;
    timeSection.style.display = 'block';
    
    // Добавляем обработчики
    addScheduleTimeEventListeners();
}

function addScheduleTimeEventListeners() {
    const timeButtons = document.querySelectorAll('[data-schedule-time]');
    const confirmButton = document.getElementById('confirm-schedule-time');
    const manualInput = document.getElementById('schedule-manual-time');
    
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const time = this.getAttribute('data-schedule-time');
            schedulePost(time);
        });
    });
    
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            const time = manualInput.value;
            if (time) {
                schedulePost(time);
            }
        });
    }
}

function schedulePost(time) {
    const content = getFromStorage('threads_temp_post_content');
    const dateStr = getFromStorage('threads_temp_schedule_date');
    
    if (!content || !dateStr) {
        alert('Ошибка планирования поста');
        return;
    }
    
    const scheduleDate = new Date(dateStr);
    const [hours, minutes] = time.split(':').map(Number);
    scheduleDate.setHours(hours, minutes, 0, 0);
    
    // Сохраняем запланированный пост
    const scheduledPosts = getFromStorage('threads_scheduled_posts') || [];
    scheduledPosts.push({
        content: content,
        scheduledFor: scheduleDate.toISOString(),
        createdAt: new Date().toISOString(),
        status: 'scheduled'
    });
    
    saveToStorage('threads_scheduled_posts', scheduledPosts);
    
    // Очищаем временные данные
    removeFromStorage('threads_temp_post_content');
    removeFromStorage('threads_temp_schedule_date');
    
    // Скрываем календарь планирования
    document.getElementById('scheduling-calendar').style.display = 'none';
    
    // Очищаем редактор
    document.getElementById('post-content').value = '';
    updateCharCounter();
    
    // Обновляем счетчики
    updateScheduledCount();
    
    alert(`📅 Пост запланирован на ${scheduleDate.toLocaleDateString('ru-RU')} в ${time}`);
}

function addToQueue(content) {
    const queuePosts = getFromStorage('threads_queue_posts') || [];
    queuePosts.push({
        content: content,
        addedAt: new Date().toISOString(),
        status: 'queued'
    });
    
    saveToStorage('threads_queue_posts', queuePosts);
    
    // Очищаем редактор
    document.getElementById('post-content').value = '';
    updateCharCounter();
    
    // Обновляем счетчик очереди
    updateQueueCount();
    
    alert('💾 Пост добавлен в очередь автопилота');
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
}

function updateRequirement(elementId, isMet) {
    const element = document.getElementById(elementId);
    if (element) {
        const statusElement = element.querySelector('.req-status');
        statusElement.textContent = isMet ? '✅' : '❌';
    }
}

// === ЗАГРУЗКА СОХРАНЕННЫХ ДАННЫХ ===
function loadSavedData() {
    console.log('Loading saved data...');
    
    // Загружаем данные подключения
    const connectionData = getFromStorage('threads_connection');
    if (connectionData && connectionData.connected) {
        updateConnectionStatus(connectionData);
        
        // Активируем шаг 2
        const stepSchedule = document.getElementById('step-schedule');
        const scheduleButton = document.getElementById('schedule-button');
        
        stepSchedule.classList.remove('disabled');
        scheduleButton.classList.remove('disabled');
    }
    
    // Загружаем данные расписания
    const scheduleData = getFromStorage('threads_schedule');
    if (scheduleData) {
        showSetupComplete(scheduleData);
    }
    
    // Обновляем счетчики
    updateDraftsCount();
    updateScheduledCount();
    updateQueueCount();
}

function loadScheduleData() {
    const scheduleData = getFromStorage('threads_schedule');
    if (scheduleData) {
        // Восстанавливаем данные в форме
        document.getElementById('posts-per-day').value = scheduleData.postsPerDay;
        selectedDate = new Date(scheduleData.startDate);
        selectedTimes = [...scheduleData.postingTimes];
        
        // Обновляем отображение
        generateCalendar();
        showSelectedDateInfo();
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
console.log('Threads ZAVOD JavaScript loaded successfully');

// Экспорт функций для отладки
window.threadsDebug = {
    saveToStorage,
    getFromStorage,
    removeFromStorage,
    switchTab,
    generateCalendar,
    updateAIRequirements
};
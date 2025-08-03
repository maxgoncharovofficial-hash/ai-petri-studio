// Threads Connection Page JavaScript
// Функционал подключения аккаунта и настройки расписания

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
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
    console.log('Threads Connection page loaded');
    
    initializeBackButton();
    initializeConnection();
    initializeCalendar();
    initializeNavigation();
    loadSavedData();
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
    const autopilotButton = document.getElementById('go-to-autopilot');
    const createButton = document.getElementById('go-to-create');
    
    if (autopilotButton) {
        autopilotButton.addEventListener('click', function() {
            window.location.href = 'threads-autopilot.html';
        });
    }
    
    if (createButton) {
        createButton.addEventListener('click', function() {
            window.location.href = 'threads-create.html';
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
        scheduleButton.textContent = '🤖 Перейти к автопилоту';
        
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
            const selectedDateInfo = document.getElementById('selected-date-info');
            if (selectedDateInfo) {
                selectedDateInfo.style.display = 'none';
            }
            generateCalendar();
        });
    }
    
    // Инициализация селектора времени
    initializeTimeSelector();
}

function showScheduleSetup() {
    // Перебрасываем в автопилот для настройки расписания
    console.log('Redirecting to autopilot for schedule setup...');
    window.location.href = 'threads-autopilot.html';
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
    // Тихо сохраняем данные без всплывающих уведомлений
    console.log('Schedule setup completed:', scheduleData);
}

function launchAutopilot() {
    console.log('Launching autopilot...');
    
    // Сохраняем статус автопилота
    saveToStorage('threads_autopilot', {
        active: true,
        launchedAt: new Date().toISOString()
    });
    
    // Переходим к автопилоту
    window.location.href = 'threads-autopilot.html';
}

function modifySchedule() {
    // Показываем форму настройки снова
    document.getElementById('setup-complete').style.display = 'none';
    document.getElementById('schedule-setup').style.display = 'block';
    
    // Загружаем сохраненные данные
    loadScheduleData();
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

// === ОТЛАДКА ===
console.log('Threads Connection JavaScript loaded successfully');
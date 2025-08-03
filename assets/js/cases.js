// Cases Page JavaScript - ПОЛНОСТЬЮ ПЕРЕПИСАН С МАКСИМАЛЬНОЙ ОТЛАДКОЙ

let currentEditingCaseId = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 === DOMContentLoaded - Cases page initialization started ===');
    console.log('📋 Script version: v30.23');
    console.log('📋 Current timestamp:', new Date().toISOString());
    console.log('📋 User agent:', navigator.userAgent);
    console.log('📋 Viewport size:', window.innerWidth, 'x', window.innerHeight);
    
    // Проверяем что все основные элементы существуют
    const form = document.getElementById('cases-form');
    const saveButton = document.getElementById('save-button');
    const saveModal = document.getElementById('save-modal');
    const modalOkButton = document.getElementById('modal-ok-button');
    
    console.log('📋 Form found:', form);
    console.log('💾 Save button found:', saveButton);
    console.log('📱 Save modal found:', saveModal);
    console.log('✅ Modal OK button found:', modalOkButton);
    
    if (!form) {
        console.error('❌ CRITICAL ERROR: Form not found!');
        return;
    }
    
    if (!saveButton) {
        console.error('❌ CRITICAL ERROR: Save button not found!');
        return;
    }
    
    if (!saveModal) {
        console.error('❌ CRITICAL ERROR: Save modal not found!');
        return;
    }
    
    if (!modalOkButton) {
        console.error('❌ CRITICAL ERROR: Modal OK button not found!');
        return;
    }
    
    console.log('✅ All critical elements found successfully');
    
    // Инициализация вкладок
    initializeTabs();
    
    // Добавляем обработчик для кнопки назад
    const backButton = document.getElementById('back-button');
    console.log('⬅️ Back button found:', backButton);
    
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('⬅️ Back button clicked');
            window.location.href = 'personality.html';
        });
        
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('⬅️ Back button touched');
            window.location.href = 'personality.html';
        });
    }
    
    // Инициализация обработчиков формы
    initializeFormHandlers();
    
    // Инициализация модальных окон
    initializeModals();
    
    // Инициализация кнопки просмотра кейсов
    initializeViewCasesButton();
    
    // Обновляем прогресс
    updateProgress();
    
    console.log('🚀 === Cases page initialization completed successfully ===');
    
    // ГЛОБАЛЬНЫЙ ОБРАБОТЧИК КЛИКОВ ДЛЯ ДИАГНОСТИКИ И ДЕЛЕГИРОВАНИЯ
    document.addEventListener('click', function(e) {
        console.log('🔍 === GLOBAL CLICK DETECTED ===');
        console.log('🔍 Clicked element:', e.target);
        console.log('🔍 Element tag:', e.target.tagName);
        console.log('🔍 Element classes:', e.target.className);
        console.log('🔍 Element ID:', e.target.id);
        
        // ДЕЛЕГИРОВАНИЕ СОБЫТИЙ ДЛЯ КНОПОК КАРТОЧЕК
        if (e.target.classList.contains('case-action-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('✅ CASE ACTION BUTTON CLICKED!');
            const action = e.target.dataset.action;
            const caseId = parseInt(e.target.dataset.caseId);
            
            console.log('📋 Action:', action);
            console.log('📋 Case ID:', caseId);
            
            // Обработка действий
            if (action === 'view') {
                const cases = getCases();
                const caseData = cases.find(case_ => case_.id === caseId);
                if (caseData) {
                    showCaseModal(caseData);
                }
            } else if (action === 'edit') {
                const cases = getCases();
                const caseData = cases.find(case_ => case_.id === caseId);
                if (caseData) {
                    loadCaseForEditing(caseData);
                }
            } else if (action === 'delete') {
                showDeleteConfirmModal(caseId);
            }
        }
        
        if (e.target.id === 'save-button') {
            console.log('✅ SAVE BUTTON CLICKED!');
        }
        
        if (e.target.id === 'modal-ok-button') {
            console.log('✅ MODAL OK BUTTON CLICKED!');
        }
    });
});

// Инициализация вкладок
function initializeTabs() {
    console.log('📑 === Initializing tabs ===');
    const tabButtons = document.querySelectorAll('.tab-button');
    console.log('📑 Found tab buttons:', tabButtons.length);
    
    tabButtons.forEach((button, index) => {
        console.log(`📑 Tab button ${index + 1}:`, button);
        console.log(`📑 Tab button ${index + 1} data-tab:`, button.getAttribute('data-tab'));
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            console.log('📑 Tab button clicked:', tabName);
            switchTab(tabName);
        });
        
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            console.log('📑 Tab button touched:', tabName);
            switchTab(tabName);
        });
    });
    console.log('📑 === Tabs initialization completed ===');
}

// Переключение вкладок
function switchTab(tabName) {
    console.log('🔄 === switchTab() called with tabName:', tabName, '===');
    
    // Обновляем активную вкладку
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeTabButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTabButton) {
        activeTabButton.classList.add('active');
        console.log('✅ Active tab button updated');
    } else {
        console.error('❌ Tab button not found for:', tabName);
    }
    
    // Показываем соответствующий контент
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    const activeTabPanel = document.getElementById(`${tabName}-tab`);
    if (activeTabPanel) {
        activeTabPanel.classList.add('active');
        console.log('✅ Active tab panel updated');
    } else {
        console.error('❌ Tab panel not found for:', tabName);
    }
    
    // Если переключаемся на список кейсов, обновляем его
    if (tabName === 'list') {
        console.log('📋 Switching to list tab, showing fullscreen interface...');
        showFullscreenCasesInterface();
    }
    
    console.log('🔄 === Tab switched successfully to:', tabName, '===');
}

// Инициализация обработчиков формы
function initializeFormHandlers() {
    console.log('📝 === Initializing form handlers ===');
    
    const form = document.getElementById('cases-form');
    const textareas = document.querySelectorAll('textarea');
    const saveButton = document.getElementById('save-button');
    
    console.log('📝 Form found:', form);
    console.log('💾 Save button found:', saveButton);
    console.log('📝 Textareas found:', textareas.length);
    
    // Обработчик отправки формы
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Form submitted, calling saveData()');
            saveData();
        });
    }
    
    // Универсальный обработчик для кнопки сохранения (работает на всех устройствах)
    if (saveButton) {
        console.log('💾 Setting up save button handlers...');
        
        // Обработчик для клика (desktop)
        saveButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('💾 === SAVE BUTTON CLICKED (DESKTOP) ===');
            console.log('💾 Event type:', e.type);
            console.log('💾 Target:', e.target);
            console.log('💾 Current target:', e.currentTarget);
            saveData();
        });
        
        // Обработчик для touchstart (mobile)
        saveButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('💾 === SAVE BUTTON TOUCHED (MOBILE) ===');
            console.log('💾 Event type:', e.type);
            console.log('💾 Target:', e.target);
            console.log('💾 Current target:', e.currentTarget);
            saveData();
        });
        
        console.log('✅ Save button handlers set up successfully');
    } else {
        console.error('❌ CRITICAL ERROR: Save button not found!');
    }
    
    // Обработчики для каждого textarea
    textareas.forEach((textarea, index) => {
        const questionNumber = index + 1;
        console.log(`📝 Setting up handlers for textarea ${questionNumber}:`, textarea);
        
        // Обработчик изменения текста
        textarea.addEventListener('input', function() {
            updateCharCounter(questionNumber, this.value.length);
            updateProgress();
        });
        
        // Обработчик фокуса
        textarea.addEventListener('focus', function() {
            this.style.borderColor = 'var(--tg-theme-button-color, #007bff)';
        });
        
        // Обработчик потери фокуса
        textarea.addEventListener('blur', function() {
            this.style.borderColor = 'var(--tg-theme-hint-color, #e9ecef)';
        });
        
        // Обработчик touchstart для мобильных
        textarea.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });
    });
    
    console.log('📝 === Form handlers initialization completed ===');
}

// Обновление счетчика символов
function updateCharCounter(questionNumber, charCount) {
    const counter = document.getElementById(`char-count-${questionNumber}`);
    if (counter) {
        counter.textContent = charCount;
        
        // Изменяем цвет при приближении к лимиту
        if (charCount > 1800) {
            counter.style.color = '#dc3545';
        } else if (charCount > 1500) {
            counter.style.color = '#ffc107';
        } else {
            counter.style.color = 'var(--tg-theme-hint-color, #6c757d)';
        }
    }
}

// Обновление прогресса
function updateProgress() {
    const textareas = document.querySelectorAll('textarea');
    let filledCount = 0;
    
    textareas.forEach(textarea => {
        if (textarea.value.trim().length > 0) {
            filledCount++;
        }
    });
    
    const percentage = Math.round((filledCount / 6) * 100);
    
    // Обновляем счетчики
    const filledQuestions = document.getElementById('filled-questions');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressFill = document.getElementById('progress-fill');
    
    if (filledQuestions) filledQuestions.textContent = `${filledCount}/6`;
    if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
}

// Сохранение данных - ПОЛНОСТЬЮ ПЕРЕПИСАНА С МАКСИМАЛЬНОЙ ОТЛАДКОЙ
function saveData() {
    console.log('💾 === НАЧАЛО СОХРАНЕНИЯ КЕЙСА ===');
    console.log('💾 Function saveData() called at:', new Date().toISOString());
    
    // Проверяем что форма существует
    const form = document.getElementById('cases-form');
    if (!form) {
        console.error('❌ CRITICAL ERROR: Form not found!');
        alert('Ошибка: форма не найдена');
        return;
    }
    console.log('✅ Form found successfully');
    
    // Проверяем все элементы формы
    const question1 = document.getElementById('question-1');
    const question2 = document.getElementById('question-2');
    const question3 = document.getElementById('question-3');
    const question4 = document.getElementById('question-4');
    const question5 = document.getElementById('question-5');
    const question6 = document.getElementById('question-6');
    
    console.log('📝 Question 1 element:', question1);
    console.log('📝 Question 2 element:', question2);
    console.log('📝 Question 3 element:', question3);
    console.log('📝 Question 4 element:', question4);
    console.log('📝 Question 5 element:', question5);
    console.log('📝 Question 6 element:', question6);
    
    if (!question1 || !question2 || !question3 || !question4 || !question5 || !question6) {
        console.error('❌ CRITICAL ERROR: One or more form elements not found!');
        alert('Ошибка: элементы формы не найдены');
        return;
    }
    
    // РАСШИРЕННАЯ ОТЛАДКА ЗНАЧЕНИЙ
    console.log('📝 question1.value RAW:', `"${question1.value}"`);
    console.log('📝 question1.value LENGTH:', question1.value.length);
    console.log('📝 question1.value TRIMMED:', `"${question1.value.trim()}"`);
    console.log('📝 question1.value TRIMMED LENGTH:', question1.value.trim().length);
    
    // Альтернативные способы получения значения
    const byQuerySelector = document.querySelector('#question-1').value;
    const byName = document.querySelector('textarea[name="client_name"]').value;
    const byForm = document.forms['cases-form']['client_name'].value;
    
    console.log('📝 By querySelector:', `"${byQuerySelector}"`);
    console.log('📝 By name:', `"${byName}"`);
    console.log('📝 By form:', `"${byForm}"`);
    
    // Проверяем все textarea
    const allTextareas = document.querySelectorAll('textarea');
    console.log('📝 All textareas values:');
    allTextareas.forEach((ta, index) => {
        console.log(`📝 Textarea ${index}: "${ta.value}"`);
    });
    
    // Собираем данные из формы
    const clientName = question1.value.trim();
    console.log('👤 Имя клиента:', clientName);
    console.log('👤 Имя клиента length:', clientName.length);
    
    // Валидация - имя клиента обязательно
    if (!clientName) {
        console.log('❌ Validation failed: client name is empty');
        alert('Пожалуйста, укажите имя клиента');
        return;
    }
    console.log('✅ Client name validation passed');
    
    // Собираем все данные из формы
    const formData = {
        id: window.editingCaseId || Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        clientName: clientName,
        howFoundOut: question2.value.trim(),
        goals: question3.value.trim(),
        problems: question4.value.trim(),
        results: question5.value.trim(),
        whatHelped: question6.value.trim(),
        saved_at: new Date().toISOString()
    };
    console.log('📊 Данные формы:', formData);
    console.log('📊 Form data JSON:', JSON.stringify(formData));
    
    // Получаем существующие кейсы из localStorage
    let existingCases = [];
    try {
        console.log('💾 Reading from localStorage...');
        const savedData = localStorage.getItem('cases');
        console.log('💾 Raw localStorage data:', savedData);
        console.log('💾 Raw localStorage data type:', typeof savedData);
        
        if (savedData) {
            existingCases = JSON.parse(savedData);
            console.log('💾 Parsed existing cases:', existingCases);
            console.log('💾 Parsed cases type:', typeof existingCases);
            console.log('💾 Is array:', Array.isArray(existingCases));
            
            if (!Array.isArray(existingCases)) {
                console.log('💾 Data is not array, resetting to empty array');
                existingCases = [];
            }
        } else {
            console.log('💾 No existing cases found, starting with empty array');
        }
        
        // Убеждаемся что это массив
        if (!Array.isArray(existingCases)) {
            console.log('💾 Existing cases is not array, resetting to empty array');
            existingCases = [];
        }
        
    } catch (error) {
        console.error('❌ Error parsing existing cases:', error);
        existingCases = [];
    }
    
    console.log('📋 Существующие кейсы перед сохранением:', existingCases);
    console.log('📋 Количество существующих кейсов:', existingCases.length);
    
    // Добавляем или обновляем кейс
    if (window.editingCaseId) {
        // Режим редактирования - обновить существующий кейс
        const caseIndex = existingCases.findIndex(c => c.id === window.editingCaseId);
        if (caseIndex !== -1) {
            // Обновить данные, но сохранить исходный ID и дату создания
            const originalId = existingCases[caseIndex].id;
            const originalDate = existingCases[caseIndex].saved_at;
            
            existingCases[caseIndex] = {
                ...formData,
                id: originalId,
                saved_at: originalDate,
                updated_at: new Date().toISOString()
            };
            
            console.log('📝 Case updated:', formData.clientName);
        }
        
        // Сбросить режим редактирования
        delete window.editingCaseId;
    } else {
        // Режим создания - добавить новый кейс
        existingCases.push(formData);
        console.log('➕ New case added:', formData.clientName);
    }
    
    console.log('📋 Кейсы после добавления/обновления:', existingCases);
    console.log('📋 Кейсы JSON:', JSON.stringify(existingCases));
    
    // Сохраняем в localStorage
    try {
        console.log('💾 Attempting to save to localStorage...');
        const dataToSave = JSON.stringify(existingCases);
        console.log('💾 Data to save:', dataToSave);
        console.log('💾 Data to save length:', dataToSave.length);
        
        localStorage.setItem('cases', dataToSave);
        console.log('✅ Data saved to localStorage successfully');
        
        // Проверяем что сохранилось
        const saved = localStorage.getItem('cases');
        console.log('💾 Verification - saved data:', saved);
        console.log('💾 Verification - saved data length:', saved ? saved.length : 0);
        
        if (saved === dataToSave) {
            console.log('✅ Data verification successful - saved data matches');
        } else {
            console.error('❌ Data verification failed - saved data does not match');
        }
        
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
        alert('Ошибка при сохранении данных: ' + error.message);
        return;
    }
    
    // Очищаем форму
    console.log('🧹 Clearing form...');
    clearForm();
    console.log('✅ Form cleared');
    
    // Сбрасываем режим редактирования
    currentEditingCaseId = null;
    console.log('🔄 Editing mode reset');
    
    // Показываем сообщение об успехе
    console.log('📱 Showing success message...');
    showSuccessMessage();
    console.log('✅ Success message shown');
    
    console.log('💾 === КОНЕЦ СОХРАНЕНИЯ КЕЙСА ===');
}

// Очистка формы
function clearForm() {
    console.log('🧹 === Clearing form ===');
    const textareas = document.querySelectorAll('textarea');
    console.log('🧹 Found textareas to clear:', textareas.length);
    
    textareas.forEach((textarea, index) => {
        console.log(`🧹 Clearing textarea ${index + 1}:`, textarea);
        textarea.value = '';
        updateCharCounter(index + 1, 0);
    });
    updateProgress();
    console.log('🧹 === Form cleared successfully ===');
}

// Загрузка кейса в форму для редактирования
function loadCaseForEditing(caseData) {
    console.log('✏️ === Loading case for editing:', caseData, '===');
    
    document.getElementById('question-1').value = caseData.clientName || '';
    document.getElementById('question-2').value = caseData.howFoundOut || '';
    document.getElementById('question-3').value = caseData.goals || '';
    document.getElementById('question-4').value = caseData.problems || '';
    document.getElementById('question-5').value = caseData.results || '';
    document.getElementById('question-6').value = caseData.whatHelped || '';
    
    // Обновляем счетчики
    for (let i = 1; i <= 6; i++) {
        const value = document.getElementById(`question-${i}`).value;
        updateCharCounter(i, value.length);
    }
    
    updateProgress();
    
    // Устанавливаем режим редактирования
    currentEditingCaseId = caseData.id;
    console.log('✏️ Editing mode set for case ID:', currentEditingCaseId);
    
    // Переключаемся на вкладку создания
    switchTab('create');
    console.log('✏️ === Case loaded for editing successfully ===');
}

// Получение списка кейсов - ИСПРАВЛЕНА
function getCases() {
    console.log('📋 === getCases() called ===');
    
    try {
        const savedData = localStorage.getItem('cases');
        console.log('📋 Raw localStorage data in getCases:', savedData);
        console.log('📋 Raw localStorage data type:', typeof savedData);
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            console.log('📋 Parsed cases data in getCases:', parsed);
            console.log('📋 Parsed data type:', typeof parsed);
            console.log('📋 Is array:', Array.isArray(parsed));
            
            if (Array.isArray(parsed)) {
                console.log('📋 Returning array of cases:', parsed);
                console.log('📋 Cases count:', parsed.length);
                return parsed;
            } else {
                console.log('📋 Parsed data is not array, returning empty array');
                return [];
            }
        } else {
            console.log('📋 No data in localStorage, returning empty array');
            return [];
        }
    } catch (error) {
        console.error('❌ Error in getCases:', error);
        return [];
    }
}

// Загрузка списка кейсов - ИСПРАВЛЕНА
function loadCasesList() {
    console.log('📋 === loadCasesList() called ===');
    
    const cases = getCases();
    console.log('📋 Loaded cases from localStorage:', cases);
    console.log('📋 Cases count:', cases.length);
    
    const casesList = document.getElementById('cases-list');
    const emptyState = document.getElementById('empty-state');
    const casesCount = document.getElementById('cases-count');
    
    console.log('📋 Cases list element:', casesList);
    console.log('📋 Empty state element:', emptyState);
    console.log('📋 Cases count element:', casesCount);
    
    if (!casesList) {
        console.error('❌ CRITICAL ERROR: Cases list element not found!');
        return;
    }
    
    if (!emptyState) {
        console.error('❌ CRITICAL ERROR: Empty state element not found!');
        return;
    }
    
    if (!casesCount) {
        console.error('❌ CRITICAL ERROR: Cases count element not found!');
        return;
    }
    
    // ПРИНУДИТЕЛЬНО ПОКАЗАТЬ КОНТЕЙНЕР СПИСКА
    casesList.style.display = 'flex';
    casesList.style.visibility = 'visible';
    casesList.style.opacity = '1';
    casesList.style.width = '100%';
    casesList.style.minHeight = '200px';
    console.log('📋 Cases list container forced to show');
    
    // Обновляем счетчик
    const countText = `${cases.length} кейс${cases.length === 1 ? '' : cases.length < 5 ? 'а' : 'ов'}`;
    casesCount.textContent = countText;
    console.log('📋 Cases count updated:', countText);
    
    if (cases.length === 0) {
        // Показываем пустое состояние
        casesList.innerHTML = '';
        emptyState.style.display = 'block';
        console.log('📋 Showing empty state');
        return;
    }
    
    // Скрываем пустое состояние
    emptyState.style.display = 'none';
    console.log('📋 Hiding empty state');
    
    // Сортируем кейсы по дате (новые сверху)
    cases.sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));
    console.log('📋 Cases sorted by date');
    
    // Создаем HTML для каждого кейса
    const casesHTML = cases.map(case_ => createCaseCard(case_)).join('');
    console.log('📋 Generated HTML length:', casesHTML.length);
    console.log('📋 Generated HTML preview:', casesHTML.substring(0, 200) + '...');
    
    casesList.innerHTML = casesHTML;
    console.log('📋 Cases HTML inserted into DOM');
    
    // ПРИНУДИТЕЛЬНОЕ ПОКАЗЫВАНИЕ СПИСКА
    casesList.style.display = 'flex';
    casesList.style.flexDirection = 'column';
    casesList.style.gap = '16px';
    casesList.style.visibility = 'visible';
    casesList.style.opacity = '1';
    casesList.style.width = '100%';
    casesList.style.minHeight = '200px';
    
    // Проверяем каждую карточку
    const cards = casesList.querySelectorAll('.case-card');
    console.log('📋 Found case cards in DOM:', cards.length);
    cards.forEach((card, index) => {
        card.style.display = 'block';
        card.style.visibility = 'visible';
        card.style.opacity = '1';
        card.style.position = 'relative';
        card.style.zIndex = '1';
        console.log(`📋 Card ${index + 1} forced to show`);
    });
    
    // Добавляем обработчики для кнопок
    addCaseCardHandlers();
    console.log('📋 Case card handlers added');
    
    // ДОПОЛНИТЕЛЬНАЯ ДИАГНОСТИКА ОТОБРАЖЕНИЯ
    console.log('🔍 === ДОПОЛНИТЕЛЬНАЯ ДИАГНОСТИКА ===');
    
    // Проверяем видимость списка
    const listComputedStyle = window.getComputedStyle(casesList);
    console.log('📋 Cases list computed display:', listComputedStyle.display);
    console.log('📋 Cases list computed visibility:', listComputedStyle.visibility);
    console.log('📋 Cases list computed opacity:', listComputedStyle.opacity);
    console.log('📋 Cases list computed height:', listComputedStyle.height);
    
    // Проверяем каждую карточку
    const allCards = document.querySelectorAll('.case-card');
    console.log('📋 Total cards found in DOM:', allCards.length);
    allCards.forEach((card, index) => {
        const cardStyle = window.getComputedStyle(card);
        console.log(`📋 Card ${index + 1}:`);
        console.log(`   - Display: ${cardStyle.display}`);
        console.log(`   - Visibility: ${cardStyle.visibility}`);
        console.log(`   - Opacity: ${cardStyle.opacity}`);
        console.log(`   - Height: ${cardStyle.height}`);
        console.log(`   - Background: ${cardStyle.backgroundColor}`);
    });
    
    // Проверяем кнопки действий
    const actionButtons = document.querySelectorAll('.case-action-btn');
    console.log('📋 Action buttons found:', actionButtons.length);
    actionButtons.forEach((btn, index) => {
        const btnStyle = window.getComputedStyle(btn);
        console.log(`📋 Button ${index + 1}:`);
        console.log(`   - Display: ${btnStyle.display}`);
        console.log(`   - Visibility: ${btnStyle.visibility}`);
        console.log(`   - Action: ${btn.dataset.action}`);
        console.log(`   - Case ID: ${btn.dataset.caseId}`);
    });
    
    // Проверяем модальные окна
    const saveModal = document.getElementById('save-modal');
    const viewModal = document.getElementById('view-case-modal');
    const deleteModal = document.getElementById('delete-confirm-modal');
    
    console.log('📱 Modal elements found:');
    console.log('   - Save modal:', saveModal);
    console.log('   - View modal:', viewModal);
    console.log('   - Delete modal:', deleteModal);
    
    if (saveModal) {
        const modalStyle = window.getComputedStyle(saveModal);
        console.log('📱 Save modal computed style:');
        console.log('   - Display:', modalStyle.display);
        console.log('   - Visibility:', modalStyle.visibility);
        console.log('   - Position:', modalStyle.position);
        console.log('   - Z-index:', modalStyle.zIndex);
    }
    
    console.log('📋 === loadCasesList() completed successfully ===');
}

// Создание карточки кейса
function createCaseCard(case_) {
    console.log('🎴 Creating card for case:', case_);
    const description = case_.howFoundOut ? case_.howFoundOut.substring(0, 100) + (case_.howFoundOut.length > 100 ? '...' : '') : 'Описание не указано';
    
    const cardHTML = `
        <div class="case-card" data-case-id="${case_.id}">
            <div class="case-header">
                <h4 class="case-title">${case_.clientName}</h4>
                <span class="case-date">${case_.date}</span>
            </div>
            <div class="case-description">${description}</div>
            <div class="case-actions">
                <button class="case-action-btn view" data-action="view" data-case-id="${case_.id}">👁️ Просмотреть</button>
                <button class="case-action-btn edit" data-action="edit" data-case-id="${case_.id}">✏️ Редактировать</button>
                <button class="case-action-btn delete" data-action="delete" data-case-id="${case_.id}">🗑️ Удалить</button>
            </div>
        </div>
    `;
    
    console.log('🎴 Generated card HTML:', cardHTML);
    return cardHTML;
}

// Добавление обработчиков для карточек кейсов
function addCaseCardHandlers() {
    console.log('🎴 === Adding case card handlers ===');
    const actionButtons = document.querySelectorAll('.case-action-btn');
    console.log('🎴 Found action buttons:', actionButtons.length);
    
    actionButtons.forEach((button, index) => {
        console.log(`🎴 Setting up handler for button ${index + 1}:`, button);
        console.log(`🎴 Button action:`, button.getAttribute('data-action'));
        console.log(`🎴 Button case ID:`, button.getAttribute('data-case-id'));
        
        // Обработчик для клика (desktop)
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const action = this.getAttribute('data-action');
            const caseId = parseInt(this.getAttribute('data-case-id'));
            const cases = getCases();
            const caseData = cases.find(case_ => case_.id === caseId);
            
            console.log('🎴 Action button clicked:', action, 'for case:', caseId);
            
            if (!caseData) {
                console.error('❌ Case data not found for ID:', caseId);
                return;
            }
            
            switch (action) {
                case 'view':
                    showCaseModal(caseData);
                    break;
                case 'edit':
                    loadCaseForEditing(caseData);
                    break;
                case 'delete':
                    showDeleteConfirmModal(caseId);
                    break;
            }
        });
        
        // Обработчик для touchstart (mobile)
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const action = this.getAttribute('data-action');
            const caseId = parseInt(this.getAttribute('data-case-id'));
            const cases = getCases();
            const caseData = cases.find(case_ => case_.id === caseId);
            
            console.log('🎴 Action button touched:', action, 'for case:', caseId);
            
            if (!caseData) {
                console.error('❌ Case data not found for ID:', caseId);
                return;
            }
            
            switch (action) {
                case 'view':
                    showCaseModal(caseData);
                    break;
                case 'edit':
                    loadCaseForEditing(caseData);
                    break;
                case 'delete':
                    showDeleteConfirmModal(caseId);
                    break;
            }
        });
    });
    console.log('🎴 === Case card handlers added successfully ===');
}

// Инициализация модальных окон
function initializeModals() {
    console.log('📱 === Initializing modals ===');
    
    // Модальное окно сохранения
    const saveModal = document.getElementById('save-modal');
    const saveOkButton = document.getElementById('modal-ok-button');
    
    console.log('📱 Save modal found:', saveModal);
    console.log('📱 Save OK button found:', saveOkButton);
    
    if (saveOkButton) {
        console.log('📱 Setting up save OK button handlers...');
        
        saveOkButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📱 Save OK button clicked');
            hideModal('save-modal');
            // Переходим на страницу списка кейсов после сохранения
            setTimeout(() => {
                window.location.href = 'cases-list.html';
                console.log('📱 Redirecting to cases list after save');
            }, 100);
        });
        
        saveOkButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('📱 Save OK button touched');
            hideModal('save-modal');
            // Переходим на страницу списка кейсов после сохранения
            setTimeout(() => {
                window.location.href = 'cases-list.html';
                console.log('📱 Redirecting to cases list after save');
            }, 100);
        });
        
        console.log('✅ Save OK button handlers set up successfully');
    } else {
        console.error('❌ CRITICAL ERROR: Save OK button not found!');
    }
    
    // Модальное окно просмотра кейса
    const viewModal = document.getElementById('view-case-modal');
    const editCaseButton = document.getElementById('edit-case-button');
    const closeViewModal = document.getElementById('close-view-modal');
    
    console.log('📱 View modal found:', viewModal);
    console.log('📱 Edit case button found:', editCaseButton);
    console.log('📱 Close view modal found:', closeViewModal);
    
    if (editCaseButton) {
        editCaseButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📱 Edit case button clicked');
            const caseData = JSON.parse(this.getAttribute('data-case'));
            hideModal('view-case-modal');
            loadCaseForEditing(caseData);
        });
        
        editCaseButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('📱 Edit case button touched');
            const caseData = JSON.parse(this.getAttribute('data-case'));
            hideModal('view-case-modal');
            loadCaseForEditing(caseData);
        });
    }
    
    if (closeViewModal) {
        closeViewModal.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📱 Close view modal clicked');
            hideModal('view-case-modal');
        });
        
        closeViewModal.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('📱 Close view modal touched');
            hideModal('view-case-modal');
        });
    }
    
    // Модальное окно подтверждения удаления
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    
    console.log('📱 Delete confirm modal found:', deleteConfirmModal);
    console.log('📱 Confirm delete button found:', confirmDeleteButton);
    console.log('📱 Cancel delete button found:', cancelDeleteButton);
    
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📱 Confirm delete button clicked');
            const caseId = parseInt(this.getAttribute('data-case-id'));
            deleteCase(caseId);
            hideModal('delete-confirm-modal');
        });
        
        confirmDeleteButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('📱 Confirm delete button touched');
            const caseId = parseInt(this.getAttribute('data-case-id'));
            deleteCase(caseId);
            hideModal('delete-confirm-modal');
        });
    }
    
    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📱 Cancel delete button clicked');
            hideModal('delete-confirm-modal');
        });
        
        cancelDeleteButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('📱 Cancel delete button touched');
            hideModal('delete-confirm-modal');
        });
    }
    
    console.log('📱 === Modals initialized successfully ===');
}

// Показ модального окна
function showModal(modalId) {
    console.log('📱 === FORCE SHOWING MODAL:', modalId, '===');
    const modal = document.getElementById(modalId);
    if (modal) {
        console.log('📱 Modal element found:', modal);
        
        // ПРИНУДИТЕЛЬНОЕ ПОКАЗЫВАНИЕ
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.zIndex = '999999';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.classList.add('show');
        
        console.log('✅ Modal forced to show');
        
        // Проверка через 100ms
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(modal);
            console.log('📱 Modal computed display:', computedStyle.display);
            console.log('📱 Modal computed visibility:', computedStyle.visibility);
            console.log('📱 Modal computed opacity:', computedStyle.opacity);
        }, 100);
    } else {
        console.error('❌ Modal not found:', modalId);
    }
}

// Скрытие модального окна
function hideModal(modalId) {
    console.log('📱 === Hiding modal:', modalId, '===');
    const modal = document.getElementById(modalId);
    if (modal) {
        console.log('📱 Modal element found:', modal);
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        console.log('✅ Modal hidden successfully');
    } else {
        console.error('❌ Modal not found:', modalId);
    }
}



// Показ модального окна кейса
function showCaseModal(caseData) {
    console.log('📋 === Showing case modal ===');
    console.log('📋 Case data:', caseData);
    
    // Простой alert для просмотра кейса
    const message = `📋 Просмотр кейса: ${caseData.clientName}

📅 Дата: ${caseData.date}
🎯 Цели: ${caseData.goals || 'Не указано'}
❗ Проблемы: ${caseData.problems || 'Не указано'}
✅ Результаты: ${caseData.results || 'Не указано'}
💡 Что помогло: ${caseData.whatHelped || 'Не указано'}`;
    
    alert(message);
    console.log('✅ Case modal shown');
}

// Показ модального окна подтверждения удаления
function showDeleteConfirmModal(caseId) {
    console.log('📱 === Showing delete confirm modal for case:', caseId, '===');
    const confirmButton = document.getElementById('confirm-delete');
    confirmButton.setAttribute('data-case-id', caseId);
    showModal('delete-confirm-modal');
}

// Удаление кейса
function deleteCase(caseId) {
    console.log('🗑️ === Deleting case:', caseId, '===');
    const cases = getCases();
    const updatedCases = cases.filter(case_ => case_.id !== caseId);
    localStorage.setItem('cases_data', JSON.stringify(updatedCases));
    loadCasesList();
    console.log('✅ Case deleted successfully');
}

// Загрузка кейса для редактирования
function loadCaseForEditing(caseData) {
    console.log('📝 === Loading case for editing ===');
    console.log('📝 Case data:', caseData);
    
    // Заполнить форму данными кейса для редактирования
    const question1 = document.getElementById('question-1');
    const question2 = document.getElementById('question-2');
    const question3 = document.getElementById('question-3');
    const question4 = document.getElementById('question-4');
    const question5 = document.getElementById('question-5');
    const question6 = document.getElementById('question-6');
    
    if (question1) question1.value = caseData.clientName || '';
    if (question2) question2.value = caseData.howFoundOut || '';
    if (question3) question3.value = caseData.goals || '';
    if (question4) question4.value = caseData.problems || '';
    if (question5) question5.value = caseData.results || '';
    if (question6) question6.value = caseData.whatHelped || '';
    
    // Установить режим редактирования
    window.editingCaseId = caseData.id;
    console.log('📝 Case loaded for editing:', caseData.clientName);
    console.log('📝 Editing case ID:', window.editingCaseId);
}

// Инициализация кнопки просмотра кейсов
function initializeViewCasesButton() {
    console.log('📋 Initializing view cases button');
    
    const viewCasesBtn = document.getElementById('view-cases-btn');
    if (viewCasesBtn) {
        viewCasesBtn.addEventListener('click', function() {
            console.log('📋 View cases button clicked');
            window.location.href = 'cases-list.html';
        });
        
        viewCasesBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('📋 View cases button touched');
            window.location.href = 'cases-list.html';
        });
        
        console.log('✅ View cases button handlers set up');
    } else {
        console.error('❌ View cases button not found');
    }
}

// Показ сообщения об успехе через модальное окно
function showSuccessMessage() {
    console.log('📱 === Showing success message ===');
    console.log('📱 About to show save-modal');
    showModal('save-modal');
    console.log('📱 Success message modal should be visible now');
}

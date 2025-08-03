// Cases Page JavaScript

let currentEditingCaseId = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cases page loaded');
    
    // Инициализация вкладок
    initializeTabs();
    
    // Добавляем обработчик для кнопки назад
    const backButton = document.getElementById('back-button');
    console.log('Back button found:', backButton);
    
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Back button clicked');
            window.location.href = 'personality.html';
        });
        
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Back button touched');
            window.location.href = 'personality.html';
        });
    }
    
    // Инициализация обработчиков формы
    initializeFormHandlers();
    
    // Инициализация модальных окон
    initializeModals();
    
    // Загружаем список кейсов
    loadCasesList();
    
    // Обновляем прогресс
    updateProgress();
});

// Инициализация вкладок
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    console.log('Found tab buttons:', tabButtons.length);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            console.log('Tab button clicked:', tabName);
            switchTab(tabName);
        });
        
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            console.log('Tab button touched:', tabName);
            switchTab(tabName);
        });
    });
}

// Переключение вкладок
function switchTab(tabName) {
    console.log('switchTab() called with tabName:', tabName);
    
    // Обновляем активную вкладку
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeTabButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTabButton) {
        activeTabButton.classList.add('active');
        console.log('Active tab button updated');
    } else {
        console.error('Tab button not found for:', tabName);
    }
    
    // Показываем соответствующий контент
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    const activeTabPanel = document.getElementById(`${tabName}-tab`);
    if (activeTabPanel) {
        activeTabPanel.classList.add('active');
        console.log('Active tab panel updated');
    } else {
        console.error('Tab panel not found for:', tabName);
    }
    
    // Если переключаемся на список кейсов, обновляем его
    if (tabName === 'list') {
        console.log('Switching to list tab, loading cases list...');
        loadCasesList();
    }
    
    console.log('Tab switched successfully to:', tabName);
}

// Инициализация обработчиков формы
function initializeFormHandlers() {
    const form = document.getElementById('cases-form');
    const textareas = document.querySelectorAll('textarea');
    const saveButton = document.getElementById('save-button');
    
    console.log('Form found:', form);
    console.log('Save button found:', saveButton);
    console.log('Textareas found:', textareas.length);
    
    // Обработчик отправки формы
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted, calling saveData()');
            saveData();
        });
    }
    
    // Универсальный обработчик для кнопки сохранения (работает на всех устройствах)
    if (saveButton) {
        // Обработчик для клика (desktop)
        saveButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Save button clicked (desktop), calling saveData()');
            saveData();
        });
        
        // Обработчик для touchstart (mobile)
        saveButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Save button touched (mobile), calling saveData()');
            saveData();
        });
    } else {
        console.error('Save button not found!');
    }
    
    // Обработчики для каждого textarea
    textareas.forEach((textarea, index) => {
        const questionNumber = index + 1;
        
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

// Сохранение данных - ПОЛНОСТЬЮ ПЕРЕПИСАНА С ОТЛАДКОЙ
function saveData() {
    console.log('=== НАЧАЛО СОХРАНЕНИЯ КЕЙСА ===');
    
    // Проверяем что форма существует
    const form = document.getElementById('cases-form');
    if (!form) {
        console.error('Форма не найдена!');
        return;
    }
    
    // Собираем данные из формы
    const clientName = document.getElementById('question-1').value.trim();
    console.log('Имя клиента:', clientName);
    
    // Валидация - имя клиента обязательно
    if (!clientName) {
        console.log('Validation failed: client name is empty');
        alert('Пожалуйста, укажите имя клиента');
        return;
    }
    
    // Собираем все данные из формы
    const formData = {
        id: currentEditingCaseId || Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        clientName: clientName,
        howFoundOut: document.getElementById('question-2').value.trim(),
        goals: document.getElementById('question-3').value.trim(),
        problems: document.getElementById('question-4').value.trim(),
        results: document.getElementById('question-5').value.trim(),
        whatHelped: document.getElementById('question-6').value.trim(),
        saved_at: new Date().toISOString()
    };
    console.log('Данные формы:', formData);
    
    // Получаем существующие кейсы из localStorage
    let existingCases = [];
    try {
        const savedData = localStorage.getItem('cases_data');
        console.log('Raw localStorage data:', savedData);
        
        if (savedData) {
            existingCases = JSON.parse(savedData);
            console.log('Parsed existing cases:', existingCases);
        } else {
            console.log('No existing cases found, starting with empty array');
        }
        
        // Убеждаемся что это массив
        if (!Array.isArray(existingCases)) {
            console.log('Existing cases is not array, resetting to empty array');
            existingCases = [];
        }
        
    } catch (error) {
        console.error('Error parsing existing cases:', error);
        existingCases = [];
    }
    
    console.log('Существующие кейсы перед сохранением:', existingCases);
    console.log('Количество существующих кейсов:', existingCases.length);
    
    // Добавляем или обновляем кейс
    if (currentEditingCaseId) {
        // Обновляем существующий кейс
        const index = existingCases.findIndex(case_ => case_.id === currentEditingCaseId);
        if (index !== -1) {
            existingCases[index] = formData;
            console.log('Updated existing case at index:', index);
        } else {
            console.log('Case not found for editing, adding as new');
            existingCases.push(formData);
        }
    } else {
        // Добавляем новый кейс
        existingCases.push(formData);
        console.log('Added new case, total cases now:', existingCases.length);
    }
    
    console.log('Кейсы после добавления/обновления:', existingCases);
    
    // Сохраняем в localStorage
    try {
        localStorage.setItem('cases_data', JSON.stringify(existingCases));
        console.log('Data saved to localStorage successfully');
        
        // Проверяем что сохранилось
        const saved = localStorage.getItem('cases_data');
        console.log('Проверка сохранения:', saved);
        
        // Сразу обновляем список кейсов
        loadCasesList();
        console.log('Cases list updated immediately');
        
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        alert('Ошибка при сохранении данных');
        return;
    }
    
    // Очищаем форму
    clearForm();
    console.log('Form cleared');
    
    // Сбрасываем режим редактирования
    currentEditingCaseId = null;
    
    // Показываем сообщение об успехе
    showSuccessMessage();
    console.log('Success message shown');
    
    console.log('=== КОНЕЦ СОХРАНЕНИЯ КЕЙСА ===');
}

// Очистка формы
function clearForm() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea, index) => {
        textarea.value = '';
        updateCharCounter(index + 1, 0);
    });
    updateProgress();
}

// Загрузка кейса в форму для редактирования
function loadCaseForEditing(caseData) {
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
    
    // Переключаемся на вкладку создания
    switchTab('create');
}

// Получение списка кейсов - ИСПРАВЛЕНА
function getCases() {
    console.log('=== getCases() called ===');
    
    try {
        const savedData = localStorage.getItem('cases_data');
        console.log('Raw localStorage data in getCases:', savedData);
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            console.log('Parsed cases data in getCases:', parsed);
            
            if (Array.isArray(parsed)) {
                console.log('Returning array of cases:', parsed);
                return parsed;
            } else {
                console.log('Parsed data is not array, returning empty array');
                return [];
            }
        } else {
            console.log('No data in localStorage, returning empty array');
            return [];
        }
    } catch (error) {
        console.error('Error in getCases:', error);
        return [];
    }
}

// Загрузка списка кейсов - ИСПРАВЛЕНА
function loadCasesList() {
    console.log('=== loadCasesList() called ===');
    
    const cases = getCases();
    console.log('Loaded cases from localStorage:', cases);
    console.log('Cases count:', cases.length);
    
    const casesList = document.getElementById('cases-list');
    const emptyState = document.getElementById('empty-state');
    const casesCount = document.getElementById('cases-count');
    
    console.log('Cases list element:', casesList);
    console.log('Empty state element:', emptyState);
    console.log('Cases count element:', casesCount);
    
    if (!casesList) {
        console.error('Cases list element not found!');
        return;
    }
    
    if (!emptyState) {
        console.error('Empty state element not found!');
        return;
    }
    
    if (!casesCount) {
        console.error('Cases count element not found!');
        return;
    }
    
    // Обновляем счетчик
    casesCount.textContent = `${cases.length} кейс${cases.length === 1 ? '' : cases.length < 5 ? 'а' : 'ов'}`;
    console.log('Cases count updated:', casesCount.textContent);
    
    if (cases.length === 0) {
        // Показываем пустое состояние
        casesList.innerHTML = '';
        emptyState.style.display = 'block';
        console.log('Showing empty state');
        return;
    }
    
    // Скрываем пустое состояние
    emptyState.style.display = 'none';
    console.log('Hiding empty state');
    
    // Сортируем кейсы по дате (новые сверху)
    cases.sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));
    console.log('Cases sorted by date');
    
    // Создаем HTML для каждого кейса
    const casesHTML = cases.map(case_ => createCaseCard(case_)).join('');
    console.log('Generated HTML:', casesHTML);
    
    casesList.innerHTML = casesHTML;
    console.log('Cases HTML inserted into DOM');
    
    // Добавляем обработчики для кнопок
    addCaseCardHandlers();
    console.log('Case card handlers added');
    
    console.log('=== loadCasesList() completed successfully ===');
}

// Создание карточки кейса
function createCaseCard(case_) {
    console.log('Creating card for case:', case_);
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
    
    console.log('Generated card HTML:', cardHTML);
    return cardHTML;
}

// Добавление обработчиков для карточек кейсов
function addCaseCardHandlers() {
    const actionButtons = document.querySelectorAll('.case-action-btn');
    console.log('Found action buttons:', actionButtons.length);
    
    actionButtons.forEach(button => {
        // Обработчик для клика (desktop)
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const action = this.getAttribute('data-action');
            const caseId = parseInt(this.getAttribute('data-case-id'));
            const cases = getCases();
            const caseData = cases.find(case_ => case_.id === caseId);
            
            console.log('Action button clicked:', action, 'for case:', caseId);
            
            if (!caseData) {
                console.error('Case data not found for ID:', caseId);
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
            
            console.log('Action button touched:', action, 'for case:', caseId);
            
            if (!caseData) {
                console.error('Case data not found for ID:', caseId);
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
}

// Инициализация модальных окон
function initializeModals() {
    console.log('Initializing modals...');
    
    // Модальное окно сохранения
    const saveModal = document.getElementById('save-modal');
    const saveOkButton = document.getElementById('modal-ok-button');
    
    console.log('Save modal found:', saveModal);
    console.log('Save OK button found:', saveOkButton);
    
    if (saveOkButton) {
        saveOkButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Save OK button clicked');
            hideModal('save-modal');
            // Переключаемся на список кейсов после закрытия модального окна
            setTimeout(() => {
                switchTab('list');
                console.log('Switched to list tab after save');
            }, 100);
        });
        
        saveOkButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Save OK button touched');
            hideModal('save-modal');
            // Переключаемся на список кейсов после закрытия модального окна
            setTimeout(() => {
                switchTab('list');
                console.log('Switched to list tab after save');
            }, 100);
        });
    }
    
    // Модальное окно просмотра кейса
    const viewModal = document.getElementById('view-case-modal');
    const editCaseButton = document.getElementById('edit-case-button');
    const closeViewModal = document.getElementById('close-view-modal');
    
    console.log('View modal found:', viewModal);
    console.log('Edit case button found:', editCaseButton);
    console.log('Close view modal found:', closeViewModal);
    
    if (editCaseButton) {
        editCaseButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Edit case button clicked');
            const caseData = JSON.parse(this.getAttribute('data-case'));
            hideModal('view-case-modal');
            loadCaseForEditing(caseData);
        });
        
        editCaseButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Edit case button touched');
            const caseData = JSON.parse(this.getAttribute('data-case'));
            hideModal('view-case-modal');
            loadCaseForEditing(caseData);
        });
    }
    
    if (closeViewModal) {
        closeViewModal.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Close view modal clicked');
            hideModal('view-case-modal');
        });
        
        closeViewModal.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Close view modal touched');
            hideModal('view-case-modal');
        });
    }
    
    // Модальное окно подтверждения удаления
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    
    console.log('Delete confirm modal found:', deleteConfirmModal);
    console.log('Confirm delete button found:', confirmDeleteButton);
    console.log('Cancel delete button found:', cancelDeleteButton);
    
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Confirm delete button clicked');
            const caseId = parseInt(this.getAttribute('data-case-id'));
            deleteCase(caseId);
            hideModal('delete-confirm-modal');
        });
        
        confirmDeleteButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Confirm delete button touched');
            const caseId = parseInt(this.getAttribute('data-case-id'));
            deleteCase(caseId);
            hideModal('delete-confirm-modal');
        });
    }
    
    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Cancel delete button clicked');
            hideModal('delete-confirm-modal');
        });
        
        cancelDeleteButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Cancel delete button touched');
            hideModal('delete-confirm-modal');
        });
    }
    
    console.log('Modals initialized successfully');
}

// Показ модального окна
function showModal(modalId) {
    console.log('Showing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        console.log('Modal shown successfully');
    } else {
        console.error('Modal not found:', modalId);
    }
}

// Скрытие модального окна
function hideModal(modalId) {
    console.log('Hiding modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        console.log('Modal hidden successfully');
    } else {
        console.error('Modal not found:', modalId);
    }
}

// Показ модального окна кейса
function showCaseModal(caseData) {
    console.log('Showing case modal for:', caseData);
    const modalContent = document.getElementById('view-case-content');
    const editButton = document.getElementById('edit-case-button');
    
    const content = `
        <div class="case-field">
            <div class="case-field-label">Имя клиента:</div>
            <div class="case-field-value">${caseData.clientName}</div>
        </div>
        <div class="case-field">
            <div class="case-field-label">Как узнал о вас:</div>
            <div class="case-field-value">${caseData.howFoundOut || 'Не указано'}</div>
        </div>
        <div class="case-field">
            <div class="case-field-label">Основные цели:</div>
            <div class="case-field-value">${caseData.goals || 'Не указано'}</div>
        </div>
        <div class="case-field">
            <div class="case-field-label">Проблемы до работы:</div>
            <div class="case-field-value">${caseData.problems || 'Не указано'}</div>
        </div>
        <div class="case-field">
            <div class="case-field-label">Достигнутые результаты:</div>
            <div class="case-field-value">${caseData.results || 'Не указано'}</div>
        </div>
        <div class="case-field">
            <div class="case-field-label">Что помогло:</div>
            <div class="case-field-value">${caseData.whatHelped || 'Не указано'}</div>
        </div>
    `;
    
    modalContent.innerHTML = content;
    editButton.setAttribute('data-case', JSON.stringify(caseData));
    
    showModal('view-case-modal');
}

// Показ модального окна подтверждения удаления
function showDeleteConfirmModal(caseId) {
    console.log('Showing delete confirm modal for case:', caseId);
    const confirmButton = document.getElementById('confirm-delete');
    confirmButton.setAttribute('data-case-id', caseId);
    showModal('delete-confirm-modal');
}

// Удаление кейса
function deleteCase(caseId) {
    console.log('Deleting case:', caseId);
    const cases = getCases();
    const updatedCases = cases.filter(case_ => case_.id !== caseId);
    localStorage.setItem('cases_data', JSON.stringify(updatedCases));
    loadCasesList();
    console.log('Case deleted successfully');
}

// Показ сообщения об успехе через модальное окно
function showSuccessMessage() {
    console.log('Showing success message');
    showModal('save-modal');
}

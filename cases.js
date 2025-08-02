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
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
        
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// Переключение вкладок
function switchTab(tabName) {
    // Обновляем активную вкладку
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Показываем соответствующий контент
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Если переключаемся на список кейсов, обновляем его
    if (tabName === 'list') {
        loadCasesList();
    }
}

// Инициализация обработчиков формы
function initializeFormHandlers() {
    const form = document.getElementById('cases-form');
    const textareas = document.querySelectorAll('textarea');
    
    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveData();
    });
    
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
    
    if (filledQuestions) {
        filledQuestions.textContent = `${filledCount}/6`;
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${percentage}%`;
    }
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
}

// Сохранение кейса
function saveData() {
    const clientName = document.getElementById('question-1').value.trim();
    
    // Валидация - имя клиента обязательно
    if (!clientName) {
        alert('Пожалуйста, укажите имя клиента');
        return;
    }
    
    const formData = {
        id: currentEditingCaseId || Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        clientName: clientName,
        howFoundOut: document.getElementById('question-2').value,
        goals: document.getElementById('question-3').value,
        problems: document.getElementById('question-4').value,
        results: document.getElementById('question-5').value,
        whatHelped: document.getElementById('question-6').value,
        saved_at: new Date().toISOString()
    };
    
    // Получаем существующие кейсы
    const existingCases = getCases();
    
    if (currentEditingCaseId) {
        // Обновляем существующий кейс
        const index = existingCases.findIndex(case_ => case_.id === currentEditingCaseId);
        if (index !== -1) {
            existingCases[index] = formData;
        }
    } else {
        // Добавляем новый кейс
        existingCases.push(formData);
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('cases_data', JSON.stringify(existingCases));
    
    // Очищаем форму
    clearForm();
    
    // Сбрасываем режим редактирования
    currentEditingCaseId = null;
    
    // Показываем сообщение об успехе
    showSuccessMessage();
    
    // Переключаемся на список кейсов
    setTimeout(() => {
        switchTab('list');
    }, 1500);
    
    console.log('Case saved:', formData);
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

// Получение списка кейсов
function getCases() {
    const savedData = localStorage.getItem('cases_data');
    if (savedData) {
        try {
            return JSON.parse(savedData);
        } catch (error) {
            console.error('Error parsing cases data:', error);
            return [];
        }
    }
    return [];
}

// Загрузка списка кейсов
function loadCasesList() {
    const cases = getCases();
    const casesList = document.getElementById('cases-list');
    const emptyState = document.getElementById('empty-state');
    const casesCount = document.getElementById('cases-count');
    
    // Обновляем счетчик
    casesCount.textContent = `${cases.length} кейс${cases.length === 1 ? '' : cases.length < 5 ? 'а' : 'ов'}`;
    
    if (cases.length === 0) {
        // Показываем пустое состояние
        casesList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    // Скрываем пустое состояние
    emptyState.style.display = 'none';
    
    // Сортируем кейсы по дате (новые сверху)
    cases.sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));
    
    // Создаем HTML для каждого кейса
    const casesHTML = cases.map(case_ => createCaseCard(case_)).join('');
    casesList.innerHTML = casesHTML;
    
    // Добавляем обработчики для кнопок
    addCaseCardHandlers();
}

// Создание карточки кейса
function createCaseCard(case_) {
    const description = case_.howFoundOut ? case_.howFoundOut.substring(0, 100) + (case_.howFoundOut.length > 100 ? '...' : '') : 'Описание не указано';
    
    return `
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
}

// Добавление обработчиков для карточек кейсов
function addCaseCardHandlers() {
    const actionButtons = document.querySelectorAll('.case-action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('data-action');
            const caseId = parseInt(this.getAttribute('data-case-id'));
            const cases = getCases();
            const caseData = cases.find(case_ => case_.id === caseId);
            
            if (!caseData) return;
            
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
        
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const action = this.getAttribute('data-action');
            const caseId = parseInt(this.getAttribute('data-case-id'));
            const cases = getCases();
            const caseData = cases.find(case_ => case_.id === caseId);
            
            if (!caseData) return;
            
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
    // Модальное окно сохранения
    const saveModal = document.getElementById('save-modal');
    const saveOkButton = document.getElementById('modal-ok-button');
    
    if (saveOkButton) {
        saveOkButton.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal('save-modal');
        });
        
        saveOkButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            hideModal('save-modal');
        });
    }
    
    // Модальное окно просмотра кейса
    const viewModal = document.getElementById('view-case-modal');
    const editCaseButton = document.getElementById('edit-case-button');
    const closeViewModal = document.getElementById('close-view-modal');
    
    if (editCaseButton) {
        editCaseButton.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal('view-case-modal');
            const caseData = JSON.parse(this.getAttribute('data-case'));
            loadCaseForEditing(caseData);
        });
        
        editCaseButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            hideModal('view-case-modal');
            const caseData = JSON.parse(this.getAttribute('data-case'));
            loadCaseForEditing(caseData);
        });
    }
    
    if (closeViewModal) {
        closeViewModal.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal('view-case-modal');
        });
        
        closeViewModal.addEventListener('touchstart', function(e) {
            e.preventDefault();
            hideModal('view-case-modal');
        });
    }
    
    // Модальное окно подтверждения удаления
    const deleteModal = document.getElementById('delete-confirm-modal');
    const cancelDelete = document.getElementById('cancel-delete');
    const confirmDelete = document.getElementById('confirm-delete');
    
    if (cancelDelete) {
        cancelDelete.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal('delete-confirm-modal');
        });
        
        cancelDelete.addEventListener('touchstart', function(e) {
            e.preventDefault();
            hideModal('delete-confirm-modal');
        });
    }
    
    if (confirmDelete) {
        confirmDelete.addEventListener('click', function(e) {
            e.preventDefault();
            const caseId = parseInt(this.getAttribute('data-case-id'));
            deleteCase(caseId);
            hideModal('delete-confirm-modal');
        });
        
        confirmDelete.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const caseId = parseInt(this.getAttribute('data-case-id'));
            deleteCase(caseId);
            hideModal('delete-confirm-modal');
        });
    }
}

// Показ модального окна
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
    }
}

// Скрытие модального окна
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
    }
}

// Показ модального окна кейса
function showCaseModal(caseData) {
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
    const confirmButton = document.getElementById('confirm-delete');
    confirmButton.setAttribute('data-case-id', caseId);
    showModal('delete-confirm-modal');
}

// Удаление кейса
function deleteCase(caseId) {
    const cases = getCases();
    const updatedCases = cases.filter(case_ => case_.id !== caseId);
    localStorage.setItem('cases_data', JSON.stringify(updatedCases));
    loadCasesList();
}

// Показ сообщения об успехе через модальное окно
function showSuccessMessage() {
    console.log('Showing success message');
    showModal('save-modal');
} 
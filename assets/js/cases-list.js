// Cases List Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Cases list page initialized');
    
    // Инициализация
    initializePage();
    loadCasesList();
    
    // Обработчики событий
    setupEventHandlers();
});

function initializePage() {
    console.log('📋 Initializing cases list page');
    
    // Проверяем элементы
    const backButton = document.getElementById('back-button');
    const addNewCaseBtn = document.getElementById('add-new-case-btn');
    const casesList = document.getElementById('cases-list');
    const emptyState = document.getElementById('empty-state');
    const casesCount = document.getElementById('cases-count');
    
    console.log('📋 Back button:', backButton);
    console.log('📋 Add new case button:', addNewCaseBtn);
    console.log('📋 Cases list:', casesList);
    console.log('📋 Empty state:', emptyState);
    console.log('📋 Cases count:', casesCount);
}

function setupEventHandlers() {
    // Кнопка "Назад"
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            console.log('⬅️ Back button clicked');
            window.location.href = 'cases.html';
        });
        
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('⬅️ Back button touched');
            window.location.href = 'cases.html';
        });
    }
    
    // Кнопка "Добавить новый кейс"
    const addNewCaseBtn = document.getElementById('add-new-case-btn');
    if (addNewCaseBtn) {
        addNewCaseBtn.addEventListener('click', function() {
            console.log('➕ Add new case button clicked');
            window.location.href = 'cases.html';
        });
        
        addNewCaseBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('➕ Add new case button touched');
            window.location.href = 'cases.html';
        });
    }
    
    // Глобальный обработчик для кнопок карточек
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('case-action-btn')) {
            e.preventDefault();
            e.stopPropagation();
            
            const action = e.target.dataset.action;
            const caseId = parseInt(e.target.dataset.caseId);
            
            console.log('🎴 Case action button clicked:', action, 'for case:', caseId);
            
            if (action === 'view') {
                const cases = getCases();
                const caseData = cases.find(c => c.id === caseId);
                if (caseData) {
                    showCaseModal(caseData);
                }
            } else if (action === 'edit') {
                const cases = getCases();
                const caseData = cases.find(c => c.id === caseId);
                if (caseData) {
                    editCase(caseData);
                }
            } else if (action === 'delete') {
                deleteCase(caseId);
            }
        }
    });
}

function getCases() {
    console.log('📋 Getting cases from localStorage');
    
    try {
        const savedData = localStorage.getItem('cases');
        console.log('📋 Raw data:', savedData);
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (Array.isArray(parsed)) {
                console.log('📋 Parsed cases:', parsed.length);
                return parsed;
            } else {
                console.log('📋 Data is not array, returning empty array');
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

function loadCasesList() {
    console.log('📋 Loading cases list');
    
    const cases = getCases();
    const casesList = document.getElementById('cases-list');
    const emptyState = document.getElementById('empty-state');
    const casesCount = document.getElementById('cases-count');
    
    if (!casesList || !emptyState || !casesCount) {
        console.error('❌ Required elements not found');
        return;
    }
    
    // Обновляем счетчик
    casesCount.textContent = cases.length;
    console.log('📋 Cases count updated:', cases.length);
    
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
    const casesHTML = cases.map((caseItem, index) => createCaseCard(caseItem, index)).join('');
    console.log('📋 Generated HTML length:', casesHTML.length);
    
    casesList.innerHTML = casesHTML;
    console.log('📋 Cases HTML inserted into DOM');
}

function createCaseCard(caseItem, index) {
    console.log('📋 Creating card for case:', caseItem.clientName);
    
    const description = caseItem.howFoundOut || caseItem.goals || caseItem.problems || 'Описание не указано';
    const shortDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;
    
    return `
        <div class="case-card" data-case-id="${caseItem.id}">
            <div class="case-header">
                <div class="case-number">#${index + 1}</div>
                <div class="case-title">
                    <h3>👤 ${caseItem.clientName}</h3>
                    <p class="case-date">📅 ${caseItem.date}</p>
                </div>
            </div>
            
            <div class="case-description">
                <p>${shortDescription}</p>
            </div>
            
            <div class="case-actions">
                <button class="case-action-btn" data-action="view" data-case-id="${caseItem.id}">
                    👁️ Просмотр
                </button>
                <button class="case-action-btn" data-action="edit" data-case-id="${caseItem.id}">
                    ✏️ Правка
                </button>
                <button class="case-action-btn" data-action="delete" data-case-id="${caseItem.id}">
                    🗑️ Удалить
                </button>
            </div>
        </div>
    `;
}

function showCaseModal(caseData) {
    console.log('📋 Showing case modal for:', caseData.clientName);
    
    const message = `📋 Просмотр кейса: ${caseData.clientName}

📅 Дата: ${caseData.date}
🎯 Цели: ${caseData.goals || 'Не указано'}
❗ Проблемы: ${caseData.problems || 'Не указано'}
✅ Результаты: ${caseData.results || 'Не указано'}
💡 Что помогло: ${caseData.whatHelped || 'Не указано'}`;
    
    alert(message);
    console.log('✅ Case modal shown');
}

function editCase(caseData) {
    console.log('📝 Editing case:', caseData.clientName);
    
    // Сохраняем данные кейса в sessionStorage для передачи на страницу редактирования
    sessionStorage.setItem('editingCase', JSON.stringify(caseData));
    
    // Переходим на страницу создания кейса
    window.location.href = 'cases.html';
}

function deleteCase(caseId) {
    console.log('🗑️ Deleting case:', caseId);
    
    if (confirm('Вы уверены, что хотите удалить этот кейс?')) {
        try {
            let cases = JSON.parse(localStorage.getItem('cases') || '[]');
            cases = cases.filter(c => c.id !== caseId);
            localStorage.setItem('cases', JSON.stringify(cases));
            
            console.log('✅ Case deleted successfully');
            alert('Кейс удален!');
            
            // Обновляем список
            loadCasesList();
        } catch (error) {
            console.error('❌ Error deleting case:', error);
            alert('Ошибка при удалении кейса');
        }
    }
} 
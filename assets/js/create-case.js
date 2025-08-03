// Create Case Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Create case page initialized');
    initializePage();
    setupEventHandlers();
    updateProgress();
});

function initializePage() {
    console.log('📝 Initializing create case page');
    
    // Check for editing case data
    const editingCase = sessionStorage.getItem('editingCase');
    if (editingCase) {
        try {
            const caseData = JSON.parse(editingCase);
            console.log('📝 Loading editing case:', caseData);
            loadCaseData(caseData);
            sessionStorage.removeItem('editingCase');
        } catch (e) {
            console.error('❌ Error parsing editing case:', e);
        }
    }
}

function setupEventHandlers() {
    console.log('🎯 Setting up event handlers');
    
    // Back button
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
    
    // Form submission
    const form = document.getElementById('cases-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('💾 Form submitted');
            saveCase();
        });
    }
    
    // Save button
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('💾 Save button clicked');
            saveCase();
        });
        saveButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('💾 Save button touched');
            saveCase();
        });
    }
    
    // Modal OK button
    const modalOkButton = document.getElementById('modal-ok-button');
    if (modalOkButton) {
        modalOkButton.addEventListener('click', function() {
            console.log('📱 Modal OK button clicked');
            hideModal('save-modal');
            setTimeout(() => {
                window.location.href = 'cases-list.html';
                console.log('📱 Redirecting to cases list after save');
            }, 100);
        });
        modalOkButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('📱 Modal OK button touched');
            hideModal('save-modal');
            setTimeout(() => {
                window.location.href = 'cases-list.html';
                console.log('📱 Redirecting to cases list after save');
            }, 100);
        });
    }
    
    // Character counters
    for (let i = 1; i <= 6; i++) {
        const textarea = document.getElementById(`question-${i}`);
        const counter = document.getElementById(`char-count-${i}`);
        
        if (textarea && counter) {
            textarea.addEventListener('input', function() {
                const length = this.value.length;
                counter.textContent = length;
                // Обновлять прогресс только при первом символе или при очистке поля
                if (length === 1 || length === 0) {
                    updateProgress();
                }
            });
            
            // Обновлять прогресс при потере фокуса
            textarea.addEventListener('blur', updateProgress);
        }
    }
}

function loadCaseData(caseData) {
    console.log('📝 Loading case data into form');
    
    const fields = [
        { id: 'question-1', key: 'clientName' },
        { id: 'question-2', key: 'howFoundOut' },
        { id: 'question-3', key: 'goals' },
        { id: 'question-4', key: 'problems' },
        { id: 'question-5', key: 'results' },
        { id: 'question-6', key: 'whatHelped' }
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element && caseData[field.key]) {
            element.value = caseData[field.key];
            // Trigger input event to update counters
            element.dispatchEvent(new Event('input'));
        }
    });
    
    // Store editing case ID
    if (caseData.id) {
        window.editingCaseId = caseData.id;
        console.log('📝 Set editing case ID:', caseData.id);
    }
}

function saveCase() {
    
    
    // Get form data
    const formData = {
        id: window.editingCaseId || Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        clientName: document.getElementById('question-1')?.value?.trim() || '',
        howFoundOut: document.getElementById('question-2')?.value?.trim() || '',
        goals: document.getElementById('question-3')?.value?.trim() || '',
        problems: document.getElementById('question-4')?.value?.trim() || '',
        results: document.getElementById('question-5')?.value?.trim() || '',
        whatHelped: document.getElementById('question-6')?.value?.trim() || '',
        saved_at: new Date().toISOString()
    };
    
    console.log('📋 Form data collected:', formData);
    
    // Validation
    if (!formData.clientName) {
        alert('Пожалуйста, введите имя клиента');
        return;
    }
    
    // Get existing cases
    let existingCases = [];
    const rawData = localStorage.getItem('cases');
    console.log('📋 Existing localStorage data:', rawData);
    
    if (rawData) {
        try {
            existingCases = JSON.parse(rawData);
            if (!Array.isArray(existingCases)) {
                existingCases = [];
            }
        } catch (e) {
            console.error('❌ Parse error:', e);
            existingCases = [];
        }
    }
    
    console.log('📋 Existing cases count:', existingCases.length);
    
    // Update or add case
    if (window.editingCaseId) {
        const caseIndex = existingCases.findIndex(c => c.id === window.editingCaseId);
        if (caseIndex !== -1) {
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
        delete window.editingCaseId;
    } else {
        existingCases.push(formData);
        console.log('➕ New case added:', formData.clientName);
    }
    
    // Save to localStorage
    try {
        const jsonString = JSON.stringify(existingCases);
        localStorage.setItem('cases', jsonString);
        console.log('✅ Data saved to localStorage');
        console.log('📋 Saved data:', jsonString);
        
        // Verify save
        const verification = localStorage.getItem('cases');
        console.log('🔍 Verification read:', verification);
        
        if (verification === jsonString) {
            console.log('✅ Data verification successful');
            
            // Обновляем все счетчики
            if (typeof updateAllSectionCounters === 'function') {
                updateAllSectionCounters();
            }
            
            showModal('save-modal');
        } else {
            console.error('❌ Data verification failed');
            alert('Ошибка при сохранении данных');
        }
        
    } catch (e) {
        console.error('❌ Save error:', e);
        alert('Ошибка при сохранении данных');
    }
}

function updateProgress() {
    let filledCount = 0;
    const totalQuestions = 6;
    
    for (let i = 1; i <= totalQuestions; i++) {
        const textarea = document.getElementById(`question-${i}`);
        if (textarea && textarea.value.trim()) {
            filledCount++;
        }
    }
    
    const percentage = Math.round((filledCount / totalQuestions) * 100);
    
    // Update progress elements
    const filledQuestions = document.getElementById('filled-questions');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressFill = document.getElementById('progress-fill');
    
    if (filledQuestions) filledQuestions.textContent = `${filledCount}/${totalQuestions}`;
    if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
}

function showModal(modalId) {
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.classList.add('show');
        console.log('✅ Modal shown successfully');
    } else {
        console.error('❌ Modal not found:', modalId);
    }
}

function hideModal(modalId) {
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        console.log('✅ Modal hidden successfully');
    } else {
        console.error('❌ Modal not found:', modalId);
    }
} 
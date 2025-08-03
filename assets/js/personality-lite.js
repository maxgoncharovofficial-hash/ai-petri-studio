// Personality Lite Page JavaScript

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Personality Lite page loaded');
    
    // Загружаем сохраненные данные
    loadSavedData();
    
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
    
    // Инициализация модального окна
    initializeModal();
    
    // Обновляем прогресс
    updateProgress();
});

// Инициализация обработчиков формы
function initializeFormHandlers() {
    const form = document.getElementById('personality-lite-form');
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
            // Обновлять прогресс только при первом символе или при очистке поля
            if (this.value.length === 1 || this.value.length === 0) {
                updateProgress();
            }
        });
        
        // Обновлять прогресс при потере фокуса
        textarea.addEventListener('blur', updateProgress);
        
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

// Сохранение данных
function saveData() {
    const formData = {
        interesting_topics: document.getElementById('question-1').value,
        frequent_questions: document.getElementById('question-2').value,
        personal_experience: document.getElementById('question-3').value,
        explain_to_beginner: document.getElementById('question-4').value,
        transformation: document.getElementById('question-5').value,
        communication_style: document.getElementById('question-6').value,
        saved_at: new Date().toISOString()
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('personality_lite_data', JSON.stringify(formData));
    
    // Обновляем все счетчики
    if (typeof updateAllSectionCounters === 'function') {
        updateAllSectionCounters();
    }
    
    // Обновляем глобальный прогресс на главной странице
    if (window.parent && window.parent.updateOverallProgress) {
        window.parent.updateOverallProgress();
    }
    
    // Показываем сообщение об успехе
    showSuccessMessage();
    
    console.log('Data saved:', formData);
}

// Загрузка сохраненных данных
function loadSavedData() {
    const savedData = localStorage.getItem('personality_lite_data');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Заполняем поля сохраненными данными
            if (data.interesting_topics) {
                document.getElementById('question-1').value = data.interesting_topics;
                updateCharCounter(1, data.interesting_topics.length);
            }
            
            if (data.frequent_questions) {
                document.getElementById('question-2').value = data.frequent_questions;
                updateCharCounter(2, data.frequent_questions.length);
            }
            
            if (data.personal_experience) {
                document.getElementById('question-3').value = data.personal_experience;
                updateCharCounter(3, data.personal_experience.length);
            }
            
            if (data.explain_to_beginner) {
                document.getElementById('question-4').value = data.explain_to_beginner;
                updateCharCounter(4, data.explain_to_beginner.length);
            }
            
            if (data.transformation) {
                document.getElementById('question-5').value = data.transformation;
                updateCharCounter(5, data.transformation.length);
            }
            
            if (data.communication_style) {
                document.getElementById('question-6').value = data.communication_style;
                updateCharCounter(6, data.communication_style.length);
            }
            
            console.log('Loaded saved data:', data);
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

// Инициализация модального окна
function initializeModal() {
    const modal = document.getElementById('save-modal');
    const okButton = document.getElementById('modal-ok-button');
    
    console.log('Initializing modal:', modal);
    console.log('OK button:', okButton);
    
    // Гарантированно скрываем модальное окно при инициализации
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        console.log('Modal hidden on initialization');
    }
    
    if (okButton) {
        okButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('OK button clicked');
            hideModal();
        });
        
        okButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('OK button touched');
            hideModal();
        });
    }
}

// Показ модального окна
function showModal() {
    const modal = document.getElementById('save-modal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        console.log('Modal shown');
    }
}

// Скрытие модального окна
function hideModal() {
    const modal = document.getElementById('save-modal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        console.log('Modal hidden');
    }
}

// Показ сообщения об успехе через модальное окно
function showSuccessMessage() {
    console.log('Showing success message');
    showModal();
} 
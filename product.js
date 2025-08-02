// Product Page JavaScript

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product page loaded');
    
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
    const form = document.getElementById('product-form');
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
    
    const percentage = Math.round((filledCount / 4) * 100);
    
    // Обновляем счетчики
    const filledQuestions = document.getElementById('filled-questions');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressFill = document.getElementById('progress-fill');
    
    if (filledQuestions) {
        filledQuestions.textContent = `${filledCount}/4`;
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
        main_product: document.getElementById('question-1').value,
        advantages: document.getElementById('question-2').value,
        values: document.getElementById('question-3').value,
        freebies: document.getElementById('question-4').value,
        saved_at: new Date().toISOString()
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('product_data', JSON.stringify(formData));
    
    // Показываем сообщение об успехе
    showSuccessMessage();
    
    console.log('Data saved:', formData);
}

// Загрузка сохраненных данных
function loadSavedData() {
    const savedData = localStorage.getItem('product_data');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            
            // Заполняем поля сохраненными данными
            if (data.main_product) {
                document.getElementById('question-1').value = data.main_product;
                updateCharCounter(1, data.main_product.length);
            }
            
            if (data.advantages) {
                document.getElementById('question-2').value = data.advantages;
                updateCharCounter(2, data.advantages.length);
            }
            
            if (data.values) {
                document.getElementById('question-3').value = data.values;
                updateCharCounter(3, data.values.length);
            }
            
            if (data.freebies) {
                document.getElementById('question-4').value = data.freebies;
                updateCharCounter(4, data.freebies.length);
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
    
    if (okButton) {
        okButton.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal();
        });
        
        okButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            hideModal();
        });
    }
    
    // Закрытие по клику на overlay
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });
    }
}

// Показ модального окна
function showModal() {
    const modal = document.getElementById('save-modal');
    if (modal) {
        modal.classList.add('show');
        console.log('Modal shown');
    }
}

// Скрытие модального окна
function hideModal() {
    const modal = document.getElementById('save-modal');
    if (modal) {
        modal.classList.remove('show');
        console.log('Modal hidden');
    }
}

// Показ сообщения об успехе через модальное окно
function showSuccessMessage() {
    showModal();
    
    // Автоматическое закрытие через 2.5 секунды
    setTimeout(() => {
        hideModal();
    }, 2500);
} 
// Prompt Settings Page JavaScript
// Страница настройки промпта для OpenAI

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Prompt Settings page loaded');
    
    initializeBackButton();
    initializePromptEditor();
    initializeSuccessModal();
    loadCurrentPrompt();
});

// === КНОПКА НАЗАД ===
function initializeBackButton() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Возвращаемся к странице подключения
            window.location.href = 'threads-connection.html';
        });
    }
}

// === РЕДАКТОР ПРОМПТА ===
function initializePromptEditor() {
    const textarea = document.getElementById('prompt-textarea');
    const charCount = document.getElementById('char-count');
    const saveBtn = document.getElementById('save-prompt');
    const resetBtn = document.getElementById('reset-prompt');
    const previewBox = document.getElementById('preview-box');
    
    // Счетчик символов
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            updatePreview();
        });
    }
    
    // Кнопка сохранения
    if (saveBtn) {
        saveBtn.addEventListener('click', savePrompt);
    }
    
    // Кнопка сброса
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToDefault);
    }
}

// === МОДАЛЬНОЕ ОКНО ===
function initializeSuccessModal() {
    const modal = document.getElementById('success-modal');
    const okBtn = document.getElementById('success-ok-btn');
    
    if (okBtn) {
        okBtn.addEventListener('click', function() {
            hideSuccessModal();
        });
    }
    
    // Закрытие при клике вне модального окна
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideSuccessModal();
            }
        });
    }
}

function showSuccessModal(message) {
    const modal = document.getElementById('success-modal');
    const messageEl = document.getElementById('success-message');
    
    if (modal && messageEl) {
        messageEl.textContent = message;
        modal.style.display = 'flex';
        
        // Анимация появления
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function hideSuccessModal() {
    const modal = document.getElementById('success-modal');
    
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// === РАБОТА С ПРОМПТОМ ===
function loadCurrentPrompt() {
    const textarea = document.getElementById('prompt-textarea');
    if (!textarea) return;
    
    // Загружаем текущий промпт из OpenAI Service
    if (window.openAIService) {
        const currentPrompt = window.openAIService.getCustomPrompt();
        textarea.value = currentPrompt;
        
        // Обновляем счетчик символов
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = currentPrompt.length;
        }
        
        updatePreview();
    }
}

function savePrompt() {
    const textarea = document.getElementById('prompt-textarea');
    const saveBtn = document.getElementById('save-prompt');
    
    if (!textarea) return;
    
    const newPrompt = textarea.value.trim();
    
    if (!newPrompt) {
        alert('Пожалуйста, введите промпт');
        return;
    }
    
    // Показываем процесс сохранения
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '💾 Сохраняем...';
    saveBtn.disabled = true;
    
    try {
        // Сохраняем через OpenAI Service
        if (window.openAIService) {
            window.openAIService.saveCustomPrompt(newPrompt);
            
            // Показываем успех
            showSuccessModal('Промпт успешно сохранен! Теперь OpenAI будет использовать ваши настройки для генерации постов.');
        } else {
            throw new Error('OpenAI Service не доступен');
        }
        
    } catch (error) {
        alert('Ошибка сохранения: ' + error.message);
    }
    
    // Восстанавливаем кнопку
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
}

function resetToDefault() {
    if (confirm('Вернуть промпт к настройкам по умолчанию?')) {
        const textarea = document.getElementById('prompt-textarea');
        
        if (textarea && window.openAIService) {
            // Получаем дефолтный промпт
            const defaultPrompt = `Ты профессиональный копирайтер для социальных сетей. Создай увлекательный пост для Threads.

Требования:
- Длина: 100-280 символов
- Стиль: дружелюбный, но профессиональный
- Добавь эмодзи для привлечения внимания
- Используй хештеги (1-3 штуки)
- Тема: [ТЕМА]

Создай пост:`;
            
            textarea.value = defaultPrompt;
            
            // Обновляем счетчик символов
            const charCount = document.getElementById('char-count');
            if (charCount) {
                charCount.textContent = defaultPrompt.length;
            }
            
            updatePreview();
        }
    }
}

function updatePreview() {
    const textarea = document.getElementById('prompt-textarea');
    const previewBox = document.getElementById('preview-box');
    
    if (!textarea || !previewBox) return;
    
    const prompt = textarea.value;
    
    if (!prompt.trim()) {
        previewBox.innerHTML = '<p style="color: #6c757d;">Введите промпт для предварительного просмотра...</p>';
        return;
    }
    
    // Подставляем пример темы
    const exampleTopic = 'продвижение в социальных сетях';
    const previewPrompt = prompt.replace(/\[ТЕМА\]/g, exampleTopic);
    
    previewBox.innerHTML = `
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #2196f3;">
            <strong>Промпт с подставленной темой:</strong><br><br>
            ${previewPrompt.replace(/\n/g, '<br>')}
        </div>
    `;
}

// === УТИЛИТЫ ===
function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error getting from storage:', error);
        return null;
    }
}

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to storage:', error);
        return false;
    }
}

// === ОТЛАДКА ===
console.log('Prompt Settings JavaScript loaded successfully');
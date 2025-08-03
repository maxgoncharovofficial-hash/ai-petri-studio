// Threads Create Post Page JavaScript
// Создание и планирование постов

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
let selectedCreationMethod = null;
let currentPost = null;

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Threads Create page loaded');
    
    initializeBackButton();
    initializeCreatePost();
    initializeNavigation();
    updateCreatePageStats();
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
    const connectionButton = document.getElementById('go-to-connection');
    const improveButton = document.getElementById('improve-ai');
    
    if (autopilotButton) {
        autopilotButton.addEventListener('click', function() {
            window.location.href = 'threads-autopilot.html';
        });
    }
    
    if (connectionButton) {
        connectionButton.addEventListener('click', function() {
            window.location.href = 'threads-connection.html';
        });
    }
    
    if (improveButton) {
        improveButton.addEventListener('click', function() {
            window.location.href = 'personality.html';
        });
    }
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
        textarea.addEventListener('input', updatePreview);
    }
    
    publishButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.id.replace('publish-', '').replace('save-', '');
            handlePublishAction(action);
        });
    });
    
    // AI генерация
    initializeAIGeneration();
    
    // Шаблоны
    initializeTemplates();
    
    // Инструменты редактора
    initializeEditorTools();
    
    // Статистика
    initializeStatsButtons();
}

function selectCreationMethod(method) {
    console.log('Creation method selected:', method);
    selectedCreationMethod = method;
    
    // Скрываем все опции
    document.getElementById('ai-options').style.display = 'none';
    document.getElementById('template-section').style.display = 'none';
    
    // Показываем нужные опции
    if (method === 'ai') {
        document.getElementById('ai-options').style.display = 'block';
    } else if (method === 'template') {
        document.getElementById('template-section').style.display = 'block';
    } else {
        showEditor();
    }
    
    // Обновляем активную кнопку
    document.querySelectorAll('.method-button').forEach(btn => btn.classList.remove('selected'));
    const buttons = {
        'ai': 'ai-generate',
        'manual': 'write-manual', 
        'template': 'use-template'
    };
    document.getElementById(buttons[method]).classList.add('selected');
}

// === ИИ ГЕНЕРАЦИЯ ===
function initializeAIGeneration() {
    const generateButton = document.getElementById('generate-ai-post');
    
    if (generateButton) {
        generateButton.addEventListener('click', generateAIPost);
    }
}

function generateAIPost() {
    const postType = document.getElementById('post-type').value;
    const tone = document.getElementById('post-tone').value;
    const length = document.getElementById('post-length').value;
    
    console.log('Generating AI post:', { postType, tone, length });
    
    showEditor();
    
    const textarea = document.getElementById('post-content');
    textarea.value = 'Генерация поста...';
    
    setTimeout(() => {
        const aiPosts = generatePostByType(postType, tone, length);
        textarea.value = aiPosts;
        updateCharCounter();
        updatePreview();
    }, 2000);
}

function generatePostByType(type, tone, length) {
    const posts = {
        'advice': [
            'Совет дня: Не бойтесь начинать с малого. Каждый эксперт когда-то был новичком. Главное — делать первый шаг и учиться на ошибках. 💪',
            'Лайфхак для продуктивности: Техника "помидора" изменила мой подход к работе. 25 минут фокуса, 5 минут отдыха. Попробуйте! 🍅'
        ],
        'experience': [
            'Поделюсь историей: Год назад боялся запускать свой проект. Сегодня понимаю — страх был напрасным. Самое сложное — начать. 🚀',
            'Недавно понял важную вещь: клиенты покупают не продукт, а решение своей проблемы. Этот инсайт изменил мой подход к продажам. 💡'
        ],
        'insight': [
            'Размышления: В эпоху информационного шума ценность не в количестве контента, а в его качестве и пользе для аудитории. 🧠',
            'Заметил интересную закономерность: чем проще объясняешь сложные вещи, тем больше доверия вызываешь у аудитории. 🎯'
        ],
        'story': [
            'История успеха: Клиент увеличил продажи на 300% за 3 месяца. Секрет? Мы изменили не продукт, а способ его презентации. 📈',
            'Кейс из практики: Как одно изменение в воронке продаж принесло +50% конверсии. Делюсь деталями в комментариях. 💰'
        ],
        'question': [
            'Вопрос к сообществу: Как вы справляетесь с выгоранием в работе? Поделитесь своими методами в комментариях. 🤔',
            'Интересно ваше мнение: Что важнее для стартапа — идея или команда? Жду ваши мысли! 💭'
        ]
    };
    
    const typesPosts = posts[type] || posts['advice'];
    return typesPosts[Math.floor(Math.random() * typesPosts.length)];
}

// === ШАБЛОНЫ ===
function initializeTemplates() {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            const template = this.getAttribute('data-template');
            loadTemplate(template);
        });
    });
}

function loadTemplate(templateType) {
    const templates = {
        'experience': 'Поделюсь опытом: [ваш опыт]\n\nЧто из этого можно извлечь:\n• [пункт 1]\n• [пункт 2]\n• [пункт 3]\n\nА у вас есть подобный опыт? 🤔',
        'problem-solution': 'Проблема: [описание проблемы]\n\nРешение: [ваше решение]\n\nРезультат: [достигнутый результат]\n\nТакой подход может помочь и вам! 💡',
        'insight': 'Сегодня понял важную вещь: [ваш инсайт]\n\nЭто изменило мой взгляд на [область применения]\n\nА что думаете вы? 🧠',
        'question': 'Вопрос к сообществу: [ваш вопрос]\n\n[контекст или личный опыт]\n\nПоделитесь в комментариях! 💭'
    };
    
    showEditor();
    
    const textarea = document.getElementById('post-content');
    textarea.value = templates[templateType] || templates['experience'];
    updateCharCounter();
    updatePreview();
    
    // Выделяем выбранный шаблон
    document.querySelectorAll('.template-card').forEach(card => card.classList.remove('selected'));
    document.querySelector(`[data-template="${templateType}"]`).classList.add('selected');
}

// === РЕДАКТОР ===
function showEditor() {
    document.getElementById('editor-section').style.display = 'block';
    document.getElementById('publishing-section').style.display = 'block';
    
    // Прокручиваем к редактору
    document.getElementById('editor-section').scrollIntoView({ behavior: 'smooth' });
}

function initializeEditorTools() {
    const emojiButton = document.getElementById('add-emoji');
    const hashtagButton = document.getElementById('add-hashtag');
    const formatButton = document.getElementById('format-text');
    
    if (emojiButton) {
        emojiButton.addEventListener('click', addEmoji);
    }
    
    if (hashtagButton) {
        hashtagButton.addEventListener('click', addHashtag);
    }
    
    if (formatButton) {
        formatButton.addEventListener('click', formatText);
    }
}

function addEmoji() {
    const emojis = ['💡', '🚀', '📈', '💪', '🎯', '✨', '🔥', '👏', '💰', '🧠'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const textarea = document.getElementById('post-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    textarea.value = textarea.value.substring(0, start) + randomEmoji + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + randomEmoji.length, start + randomEmoji.length);
    
    updateCharCounter();
    updatePreview();
}

function addHashtag() {
    const hashtags = ['#бизнес', '#маркетинг', '#продажи', '#стартап', '#успех', '#мотивация'];
    const randomHashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
    
    const textarea = document.getElementById('post-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    textarea.value = textarea.value.substring(0, start) + randomHashtag + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + randomHashtag.length, start + randomHashtag.length);
    
    updateCharCounter();
    updatePreview();
}

function formatText() {
    alert('Форматирование текста (в разработке)');
}

function updateCharCounter() {
    const textarea = document.getElementById('post-content');
    const counter = document.getElementById('char-count');
    const indicator = document.getElementById('char-indicator');
    
    if (textarea && counter) {
        const count = textarea.value.length;
        counter.textContent = count;
        
        // Меняем цвет и индикатор при превышении лимита
        if (count > 450) {
            counter.style.color = '#dc3545';
            indicator.textContent = '❌';
        } else if (count > 400) {
            counter.style.color = '#ffc107';
            indicator.textContent = '⚠️';
        } else {
            counter.style.color = '#6c757d';
            indicator.textContent = '📝';
        }
    }
}

function updatePreview() {
    const textarea = document.getElementById('post-content');
    const preview = document.getElementById('preview-content');
    
    if (textarea && preview) {
        const content = textarea.value || 'Текст поста появится здесь...';
        preview.textContent = content;
    }
}

// === ПУБЛИКАЦИЯ ===
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
        case 'draft':
            saveDraft(content);
            break;
    }
}

function publishNow(content) {
    // Симуляция публикации
    alert('📤 Пост опубликован!');
    
    // Сохраняем в историю опубликованных постов
    const publishedPosts = getFromStorage('threads_published_posts') || [];
    publishedPosts.unshift({
        content: content,
        publishedAt: new Date().toISOString(),
        method: selectedCreationMethod || 'manual'
    });
    saveToStorage('threads_published_posts', publishedPosts);
    
    // Очищаем редактор
    clearEditor();
    updateCreatePageStats();
}

function showSchedulingCalendar(content) {
    const calendar = document.getElementById('scheduling-calendar');
    calendar.style.display = 'block';
    
    // Сохраняем контент для планирования
    saveToStorage('threads_temp_post_content', content);
    
    // Заглушка календаря
    const container = document.getElementById('schedule-calendar-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #6c757d;">
            <div style="font-size: 48px; margin-bottom: 16px;">📅</div>
            <div>Календарь планирования</div>
            <div style="font-size: 14px; margin-top: 8px;">В разработке</div>
            <button onclick="scheduleForTomorrow()" style="margin-top: 16px; padding: 8px 16px; border: 1px solid #4dabf7; background: #4dabf7; color: white; border-radius: 6px; cursor: pointer;">Запланировать на завтра</button>
        </div>
    `;
    
    calendar.scrollIntoView({ behavior: 'smooth' });
}

function scheduleForTomorrow() {
    const content = getFromStorage('threads_temp_post_content');
    if (!content) return;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    // Сохраняем запланированный пост
    const scheduledPosts = getFromStorage('threads_scheduled_posts') || [];
    scheduledPosts.push({
        content: content,
        scheduledFor: tomorrow.toISOString(),
        createdAt: new Date().toISOString(),
        status: 'scheduled'
    });
    
    saveToStorage('threads_scheduled_posts', scheduledPosts);
    removeFromStorage('threads_temp_post_content');
    
    // Скрываем календарь
    document.getElementById('scheduling-calendar').style.display = 'none';
    
    clearEditor();
    updateCreatePageStats();
    
    alert(`📅 Пост запланирован на завтра в 10:00`);
}

function addToQueue(content) {
    const queuePosts = getFromStorage('threads_queue_posts') || [];
    queuePosts.push({
        content: content,
        addedAt: new Date().toISOString(),
        status: 'queued'
    });
    
    saveToStorage('threads_queue_posts', queuePosts);
    
    clearEditor();
    updateCreatePageStats();
    
    alert('💾 Пост добавлен в очередь автопилота');
}

function saveDraft(content) {
    const drafts = getFromStorage('threads_drafts') || [];
    drafts.push({
        content: content,
        createdAt: new Date().toISOString(),
        status: 'draft'
    });
    
    saveToStorage('threads_drafts', drafts);
    
    clearEditor();
    updateCreatePageStats();
    
    alert('📄 Пост сохранен как черновик');
}

function clearEditor() {
    document.getElementById('post-content').value = '';
    updateCharCounter();
    updatePreview();
    
    // Скрываем секции
    document.getElementById('editor-section').style.display = 'none';
    document.getElementById('publishing-section').style.display = 'none';
    document.getElementById('ai-options').style.display = 'none';
    document.getElementById('template-section').style.display = 'none';
    
    // Убираем выделение кнопок
    document.querySelectorAll('.method-button').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.template-card').forEach(card => card.classList.remove('selected'));
    
    selectedCreationMethod = null;
}

// === СТАТИСТИКА ===
function updateCreatePageStats() {
    updateDraftsCount();
    updateScheduledCount();
    updateQueueCount();
    updatePublishedCount();
}

function updateDraftsCount() {
    const drafts = getFromStorage('threads_drafts') || [];
    document.getElementById('drafts-count').textContent = drafts.length;
}

function updateScheduledCount() {
    const scheduled = getFromStorage('threads_scheduled_posts') || [];
    document.getElementById('scheduled-count').textContent = scheduled.length;
}

function updateQueueCount() {
    const queue = getFromStorage('threads_queue_posts') || [];
    document.getElementById('queue-count').textContent = queue.length;
}

function updatePublishedCount() {
    const published = getFromStorage('threads_published_posts') || [];
    document.getElementById('published-count').textContent = published.length;
}

function initializeStatsButtons() {
    const viewButtons = ['view-drafts', 'view-scheduled', 'view-queue', 'view-published'];
    
    viewButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                const type = buttonId.replace('view-', '');
                showContentList(type);
            });
        }
    });
}

function showContentList(type) {
    const typeNames = {
        'drafts': 'Черновики',
        'scheduled': 'Запланированные',
        'queue': 'В очереди',
        'published': 'Опубликованные'
    };
    
    alert(`${typeNames[type]} (в разработке)`);
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

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ===
window.scheduleForTomorrow = scheduleForTomorrow;

// === ОТЛАДКА ===
console.log('Threads Create JavaScript loaded successfully');
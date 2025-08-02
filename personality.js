// Personality Page JavaScript

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Personality page loaded');
    
    // Добавляем обработчик для кнопки назад - точно как для основной кнопки
    const backButton = document.getElementById('back-button');
    console.log('Back button found:', backButton);
    
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Back button clicked');
            window.location.href = 'index.html';
        });
        
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Back button touched');
            window.location.href = 'index.html';
        });
    }
    
    // Инициализация обработчиков событий
    initializeSectionHandlers();
    
    // Анимация появления элементов
    animateElements();
});

// Инициализация обработчиков для секций
function initializeSectionHandlers() {
    console.log('Initializing section handlers');
    
    const sections = document.querySelectorAll('.section-card');
    console.log('Found sections:', sections.length);
    
    sections.forEach(section => {
        console.log('Adding handlers for section:', section.id);
        
        section.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Section clicked:', this.id);
            const sectionId = this.id;
            handleSectionClick(sectionId);
        });
        
        section.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Section touched:', this.id);
            this.style.transform = 'scale(0.98)';
        });
        
        section.addEventListener('touchend', function(e) {
            e.preventDefault();
            console.log('Section touch ended:', this.id);
            this.style.transform = '';
            const sectionId = this.id;
            handleSectionClick(sectionId);
        });
    });
}

// Обработка кликов по секциям
function handleSectionClick(sectionId) {
    console.log('Handling section click:', sectionId);
    
    switch(sectionId) {
        case 'product-section':
            console.log('Calling handleProductSection');
            handleProductSection();
            break;
        case 'audience-section':
            console.log('Calling handleAudienceSection');
            handleAudienceSection();
            break;
        case 'cases-section':
            console.log('Calling handleCasesSection');
            handleCasesSection();
            break;
        case 'personality-lite-section':
            console.log('Calling handlePersonalityLiteSection');
            handlePersonalityLiteSection();
            break;
        case 'personality-pro-section':
            console.log('Calling handlePersonalityProSection');
            handlePersonalityProSection();
            break;
        default:
            console.log('Неизвестная секция:', sectionId);
    }
}

// Обработчики для каждого раздела
function handleProductSection() {
    console.log('Распаковка продукта clicked');
    window.location.href = 'product.html';
}

function handleAudienceSection() {
    console.log('Распаковка аудитории clicked');
    window.location.href = 'audience.html';
}

function handleCasesSection() {
    console.log('Распаковка кейсов clicked');
    window.location.href = 'cases.html';
}

function handlePersonalityLiteSection() {
    console.log('Распаковка личности Lite clicked');
    alert('Раздел "Распаковка личности Lite" в разработке');
}

function handlePersonalityProSection() {
    console.log('Распаковка личности Pro clicked');
    alert('Раздел "Распаковка личности Pro" в разработке');
}

// Функция возврата на главную страницу (запасная)
function goBack() {
    console.log('Back button clicked (fallback)');
    window.location.href = 'index.html';
}

// Анимация появления элементов
function animateElements() {
    const elements = document.querySelectorAll('.progress-section, .section-card, .advice-section');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Функция обновления прогресса
function updateProgress(filledQuestions, totalQuestions) {
    const percentage = Math.round((filledQuestions / totalQuestions) * 100);
    const progressFill = document.querySelector('.progress-fill');
    const statValue = document.querySelector('.stat-value');
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    if (statValue) {
        statValue.textContent = filledQuestions + '/' + totalQuestions;
    }
} 
// Personality Page JavaScript

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Personality page loaded');
    
    // Добавляем обработчик для кнопки назад
    const backButton = document.getElementById('back-button');
    console.log('Back button found:', backButton);
    
    if (backButton) {
        backButton.addEventListener('click', function() {
            console.log('Back button clicked via addEventListener');
            goBack();
        });
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Back button touched');
            goBack();
        });
    }
    
    // Инициализация обработчиков событий
    initializeSectionHandlers();
    
    // Анимация появления элементов
    animateElements();
});

// Инициализация обработчиков для секций
function initializeSectionHandlers() {
    const sections = document.querySelectorAll('.section-card');
    
    sections.forEach(section => {
        section.addEventListener('click', function() {
            const sectionId = this.id;
            handleSectionClick(sectionId);
        });
        
        // Добавляем эффект при нажатии
        section.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        section.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Обработка кликов по секциям
function handleSectionClick(sectionId) {
    switch(sectionId) {
        case 'product-section':
            handleProductSection();
            break;
        case 'audience-section':
            handleAudienceSection();
            break;
        case 'cases-section':
            handleCasesSection();
            break;
        case 'personality-lite-section':
            handlePersonalityLiteSection();
            break;
        case 'personality-pro-section':
            handlePersonalityProSection();
            break;
        default:
            console.log('Неизвестная секция:', sectionId);
    }
}

// Обработчики для каждого раздела
function handleProductSection() {
    console.log('Распаковка продукта clicked');
    alert('Раздел "Распаковка продукта" в разработке');
}

function handleAudienceSection() {
    console.log('Распаковка аудитории clicked');
    alert('Раздел "Распаковка аудитории" в разработке');
}

function handleCasesSection() {
    console.log('Распаковка кейсов clicked');
    alert('Раздел "Распаковка кейсов" в разработке');
}

function handlePersonalityLiteSection() {
    console.log('Распаковка личности Lite clicked');
    alert('Раздел "Распаковка личности Lite" в разработке');
}

function handlePersonalityProSection() {
    console.log('Распаковка личности Pro clicked');
    alert('Раздел "Распаковка личности Pro" в разработке');
}

// Функция возврата на главную страницу
function goBack() {
    console.log('Back button clicked');
    // Простой переход без дополнительной логики
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
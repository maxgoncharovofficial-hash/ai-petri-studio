// Personality Page JavaScript

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Personality page loaded');
    
    // Добавляем обработчик для кнопки назад
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
    
    // Обновляем все счетчики при загрузке
    updateAllSectionCounters();
    
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
    window.location.href = 'personality-lite.html';
}

function handlePersonalityProSection() {
    console.log('Распаковка личности Pro clicked');
    window.location.href = 'personality-pro.html';
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

// Функция подсчета заполненных полей
function countFilledFields(dataObject, fieldNames) {
    if (!dataObject || typeof dataObject !== 'object') {
        return 0;
    }
    
    let filledCount = 0;
    fieldNames.forEach(fieldName => {
        if (dataObject[fieldName] && dataObject[fieldName].trim() !== '') {
            filledCount++;
        }
    });
    
    return filledCount;
}

// Функция обновления конкретного счетчика
function updateSectionCounter(counterId, filled, total) {
    const counterElement = document.getElementById(counterId);
    if (counterElement) {
        counterElement.textContent = `[${filled}/${total}]`;
        console.log(`Updated ${counterId}: [${filled}/${total}]`);
    } else {
        console.error(`Counter element not found: ${counterId}`);
    }
}

// Функция обновления всех счетчиков разделов
function updateAllSectionCounters() {
    console.log('Updating all section counters...');
    
    // Продукт (4 поля)
    try {
        const productData = JSON.parse(localStorage.getItem('product_data') || '{}');
        const productFields = ['main_product', 'advantages', 'values', 'freebies'];
        const productFilled = countFilledFields(productData, productFields);
        updateSectionCounter('product-counter', productFilled, 4);
        console.log('Product counter updated:', productFilled, '/ 4');
    } catch (error) {
        console.error('Error updating product counter:', error);
        updateSectionCounter('product-counter', 0, 4);
    }
    
    // Аудитория (6 полей)
    try {
        const audienceData = JSON.parse(localStorage.getItem('audience_data') || '{}');
        const audienceFields = ['age_location', 'family_status', 'interests', 'main_problems', 'solution_steps', 'your_solutions'];
        const audienceFilled = countFilledFields(audienceData, audienceFields);
        updateSectionCounter('audience-counter', audienceFilled, 6);
        console.log('Audience counter updated:', audienceFilled, '/ 6');
    } catch (error) {
        console.error('Error updating audience counter:', error);
        updateSectionCounter('audience-counter', 0, 6);
    }
    
    // Кейсы (проверяем наличие кейсов)
    try {
        const casesData = JSON.parse(localStorage.getItem('cases_data') || '[]');
        const casesFilled = casesData.length > 0 ? 6 : 0; // Если есть кейсы, считаем 6/6
        updateSectionCounter('cases-counter', casesFilled, 6);
        console.log('Cases counter updated:', casesFilled, '/ 6');
    } catch (error) {
        console.error('Error updating cases counter:', error);
        updateSectionCounter('cases-counter', 0, 6);
    }
    
    // Личность Lite (6 полей)
    try {
        const liteData = JSON.parse(localStorage.getItem('personality_lite_data') || '{}');
        const liteFields = ['interesting_topics', 'frequent_questions', 'personal_experience', 'explain_to_beginner', 'transformation', 'communication_style'];
        const liteFilled = countFilledFields(liteData, liteFields);
        updateSectionCounter('lite-counter', liteFilled, 6);
        console.log('Lite counter updated:', liteFilled, '/ 6');
    } catch (error) {
        console.error('Error updating lite counter:', error);
        updateSectionCounter('lite-counter', 0, 6);
    }
    
    // Личность Pro (5 полей)
    try {
        const proData = JSON.parse(localStorage.getItem('personality_pro_data') || '{}');
        const proFields = ['client_problem', 'unique_approach', 'common_mistakes', 'content_format', 'expert_mission'];
        const proFilled = countFilledFields(proData, proFields);
        updateSectionCounter('pro-counter', proFilled, 5);
        console.log('Pro counter updated:', proFilled, '/ 5');
    } catch (error) {
        console.error('Error updating pro counter:', error);
        updateSectionCounter('pro-counter', 0, 5);
    }
    
    console.log('All section counters updated successfully');
}

// Функция обновления общего прогресса
function updateOverallProgress() {
    console.log('Updating overall progress...');
    
    let totalFilled = 0;
    let totalFields = 0;
    
    // Считаем общий прогресс по всем разделам
    try {
        // Продукт
        const productData = JSON.parse(localStorage.getItem('product_data') || '{}');
        const productFields = ['main_product', 'advantages', 'values', 'freebies'];
        totalFilled += countFilledFields(productData, productFields);
        totalFields += 4;
        
        // Аудитория
        const audienceData = JSON.parse(localStorage.getItem('audience_data') || '{}');
        const audienceFields = ['age_location', 'family_status', 'interests', 'main_problems', 'solution_steps', 'your_solutions'];
        totalFilled += countFilledFields(audienceData, audienceFields);
        totalFields += 6;
        
        // Кейсы
        const casesData = JSON.parse(localStorage.getItem('cases_data') || '[]');
        if (casesData.length > 0) {
            totalFilled += 6; // Если есть кейсы, считаем как заполненные
        }
        totalFields += 6;
        
        // Lite
        const liteData = JSON.parse(localStorage.getItem('personality_lite_data') || '{}');
        const liteFields = ['interesting_topics', 'frequent_questions', 'personal_experience', 'explain_to_beginner', 'transformation', 'communication_style'];
        totalFilled += countFilledFields(liteData, liteFields);
        totalFields += 6;
        
        // Pro
        const proData = JSON.parse(localStorage.getItem('personality_pro_data') || '{}');
        const proFields = ['client_problem', 'unique_approach', 'common_mistakes', 'content_format', 'expert_mission'];
        totalFilled += countFilledFields(proData, proFields);
        totalFields += 5;
        
        // Обновляем общий прогресс
        const percentage = Math.round((totalFilled / totalFields) * 100);
        const progressFill = document.querySelector('.progress-fill');
        const statValue = document.querySelector('.stat-value');
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (statValue) {
            statValue.textContent = totalFilled + '/' + totalFields;
        }
        
        console.log('Overall progress updated:', totalFilled, '/', totalFields, '(', percentage, '%)');
        
    } catch (error) {
        console.error('Error updating overall progress:', error);
    }
}

// Функция обновления прогресса (обновленная)
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

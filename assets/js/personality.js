// Премиум автоматизация публикаций v30.42
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
            window.location.href = '../index.html';
        });
        
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('Back button touched');
            window.location.href = '../index.html';
        });
    }
    
    // Инициализация обработчиков событий
    initializeSectionHandlers();
    

    
    // Обновляем все счетчики при загрузке
    updateAllSectionCounters();
    
    // Пересчитать прогресс с существующими данными
    const progress = recalculateExistingProgress();
    
    updateOverallProgress();
    
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
    window.location.href = '../index.html';
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
        console.log('🔍 countFilledFields: dataObject is empty or invalid');
        return 0;
    }
    
    console.log('🔍 countFilledFields: dataObject =', dataObject);
    console.log('🔍 countFilledFields: fieldNames =', fieldNames);
    
    let filledCount = 0;
    fieldNames.forEach(fieldName => {
        // Пропускаем системные поля
        if (fieldName === 'saved_at' || fieldName === 'timestamp') {
            console.log(`🔍 Field "${fieldName}": SKIPPED (system field)`);
            return;
        }
        
        const value = dataObject[fieldName];
        const isFilled = value && value.trim() !== '';
        console.log(`🔍 Field "${fieldName}": "${value}" -> ${isFilled ? 'FILLED' : 'EMPTY'}`);
        if (isFilled) {
            filledCount++;
        }
    });
    
    console.log(`🔍 countFilledFields result: ${filledCount} из ${fieldNames.length}`);
    return filledCount;
}

// Функция обновления конкретного счетчика
function updateSectionCounter(counterId, filled, total) {
    console.log(`🔧 updateSectionCounter called: ${counterId} = [${filled}/${total}]`);
    const counterElement = document.getElementById(counterId);
    if (counterElement) {
        counterElement.textContent = `[${filled}/${total}]`;
        console.log(`✅ Updated ${counterId}: [${filled}/${total}]`);
        
        // Дополнительная проверка для проблемных счетчиков
        if (counterId === 'product-counter' || counterId === 'audience-counter') {
            console.log(`🔍 СПЕЦИАЛЬНАЯ ПРОВЕРКА ${counterId}:`);
            console.log(`🔍 Element found:`, counterElement);
            console.log(`🔍 Element textContent:`, counterElement.textContent);
            console.log(`🔍 Element innerHTML:`, counterElement.innerHTML);
        }
    } else {
        console.error(`❌ Counter element not found: ${counterId}`);
        console.log(`🔍 All elements with class section-counter:`, document.querySelectorAll('.section-counter'));
    }
}

// Функция обновления счетчика кейсов (показывает количество кейсов)
function updateCasesCounter(counterId, casesCount) {
    const counterElement = document.getElementById(counterId);
    if (counterElement) {
        counterElement.textContent = casesCount.toString();
        console.log(`Updated ${counterId}: ${casesCount} cases`);
    } else {
        console.error(`Counter element not found: ${counterId}`);
    }
}

// Функция обновления всех счетчиков разделов
function updateAllSectionCounters() {
    console.log('🔄 === ОБНОВЛЕНИЕ ВСЕХ СЧЕТЧИКОВ ===');
    
    let totalFilled = 0;
    const progressResults = {};
    
    // Продукт (4 поля)
    try {
        console.log('📦 === ДЕТАЛЬНАЯ ПРОВЕРКА ПРОДУКТА ===');
        const productData = JSON.parse(localStorage.getItem('product_data') || '{}');
        console.log('📦 Raw product data:', productData);
        const productFields = ['main_product', 'advantages', 'values', 'freebies'];
        console.log('📦 Checking fields:', productFields);
        const productFilled = countFilledFields(productData, productFields);
        console.log('📦 Filled count:', productFilled);
        updateSectionCounter('product-counter', productFilled, 4);
        console.log('📦 Called updateSectionCounter(product-counter,', productFilled, ', 4)');
        progressResults.product = `${productFilled}/4`;
        totalFilled += productFilled;
        console.log('✅ Продукт итог:', productFilled, '/ 4');
    } catch (error) {
        console.error('❌ Ошибка обновления счетчика продукта:', error);
        updateSectionCounter('product-counter', 0, 4);
        progressResults.product = '0/4';
    }
    
    // Аудитория (6 полей)
    try {
        console.log('👥 === ДЕТАЛЬНАЯ ПРОВЕРКА АУДИТОРИИ ===');
        const audienceData = JSON.parse(localStorage.getItem('audience_data') || '{}');
        console.log('👥 Raw audience data:', audienceData);
        const audienceFields = ['age_location', 'family_status', 'interests', 'main_problems', 'solution_steps', 'your_solutions'];
        console.log('👥 Checking fields:', audienceFields);
        const audienceFilled = countFilledFields(audienceData, audienceFields);
        console.log('👥 Filled count:', audienceFilled);
        updateSectionCounter('audience-counter', audienceFilled, 6);
        console.log('👥 Called updateSectionCounter(audience-counter,', audienceFilled, ', 6)');
        progressResults.audience = `${audienceFilled}/6`;
        totalFilled += audienceFilled;
        console.log('✅ Аудитория итог:', audienceFilled, '/ 6');
    } catch (error) {
        console.error('❌ Ошибка обновления счетчика аудитории:', error);
        updateSectionCounter('audience-counter', 0, 6);
        progressResults.audience = '0/6';
    }
    
    // Личность Lite (6 полей)
    try {
        console.log('🎭 Проверяем личность Lite...');
        const liteData = JSON.parse(localStorage.getItem('personality_lite_data') || '{}');
        const liteFields = ['interesting_topics', 'frequent_questions', 'personal_experience', 'explain_to_beginner', 'transformation', 'communication_style'];
        const liteFilled = countFilledFields(liteData, liteFields);
        updateSectionCounter('lite-counter', liteFilled, 6);
        progressResults.personalityLite = `${liteFilled}/6`;
        totalFilled += liteFilled;
        console.log('✅ Личность Lite:', liteFilled, '/ 6');
    } catch (error) {
        console.error('❌ Ошибка обновления счетчика личности Lite:', error);
        updateSectionCounter('lite-counter', 0, 6);
        progressResults.personalityLite = '0/6';
    }
    
    // Личность Pro (5 полей)
    try {
        console.log('👨‍💼 Проверяем личность Pro...');
        const proData = JSON.parse(localStorage.getItem('personality_pro_data') || '{}');
        const proFields = ['client_problem', 'unique_approach', 'common_mistakes', 'content_format', 'expert_mission'];
        const proFilled = countFilledFields(proData, proFields);
        updateSectionCounter('pro-counter', proFilled, 5);
        progressResults.personalityPro = `${proFilled}/5`;
        totalFilled += proFilled;
        console.log('✅ Личность Pro:', proFilled, '/ 5');
    } catch (error) {
        console.error('❌ Ошибка обновления счетчика личности Pro:', error);
        updateSectionCounter('pro-counter', 0, 5);
        progressResults.personalityPro = '0/5';
    }
    
    // Кейсы (динамическое количество)
    try {
        console.log('📋 Проверяем кейсы...');
        const casesData = JSON.parse(localStorage.getItem('cases') || '[]');
        const casesCount = Array.isArray(casesData) ? casesData.length : 0;
        updateCasesCounter('cases-counter', casesCount);
        progressResults.cases = `${casesCount} кейсов`;
        console.log('✅ Кейсы:', casesCount, 'шт.');
    } catch (error) {
        console.error('❌ Ошибка обновления счетчика кейсов:', error);
        updateCasesCounter('cases-counter', 0);
        progressResults.cases = '0 кейсов';
    }
    
    // Общий прогресс (21 поле максимум)
    const totalMaxFields = 21; // 4 + 6 + 6 + 5 = 21
    const percentage = Math.round((totalFilled / totalMaxFields) * 100);
    
    // Обновляем глобальные счетчики
    updateGlobalProgress(totalFilled, totalMaxFields, percentage);
    
    console.log('📊 === ИТОГОВАЯ СТАТИСТИКА ===');
    console.log('📦 Продукт:', progressResults.product);
    console.log('👥 Аудитория:', progressResults.audience);
    console.log('🎭 Личность Lite:', progressResults.personalityLite);
    console.log('👨‍💼 Личность Pro:', progressResults.personalityPro);
    console.log('📋 Кейсы:', progressResults.cases);
    console.log('🧮 === ПОДРОБНЫЙ ПОДСЧЕТ ===');
    console.log('🧮 totalFilled =', totalFilled);
    console.log('🧮 totalMaxFields =', totalMaxFields);
    console.log('🧮 percentage =', percentage);
    console.log('🧮 Математика: ', totalFilled, '/', totalMaxFields, '=', Math.round((totalFilled / totalMaxFields) * 100), '%');
    console.log('🎯 ИТОГО:', totalFilled, '/', totalMaxFields, '(', percentage, '%)');
    console.log('✅ Все счетчики обновлены успешно');
}

// Функция обновления глобального прогресса
function updateGlobalProgress(filled, total, percentage) {
    console.log('🎯 Обновляем глобальный прогресс:', filled, '/', total, '(', percentage, '%)');
    
    // Обновляем текст счетчика
    const parametersElement = document.querySelector('[data-parameters-count]');
    if (parametersElement) {
        parametersElement.textContent = `${filled}/21 параметров`;
        console.log('✅ Обновлен счетчик параметров:', `${filled}/21 параметров`);
    }
    
    // Обновляем процент готовности
    const percentageElement = document.querySelector('[data-readiness-percent]');
    if (percentageElement) {
        percentageElement.textContent = `${percentage}%`;
        console.log('✅ Обновлен процент готовности:', `${percentage}%`);
    }
    
    // Обновляем прогресс-бар
    const progressBar = document.querySelector('[data-progress-bar]');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        console.log('✅ Обновлен прогресс-бар:', `${percentage}%`);
    }
}

// Служебная функция полной очистки данных
function clearAllData() {
    // Список всех возможных ключей для удаления
    const keysToRemove = [
        // Данные разделов
        'product-data', 'productData', 'product',
        'audience-data', 'audienceData', 'audience',
        'personality-lite-data', 'personalityLiteData', 'personality-lite',
        'personality-pro-data', 'personalityProData', 'personality-pro',
        
        // Данные кейсов
        'cases', 'cases-data', 'casesData',
        
        // Любые другие данные
        'progress', 'progressData', 'saved-progress'
    ];
    
    // Удалить все ключи
    keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
        }
    });
    
    // Дополнительно - удалить все ключи содержащие определенные слова
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (
            key.includes('product') || 
            key.includes('audience') || 
            key.includes('personality') || 
            key.includes('cases') ||
            key.includes('progress')
        )) {
            localStorage.removeItem(key);
        }
    }
}

// Служебная функция сброса прогресса во всех разделах
function resetAllProgress() {
    // Сбросить глобальный прогресс
    const globalProgress = {
        answered: 0,
        total: 21,
        percentage: 0
    };
    
    updateGlobalProgressDisplay(globalProgress);
    
    // Сбросить счетчики в карточках разделов
    updateSectionProgress('product', 0, 4);
    updateSectionProgress('audience', 0, 6);
    updateSectionProgress('personality-lite', 0, 6);
    updateSectionProgress('personality-pro', 0, 5);
    
    // Сбросить счетчик кейсов
    updateCasesCount(0);
}

// Функция обновления отображения глобального прогресса
function updateGlobalProgressDisplay(progress) {
    // Обновить верхний блок
    const parametersElement = document.querySelector('[data-parameters-count]');
    if (parametersElement) {
        parametersElement.textContent = `${progress.answered}/21 параметров`;
    }
    
    const percentageElement = document.querySelector('[data-readiness-percent]');
    if (percentageElement) {
        percentageElement.textContent = `${progress.percentage}%`;
    }
    
    const progressBar = document.querySelector('[data-progress-bar]');
    if (progressBar) {
        progressBar.style.width = `${progress.percentage}%`;
    }
}

// Функция обновления прогресса раздела
function updateSectionProgress(section, answered, total) {
    const sectionElement = document.querySelector(`[data-section="${section}"] [data-section-progress]`);
    if (sectionElement) {
        sectionElement.textContent = `[${answered}/${total}]`;
    }
}

// Функция обновления счетчика кейсов
function updateCasesCount(count) {
    const casesElement = document.querySelector('[data-cases-count]');
    if (casesElement) {
        casesElement.textContent = count;
    }
}

// Служебная функция очистки форм на всех страницах
function clearAllForms() {
    // Очистить все textarea на текущей странице
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.value = '';
    });
    
    // Очистить все input поля
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
    inputs.forEach(input => {
        input.value = '';
    });
}



// Функция подсчета заполненных полей в объекте
function countNonEmptyFields(data) {
    let count = 0;
    
    if (typeof data === 'object' && data !== null) {
        for (let key in data) {
            const value = data[key];
            
            // Проверить что поле действительно заполнено
            if (value !== null && 
                value !== undefined && 
                typeof value === 'string' && 
                value.trim().length > 0) {
                
                console.log('✅ Заполненное поле:', key, '=', value.substring(0, 50) + '...');
                count++;
            } else {
                console.log('❌ Пустое поле:', key, '=', value);
            }
        }
    }
    
    return count;
}

// Функция подсчета заполненных полей на текущей странице
function countFilledFieldsOnPage(sectionName) {
    const textareas = document.querySelectorAll('textarea');
    let filledCount = 0;
    
    textareas.forEach(textarea => {
        if (textarea.value && textarea.value.trim().length > 0) {
            filledCount++;
        }
    });
    
    return filledCount;
}

// Функция подсчета заполненных вопросов для раздела с проверкой разных ключей
function getFilledQuestionsCount(section, maxQuestions) {

    
    // Получить данные из localStorage
    const possibleKeys = [
        section + '-data',
        section + '_data', 
        section + 'Data',
        section
    ];
    
    let filledCount = 0;
    let foundData = null;
    let foundKey = null;
    
    for (let key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                foundData = JSON.parse(data);
                foundKey = key;
                console.log('✅ Найдены данные в ключе:', key);
                console.log('📄 Данные:', foundData);
                break;
            } catch (e) {
                console.log('❌ Ошибка парсинга ключа:', key);
            }
        }
    }
    
    if (foundData) {
        // ТОЧНО подсчитать заполненные поля
        filledCount = countNonEmptyFields(foundData);
        console.log('📝 Заполненных полей найдено:', filledCount);
    } else {
        console.log('❌ Данные не найдены для раздела:', section);
    }
    
    // НЕ превышать максимум для раздела
    const result = Math.min(filledCount, maxQuestions);
    console.log('📊 Результат для ' + section + ':', result + '/' + maxQuestions);
    
    return result;
}

// Функция пересчета существующих данных
function recalculateExistingProgress() {

    
    let totalAnswered = 0;
    
    // Проверить каждый раздел и подсчитать заполненные поля
    
    // 1. Распаковка продукта (4 вопроса)
    const productAnswered = getFilledQuestionsCount('product', 4);
    console.log('📦 Продукт:', productAnswered + '/4');
    
    // 2. Распаковка аудитории (6 вопросов)  
    const audienceAnswered = getFilledQuestionsCount('audience', 6);
    console.log('👥 Аудитория:', audienceAnswered + '/6');
    
    // 3. Распаковка личности Lite (6 вопросов)
    const personalityLiteAnswered = getFilledQuestionsCount('personality_lite', 6);
    console.log('🧠 Личность Lite:', personalityLiteAnswered + '/6');
    
    // 4. Распаковка личности Pro (5 вопросов)  
    const personalityProAnswered = getFilledQuestionsCount('personality_pro', 5);
    console.log('⭐ Личность Pro:', personalityProAnswered + '/5');
    
    totalAnswered = productAnswered + audienceAnswered + personalityLiteAnswered + personalityProAnswered;
    
    console.log('📊 Итого заполнено:', totalAnswered + '/21');
    console.log('🎯 Ожидаемый результат: 16/21 (76%)');
    console.log('💡 Показано на карточках: 3+4+5+4=16');
    
    return {
        answered: totalAnswered,
        total: 21,
        percentage: Math.round((totalAnswered / 21) * 100)
    };
}

// Функция расчета глобального прогресса (БЕЗ кейсов)
function calculateGlobalProgress() {
    return recalculateExistingProgress();
}

// Функция обновления общего прогресса
function updateOverallProgress() {
    console.log('Updating overall progress...');
    
    const progress = calculateGlobalProgress();
    
    // Обновляем общий прогресс
    const progressFill = document.getElementById('overall-progress-fill');
    const statValue = document.getElementById('overall-progress');
    const totalParams = document.getElementById('total-params');
    
    if (progressFill) {
        progressFill.style.width = progress.percentage + '%';
    }
    
    if (statValue) {
        statValue.textContent = progress.percentage + '%';
    }
    
    if (totalParams) {
        totalParams.textContent = `${progress.answered}/${progress.total} параметров`;
    }
    
    console.log('Overall progress updated:', progress.answered, '/', progress.total, '(', progress.percentage, '%)');
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

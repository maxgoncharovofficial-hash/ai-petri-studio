// Проверяем, запущено ли приложение в Telegram Mini App
function isTelegramMiniApp() {
    return window.Telegram && window.Telegram.WebApp;
}

// Обработчики для каждой карточки
function handlePersonality() {
    console.log('РАСПАКОВКА ЛИЧНОСТИ clicked');
    
    if (isTelegramMiniApp()) {
        // В мини-аппе - просто показываем уведомление
        alert('Открываю раздел РАСПАКОВКА ЛИЧНОСТИ...');
    } else {
        // В обычном браузере - переход на страницу
        window.location.href = 'personality.html';
    }
}

function handleThreadsZavod() {
    console.log('THREADS ZAVOD clicked');
    alert('Раздел THREADS ZAVOD в разработке');
}

function handleContentCreation() {
    console.log('СОЗДАНИЕ КОНТЕНТА clicked');
    alert('Раздел СОЗДАНИЕ КОНТЕНТА в разработке');
}

function handleMonitoring() {
    console.log('МОНИТОРИНГ clicked');
    alert('Раздел МОНИТОРИНГ в разработке');
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Приложение инициализировано');
    console.log('Telegram Mini App доступен:', isTelegramMiniApp());
    
    // Добавляем анимацию для карточек
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

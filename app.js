// Обработчики для каждой карточки
function handlePersonality() {
    console.log('РАСПАКОВКА ЛИЧНОСТИ clicked');
    // Временно закомментировал все, чтобы найти проблему
}

function handleThreadsZavod() {
    console.log('THREADS ZAVOD clicked');
}

function handleContentCreation() {
    console.log('СОЗДАНИЕ КОНТЕНТА clicked');
}

function handleMonitoring() {
    console.log('МОНИТОРИНГ clicked');
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('Приложение инициализировано');
    
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

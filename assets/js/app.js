// Обработчики для каждой карточки
function handlePersonality() {
    console.log('РАСПАКОВКА ЛИЧНОСТИ clicked');
    window.location.href = 'pages/personality.html';
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
    
    // Добавляем обработчики кликов для карточек
    const personalityCard = document.getElementById('personality-card');
    if (personalityCard) {
        personalityCard.addEventListener('click', handlePersonality);
        personalityCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handlePersonality();
        });
    }
    
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

// Cases Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Cases page initialized');
    initializePage();
    setupEventHandlers();
    updateCasesCount();
});

function initializePage() {
    console.log('📋 Initializing cases page');
    updateCasesCount();
}

function setupEventHandlers() {
    console.log('🎯 Setting up event handlers');
    
    // Back button
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('⬅️ Back button clicked');
            window.location.href = '../index.html';
        });
        backButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('⬅️ Back button touched');
            window.location.href = '../index.html';
        });
    }
    
    // Create case card
    const createCaseCard = document.getElementById('create-case-card');
    if (createCaseCard) {
        createCaseCard.addEventListener('click', function() {
            console.log('➕ Create case card clicked');
            window.location.href = 'create-case.html';
        });
        createCaseCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('➕ Create case card touched');
            window.location.href = 'create-case.html';
        });
    }
    
    // Start create button
    const startCreateBtn = document.getElementById('start-create-btn');
    if (startCreateBtn) {
        startCreateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('➕ Start create button clicked');
            window.location.href = 'create-case.html';
        });
        startCreateBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('➕ Start create button touched');
            window.location.href = 'create-case.html';
        });
    }
    
    // View cases card
    const viewCasesCard = document.getElementById('view-cases-card');
    if (viewCasesCard) {
        viewCasesCard.addEventListener('click', function() {
            console.log('📋 View cases card clicked');
            window.location.href = 'cases-list.html';
        });
        viewCasesCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log('📋 View cases card touched');
            window.location.href = 'cases-list.html';
        });
    }
    
    // View cases button
    const viewCasesBtn = document.getElementById('view-cases-btn');
    if (viewCasesBtn) {
        viewCasesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📋 View cases button clicked');
            window.location.href = 'cases-list.html';
        });
        viewCasesBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📋 View cases button touched');
            window.location.href = 'cases-list.html';
        });
    }
}

function updateCasesCount() {
    console.log('📊 Updating cases count');
    
    const cases = getCases();
    const countDisplay = document.getElementById('cases-count-display');
    
    if (countDisplay) {
        countDisplay.textContent = `Сохранено: ${cases.length} кейсов`;
        console.log(`📊 Cases count updated: ${cases.length}`);
    }
}

function getCases() {
    console.log('📋 === Getting cases from localStorage ===');
    
    const rawData = localStorage.getItem('cases');
    console.log('📋 Raw data:', rawData);
    
    if (!rawData) {
        console.log('📋 No data found, returning empty array');
        return [];
    }
    
    try {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed)) {
            console.log('📋 Parsed cases:', parsed.length);
            return parsed;
        } else {
            console.log('📋 Data is not array, returning empty array');
            return [];
        }
    } catch (e) {
        console.error('❌ Parse error:', e);
        return [];
    }
}

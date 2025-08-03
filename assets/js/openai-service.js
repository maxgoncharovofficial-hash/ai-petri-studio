// OpenAI Integration Service
// Сервис для работы с OpenAI API

class OpenAIService {
    constructor() {
        this.apiKey = localStorage.getItem('openai_api_key') || null;
        this.baseURL = 'https://api.openai.com/v1';
        this.isConnected = !!this.apiKey; // true если есть ключ
        this.defaultPrompt = `Ты профессиональный копирайтер для социальных сетей. Создай увлекательный пост для Threads.
        
Требования:
- Длина: 100-280 символов
- Стиль: дружелюбный, но профессиональный
- Добавь эмодзи для привлечения внимания
- Используй хештеги (1-3 штуки)
- Тема: [ТЕМА БУДЕТ ЗАМЕНЕНА НА ОСНОВЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ]

Создай пост:`;
    }
    
    // Инициализация с API ключом
    async initialize(apiKey) {
        if (!apiKey || !apiKey.startsWith('sk-')) {
            throw new Error('Некорректный API ключ OpenAI');
        }
        
        this.apiKey = apiKey;
        
        try {
            // Проверяем ключ запросом к API
            const response = await this.testConnection();
            if (response.success) {
                this.isConnected = true;
                localStorage.setItem('openai_api_key', apiKey);
                return { success: true, message: 'OpenAI подключен успешно!' };
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            this.isConnected = false;
            throw error;
        }
    }
    
    // Тестирование подключения
    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/models`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                return { success: true };
            } else {
                const error = await response.json();
                return { 
                    success: false, 
                    error: error.error?.message || 'Ошибка подключения к OpenAI' 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                error: 'Не удалось подключиться к OpenAI API' 
            };
        }
    }
    
    // Проверка подключения
    isServiceConnected() {
        return this.isConnected && !!this.apiKey;
    }
    
    // Генерация поста
    async generatePost(prompt = null, context = {}) {
        if (!this.isConnected || !this.apiKey) {
            throw new Error('OpenAI не подключен. Добавьте API ключ.');
        }
        
        const finalPrompt = this.buildPrompt(prompt, context);
        
        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini', // Используем более доступную модель
                    messages: [
                        {
                            role: 'user',
                            content: finalPrompt
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Ошибка генерации поста');
            }
            
            const data = await response.json();
            const generatedText = data.choices[0]?.message?.content?.trim();
            
            if (!generatedText) {
                throw new Error('Не удалось сгенерировать пост');
            }
            
            return {
                success: true,
                text: generatedText,
                usage: data.usage
            };
            
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }
    
    // Построение промпта на основе данных пользователя
    buildPrompt(customPrompt, context) {
        if (customPrompt) {
            return customPrompt;
        }
        
        // Используем сохраненный кастомный промпт или дефолтный
        let prompt = this.getCustomPrompt();
        
        // Заменяем тему на основе данных пользователя
        let topic = 'общие советы по развитию';
        
        if (context.product && context.product.name) {
            topic = `продукт "${context.product.name}"`;
        } else if (context.audience && context.audience.description) {
            topic = `аудитория: ${context.audience.description}`;
        } else if (context.personality && context.personality.expertise) {
            topic = `экспертиза в ${context.personality.expertise}`;
        }
        
        prompt = prompt.replace('[ТЕМА БУДЕТ ЗАМЕНЕНА НА ОСНОВЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ]', topic);
        
        return prompt;
    }
    
    // Сохранение/загрузка кастомного промпта
    saveCustomPrompt(prompt) {
        localStorage.setItem('openai_custom_prompt', prompt);
    }
    
    getCustomPrompt() {
        return localStorage.getItem('openai_custom_prompt') || this.defaultPrompt;
    }
    
    // Проверка состояния подключения
    isServiceConnected() {
        return this.isConnected && this.apiKey;
    }
    
    // Отключение
    disconnect() {
        this.apiKey = null;
        this.isConnected = false;
        localStorage.removeItem('openai_api_key');
        localStorage.removeItem('openai_custom_prompt');
    }
    
    // Восстановление подключения из localStorage
    async restoreConnection() {
        const savedKey = localStorage.getItem('openai_api_key');
        if (savedKey) {
            try {
                await this.initialize(savedKey);
                return true;
            } catch (error) {
                console.warn('Failed to restore OpenAI connection:', error);
                return false;
            }
        }
        return false;
    }
}

// Глобальный экземпляр сервиса
window.openAIService = new OpenAIService();

// Автовосстановление подключения при загрузке
document.addEventListener('DOMContentLoaded', function() {
    window.openAIService.restoreConnection();
});

console.log('OpenAI Service loaded successfully');
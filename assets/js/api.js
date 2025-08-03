// API Client for AiPetri Studio Backend

class ApiClient {
  constructor() {
    this.baseUrl = process.env.API_URL || 'https://ai-petri-studio-api.onrender.com';
    this.telegramId = null;
    this.init();
  }

  // Инициализация API клиента
  init() {
    // Получаем telegram_id из Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      this.telegramId = tg.initDataUnsafe?.user?.id || tg.initDataUnsafe?.user?.id;
      
      if (!this.telegramId) {
        console.warn('Telegram ID not found, using fallback');
        // Fallback для разработки
        this.telegramId = localStorage.getItem('telegram_id') || '123456789';
      }
    } else {
      // Fallback для веб-версии
      this.telegramId = localStorage.getItem('telegram_id') || '123456789';
    }
  }

  // Утилиты для работы с API
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Получить все данные пользователя
  async getUserData() {
    try {
      const data = await this.request(`/api/user/${this.telegramId}/data`);
      return data;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  // Сохранить данные продукта
  async saveProductData(productData) {
    try {
      const response = await this.request(`/api/user/${this.telegramId}/product`, {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      return response;
    } catch (error) {
      console.error('Failed to save product data:', error);
      throw error;
    }
  }

  // Сохранить данные аудитории
  async saveAudienceData(audienceData) {
    try {
      const response = await this.request(`/api/user/${this.telegramId}/audience`, {
        method: 'POST',
        body: JSON.stringify(audienceData)
      });
      return response;
    } catch (error) {
      console.error('Failed to save audience data:', error);
      throw error;
    }
  }

  // Сохранить кейсы
  async saveCasesData(casesData) {
    try {
      const response = await this.request(`/api/user/${this.telegramId}/cases`, {
        method: 'POST',
        body: JSON.stringify({ cases: casesData })
      });
      return response;
    } catch (error) {
      console.error('Failed to save cases data:', error);
      throw error;
    }
  }

  // Сохранить данные личности Lite
  async savePersonalityLiteData(personalityData) {
    try {
      const response = await this.request(`/api/user/${this.telegramId}/personality-lite`, {
        method: 'POST',
        body: JSON.stringify(personalityData)
      });
      return response;
    } catch (error) {
      console.error('Failed to save personality lite data:', error);
      throw error;
    }
  }

  // Сохранить данные личности Pro
  async savePersonalityProData(personalityData) {
    try {
      const response = await this.request(`/api/user/${this.telegramId}/personality-pro`, {
        method: 'POST',
        body: JSON.stringify(personalityData)
      });
      return response;
    } catch (error) {
      console.error('Failed to save personality pro data:', error);
      throw error;
    }
  }

  // Получить агрегированные данные для OpenAI
  async getUserSummary() {
    try {
      const data = await this.request(`/api/user/${this.telegramId}/summary`);
      return data;
    } catch (error) {
      console.error('Failed to get user summary:', error);
      return null;
    }
  }

  // Проверить здоровье API
  async healthCheck() {
    try {
      const response = await this.request('/api/health');
      return response;
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  }

  // Fallback к localStorage при ошибках сети
  fallbackToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`Data saved to localStorage as fallback: ${key}`);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Загрузить из localStorage как fallback
  loadFromLocalStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }
}

// Создаем глобальный экземпляр API клиента
window.apiClient = new ApiClient();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiClient;
} 
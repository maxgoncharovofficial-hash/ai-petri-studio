// OpenAI Data Aggregator for AiPetri Studio

class OpenAIAggregator {
  constructor() {
    this.apiClient = window.apiClient;
  }

  // Агрегировать все данные пользователя в промпт для OpenAI
  async generatePersonalityPrompt() {
    try {
      const userData = await this.apiClient.getUserSummary();
      
      if (!userData) {
        throw new Error('Failed to get user data');
      }

      return this.buildPrompt(userData);
    } catch (error) {
      console.error('Failed to generate personality prompt:', error);
      return null;
    }
  }

  // Построить промпт на основе данных пользователя
  buildPrompt(userData) {
    const { user, product, audience, cases, personalityLite, personalityPro } = userData;
    
    let prompt = `# Распаковка личности для ${user.name}\n\n`;

    // Информация о продукте
    if (product && this.hasData(product)) {
      prompt += `## Информация о продукте\n`;
      if (product.name) prompt += `**Название продукта:** ${product.name}\n`;
      if (product.targetAudience) prompt += `**Целевая аудитория:** ${product.targetAudience}\n`;
      if (product.uniqueValue) prompt += `**Уникальная ценность:** ${product.uniqueValue}\n`;
      if (product.mainBenefits) prompt += `**Основные преимущества:** ${product.mainBenefits}\n`;
      prompt += `\n`;
    }

    // Информация об аудитории
    if (audience && this.hasData(audience)) {
      prompt += `## Информация об аудитории\n`;
      if (audience.ageLocation) prompt += `**Возраст и локация:** ${audience.ageLocation}\n`;
      if (audience.familyStatus) prompt += `**Семейное положение:** ${audience.familyStatus}\n`;
      if (audience.interests) prompt += `**Интересы:** ${audience.interests}\n`;
      if (audience.mainProblems) prompt += `**Главные проблемы:** ${audience.mainProblems}\n`;
      if (audience.solutionSteps) prompt += `**Шаги к решению:** ${audience.solutionSteps}\n`;
      if (audience.yourSolutions) prompt += `**Ваши решения:** ${audience.yourSolutions}\n`;
      prompt += `\n`;
    }

    // Кейсы клиентов
    if (cases && cases.length > 0) {
      prompt += `## Кейсы клиентов\n\n`;
      cases.forEach((case_, index) => {
        prompt += `### Кейс ${index + 1}: ${case_.clientName}\n`;
        if (case_.howFoundOut) prompt += `**Как узнал:** ${case_.howFoundOut}\n`;
        if (case_.goals) prompt += `**Цели:** ${case_.goals}\n`;
        if (case_.problems) prompt += `**Проблемы до работы:** ${case_.problems}\n`;
        if (case_.results) prompt += `**Результаты:** ${case_.results}\n`;
        if (case_.whatHelped) prompt += `**Что помогло:** ${case_.whatHelped}\n`;
        prompt += `\n`;
      });
    }

    // Распаковка личности Lite
    if (personalityLite && this.hasData(personalityLite)) {
      prompt += `## Базовый анализ экспертности\n`;
      if (personalityLite.interestingTopics) prompt += `**Интересные темы:** ${personalityLite.interestingTopics}\n`;
      if (personalityLite.frequentQuestions) prompt += `**Частые вопросы:** ${personalityLite.frequentQuestions}\n`;
      if (personalityLite.personalExperience) prompt += `**Личный опыт:** ${personalityLite.personalExperience}\n`;
      if (personalityLite.explainToBeginner) prompt += `**Объяснение новичку:** ${personalityLite.explainToBeginner}\n`;
      if (personalityLite.transformation) prompt += `**Трансформация:** ${personalityLite.transformation}\n`;
      if (personalityLite.communicationStyle) prompt += `**Стиль общения:** ${personalityLite.communicationStyle}\n`;
      prompt += `\n`;
    }

    // Распаковка личности Pro
    if (personalityPro && this.hasData(personalityPro)) {
      prompt += `## Углубленный анализ экспертности\n`;
      if (personalityPro.clientProblem) prompt += `**Проблема клиентов:** ${personalityPro.clientProblem}\n`;
      if (personalityPro.uniqueApproach) prompt += `**Уникальный подход:** ${personalityPro.uniqueApproach}\n`;
      if (personalityPro.commonMistakes) prompt += `**Главные ошибки:** ${personalityPro.commonMistakes}\n`;
      if (personalityPro.contentFormat) prompt += `**Формат подачи:** ${personalityPro.contentFormat}\n`;
      if (personalityPro.expertMission) prompt += `**Миссия эксперта:** ${personalityPro.expertMission}\n`;
      prompt += `\n`;
    }

    // Заключение
    prompt += `## Задача для ИИ\n\n`;
    prompt += `На основе предоставленной информации создай детальную распаковку личности для ${user.name}. `;
    prompt += `Включи:\n`;
    prompt += `- Основные темы для контента\n`;
    prompt += `- Стиль подачи информации\n`;
    prompt += `- Уникальные подходы и методы\n`;
    prompt += `- Целевая аудитория и их проблемы\n`;
    prompt += `- Конкретные примеры и кейсы\n`;
    prompt += `- Рекомендации по позиционированию\n\n`;
    prompt += `Структурируй ответ в виде готового к использованию контент-плана.`;

    return prompt;
  }

  // Проверить, есть ли данные в объекте
  hasData(obj) {
    return obj && Object.values(obj).some(value => value && value.trim() !== '');
  }

  // Получить краткую сводку для быстрого анализа
  async getQuickSummary() {
    try {
      const userData = await this.apiClient.getUserSummary();
      
      if (!userData) return null;

      const summary = {
        user: userData.user.name,
        hasProduct: this.hasData(userData.product),
        hasAudience: this.hasData(userData.audience),
        casesCount: userData.cases?.length || 0,
        hasPersonalityLite: this.hasData(userData.personalityLite),
        hasPersonalityPro: this.hasData(userData.personalityPro),
        completionPercentage: this.calculateCompletion(userData)
      };

      return summary;
    } catch (error) {
      console.error('Failed to get quick summary:', error);
      return null;
    }
  }

  // Рассчитать процент заполнения
  calculateCompletion(userData) {
    let totalFields = 0;
    let filledFields = 0;

    // Продукт (4 поля)
    if (userData.product) {
      totalFields += 4;
      filledFields += Object.values(userData.product).filter(v => v && v.trim()).length;
    }

    // Аудитория (6 полей)
    if (userData.audience) {
      totalFields += 6;
      filledFields += Object.values(userData.audience).filter(v => v && v.trim()).length;
    }

    // Кейсы (минимум 1 кейс)
    if (userData.cases && userData.cases.length > 0) {
      totalFields += 1;
      filledFields += 1;
    }

    // Личность Lite (6 полей)
    if (userData.personalityLite) {
      totalFields += 6;
      filledFields += Object.values(userData.personalityLite).filter(v => v && v.trim()).length;
    }

    // Личность Pro (5 полей)
    if (userData.personalityPro) {
      totalFields += 5;
      filledFields += Object.values(userData.personalityPro).filter(v => v && v.trim()).length;
    }

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  }

  // Экспорт данных для внешних систем
  async exportData(format = 'json') {
    try {
      const userData = await this.apiClient.getUserSummary();
      
      if (!userData) return null;

      switch (format.toLowerCase()) {
        case 'json':
          return JSON.stringify(userData, null, 2);
        case 'csv':
          return this.convertToCSV(userData);
        case 'prompt':
          return this.buildPrompt(userData);
        default:
          return userData;
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  // Конвертировать в CSV формат
  convertToCSV(userData) {
    const { user, product, audience, cases, personalityLite, personalityPro } = userData;
    
    let csv = 'Section,Field,Value\n';
    
    // Пользователь
    csv += `User,Name,"${user.name}"\n`;
    csv += `User,TelegramID,"${user.telegramId}"\n`;
    
    // Продукт
    if (product) {
      Object.entries(product).forEach(([key, value]) => {
        if (value) csv += `Product,${key},"${value}"\n`;
      });
    }
    
    // Аудитория
    if (audience) {
      Object.entries(audience).forEach(([key, value]) => {
        if (value) csv += `Audience,${key},"${value}"\n`;
      });
    }
    
    // Кейсы
    if (cases) {
      cases.forEach((case_, index) => {
        Object.entries(case_).forEach(([key, value]) => {
          if (value) csv += `Case${index + 1},${key},"${value}"\n`;
        });
      });
    }
    
    // Личность Lite
    if (personalityLite) {
      Object.entries(personalityLite).forEach(([key, value]) => {
        if (value) csv += `PersonalityLite,${key},"${value}"\n`;
      });
    }
    
    // Личность Pro
    if (personalityPro) {
      Object.entries(personalityPro).forEach(([key, value]) => {
        if (value) csv += `PersonalityPro,${key},"${value}"\n`;
      });
    }
    
    return csv;
  }
}

// Создаем глобальный экземпляр агрегатора
window.openAIAggregator = new OpenAIAggregator();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OpenAIAggregator;
} 
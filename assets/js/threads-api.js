// Threads API Service
// Полноценный сервис для работы с Threads API согласно официальной документации
// Поддерживает публикацию постов, получение профиля, аналитику и управление ответами

class ThreadsAPI {
    constructor() {
        this.baseURL = 'https://graph.threads.net/v1.0';
        this.accessToken = null;
        this.userId = null;
        this.rateLimit = {
            remaining: 100,
            resetTime: null
        };
    }

    // === ИНИЦИАЛИЗАЦИЯ И АВТОРИЗАЦИЯ ===
    
    /**
     * Инициализация API с токеном доступа
     * @param {string} accessToken - Токен доступа Threads API
     */
    async initialize(accessToken) {
        this.accessToken = accessToken;
        
        try {
            // Валидируем токен и получаем информацию о пользователе
            const userInfo = await this.getCurrentUser();
            this.userId = userInfo.id;
            
            console.log('Threads API initialized successfully:', userInfo);
            return {
                success: true,
                user: userInfo
            };
        } catch (error) {
            console.error('Failed to initialize Threads API:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Проверка статуса подключения
     */
    isConnected() {
        return this.accessToken && this.userId;
    }

    /**
     * Получение информации о текущем пользователе
     */
    async getCurrentUser() {
        const url = `${this.baseURL}/me?fields=id,username,name,threads_profile_picture_url,threads_biography,is_verified&access_token=${this.accessToken}`;
        
        const response = await fetch(url);
        const data = await this.handleResponse(response);
        
        return data;
    }

    /**
     * Валидация токена доступа
     */
    async validateToken() {
        try {
            const url = `${this.baseURL}/debug_token?access_token=${this.accessToken}&input_token=${this.accessToken}`;
            const response = await fetch(url);
            const data = await this.handleResponse(response);
            
            return {
                valid: data.data?.is_valid === true,
                scopes: data.data?.scopes || [],
                expires: data.data?.expires_at
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }

    // === ПУБЛИКАЦИЯ ПОСТОВ ===

    /**
     * Создание и публикация текстового поста
     * @param {string} text - Текст поста (до 500 символов)
     * @param {Object} options - Дополнительные опции
     */
    async createTextPost(text, options = {}) {
        try {
            // Шаг 1: Создание медиа-контейнера
            const container = await this.createMediaContainer({
                media_type: 'TEXT_POST',
                text: text,
                reply_control: options.replyControl || 'everyone',
                ...options
            });

            // Шаг 2: Публикация контейнера
            const published = await this.publishContainer(container.id);
            
            return {
                success: true,
                postId: published.id,
                containerId: container.id
            };
        } catch (error) {
            console.error('Failed to create text post:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Создание медиа-контейнера
     */
    async createMediaContainer(params) {
        const url = `${this.baseURL}/${this.userId}/threads`;
        
        const formData = new FormData();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined) {
                formData.append(key, params[key]);
            }
        });
        formData.append('access_token', this.accessToken);

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        return await this.handleResponse(response);
    }

    /**
     * Публикация медиа-контейнера
     */
    async publishContainer(containerId) {
        const url = `${this.baseURL}/${this.userId}/threads_publish`;
        
        const formData = new FormData();
        formData.append('creation_id', containerId);
        formData.append('access_token', this.accessToken);

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        return await this.handleResponse(response);
    }

    /**
     * Проверка статуса медиа-контейнера
     */
    async getContainerStatus(containerId) {
        const url = `${this.baseURL}/${containerId}?fields=status,error_message&access_token=${this.accessToken}`;
        
        const response = await fetch(url);
        return await this.handleResponse(response);
    }

    /**
     * Ожидание готовности контейнера к публикации
     */
    async waitForContainer(containerId, maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            const status = await this.getContainerStatus(containerId);
            
            if (status.status === 'FINISHED') {
                return true;
            } else if (status.status === 'ERROR') {
                throw new Error(`Container error: ${status.error_message}`);
            } else if (status.status === 'EXPIRED') {
                throw new Error('Container expired');
            }
            
            // Ждем 2 секунды перед следующей проверкой
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        throw new Error('Container processing timeout');
    }

    // === ПОЛУЧЕНИЕ ПОСТОВ ===

    /**
     * Получение постов пользователя
     */
    async getUserPosts(userId = null, options = {}) {
        const targetUserId = userId || this.userId;
        const url = `${this.baseURL}/${targetUserId}/threads?fields=id,text,username,permalink,timestamp,media_product_type,media_type,media_url,shortcode,thumbnail_url,is_quote_post,has_replies&limit=${options.limit || 25}&access_token=${this.accessToken}`;
        
        const response = await fetch(url);
        return await this.handleResponse(response);
    }

    /**
     * Получение поста по ID
     */
    async getPost(postId) {
        const url = `${this.baseURL}/${postId}?fields=id,text,username,permalink,timestamp,media_product_type,media_type,media_url,shortcode,thumbnail_url,is_quote_post,has_replies,root_post,replied_to,is_reply&access_token=${this.accessToken}`;
        
        const response = await fetch(url);
        return await this.handleResponse(response);
    }

    // === УПРАВЛЕНИЕ ОТВЕТАМИ ===

    /**
     * Получение ответов на пост
     */
    async getPostReplies(postId, options = {}) {
        const url = `${this.baseURL}/${postId}/replies?fields=id,text,username,timestamp,media_type,has_replies,hide_status&reverse=${options.reverse || false}&access_token=${this.accessToken}`;
        
        const response = await fetch(url);
        return await this.handleResponse(response);
    }

    /**
     * Получение полной беседы
     */
    async getPostConversation(postId, options = {}) {
        const url = `${this.baseURL}/${postId}/conversation?fields=id,text,username,timestamp,media_type,has_replies,hide_status,root_post,replied_to,is_reply&reverse=${options.reverse || false}&access_token=${this.accessToken}`;
        
        const response = await fetch(url);
        return await this.handleResponse(response);
    }

    /**
     * Скрытие/показ ответа
     */
    async manageReply(replyId, hide = true) {
        const url = `${this.baseURL}/${replyId}/manage_reply`;
        
        const formData = new FormData();
        formData.append('hide', hide.toString());
        formData.append('access_token', this.accessToken);

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        return await this.handleResponse(response);
    }

    // === АНАЛИТИКА ===

    /**
     * Получение аналитики поста
     */
    async getPostInsights(postId, metrics = ['views', 'likes', 'replies', 'reposts', 'quotes']) {
        const url = `${this.baseURL}/${postId}/insights?metric=${metrics.join(',')}&access_token=${this.accessToken}`;
        
        const response = await fetch(url);
        return await this.handleResponse(response);
    }

    /**
     * Получение аналитики пользователя
     */
    async getUserInsights(metrics = ['views', 'likes', 'replies', 'reposts', 'quotes', 'followers_count'], since = null, until = null) {
        let url = `${this.baseURL}/${this.userId}/threads_insights?metric=${metrics.join(',')}&access_token=${this.accessToken}`;
        
        if (since) url += `&since=${since}`;
        if (until) url += `&until=${until}`;
        
        const response = await fetch(url);
        return await this.handleResponse(response);
    }

    // === ЛИМИТЫ И КВОТЫ ===

    /**
     * Получение информации о лимитах публикации
     */
    async getPublishingLimits() {
        const url = `${this.baseURL}/${this.userId}/threads_publishing_limit?fields=quota_usage,config,reply_quota_usage,reply_config&access_token=${this.accessToken}`;
        
        const response = await fetch(url);
        return await this.handleResponse(response);
    }

    // === ПОИСК И ПРОФИЛИ ===

    /**
     * Поиск публичного профиля
     */
    async lookupProfile(username) {
        const url = `${this.baseURL}/profile_lookup?username=${username}&fields=username,name,profile_picture_url,biography,follower_count,is_verified&access_token=${this.accessToken}`;
        
        const response = await fetch(url);
        return await this.handleResponse(response);
    }

    /**
     * Поиск по ключевым словам
     */
    async searchPosts(query, options = {}) {
        const url = `${this.baseURL}/keyword_search?q=${encodeURIComponent(query)}&fields=id,text,username,timestamp,media_type&limit=${options.limit || 10}&access_token=${this.accessToken}`;
        
        const response = await fetch(url);
        return await this.handleResponse(response);
    }

    // === РЕПОСТЫ И ДЕЙСТВИЯ ===

    /**
     * Репост поста
     */
    async repost(postId) {
        const url = `${this.baseURL}/${postId}/repost`;
        
        const formData = new FormData();
        formData.append('access_token', this.accessToken);

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        return await this.handleResponse(response);
    }

    /**
     * Удаление поста
     */
    async deletePost(postId) {
        const url = `${this.baseURL}/${postId}?access_token=${this.accessToken}`;

        const response = await fetch(url, {
            method: 'DELETE'
        });

        return await this.handleResponse(response);
    }

    // === УТИЛИТЫ ===

    /**
     * Обработка ответов API
     */
    async handleResponse(response) {
        // Обновляем информацию о лимитах
        this.updateRateLimit(response.headers);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            error.code = errorData.error?.code;
            error.type = errorData.error?.type;
            error.status = response.status;
            throw error;
        }

        return await response.json();
    }

    /**
     * Обновление информации о лимитах запросов
     */
    updateRateLimit(headers) {
        const remaining = headers.get('X-RateLimit-Remaining');
        const reset = headers.get('X-RateLimit-Reset');
        
        if (remaining) this.rateLimit.remaining = parseInt(remaining);
        if (reset) this.rateLimit.resetTime = new Date(parseInt(reset) * 1000);
    }

    /**
     * Проверка доступности API (лимиты)
     */
    canMakeRequest() {
        return this.rateLimit.remaining > 0;
    }

    /**
     * Получение времени до сброса лимитов
     */
    getTimeUntilReset() {
        if (!this.rateLimit.resetTime) return null;
        return Math.max(0, this.rateLimit.resetTime.getTime() - Date.now());
    }

    /**
     * Форматирование ошибок для пользователя
     */
    formatError(error) {
        const errorMessages = {
            400: 'Неверные параметры запроса',
            401: 'Недействительный токен доступа',
            403: 'Доступ запрещен. Проверьте права доступа',
            404: 'Ресурс не найден',
            429: 'Превышен лимит запросов. Попробуйте позже',
            500: 'Внутренняя ошибка сервера Threads'
        };

        return errorMessages[error.status] || error.message || 'Неизвестная ошибка API';
    }

    // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===

    /**
     * Создание поста с автоматической обработкой контейнера
     */
    async createPostWithRetry(text, options = {}, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await this.createTextPost(text, options);
                if (result.success) {
                    return result;
                }
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                
                // Ждем перед повторной попыткой
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    /**
     * Пакетная публикация постов с соблюдением лимитов
     */
    async batchPublish(posts, delayBetweenPosts = 5000) {
        const results = [];
        
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            
            try {
                // Проверяем лимиты
                if (!this.canMakeRequest()) {
                    const waitTime = this.getTimeUntilReset();
                    if (waitTime > 0) {
                        console.log(`Waiting ${Math.ceil(waitTime / 1000)}s for rate limit reset...`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    }
                }

                const result = await this.createTextPost(post.text, post.options);
                results.push({
                    index: i,
                    success: result.success,
                    postId: result.postId,
                    originalPost: post
                });

                // Задержка между постами
                if (i < posts.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, delayBetweenPosts));
                }

            } catch (error) {
                results.push({
                    index: i,
                    success: false,
                    error: this.formatError(error),
                    originalPost: post
                });
            }
        }
        
        return results;
    }
}

// Экспорт для использования в других модулях
window.ThreadsAPI = ThreadsAPI;

// === ИНТЕГРАЦИЯ С ПРИЛОЖЕНИЕМ ===

// Глобальный экземпляр API
window.threadsAPI = new ThreadsAPI();

// Функции для интеграции с существующим кодом
window.ThreadsIntegration = {
    
    /**
     * Инициализация API из локального хранилища
     */
    async initFromStorage() {
        const connectionData = localStorage.getItem('threads_connection');
        if (connectionData) {
            const data = JSON.parse(connectionData);
            if (data.accessToken) {
                return await window.threadsAPI.initialize(data.accessToken);
            }
        }
        return { success: false, error: 'No access token found' };
    },

    /**
     * Сохранение данных подключения
     */
    saveConnection(data) {
        localStorage.setItem('threads_connection', JSON.stringify({
            ...data,
            connectedAt: new Date().toISOString()
        }));
    },

    /**
     * Публикация поста по расписанию
     */
    async publishScheduledPost(postData) {
        try {
            const result = await window.threadsAPI.createTextPost(
                postData.text, 
                {
                    replyControl: postData.replyControl || 'everyone'
                }
            );

            if (result.success) {
                // Сохраняем в историю публикаций
                this.savePublishedPost({
                    id: result.postId,
                    text: postData.text,
                    publishedAt: new Date().toISOString(),
                    scheduledTime: postData.scheduledTime,
                    status: 'published'
                });
            }

            return result;
        } catch (error) {
            console.error('Failed to publish scheduled post:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Сохранение опубликованного поста в историю
     */
    savePublishedPost(postData) {
        const published = JSON.parse(localStorage.getItem('threads_published_posts') || '[]');
        published.unshift(postData);
        
        // Ограничиваем историю 100 постами
        if (published.length > 100) {
            published.splice(100);
        }
        
        localStorage.setItem('threads_published_posts', JSON.stringify(published));
    },

    /**
     * Получение статистики аккаунта
     */
    async getAccountStats() {
        try {
            const insights = await window.threadsAPI.getUserInsights();
            const limits = await window.threadsAPI.getPublishingLimits();
            
            return {
                success: true,
                insights: insights.data,
                limits: limits
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

console.log('Threads API Service loaded successfully');
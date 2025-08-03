# Структура проекта AiPetri Studio

## Реструктуризация завершена ✅

Проект был реорганизован для лучшей организации кода и удобства разработки.

### Новая структура папок:

```
/
├── index.html                    # Главная страница
├── assets/                       # Ресурсы приложения
│   ├── css/                      # Стили
│   │   ├── styles.css           # Общие стили
│   │   ├── personality.css      # Стили для распаковки личности
│   │   ├── product.css          # Стили для продукта
│   │   ├── audience.css         # Стили для аудитории
│   │   ├── cases.css            # Стили для кейсов
│   │   ├── personality-lite.css # Стили для Lite версии
│   │   └── personality-pro.css  # Стили для Pro версии
│   ├── js/                       # JavaScript файлы
│   │   ├── app.js               # Главный JS файл
│   │   ├── personality.js       # JS для распаковки личности
│   │   ├── product.js           # JS для продукта
│   │   ├── audience.js          # JS для аудитории
│   │   ├── cases.js             # JS для кейсов
│   │   ├── personality-lite.js  # JS для Lite версии
│   │   ├── personality-pro.js   # JS для Pro версии
│   │   ├── api.js               # API функции
│   │   └── openai-aggregator.js # OpenAI интеграция
│   └── images/                   # Изображения
│       └── ChatGPT Image 2 авг. 2025 г., 19_40_13.png
├── pages/                        # HTML страницы
│   ├── personality.html          # Распаковка личности
│   ├── product.html              # Распаковка продукта
│   ├── audience.html             # Распаковка аудитории
│   ├── cases.html                # Распаковка кейсов
│   ├── personality-lite.html     # Lite версия
│   └── personality-pro.html      # Pro версия
└── backend/                      # Backend файлы
    ├── package.json              # Зависимости
    ├── src/
    │   └── index.js              # Backend логика
    ├── database/
    │   └── schema.prisma         # Схема базы данных
    ├── Телеграм апи.txt          # Документация API
    └── Распаковка личности/       # Дополнительные материалы
```

### Обновленные пути:

#### В index.html:
- CSS: `assets/css/styles.css`
- JS: `assets/js/app.js?v=30.16`
- Изображения: `assets/images/`

#### В страницах pages/:
- CSS: `../assets/css/`
- JS: `../assets/js/`

#### Навигация:
- Из корня в pages/: `pages/personality.html`
- Из pages/ в корень: `../index.html`
- Между страницами в pages/: `product.html`

### Версия обновлена:
- Премиум автоматизация публикаций v30.16

### Преимущества новой структуры:
1. ✅ Логическое разделение файлов по типам
2. ✅ Удобная навигация между папками
3. ✅ Четкая организация ресурсов
4. ✅ Упрощенное сопровождение кода
5. ✅ Масштабируемость проекта

### Файлы обновлены:
- ✅ Все HTML файлы с новыми путями
- ✅ Все JS файлы с обновленной навигацией
- ✅ Версии скриптов обновлены до v30.16
- ✅ Backup файлы удалены
- ✅ Дополнительные файлы перемещены в backend/ 
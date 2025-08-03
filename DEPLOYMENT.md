# Инструкции по деплою на GitHub Pages

## 🚀 Автоматический деплой

### Настройка GitHub Pages

1. Перейдите в настройки репозитория на GitHub
2. Найдите раздел "Pages" в боковом меню
3. В разделе "Source" выберите "Deploy from a branch"
4. Выберите ветку `gh-pages` и папку `/ (root)`
5. Нажмите "Save"

### GitHub Action

При каждом push в ветку `main` автоматически запускается workflow, который:

1. ✅ Копирует файлы из структуры папок в корень
2. ✅ Обновляет пути в HTML и JS файлах
3. ✅ Создает ветку `gh-pages` с правильной структурой
4. ✅ Деплоит на GitHub Pages

### Структура для разработки vs деплой

**Для разработки (сохраняется):**
```
/
├── index.html
├── assets/
│   ├── css/
│   └── js/
├── pages/
│   ├── personality.html
│   └── ...
└── backend/
```

**Для GitHub Pages (создается автоматически):**
```
/
├── index.html
├── personality.html
├── product.html
├── audience.html
├── cases.html
├── personality-lite.html
├── personality-pro.html
└── assets/
    ├── css/
    └── js/
```

## 🔧 Ручной деплой

### Локальная сборка

```bash
# Создаем папку для сборки
mkdir temp-deploy

# Копируем index.html
cp index.html temp-deploy/

# Копируем assets
cp -r assets temp-deploy/

# Копируем HTML файлы из pages/
cp pages/*.html temp-deploy/

# Обновляем пути в HTML файлах
sed -i 's|../assets/|assets/|g' temp-deploy/*.html
sed -i 's|pages/||g' temp-deploy/*.html

# Обновляем навигацию в JS файлах
sed -i 's|pages/||g' temp-deploy/assets/js/*.js
sed -i 's|../index.html|index.html|g' temp-deploy/assets/js/*.js
```

### Загрузка на GitHub Pages

1. Создайте ветку `gh-pages`:
```bash
git checkout -b gh-pages
```

2. Скопируйте файлы из `temp-deploy/` в корень:
```bash
cp -r temp-deploy/* .
```

3. Зафиксируйте изменения:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

## 📱 Настройка Telegram Mini App

### В @BotFather

1. Создайте бота: `/newbot`
2. Добавьте Mini App: `/newapp`
3. Укажите URL: `https://mttMxr.github.io/ai-petri-studio/`

### Проверка работы

1. Откройте URL в браузере
2. Проверьте все страницы и функциональность
3. Протестируйте в Telegram

## 🐛 Устранение проблем

### 404 ошибка

**Причина:** Неправильная структура файлов для GitHub Pages

**Решение:**
1. Проверьте, что GitHub Action выполнился успешно
2. Убедитесь, что ветка `gh-pages` создана
3. Проверьте настройки GitHub Pages

### Неправильные пути

**Причина:** Пути не обновились при деплое

**Решение:**
1. Проверьте логи GitHub Action
2. Убедитесь, что sed команды выполнились
3. Проверьте файлы в ветке `gh-pages`

### Telegram Mini App не работает

**Причина:** Проблемы с CORS или путями

**Решение:**
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что все ресурсы загружаются
3. Проверьте настройки в @BotFather

## 📋 Чек-лист деплоя

- [ ] GitHub Action настроен
- [ ] GitHub Pages включен
- [ ] Ветка `gh-pages` создана
- [ ] Все файлы скопированы в корень
- [ ] Пути обновлены
- [ ] Приложение работает локально
- [ ] Приложение работает на GitHub Pages
- [ ] Telegram Mini App настроен
- [ ] Все функции работают в Telegram

## 🔄 Обновление

При каждом изменении кода:

1. Зафиксируйте изменения в `main`:
```bash
git add .
git commit -m "Update functionality"
git push origin main
```

2. GitHub Action автоматически запустится
3. Через несколько минут изменения появятся на сайте

## 📞 Поддержка

При проблемах с деплоем:

1. Проверьте логи GitHub Action
2. Убедитесь, что все файлы на месте
3. Проверьте настройки GitHub Pages
4. Создайте Issue в репозитории

---

**Важно:** Структура папок сохранена для удобной разработки. GitHub Action автоматически создает правильную структуру для GitHub Pages при каждом деплое. 
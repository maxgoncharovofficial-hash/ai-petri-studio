# GitHub Pages Setup Guide

## 🔧 Настройка GitHub Pages для исправления ошибок деплоя

### Ошибки которые нужно исправить:
- ❌ Error: Failed to create deployment (status...)
- ❌ HttpError: Missing environment. Ensure yo...
- ❌ Creating Pages deployment failed

### Шаги для исправления:

#### 1. Настройка GitHub Pages в репозитории

1. Перейдите в репозиторий на GitHub
2. Нажмите **Settings** (вкладка настроек)
3. В левом меню найдите **Pages**
4. В разделе **Source** выберите:
   - **Deploy from a branch** → **main** → **/(root)**
   - ИЛИ **GitHub Actions** (рекомендуется)

#### 2. Создание Environment (если требуется)

1. В репозитории перейдите в **Settings** → **Environments**
2. Нажмите **New environment**
3. Введите имя: `github-pages`
4. Нажмите **Configure environment**
5. В разделе **Deployment branches** добавьте:
   - `main` (или `*` для всех веток)
6. Нажмите **Save protection rules**

#### 3. Проверка Workflow файлов

Убедитесь что в репозитории есть правильный `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./deploy
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 4. Проверка структуры файлов

Убедитесь что в корне репозитория есть:
- ✅ `index.html`
- ✅ `assets/` папка с CSS/JS/изображениями
- ✅ `pages/` папка с HTML файлами

#### 5. Проверка путей в файлах

В HTML файлах пути должны быть:
- ✅ `assets/css/styles.css` (в index.html)
- ✅ `../assets/css/styles.css` (в pages/*.html)

#### 6. Запуск деплоя

1. Сделайте push в ветку `main`
2. Перейдите в **Actions** в репозитории
3. Проверьте что workflow запустился
4. Дождитесь завершения деплоя

### Альтернативный простой workflow

Если основной workflow не работает, используйте `deploy-simple.yml`:

```yaml
name: Deploy to GitHub Pages (Simple)

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Проверка результата

После успешного деплоя:
1. Перейдите в **Settings** → **Pages**
2. Убедитесь что есть URL сайта
3. Проверьте что сайт доступен по ссылке

### Устранение проблем

#### Проблема: "Missing environment"
**Решение:** Создайте environment `github-pages` в настройках репозитория

#### Проблема: "Failed to create deployment"
**Решение:** Проверьте permissions в workflow файле

#### Проблема: "Creating Pages deployment failed"
**Решение:** Убедитесь что в Settings → Pages выбран правильный Source

### Контакты

Если проблемы остаются:
1. Проверьте логи в Actions
2. Убедитесь что все файлы в правильных местах
3. Проверьте что нет конфликтующих workflow файлов 
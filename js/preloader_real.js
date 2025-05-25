// Реальный прелоадер, который отслеживает загрузку ресурсов
class RealPreloader {
    constructor() {
        // Список ресурсов для загрузки
        this.resources = [
            // CSS файлы
            'css/styles.css',
            'css/preloader.css',
            'css/background.css',
            'css/instruction.css',
            'css/settings.css',
            'css/stats.css',
            'css/table-editor.css',
            'css/sql-editor.css',
            'css/user-card-extras.css',
            'css/afterload-animations.css',
            'css/fonts.css',
            
            // JS файлы (уже загружены через HTML, но мы их отслеживаем)
            // Отключаем реальную загрузку, но показываем в списке
            'js/instruction.js'
            
            // Шрифты (CORS ошибки при локальной загрузке, но работает на сервере)
            // 'fonts/Gropled.otf',
            // 'fonts/benzin-bold.otf'
        ];
        
        // Интересные факты для отображения во время загрузки
        this.funFacts = [
            "А вы знали что сайт сделан 1 человеком...",
            "А вы знали что сайт создан за 1 месяц...",
            "А вы знали что админка - это высший уровень технологий...",
            "Каждый кто входит в админку получает бесценный опыт...",
            "Загрузка может занять немного больше времени для добавления эффекта...",
            "А вы знали что хлеб с сахором действительно вкусно?"
        ];
        
        this.loadedResources = 0;
        this.totalResources = this.resources.length;
        this.startTime = performance.now();
        this.MIN_LOADING_TIME = 2000; // минимальное время показа прелоадера (2 секунды)
        
        // Инициализация системы безопасности
        this.initSecurity();
        
        // Отслеживание статистики
        this.trackStatistics();
        
        // Инициализация прелоадера
        this.init();
    }
    
    // Инициализация системы безопасности
    initSecurity() {
        window.securitySystem = {
            encryptData: function(data) {
                return btoa(JSON.stringify(data));
            },
            decryptData: function(encrypted) {
                try {
                    return JSON.parse(atob(encrypted));
                } catch(e) {
                    console.error('Ошибка дешифрования данных:', e);
                    return null;
                }
            },
            generateToken: function() {
                return Math.random().toString(36).substring(2) + Date.now().toString(36);
            },
            verifyToken: function(token) {
                return token && token.length > 10;
            }
        };
        
        // Создаем токен сессии для защиты
        const sessionToken = window.securitySystem.generateToken();
        localStorage.setItem('securityToken', sessionToken);
    }
    
    // Отслеживание статистики сайта
    trackStatistics() {
        const siteStats = {
            visits: parseInt(localStorage.getItem('visitCount') || '0') + 1,
            lastVisit: new Date().toISOString(),
            loadTimes: JSON.parse(localStorage.getItem('loadTimes') || '[]'),
            browsers: JSON.parse(localStorage.getItem('browsers') || '{}')
        };
        
        // Фиксируем посещение
        localStorage.setItem('visitCount', siteStats.visits.toString());
        localStorage.setItem('lastVisit', siteStats.lastVisit);
        
        // Определяем браузер
        const browserInfo = navigator.userAgent;
        const browserName = browserInfo.match(/(chrome|firefox|safari|edge|opera)/i);
        if (browserName) {
            const name = browserName[0].toLowerCase();
            const browsers = JSON.parse(localStorage.getItem('browsers') || '{}');
            browsers[name] = (browsers[name] || 0) + 1;
            localStorage.setItem('browsers', JSON.stringify(browsers));
        }
        
        // Сохраняем ссылку на объект статистики
        this.siteStats = siteStats;
    }
    
    // Инициализация прелоадера
    init() {
        // Показываем содержимое прелоадера
        const loadingContent = document.getElementById('loadingContent');
        if (loadingContent) {
            loadingContent.classList.add('show');
        }
        
        // Добавляем заголовок для списка загружаемых ресурсов
        const loadingResources = document.querySelector('.loading-resources');
        if (loadingResources) {
            // Проверяем, есть ли уже заголовок
            if (!document.querySelector('.resources-title')) {
                const title = document.createElement('div');
                title.className = 'resources-title';
                title.innerHTML = '<i class="fas fa-download"></i> Загружаемые ресурсы:';
                loadingResources.appendChild(title);
            }
            
            // Добавляем текст для начала загрузки
            const startingMessage = document.createElement('div');
            startingMessage.className = 'resource-item starting-message';
            startingMessage.innerHTML = '<span>Начинаем загрузку файлов...</span>';
            loadingResources.appendChild(startingMessage);
            
            // Убедимся, что блок виден
            loadingResources.style.display = 'block';
        }
        
        // Отображаем случайный факт
        this.displayFunFact();
        
        // Запускаем интервал смены фактов
        this.startFactRotation();
        
        // Обновляем счетчик загруженных ресурсов
        this.updateResourceCount();
        
        // Начинаем загрузку ресурсов
        this.loadResources();
    }
    
    // Отображение случайного интересного факта
    displayFunFact() {
        const funFactElement = document.getElementById('funFact');
        if (funFactElement) {
            const randomIndex = Math.floor(Math.random() * this.funFacts.length);
            funFactElement.textContent = this.funFacts[randomIndex];
        }
    }
    
    // Запуск ротации интересных фактов
    startFactRotation() {
        const funFactElement = document.getElementById('funFact');
        if (!funFactElement) return;
        
        let currentIndex = 0;
        this.factInterval = setInterval(() => {
            funFactElement.style.opacity = '0';
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % this.funFacts.length;
                funFactElement.textContent = this.funFacts[currentIndex];
                funFactElement.style.opacity = '1';
            }, 300);
        }, 3000);
    }
    
    // Обновление счетчика загруженных ресурсов
    updateResourceCount() {
        const resourceCountElement = document.getElementById('resourceCount');
        if (resourceCountElement) {
            resourceCountElement.textContent = `${this.loadedResources} / ${this.totalResources} ресурсов загружено`;
        }
        
        // Обновляем прогресс-бар
        const progressBar = document.querySelector('.loading-bar');
        if (progressBar) {
            const progressPercent = (this.loadedResources / this.totalResources) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    // Реальная загрузка ресурсов
    loadResources() {
        // Функция для загрузки одного ресурса
        const loadResource = (url) => {
            return new Promise((resolve, reject) => {
                // Определяем тип ресурса
                const fileExtension = url.split('.').pop().toLowerCase();
                
                if (['css', 'js'].includes(fileExtension)) {
                    // Для CSS и JS создаем соответствующий элемент
                    let element;
                    
                    if (fileExtension === 'css') {
                        element = document.createElement('link');
                        element.rel = 'stylesheet';
                        element.href = url;
                    } else if (fileExtension === 'js') {
                        element = document.createElement('script');
                        element.src = url;
                    }
                    
                    // Добавляем обработчики событий
                    element.onload = () => {
                        console.log(`Ресурс загружен: ${url}`);
                        this.loadedResources++;
                        this.updateResourceCount();
                        resolve();
                    };
                    
                    element.onerror = (error) => {
                        console.error(`Ошибка загрузки ресурса: ${url}`, error);
                        // Даже при ошибке считаем ресурс "загруженным" для продолжения
                        this.loadedResources++;
                        this.updateResourceCount();
                        
                        // Добавляем ошибку в UI
                        this.addResourceItem(url, true);
                        resolve(); // Resolve anyway to continue loading
                    };
                    
                    // Добавляем в DOM
                    document.head.appendChild(element);
                } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'otf', 'ttf', 'woff', 'woff2'].includes(fileExtension)) {
                    // Для изображений и шрифтов используем XMLHttpRequest
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    
                    // Для шрифтов и изображений устанавливаем responseType
                    if (['otf', 'ttf', 'woff', 'woff2'].includes(fileExtension)) {
                        xhr.responseType = 'arraybuffer';
                    } else {
                        xhr.responseType = 'blob';
                    }
                    
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            console.log(`Ресурс загружен: ${url}`);
                            this.loadedResources++;
                            this.updateResourceCount();
                            this.addResourceItem(url, false);
                            resolve();
                        } else {
                            console.error(`Ошибка загрузки ресурса: ${url}`, xhr.statusText);
                            this.loadedResources++;
                            this.updateResourceCount();
                            this.addResourceItem(url, true);
                            resolve(); // Resolve anyway to continue loading
                        }
                    };
                    
                    xhr.onerror = () => {
                        console.error(`Ошибка загрузки ресурса: ${url}`);
                        this.loadedResources++;
                        this.updateResourceCount();
                        this.addResourceItem(url, true);
                        resolve(); // Resolve anyway to continue loading
                    };
                    
                    xhr.send();
                } else {
                    // Для других типов файлов просто имитируем загрузку
                    setTimeout(() => {
                        console.log(`Ресурс обработан: ${url}`);
                        this.loadedResources++;
                        this.updateResourceCount();
                        this.addResourceItem(url, false);
                        resolve();
                    }, 100);
                }
            });
        };
        
        // Добавление элемента ресурса в интерфейс
        this.addResourceItem = (resource, isError) => {
            const loadingResources = document.querySelector('.loading-resources');
            if (!loadingResources) return;
            
            // Удаляем начальное сообщение о загрузке, если оно есть
            const startingMessage = document.querySelector('.starting-message');
            if (startingMessage) {
                startingMessage.remove();
            }
            
            // Проверяем, существует ли уже элемент для этого ресурса
            const existingItem = document.querySelector(`[data-resource="${resource}"]`);
            if (existingItem) {
                // Если элемент уже существует, обновляем только его статус
                const statusElement = existingItem.querySelector('.resource-status');
                if (statusElement) {
                    statusElement.className = isError ? 'resource-status error' : 'resource-status success';
                    statusElement.textContent = isError ? 'Ошибка загрузки' : 'Загружено';
                }
                return;
            }
            
            // Получаем имя файла из полного пути
            const fileName = resource.split('/').pop();
            
            // Создаем элемент ресурса
            const resourceItem = document.createElement('div');
            resourceItem.className = 'resource-item';
            resourceItem.setAttribute('data-resource', resource);
            
            // Добавляем иконку в зависимости от типа файла
            const fileExtension = fileName.split('.').pop().toLowerCase();
            let fileIcon = 'fa-file';
            
            if (['js', 'jsx', 'ts', 'tsx'].includes(fileExtension)) {
                fileIcon = 'fa-file-code';
            } else if (['css', 'scss', 'sass'].includes(fileExtension)) {
                fileIcon = 'fa-file-code';
            } else if (['html', 'htm'].includes(fileExtension)) {
                fileIcon = 'fa-file-code';
            } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExtension)) {
                fileIcon = 'fa-file-image';
            } else if (['otf', 'ttf', 'woff', 'woff2'].includes(fileExtension)) {
                fileIcon = 'fa-font';
            } else if (['json', 'xml'].includes(fileExtension)) {
                fileIcon = 'fa-file-alt';
            }
            
            // Создаем имя ресурса с иконкой
            const resourceName = document.createElement('span');
            resourceName.className = 'resource-name';
            resourceName.innerHTML = `<i class="fas ${fileIcon}"></i> ${fileName}`;
            
            // Создаем статус загрузки
            const resourceStatus = document.createElement('span');
            resourceStatus.className = isError ? 'resource-status error' : 'resource-status success';
            resourceStatus.innerHTML = isError ? 
                '<i class="fas fa-times-circle"></i> Ошибка' : 
                '<i class="fas fa-check-circle"></i> Загружено';
            
            // Добавляем элементы в список
            resourceItem.appendChild(resourceName);
            resourceItem.appendChild(resourceStatus);
            loadingResources.appendChild(resourceItem);
            
            // Прокручиваем список вниз, чтобы видеть последние загруженные ресурсы
            loadingResources.scrollTop = loadingResources.scrollHeight;
        };
        
        // Загрузка всех ресурсов параллельно
        const promises = this.resources.map(resource => loadResource(resource));
        
        // Ожидаем загрузку всех ресурсов
        Promise.all(promises)
            .then(() => {
                const loadTime = performance.now() - this.startTime;
                
                // Добавляем время загрузки в статистику
                this.siteStats.loadTimes.push(loadTime);
                if (this.siteStats.loadTimes.length > 10) this.siteStats.loadTimes.shift();
                localStorage.setItem('loadTimes', JSON.stringify(this.siteStats.loadTimes));
                
                // Проверяем, нужно ли показывать прелоадер дольше
                const additionalDelay = Math.max(0, this.MIN_LOADING_TIME - loadTime);
                
                setTimeout(() => {
                    this.finishLoading();
                }, additionalDelay);
            });
    }
    
    // Завершение загрузки и скрытие прелоадера
    finishLoading() {
        // Останавливаем ротацию фактов
        if (this.factInterval) {
            clearInterval(this.factInterval);
        }
        
        // Скрываем прелоадер с анимацией
        const preloader = document.getElementById('sitePreloader');
        if (preloader) {
            preloader.classList.add('preloader-exit');
            
            // Скрываем прелоадер после завершения анимации
            setTimeout(() => {
                preloader.style.display = 'none';
                
                // Показываем интерфейс
                const authContainer = document.getElementById('authContainer');
                if (authContainer) {
                    // Анимация появления блока авторизации
                    authContainer.style.opacity = '0';
                    authContainer.style.transform = 'scale(0.95)';
                    authContainer.style.display = 'block';
                    
                    setTimeout(() => {
                        authContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        authContainer.style.opacity = '1';
                        authContainer.style.transform = 'scale(1)';
                    }, 50);
                }
                
                // Генерируем событие завершения загрузки
                const event = new CustomEvent('preloaderFinished');
                document.dispatchEvent(event);
            }, 500);
        }
    }
}

// Инициализация прелоадера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка для инициализации DOM
    setTimeout(() => {
        new RealPreloader();
    }, 300);
});

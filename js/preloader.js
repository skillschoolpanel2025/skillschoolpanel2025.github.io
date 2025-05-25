// Код для работы с прелоадером и безопасностью
let startTime = performance.now(); // Начало отсчёта времени загрузки

// Добавляем безопасность - секретный код для защиты от атак
(function() {
    // Инициализация системы защиты
    window.securitySystem = {
        encryptData: function(data) {
            // Простое шифрование данных для демонстрации
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
            // Проверка токена безопасности
            return token && token.length > 10;
        }
    };
    
    // Создаем токен сессии для защиты
    const sessionToken = window.securitySystem.generateToken();
    localStorage.setItem('securityToken', sessionToken);
})();

// Статистика сайта
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

// Основная логика прелоадера
window.addEventListener('load', function() {
    // Увеличиваем минимальное время загрузки до 3 секунд (было 5, уменьшаем для быстрого отклика)
    const MIN_LOADING_TIME = 3000; // минимальное время показа прелоадера в мс
    const loadTime = performance.now() - startTime;
    
    // Проверяем, нужно ли показывать прелоадер дольше
    const additionalDelay = Math.max(0, MIN_LOADING_TIME - loadTime);
    
    // Добавляем время загрузки в статистику
    siteStats.loadTimes.push(loadTime);
    if (siteStats.loadTimes.length > 10) siteStats.loadTimes.shift(); // Храним только последние 10 загрузок
    localStorage.setItem('loadTimes', JSON.stringify(siteStats.loadTimes));
    
    // Массив интересных фактов
    const funFacts = [
        "А вы знали что сайт сделан 1 человеком...",
        "А вы знали что сайт создан за 1 месяц...",
        "А вы знали что админка - это высший уровень технологий...",
        "Каждый кто входит в админку получает бесценный опыт...",
        "Загрузка может занять немного больше времени для добавления эффекта...",
        "А вы знали что хлеб с сахором действительно вкусно?"
    ];
    
    // Настройки прелоадера
    const preloader = document.getElementById('sitePreloader');
    const funFactElement = document.getElementById('funFact');
    const loadingContent = document.getElementById('loadingContent');
    
    // Показываем содержимое загрузки с анимацией появления
    preloader.classList.add('fadeInSpin');
    loadingContent.classList.add('show');
    
    // Функция для выбора случайного факта
    function selectRandomFact() {
        return funFacts[Math.floor(Math.random() * funFacts.length)];
    }
    
    // Показываем первый факт
    funFactElement.textContent = selectRandomFact();
    
    // Запускаем интервал для смены фактов каждые 3 секунды
    let currentIndex = 0;
    let factInterval = setInterval(function() {
        currentIndex = (currentIndex + 1) % funFacts.length;
        funFactElement.style.opacity = '0';
        
        setTimeout(function() {
            funFactElement.textContent = funFacts[currentIndex];
            funFactElement.style.opacity = '1';
        }, 300); // Ускоряем анимацию
    }, 3000);
    
    // Функция для отслеживания загрузки ресурсов
    function trackResourceLoading() {
        if (window.performance && window.performance.getEntriesByType) {
            const resources = window.performance.getEntriesByType("resource");
            window.resourceLoadingComplete = resources.length > 0 && 
                resources.filter(r => r.responseEnd > 0).length === resources.length;
            
            if (window.resourceLoadingComplete) {
                const event = new Event('resourcesLoaded');
                window.dispatchEvent(event);
            }
        }
    }
    
    // Вызываем функцию сразу и через интервал
    trackResourceLoading();
    const trackingInterval = setInterval(trackResourceLoading, 300);
    
    // Ждем загрузки всех ресурсов и минимального времени
    Promise.all([
        new Promise(function(resolve) {
            if (window.resourceLoadingComplete) {
                resolve();
            } else {
                window.addEventListener('resourcesLoaded', resolve, { once: true });
            }
        }),
        new Promise(function(resolve) { setTimeout(resolve, additionalDelay); })
    ])
    .then(function() {
        // Остановка интервала отслеживания
        clearInterval(trackingInterval);
        
        // Используем requestAnimationFrame для плавной анимации
        requestAnimationFrame(function() {
            // Добавляем анимацию исчезновения прелоадера
            preloader.classList.remove('fadeInSpin');
            preloader.classList.add('fadeOutSpin');
            preloader.style.animation = 'fadeOutSpin 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards';
            preloader.style.opacity = '0';
            preloader.style.transform = 'scale(1.1)';
            
            // Останавливаем интервал фактов
            clearInterval(factInterval);
            
            // Ждем завершения анимации
            setTimeout(function() {
                // Скрипт для нового прелоадера

class Preloader {
    constructor() {
        this.resources = [
            'css/styles.css',
            'css/preloader.css',
            'css/auth.css',
            'css/background.css',
            'css/instruction.css',
            'css/settings.css',
            'css/stats.css',
            'js/supabase-config.js',
            'js/auth.js',
            'js/main.js',
            'js/utils.js',
            'js/settings.js'
        ];
        
        this.funFacts = [
            'Регулярные обновления пароля повышают безопасность учетной записи на 60%',
            'В среднем ученику требуется 10 000 часов практики, чтобы стать экспертом',
            'SkillCoins можно использовать для покупки дополнительных материалов и уроков',
            'В 2025 году самыми востребованными навыками являются: ИИ, кибербезопасность и анализ данных',
            '70% студентов лучше усваивают материал с помощью интерактивных заданий',
            'Среднее время концентрации внимания составляет всего 20 минут. Делайте перерывы!'
        ];
        
        this.loadedCount = 0;
        this.totalCount = this.resources.length;
        this.progressMessages = [
            'Подготовка к загрузке...',
            'Загрузка компонентов...',
            'Настройка интерфейса...',
            'Почти готово, немного подождите...'
        ];
        
        this.errorRate = 0.2; // 20% шанс ошибки для имитации
        
        this.init();
    }
    
    init() {
        this.displayFunFact();
        this.updateResourceCount();
        this.simulateLoading();
    }
    
    displayFunFact() {
        const funFactElement = document.getElementById('funFact');
        const randomFact = this.funFacts[Math.floor(Math.random() * this.funFacts.length)];
        funFactElement.innerText = randomFact;
    }
    
    updateResourceCount() {
        document.getElementById('loadedCount').innerText = this.loadedCount;
        document.getElementById('totalCount').innerText = this.totalCount;
    }
    
    simulateLoading() {
        // Очищаем список ресурсов
        const resourcesContainer = document.querySelector('.loading-resources');
        resourcesContainer.innerHTML = '';
        
        // Добавляем несколько ресурсов в список
        const resourcesToShow = this.resources.slice(0, 4); // Показываем только 4 ресурса
        
        resourcesToShow.forEach(resource => {
            const resourceItem = document.createElement('div');
            resourceItem.className = 'resource-item';
            resourceItem.dataset.resource = resource;
            
            const resourceName = document.createElement('span');
            resourceName.className = 'resource-name';
            resourceName.innerText = resource;
            
            const resourceStatus = document.createElement('span');
            resourceStatus.className = 'resource-status';
            
            // Случайным образом добавляем ошибки для реалистичности
            if (Math.random() < this.errorRate) {
                resourceStatus.className = 'resource-status error';
                resourceStatus.innerText = 'resource.includes is not a function';
            } else {
                resourceStatus.innerText = 'Загружается...';
            }
            
            resourceItem.appendChild(resourceName);
            resourceItem.appendChild(resourceStatus);
            resourcesContainer.appendChild(resourceItem);
        });
        
        // Имитируем постепенную загрузку
        this.loadResources();
    }
    
    loadResources() {
        // Случайное время загрузки для реалистичности
        const totalLoadTime = 5000; // 5 секунд на всю загрузку
        const resourcesInterval = totalLoadTime / this.totalCount;
        
        let currentIndex = 0;
        const loadingInterval = setInterval(() => {
            if (currentIndex >= this.totalCount) {
                clearInterval(loadingInterval);
                this.finishLoading();
                return;
            }
            
            this.loadedCount++;
            this.updateResourceCount();
            
            // Обновляем сообщение о прогрессе
            const progressIndex = Math.floor((this.loadedCount / this.totalCount) * this.progressMessages.length);
            const progressMessage = this.progressMessages[Math.min(progressIndex, this.progressMessages.length - 1)];
            document.getElementById('loadingProgressMessage').innerText = progressMessage;
            
            currentIndex++;
        }, resourcesInterval);
    }
    
    finishLoading() {
        setTimeout(() => {
            const preloader = document.getElementById('sitePreloader');
            preloader.classList.add('preloader-exit');
            
            setTimeout(() => {
                preloader.style.display = 'none';
                // Здесь можно добавить код для показа авторизации
                document.getElementById('authContainer').classList.remove('hidden');
                document.getElementById('authContainer').classList.add('auth-animation-entry');
            }, 500);
        }, 1000);
    }
}

// Инициализация прелоадера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Показываем содержимое прелоадера
    setTimeout(() => {
        document.getElementById('loadingContent').classList.add('show');
        new Preloader();
    }, 500);
});
                preloader.style.display = 'none';
                
                // Простая анимация появления блока авторизации без смещений
                const authContainer = document.getElementById('authContainer');
                if (authContainer) {
                    // Полностью скрываем блок авторизации
                    authContainer.style.display = 'none';
                    
                    
                    // Показываем с задержкой
                    setTimeout(() => {
                        // Сначала сбрасываем стили и устанавливаем начальное состояние
                        authContainer.style.opacity = '0';
                        authContainer.style.transform = 'scale(0.95)';
                        authContainer.style.transition = 'none';
                        
                        // Показываем блок
                        authContainer.style.display = 'block';
                        
                        // Даем браузеру время на отрисовку
                        setTimeout(() => {
                            // Плавно показываем блок без смещений
                            authContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            authContainer.style.opacity = '1';
                            authContainer.style.transform = 'scale(1)';
                        }, 50);
                    }, 300);
                }
                
                // Очищаем ресурсы
                setTimeout(function() {
                    factInterval = null;
                    if (preloader.parentNode) {
                        preloader.innerHTML = '';
                    }
                }, 500);
            }, 500);
        });
    });
});

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
                // Скрываем прелоадер
                preloader.style.display = 'none';
                
                // Добавляем анимацию появления авторизации
                const authContainer = document.getElementById('authContainer');
                if (authContainer) {
                    // Подготавливаем элемент
                    authContainer.style.transition = 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
                    authContainer.style.opacity = '0';
                    authContainer.style.transform = 'scale(0.95) rotate(-5deg)';
                    
                    // Применяем анимацию появления
                    requestAnimationFrame(function() {
                        authContainer.style.opacity = '1';
                        authContainer.style.transform = 'scale(1) rotate(0deg)';
                    });
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

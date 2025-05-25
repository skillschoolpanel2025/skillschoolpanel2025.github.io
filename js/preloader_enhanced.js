// Расширенный функционал прелоадера с поддержкой кнопок и дополнительных состояний
class EnhancedPreloader {
    constructor() {
        this.preloader = document.getElementById('sitePreloader');
        this.authContainer = document.getElementById('authContainer');
        this.mainContainer = document.getElementById('mainContainer');
        this.loadingContent = document.getElementById('loadingContent');
        
        // Сохраняем ссылки на кнопки авторизации
        this.authSubmitButton = document.querySelector('#authForm button[type="submit"]');
        this.googleAuthButton = document.getElementById('googleAuthBtn');
        
        this.initialize();
    }
    
    initialize() {
        // Не скрываем кнопки, чтобы они были видны после загрузки
        
        // Обработчик событий для показа кнопок после загрузки
        window.addEventListener('preloaderComplete', () => {
            // Показываем кнопки авторизации
            if (this.authSubmitButton) {
                this.authSubmitButton.style.display = 'block';
            }
            
            if (this.googleAuthButton) {
                this.googleAuthButton.style.display = 'block';
            }
        });
    }
    
    // Показывает кнопки авторизации с анимацией
    showAuthButtons() {
        if (this.authSubmitButton) {
            setTimeout(() => {
                this.authSubmitButton.style.display = 'flex';
                this.authSubmitButton.style.opacity = '0';
                setTimeout(() => {
                    this.authSubmitButton.style.transition = 'opacity 0.5s ease';
                    this.authSubmitButton.style.opacity = '1';
                }, 100);
            }, 300);
        }
        
        if (this.googleAuthButton) {
            setTimeout(() => {
                this.googleAuthButton.style.display = 'flex';
                this.googleAuthButton.style.opacity = '0';
                setTimeout(() => {
                    this.googleAuthButton.style.transition = 'opacity 0.5s ease';
                    this.googleAuthButton.style.opacity = '1';
                }, 100);
            }, 600); // Задержка для последовательного появления
        }
    }
    
    // Показывает прелоадер с анимацией
    showPreloader() {
        if (this.preloader) {
            this.preloader.style.display = 'flex';
            this.preloader.style.opacity = '0';
            
            // Даем время для отрисовки DOM
            setTimeout(() => {
                this.preloader.classList.add('fadeInSpin');
                this.preloader.style.opacity = '1';
                
                if (this.loadingContent) {
                    this.loadingContent.classList.add('show');
                }
            }, 50);
        }
    }
    
    // Скрывает прелоадер с анимацией
    hidePreloader(delay = 500) {
        if (this.preloader) {
            setTimeout(() => {
                this.preloader.classList.remove('fadeInSpin');
                this.preloader.classList.add('fadeOutSpin');
                this.preloader.style.opacity = '0';
                
                setTimeout(() => {
                    this.preloader.style.display = 'none';
                    this.preloader.classList.remove('fadeOutSpin');
                    
                    // Создаем событие о завершении прелоадера
                    const event = new Event('preloaderComplete');
                    window.dispatchEvent(event);
                }, 500);
            }, delay);
        }
    }
    
    // Показывает прелоадер после авторизации
    showPostAuthPreloader() {
        if (this.preloader) {
            // Скрываем форму авторизации
            if (this.authContainer) {
                this.authContainer.style.display = 'none';
            }
            
            // Показываем прелоадер
            this.showPreloader();
            
            // Меняем текст загрузки, если есть
            const preloaderText = document.querySelector('.preloader-text');
            if (preloaderText) {
                preloaderText.textContent = 'Загрузка панели администратора...';
            }
            
            // Добавляем новый факт о загрузке
            const funFact = document.getElementById('funFact');
            if (funFact) {
                funFact.textContent = 'Подготовка данных панели управления...';
            }
        }
    }
    
    // Скрывает прелоадер и показывает главный контейнер
    hidePreloaderAndShowMain(delay = 1500) {
        if (this.preloader && this.mainContainer) {
            // Подготавливаем главный контейнер
            this.mainContainer.classList.remove('hidden');
            this.mainContainer.style.opacity = '0';
            
            // Скрываем прелоадер с задержкой
            this.hidePreloader(delay);
            
            // Плавно показываем главный контейнер
            setTimeout(() => {
                this.mainContainer.style.transition = 'opacity 0.8s ease';
                this.mainContainer.style.opacity = '1';
            }, delay + 300);
        }
    }
}

// Инициализация усовершенствованного прелоадера
document.addEventListener('DOMContentLoaded', function() {
    window.enhancedPreloader = new EnhancedPreloader();
    
    // Интегрируем с существующим прелоадером
    window.addEventListener('load', function() {
        // Оригинальный код прелоадера скроет его через установленное время
        // Мы только добавляем показ кнопок авторизации после этого
        
        // Устанавливаем куки для отслеживания сессий
        if (typeof CookieUtils !== 'undefined') {
            const sessionCheck = {
                timestamp: new Date().getTime(),
                visited: true
            };
            CookieUtils.setCookie('skillschoolVisit', JSON.stringify(sessionCheck), 7);
        }
    });
});

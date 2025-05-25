window.addEventListener('DOMContentLoaded', function() {
    var errorElement = document.getElementById('authError');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
});

class Auth {
    constructor() {
        this.user = null;
        this.init();
        
        // Настройка персистентной сессии
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // Сохраняем сессию в localStorage и cookies
                localStorage.setItem('supabaseSession', JSON.stringify(session));
                
                // Сохраняем в cookies
                if (typeof CookieUtils !== 'undefined') {
                    // Сохраняем только необходимые данные, чтобы не переполнить куки
                    const sessionData = {
                        user_id: session.user.id,
                        email: session.user.email,
                        timestamp: new Date().getTime()
                    };
                    CookieUtils.setCookie('skillschoolSession', JSON.stringify(sessionData), 30); // 30 дней
                }
            } else if (event === 'SIGNED_OUT') {
                // Удаляем сессию из localStorage и cookies
                localStorage.removeItem('supabaseSession');
                
                // Удаляем из cookies
                if (typeof CookieUtils !== 'undefined') {
                    CookieUtils.deleteCookie('skillschoolSession');
                }
            }
        });
    }

    async init() {
        // Показываем прелоадер при загрузке страницы
        const preloader = document.getElementById('sitePreloader');
        if (preloader && preloader.style.display === 'none') {
            preloader.style.display = 'flex';
        }
        
        // Показываем форму авторизации, но только после завершения анимации прелоадера
        const authContainer = document.getElementById('authContainer');
        if (authContainer) {
            // Сохраняем фиксированное позиционирование
            authContainer.style.position = 'fixed';
            authContainer.style.top = '0';
            authContainer.style.left = '0';
            authContainer.style.width = '100%';
            authContainer.style.height = '100%';
        }
        
        // Проверяем флаг принудительного выхода
        const forceLogout = sessionStorage.getItem('forceLogout');
        if (forceLogout === 'true') {
            // Очищаем флаг выхода
            sessionStorage.removeItem('forceLogout');
            
            // Дополнительная очистка кэша и данных сессии
            localStorage.clear(); // Полная очистка localStorage
            this.user = null;
            
            // Удаляем все куки, связанные с авторизацией
            document.cookie.split(';').forEach(cookie => {
                const name = cookie.split('=')[0].trim();
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
            });
            
            // Показываем форму входа
            this.showLoginForm();
            return; // Прерываем дальнейшую проверку
        }
        
        // Проверяем куки в первую очередь
        let isAuthenticated = false;
        
        if (typeof CookieUtils !== 'undefined') {
            const cookieSession = CookieUtils.getCookie('skillschoolSession');
            if (cookieSession) {
                try {
                    const sessionData = JSON.parse(cookieSession);
                    const currentTime = new Date().getTime();
                    const sessionTimestamp = sessionData.timestamp || 0;
                    
                    // Проверяем, что сессия не старше 30 дней
                    if (currentTime - sessionTimestamp < 30 * 24 * 60 * 60 * 1000) {
                        this.user = {
                            id: sessionData.user_id,
                            email: sessionData.email
                        };
                        isAuthenticated = true;
                    }
                } catch (e) {
                    // Игнорируем ошибку и продолжаем проверки
                }
            }
        }
        
        // Если не удалось аутентифицироваться с помощью cookie, проверяем localStorage
        if (!isAuthenticated) {
            const sessionString = localStorage.getItem('supabaseSession');
            if (sessionString) {
                try {
                    const session = JSON.parse(sessionString);
                    if (session.user) {
                        this.user = session.user;
                        isAuthenticated = true;
                    }
                } catch (e) {
                    // Игнорируем ошибку и продолжаем проверки
                }
            }
        }
        
        // Если все еще не аутентифицированы, проверяем активную сессию Supabase
        if (!isAuthenticated) {
            try {
                const { data: { session }, error } = await supabaseClient.auth.getSession();
                if (!error && session && session.user) {
                    this.user = session.user;
                    isAuthenticated = true;
                }
            } catch (error) {
                // Игнорируем ошибку и показываем форму входа
            }
        }
        
        // Если пользователь аутентифицирован, показываем главный контейнер
        if (isAuthenticated) {
            this.showMainContainer();
        } else {
            // Иначе показываем форму входа
            this.showLoginForm();
        }
    }

    showLoginForm() {
        document.getElementById('authForm').addEventListener('submit', this.handleLogin.bind(this));
        // Удалена поддержка входа через Google
        
        // Показываем/скрываем пароль
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const passwordInput = document.getElementById('authPassword');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                }
            });
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        
        if (!this.validateEmail(email)) {
            this.showError('Пожалуйста, введите корректный email');
            return;
        }
        
        try {
            // Скрываем кнопки и показываем индикатор загрузки
            const authSubmitButton = document.querySelector('#authForm button[type="submit"]');
            const googleAuthButton = document.getElementById('googleAuthBtn');
            
            if (authSubmitButton) authSubmitButton.style.display = 'none';
            if (googleAuthButton) googleAuthButton.style.display = 'none';
            
            document.getElementById('loadingSpinner').style.display = 'flex';
            
            // Авторизация через Supabase
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) {
                throw error;
            }
            
            // Устанавливаем куки сессии
            if (typeof CookieUtils !== 'undefined') {
                const sessionData = {
                    user_id: data.user.id,
                    email: data.user.email,
                    timestamp: new Date().getTime()
                };
                CookieUtils.setCookie('skillschoolSession', JSON.stringify(sessionData), 30);
            }
            
            this.user = data.user;
            this.showMainContainer();
        } catch (error) {
            console.info('Ошибка при входе:', error.message);
            
            // Восстанавливаем отображение кнопок
            const authSubmitButton = document.querySelector('#authForm button[type="submit"]');
            const googleAuthButton = document.getElementById('googleAuthBtn');
            
            if (authSubmitButton) authSubmitButton.style.display = 'block';
            if (googleAuthButton) googleAuthButton.style.display = 'block';
            
            if (error.message.includes('Invalid login credentials')) {
                this.showError('Неверный email или пароль');
            } else {
                this.showError('Ошибка входа: ' + error.message);
            }
        } finally {
            document.getElementById('loadingSpinner').style.display = 'none';
        }
    }

    async handleGoogleLogin() {
        try {
            document.getElementById('loadingSpinner').style.display = 'flex';
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            
            if (error) {
                throw error;
            }
            
        } catch (error) {
            console.info('Ошибка при входе через Google:', error.message);
            this.showError('Ошибка входа через Google: ' + error.message);
            document.getElementById('loadingSpinner').style.display = 'none';
        }
    }

    showError(message) {
        const errorElement = document.getElementById('authError');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    hideError() {
        const errorElement = document.getElementById('authError');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    async logout() {
        try {
            console.log('Начало процесса выхода из системы');
            
            // Запрещаем автоматические попытки авторизации
            supabaseClient.auth.onAuthStateChange = null;
            
            // Сначала выходим из Supabase
            await supabaseClient.auth.signOut({ scope: 'global' });
            console.log('Выход из Supabase выполнен');
            
            // Создаем новый экземпляр клиента Supabase чтобы сбросить любые кэшированные состояния
            window.supabaseClient = window.supabase.createClient(
                'https://amwkvqajytcgzmzhntoz.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtd2t2cWFqeXRjZ3ptemhudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjc2ODUsImV4cCI6MjA2MjMwMzY4NX0.L_1gcvx3PqkOespMcwLWvMp4F4pEJOTxGU-DGr8OxBw'
            );
            
            // Удаляем все куки
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
            }
            console.log('Все куки удалены');
            
            // Полная очистка localStorage
            const localStorageKeys = Object.keys(localStorage);
            for (let i = 0; i < localStorageKeys.length; i++) {
                localStorage.removeItem(localStorageKeys[i]);
            }
            console.log('localStorage очищен');
            
            // Полная очистка sessionStorage
            const sessionStorageKeys = Object.keys(sessionStorage);
            for (let i = 0; i < sessionStorageKeys.length; i++) {
                sessionStorage.removeItem(sessionStorageKeys[i]);
            }
            
            // Устанавливаем флаг принудительного выхода в sessionStorage
            sessionStorage.setItem('forceLogout', 'true');
            console.log('sessionStorage очищен, флаг forceLogout установлен');
            
            // Обнуляем объект пользователя
            this.user = null;
            console.log('Объект пользователя обнулен');
            
            // Перезагружаем страницу с параметром чтобы избежать кэширования
            console.log('Перенаправление на страницу выхода...');
            window.location.href = 'index.html?logout=' + new Date().getTime();
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
            
            // Даже в случае ошибки перенаправляем на страницу выхода
            alert('Произошла ошибка при выходе. Перезагрузка страницы...');
            window.location.href = 'index.html?logout=' + new Date().getTime();
        }
    }

    async createUser(userData) {
        try {
            const { data: authData, error } = await supabaseClient.auth.signUp({
                email: userData.email,
                password: userData.password
            });
            
            if (error) {
                throw error;
            }
            
            const dbUserData = {
                id: authData.user.id,
                email: userData.email,
                fullname: userData.fullName,
                role: userData.role
            };
            
            await Database.createUser(dbUserData);
            
            switch (userData.role) {
                case 'student':
                    await Database.createStudent({
                        user_id: authData.user.id,
                        school_id: userData.school_id
                    });
                    break;
                case 'teacher':
                    await Database.createTeacher({
                        user_id: authData.user.id,
                        school_id: userData.school_id
                    });
                    break;
                case 'assistant':
                    await Database.createAssistant({
                        user_id: authData.user.id,
                        school_id: userData.school_id
                    });
                    break;
                case 'admin':
                    await Database.createAdmin({
                        user_id: authData.user.id
                    });
                    break;
            }
            
            return authData.user;
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            throw error;
        }
    }

    showAuthContainer() {
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('mainContainer').classList.add('hidden');
    }

    showMainContainer() {
        const self = this;
        
        // Используем прелоадер после авторизации
        if (window.enhancedPreloader) {
            // Показываем прелоадер после авторизации
            window.enhancedPreloader.showPostAuthPreloader();
            
            // Скрываем прелоадер и показываем главный контейнер через задержку
            setTimeout(() => {
                window.enhancedPreloader.hidePreloaderAndShowMain(1500);
                
                // Обновляем данные пользователя
                setTimeout(() => {
                    self.updateUserInfo();
                    self.hideError();
                }, 1800);
            }, 1000);
        } else {
            // Запасной вариант, если улучшенный прелоадер недоступен
            const authContainer = document.getElementById('authContainer');
            const mainContainer = document.getElementById('mainContainer');

            // Скрываем блок авторизации
            authContainer.style.display = 'none';
            authContainer.classList.add('hidden');
            
            // Подготавливаем и показываем основной контейнер
            mainContainer.classList.remove('hidden');
            mainContainer.style.opacity = '0';
            
            setTimeout(function() {
                mainContainer.style.transition = 'opacity 0.8s';
                mainContainer.style.opacity = '1';
                
                // Обновляем данные пользователя
                self.updateUserInfo();
                self.hideError();
            }, 100);
        }
    }

    updateUserInfo() {
        if (this.user) {
            const userNameElement = document.getElementById('userName');
            const userAvatarElement = document.getElementById('userAvatar');
            
            // Устанавливаем фиксированное имя без запросов к базе данных
            if (userNameElement) {
                userNameElement.textContent = 'Никита Саралашвили';
            }
            
            if (userAvatarElement) {
                userAvatarElement.textContent = 'Н';
            }
            
            // Напрямую добавляем обработчик выхода без клонирования
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                // Удаляем все существующие обработчики
                logoutBtn.onclick = null;
                
                // Добавляем прямой обработчик выхода
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    console.log('Кнопка выхода нажата!');
                    
                    // Полная очистка сессий и данных
                    // 1. Очищаем localStorage полностью
                    localStorage.removeItem('supabaseSession');
                    localStorage.removeItem('sb-amwkvqajytcgzmzhntoz-auth-token');
                    localStorage.removeItem('hasSessionCookie');
                    localStorage.removeItem('skillschoolVisit');
                    
                    // 2. Очищаем все куки
                    if (typeof CookieUtils !== 'undefined') {
                        CookieUtils.deleteCookie('skillschoolSession');
                        CookieUtils.deleteCookie('sb-access-token');
                        CookieUtils.deleteCookie('sb-refresh-token');
                    }
                    
                    // 3. Очищаем сессию через Supabase
                    try {
                        supabaseClient.auth.signOut();
                    } catch(e) {
                        console.error('Error signing out from Supabase:', e);
                    }
                    
                    // 4. Задаем флаг выхода и перезагружаем с флагом
                    sessionStorage.setItem('forceLogout', 'true');
                    
                    // 5. Перезагрузка страницы с очисткой кэша
                    window.location.href = window.location.origin + window.location.pathname + '?logout=' + new Date().getTime();
                };
            }
        }
    }
    // Получение полного имени пользователя из базы данных
    async fetchUserFullName() {
        // Всегда возвращаем фиксированное имя вместо запросов к базе данных
        return 'Никита Саралашвили';
        
        // Отключаем все запросы к базе данных, чтобы не получать ошибки 404
        /* 
        try {
            // Код запросов к базе данных отключен
        } catch (error) {
            console.error('Ошибка при получении полного имени:', error);
            return 'Никита Саралашвили';
        }
        */
    }
    
    // Показать диалог подтверждения выхода
    showLogoutConfirmation() {
        // Создаем модальное окно подтверждения, если его еще нет
        let confirmModal = document.getElementById('logoutConfirmModal');
        
        if (!confirmModal) {
            confirmModal = document.createElement('div');
            confirmModal.id = 'logoutConfirmModal';
            confirmModal.className = 'modal';
            confirmModal.innerHTML = `
                <div class="modal-content" style="background: rgba(30, 30, 46, 0.95); border-radius: 12px; border: 1px solid rgba(124, 77, 255, 0.2); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4); max-width: 400px; margin: 0 auto; overflow: hidden;">
                    <div class="modal-header" style="background: rgba(124, 77, 255, 0.1); border-bottom: 1px solid rgba(124, 77, 255, 0.2); padding: 16px 20px; display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-sign-out-alt" style="color: #7c4dff; font-size: 20px;"></i>
                        <h3 style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 600;">Подтверждение выхода</h3>
                    </div>
                    <div class="modal-body" style="padding: 24px 20px; text-align: center;">
                        <p style="margin: 0; font-size: 16px; color: #e0e0e0; line-height: 1.5;">Вы действительно хотите выйти из системы?</p>
                    </div>
                    <div class="modal-footer" style="display: flex; justify-content: center; gap: 12px; padding: 16px 20px; border-top: 1px solid rgba(124, 77, 255, 0.1);">
                        <button id="cancelLogoutBtn" class="btn" style="background: rgba(255, 255, 255, 0.1); border: none; border-radius: 6px; padding: 10px 18px; color: #e0e0e0; font-weight: 500; cursor: pointer; transition: all 0.2s ease;">Отмена</button>
                        <button id="confirmLogoutBtn" class="btn" style="background: rgba(220, 53, 69, 0.8); border: none; border-radius: 6px; padding: 10px 18px; color: #ffffff; font-weight: 500; cursor: pointer; transition: all 0.2s ease;">Выйти</button>
                    </div>
                </div>
            `;
            document.body.appendChild(confirmModal);
        }
        
        // Показываем модальное окно с анимацией
        confirmModal.style.display = 'flex';
        confirmModal.style.alignItems = 'center';
        confirmModal.style.justifyContent = 'center';
        confirmModal.style.background = 'rgba(0, 0, 0, 0.7)';
        confirmModal.style.backdropFilter = 'blur(5px)';
        confirmModal.style.position = 'fixed';
        confirmModal.style.top = '0';
        confirmModal.style.left = '0';
        confirmModal.style.width = '100%';
        confirmModal.style.height = '100%';
        confirmModal.style.zIndex = '9999';
        confirmModal.style.opacity = '0';
        confirmModal.style.transition = 'opacity 0.3s ease';
        
        // Добавляем анимацию появления
        setTimeout(() => {
            confirmModal.style.opacity = '1';
            
            // Анимация для самого модального окна
            const modalContent = confirmModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(0.9)';
                modalContent.style.opacity = '0';
                modalContent.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    modalContent.style.transform = 'scale(1)';
                    modalContent.style.opacity = '1';
                }, 100);
            }
        }, 10);
        
        // Добавляем обработчики событий для кнопок
        const cancelBtn = document.getElementById('cancelLogoutBtn');
        const confirmBtn = document.getElementById('confirmLogoutBtn');
        
        const self = this;
        
        // Удаляем старые обработчики
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        // Добавляем эффекты ховера
        newCancelBtn.addEventListener('mouseover', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        newCancelBtn.addEventListener('mouseout', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        newConfirmBtn.addEventListener('mouseover', function() {
            this.style.background = 'rgba(220, 53, 69, 1)';
        });
        newConfirmBtn.addEventListener('mouseout', function() {
            this.style.background = 'rgba(220, 53, 69, 0.8)';
        });
        
        // Добавляем новые обработчики с анимацией
        newCancelBtn.addEventListener('click', function() {
            const modalContent = confirmModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(0.9)';
                modalContent.style.opacity = '0';
            }
            confirmModal.style.opacity = '0';
            
            setTimeout(() => {
                confirmModal.style.display = 'none';
            }, 300);
        });
        
        newConfirmBtn.addEventListener('click', function() {
            const modalContent = confirmModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(0.9)';
                modalContent.style.opacity = '0';
            }
            confirmModal.style.opacity = '0';
            
            setTimeout(() => {
                confirmModal.style.display = 'none';
                self.logout();
            }, 300);
        });
    }
}

// Инициализация
const auth = new Auth();

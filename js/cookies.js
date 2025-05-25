// Утилиты для работы с куками
const CookieUtils = {
    // Установка куки с опциями (срок жизни в днях)
    setCookie: function(name, value, days = 30) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Strict";
        // Запись в куки выполнена
    },
    
    // Получение значения куки по имени
    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    },
    
    // Удаление куки
    deleteCookie: function(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Strict';
        // Кука удалена
    }
};

// Автоматически проверяем сохраненную сессию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем наличие сохраненной сессии в куках
    const savedSession = CookieUtils.getCookie('skillschoolSession');
    
    if (savedSession) {
        try {
            // Найдена сохраненная сессия в cookies
            
            // Если есть сохраненные данные сессии, попробуем восстановить
            // Это обрабатывается в auth.js, просто добавим флаг
            window.hasSessionCookie = true;
        } catch (e) {
            console.error('Ошибка при чтении сохраненной сессии из cookies:', e);
            CookieUtils.deleteCookie('skillschoolSession');
        }
    } else {
        // Сохраненная сессия не найдена в cookies
    }
});

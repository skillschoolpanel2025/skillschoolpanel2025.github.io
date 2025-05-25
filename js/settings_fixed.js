// JavaScript для настроек интерфейса
class SettingsManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('uiLanguage') || 'ru';
        this.currentTheme = localStorage.getItem('uiTheme') || 'default';
        this.currentFont = localStorage.getItem('uiFont') || 'default';
        this.currentFontSize = localStorage.getItem('uiFontSize') || '16';
        this.customFontData = localStorage.getItem('customFontData') || null;
        
        // Создаем элемент стиля для пользовательских шрифтов
        this.customStyleElement = document.createElement('style');
        document.head.appendChild(this.customStyleElement);
        
        // Загружаем встроенные шрифты
        this.loadBuiltInFonts();
        
        // Инициализируем настройки
        this.initSettings();
        
        // Инициализируем обработчики событий
        this.initEventListeners();
    }
    
    // Инициализация настроек при загрузке страницы
    initSettings() {
        console.log('Инициализация настроек...');
        
        // Проверка доступности элементов раздела настроек
        const settingsSection = document.getElementById('settingsSection');
        if (settingsSection) {
            console.log('Раздел настроек найден');
        } else {
            console.error('Раздел настроек не найден');
            return;
        }
        
        // Устанавливаем выбранный язык в селекторе
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            console.log('Язык установлен:', this.currentLanguage);
        } else {
            console.error('Элемент выбора языка не найден');
        }
        
        // Устанавливаем выбранную тему
        this.applyTheme(this.currentTheme);
        console.log('Тема применена:', this.currentTheme);
        
        // Устанавливаем выбранный шрифт
        const fontSelect = document.getElementById('fontSelect');
        if (fontSelect) {
            fontSelect.value = this.currentFont;
            console.log('Шрифт установлен:', this.currentFont);
        } else {
            console.error('Элемент выбора шрифта не найден');
        }
        
        // Устанавливаем размер шрифта
        const fontSizeRange = document.getElementById('fontSizeRange');
        const fontSizeValue = document.getElementById('fontSizeValue');
        if (fontSizeRange && fontSizeValue) {
            fontSizeRange.value = this.currentFontSize;
            fontSizeValue.textContent = `${this.currentFontSize}px`;
            console.log('Размер шрифта установлен:', this.currentFontSize);
        } else {
            console.error('Элементы выбора размера шрифта не найдены');
        }
        
        // Применяем настройки шрифта
        this.applyFont(this.currentFont, this.currentFontSize);
        
        // Если есть пользовательский шрифт, загружаем его
        if (this.customFontData) {
            this.applyCustomFont(this.customFontData);
            console.log('Пользовательский шрифт применен');
        }
        
        // Отмечаем активную тему
        this.highlightActiveTheme();
        
        console.log('Инициализация настроек завершена');
    }
    
    // Загрузка встроенных шрифтов
    loadBuiltInFonts() {
        // Вместо загрузки base64 шрифтов, используем ссылки на файлы
        // Определим шрифты через @font-face
        const gropledFont = `
        @font-face {
            font-family: 'Gropled';
            src: url('../fonts/Gropled.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
        }`;
        
        const benzinFont = `
        @font-face {
            font-family: 'Benzin';
            src: url('../fonts/benzin-bold.otf') format('opentype');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
        }`;
        
        // Добавляем шрифты в стили
        this.customStyleElement.innerHTML += gropledFont + benzinFont;
        
        console.log('Шрифты загружены');
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        console.log('Инициализация обработчиков событий...');
        
        // Добавляем обработчик для отображения раздела настроек
        const settingsLink = document.querySelector('.nav-link[data-section="settings"]');
        if (settingsLink) {
            console.log('Найдена ссылка на раздел настроек');
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Скрываем все разделы
                document.querySelectorAll('main .content > div').forEach(section => {
                    section.classList.add('hidden');
                });
                
                // Отображаем раздел настроек
                const settingsSection = document.getElementById('settingsSection');
                if (settingsSection) {
                    settingsSection.classList.remove('hidden');
                    console.log('Раздел настроек отображен');
                    
                    // Активируем ссылку в меню
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    settingsLink.classList.add('active');
                    
                    // Обновляем заголовок страницы
                    const contentTitle = document.querySelector('.content-header .content-title');
                    if (contentTitle) {
                        contentTitle.textContent = 'Настройки интерфейса';
                    }
                } else {
                    console.error('Раздел настроек не найден');
                }
            });
        } else {
            console.error('Ссылка на раздел настроек не найдена');
        }
        
        // Обработчик кнопки сброса настроек
        const resetSettingsBtn = document.getElementById('resetSettingsBtn');
        if (resetSettingsBtn) {
            console.log('Найдена кнопка сброса настроек');
            resetSettingsBtn.addEventListener('click', () => {
                if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
                    // Сбрасываем все настройки
                    localStorage.removeItem('uiLanguage');
                    localStorage.removeItem('uiTheme');
                    localStorage.removeItem('uiFont');
                    localStorage.removeItem('uiFontSize');
                    localStorage.removeItem('customFontData');
                    
                    // Устанавливаем значения по умолчанию
                    this.currentLanguage = 'ru';
                    this.currentTheme = 'default';
                    this.currentFont = 'default';
                    this.currentFontSize = '16';
                    this.customFontData = null;
                    
                    // Обновляем интерфейс
                    this.initSettings();
                    
                    // Уведомляем пользователя
                    alert('Настройки успешно сброшены. Обновите страницу, чтобы изменения вступили в силу.');
                }
            });
        } else {
            console.error('Кнопка сброса настроек не найдена');
        }
        
        // Обработчик выбора языка
        const applyLanguageBtn = document.getElementById('applyLanguageBtn');
        if (applyLanguageBtn) {
            console.log('Кнопка применения языка найдена');
            applyLanguageBtn.addEventListener('click', () => {
                const languageSelect = document.getElementById('languageSelect');
                if (languageSelect) {
                    this.applyLanguage(languageSelect.value);
                }
            });
        } else {
            console.error('Кнопка применения языка не найдена');
        }
        
        // Обработчик выбора темы
        const themeCards = document.querySelectorAll('.theme-card');
        if (themeCards.length > 0) {
            console.log('Найдены карточки тем:', themeCards.length);
            themeCards.forEach(card => {
                card.addEventListener('click', () => {
                    const theme = card.dataset.theme;
                    this.applyTheme(theme);
                    this.highlightActiveTheme();
                });
            });
        } else {
            console.error('Карточки тем не найдены');
        }
        
        // Обработчик изменения размера шрифта
        const fontSizeRange = document.getElementById('fontSizeRange');
        const fontSizeValue = document.getElementById('fontSizeValue');
        if (fontSizeRange && fontSizeValue) {
            console.log('Найдены элементы управления размером шрифта');
            fontSizeRange.addEventListener('input', () => {
                const size = fontSizeRange.value;
                fontSizeValue.textContent = `${size}px`;
                this.updateFontPreview();
            });
        } else {
            console.error('Элементы управления размером шрифта не найдены');
        }
        
        // Обработчик изменения шрифта
        const fontSelect = document.getElementById('fontSelect');
        if (fontSelect) {
            console.log('Найден выбор шрифта');
            fontSelect.addEventListener('change', () => {
                this.updateFontPreview();
            });
        } else {
            console.error('Элемент выбора шрифта не найден');
        }
        
        // Обработчик загрузки пользовательского шрифта
        const customFontUpload = document.getElementById('customFontUpload');
        if (customFontUpload) {
            console.log('Найден элемент загрузки шрифта');
            customFontUpload.addEventListener('change', (event) => {
                this.handleFontUpload(event);
            });
        } else {
            console.error('Элемент загрузки шрифта не найден');
        }
        
        // Обработчик применения настроек шрифта
        const applyFontBtn = document.getElementById('applyFontBtn');
        if (applyFontBtn) {
            console.log('Найдена кнопка применения шрифта');
            applyFontBtn.addEventListener('click', () => {
                const fontSelect = document.getElementById('fontSelect');
                const fontSizeRange = document.getElementById('fontSizeRange');
                
                if (fontSelect && fontSizeRange) {
                    const font = fontSelect.value;
                    const size = fontSizeRange.value;
                    this.applyFont(font, size);
                    
                    alert('Настройки шрифта применены');
                }
            });
        } else {
            console.error('Кнопка применения шрифта не найдена');
        }
        
        console.log('Инициализация обработчиков завершена');
    }
    
    // Применение выбранного языка
    applyLanguage(language) {
        console.log('Применяем язык:', language);
        this.currentLanguage = language;
        localStorage.setItem('uiLanguage', language);
        
        // Словарь переводов
        const translations = {
            'ru': {
                'settings': 'Настройки интерфейса',
                'language': 'Язык интерфейса',
                'apply': 'Применить',
                'theme': 'Тема оформления',
                'default_theme': 'Стандартная',
                'dark_theme': 'Тёмная',
                'light_theme': 'Светлая',
                'font_settings': 'Настройки шрифтов',
                'select_font': 'Выберите шрифт:',
                'font_size': 'Размер шрифта',
                'upload_font': 'Загрузить свой шрифт:',
                'supported_formats': 'Поддерживаемые форматы: TTF, OTF, WOFF, WOFF2',
                'font_preview': 'Предпросмотр шрифта:',
                'apply_font': 'Применить настройки шрифта',
                'reset_settings': 'Сбросить настройки',
                'select_file': 'Выберите файл',
                'no_file': 'Файл не выбран'
            },
            'en': {
                'settings': 'Interface Settings',
                'language': 'Interface Language',
                'apply': 'Apply',
                'theme': 'Theme',
                'default_theme': 'Default',
                'dark_theme': 'Dark',
                'light_theme': 'Light',
                'font_settings': 'Font Settings',
                'select_font': 'Select Font:',
                'font_size': 'Font Size',
                'upload_font': 'Upload Custom Font:',
                'supported_formats': 'Supported formats: TTF, OTF, WOFF, WOFF2',
                'font_preview': 'Font Preview:',
                'apply_font': 'Apply Font Settings',
                'reset_settings': 'Reset Settings',
                'select_file': 'Select File',
                'no_file': 'No file selected'
            }
        };
        
        // Применяем переводы
        const currentTranslation = translations[language];
        
        // Обновляем тексты в разделе настроек
        document.querySelector('.content-title').textContent = currentTranslation.settings;
        document.querySelector('.settings-block:nth-child(1) h3').innerHTML = `<i class="fas fa-language"></i> ${currentTranslation.language}`;
        document.querySelector('#applyLanguageBtn').textContent = currentTranslation.apply;
        document.querySelector('.settings-block:nth-child(2) h3').innerHTML = `<i class="fas fa-palette"></i> ${currentTranslation.theme}`;
        document.querySelectorAll('.theme-card span')[0].textContent = currentTranslation.default_theme;
        document.querySelectorAll('.theme-card span')[1].textContent = currentTranslation.dark_theme;
        document.querySelectorAll('.theme-card span')[2].textContent = currentTranslation.light_theme;
        document.querySelector('.settings-block:nth-child(3) h3').innerHTML = `<i class="fas fa-font"></i> ${currentTranslation.font_settings}`;
        document.querySelectorAll('.settings-row label')[0].textContent = currentTranslation.select_font;
        document.querySelectorAll('.settings-row label')[1].textContent = currentTranslation.font_size;
        document.querySelectorAll('.settings-row label')[2].textContent = currentTranslation.upload_font;
        document.querySelector('.font-hint').textContent = currentTranslation.supported_formats;
        document.querySelectorAll('.settings-row label')[3].textContent = currentTranslation.font_preview;
        document.querySelector('#applyFontBtn').textContent = currentTranslation.apply_font;
        document.querySelector('#resetSettingsBtn').textContent = currentTranslation.reset_settings;
        
        // Сообщение об успешном применении
        alert(`Язык интерфейса изменен на: ${language === 'ru' ? 'Русский' : 'English'}`);
    }
    
    // Применение выбранной темы
    applyTheme(theme) {
        console.log('Применяем тему:', theme);
        this.currentTheme = theme;
        localStorage.setItem('uiTheme', theme);
        
        // Удаляем все классы темы с body
        document.body.classList.remove('theme-default', 'theme-dark', 'theme-light');
        
        // Добавляем новый класс темы
        document.body.classList.add(`theme-${theme}`);
        
        // Создаем стилевой элемент для темы, если его еще нет
        let themeStyle = document.getElementById('theme-style');
        if (!themeStyle) {
            themeStyle = document.createElement('style');
            themeStyle.id = 'theme-style';
            document.head.appendChild(themeStyle);
        }
        
        // Определяем CSS для каждой темы
        let themeCSS = '';
        
        switch (theme) {
            case 'dark':
                themeCSS = `
                    :root {
                        --bg-color: #121212;
                        --text-color: #ffffff;
                        --primary: #7c4dff;
                        --secondary: #5d37d1;
                        --card-bg: rgba(30, 30, 40, 0.6);
                        --border-color: rgba(255, 255, 255, 0.1);
                    }
                    body {
                        background-color: #121212;
                        color: #ffffff;
                    }
                    .theme-card.active {
                        border-color: #7c4dff;
                    }
                    .settings-block, .stats-card, .stats-chart-container {
                        background-color: rgba(30, 30, 40, 0.6);
                    }
                `;
                break;
                
            case 'light':
                themeCSS = `
                    :root {
                        --bg-color: #f5f5f5;
                        --text-color: #333333;
                        --primary: #7c4dff;
                        --secondary: #5d37d1;
                        --card-bg: #ffffff;
                        --border-color: rgba(0, 0, 0, 0.1);
                    }
                    body {
                        background-color: #f5f5f5;
                        color: #333333;
                    }
                    .theme-card.active {
                        border-color: #7c4dff;
                    }
                    .settings-block, .stats-card, .stats-chart-container {
                        background-color: #ffffff;
                        color: #333333;
                    }
                    .settings-block h3, .stats-card-label {
                        color: #555;
                    }
                    .content-title {
                        color: #333;
                    }
                `;
                break;
                
            default: // default theme
                themeCSS = `
                    :root {
                        --bg-color: #1e1e35;
                        --text-color: #ffffff;
                        --primary: #7c4dff;
                        --secondary: #5d37d1;
                        --card-bg: rgba(30, 30, 50, 0.6);
                        --border-color: rgba(255, 255, 255, 0.1);
                    }
                    body {
                        background-color: #1e1e35;
                        color: #ffffff;
                    }
                    .theme-card.active {
                        border-color: #7c4dff;
                    }
                    .settings-block, .stats-card, .stats-chart-container {
                        background-color: rgba(30, 30, 50, 0.6);
                    }
                `;
                break;
        }
        
        // Применяем CSS
        themeStyle.textContent = themeCSS;
        
        // Обновляем активную тему в интерфейсе
        this.highlightActiveTheme();
        
        console.log('Тема успешно применена:', theme);
    }
    
    // Подсветка активной темы
    highlightActiveTheme() {
        const themeCards = document.querySelectorAll('.theme-card');
        themeCards.forEach(card => {
            if (card.dataset.theme === this.currentTheme) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }
    
    // Обработка загрузки пользовательского шрифта
    handleFontUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const validTypes = ['font/ttf', 'font/otf', 'font/woff', 'font/woff2', 'application/x-font-ttf', 'application/x-font-otf', 'application/font-woff', 'application/font-woff2'];
        const fileType = file.type;
        
        // Проверяем расширение файла, если тип не соответствует
        const fileName = file.name.toLowerCase();
        const validExtension = [".ttf", ".otf", ".woff", ".woff2"].some(ext => fileName.endsWith(ext));
        
        if (!validTypes.includes(fileType) && !validExtension) {
            alert('Пожалуйста, загрузите шрифт в одном из поддерживаемых форматов: TTF, OTF, WOFF, WOFF2');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const fontData = e.target.result;
            
            // Сохраняем данные шрифта в localStorage для использования после перезагрузки
            localStorage.setItem('customFontData', fontData);
            this.customFontData = fontData;
            
            // Применяем шрифт
            this.applyCustomFont(fontData);
            
            // Автоматически выбираем "custom" в селекторе шрифтов
            const fontSelect = document.getElementById('fontSelect');
            if (fontSelect) {
                fontSelect.value = 'custom';
            }
            
            // Обновляем предпросмотр
            this.updateFontPreview();
        };
        
        reader.readAsDataURL(file);
    }
    
    // Применение пользовательского шрифта
    applyCustomFont(fontData) {
        // Генерируем случайное имя для шрифта, чтобы избежать конфликтов
        const fontName = `customFont_${new Date().getTime()}`;
        
        // Определяем шрифт через @font-face
        const fontFace = `
        @font-face {
            font-family: '${fontName}';
            src: url('${fontData}') format('woff2');
            font-weight: normal;
            font-style: normal;
        }`;
        
        // Добавляем стиль для пользовательского шрифта
        this.customStyleElement.innerHTML += fontFace;
        
        // Сохраняем имя шрифта для использования
        this.customFontName = fontName;
    }
    
    // Обновление предпросмотра шрифта
    updateFontPreview() {
        const fontSelect = document.getElementById('fontSelect');
        const fontSizeRange = document.getElementById('fontSizeRange');
        const previewText = document.getElementById('fontPreviewText');
        
        if (!fontSelect || !fontSizeRange || !previewText) return;
        
        const selectedFont = fontSelect.value;
        const fontSize = fontSizeRange.value;
        
        let fontFamily;
        switch (selectedFont) {
            case 'gropled':
                fontFamily = 'Gropled, sans-serif';
                break;
            case 'benzin':
                fontFamily = 'Benzin, sans-serif';
                break;
            case 'custom':
                fontFamily = this.customFontName ? `'${this.customFontName}', sans-serif` : 'Inter, sans-serif';
                break;
            default:
                fontFamily = 'Inter, sans-serif';
                break;
        }
        
        previewText.style.fontFamily = fontFamily;
        previewText.style.fontSize = `${fontSize}px`;
    }
    
    // Применение шрифта ко всему сайту
    applyFont(font, size) {
        this.currentFont = font;
        this.currentFontSize = size;
        
        localStorage.setItem('uiFont', font);
        localStorage.setItem('uiFontSize', size);
        
        let fontFamily;
        switch (font) {
            case 'gropled':
                fontFamily = 'Gropled, sans-serif';
                break;
            case 'benzin':
                fontFamily = 'Benzin, sans-serif';
                break;
            case 'custom':
                fontFamily = this.customFontName ? `'${this.customFontName}', sans-serif` : 'Inter, sans-serif';
                break;
            default:
                fontFamily = 'Inter, sans-serif';
                break;
        }
        
        // Применяем шрифт ко всему сайту через CSS переменные
        document.documentElement.style.setProperty('--font-family', fontFamily);
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
        
        // Применяем шрифт напрямую к body
        document.body.style.fontFamily = fontFamily;
        document.body.style.fontSize = `${size}px`;
        
        // Обновляем предпросмотр
        this.updateFontPreview();
        
        console.log('Шрифт применен:', font, size, fontFamily);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.settingsManager = new SettingsManager();
});

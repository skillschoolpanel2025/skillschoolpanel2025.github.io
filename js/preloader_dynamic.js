// Скрипт для динамического расчета времени загрузки
document.addEventListener('DOMContentLoaded', function() {
    // Элементы прогресс-бара
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    
    // Начальное время
    let startTime = performance.now();
    let estimatedTotalTime = 0;
    let loadProgress = 0;
    let interval;
    
    // Функция оценки размера ресурсов и времени загрузки
    function estimateLoadTime() {
        // Получаем все ресурсы
        const resources = performance.getEntriesByType('resource');
        
        if (resources.length === 0) {
            // Если ресурсы еще не начали загружаться, используем примерную оценку
            return 15; // 15 секунд по умолчанию
        }
        
        // Подсчитываем общий размер загруженных ресурсов и оценку оставшихся
        let totalSize = 0;
        let loadedSize = 0;
        let estimatedAdditionalResources = 5; // Примерная оценка дополнительных ресурсов
        
        resources.forEach(resource => {
            // Используем transferSize, если доступен, иначе оцениваем по типу ресурса
            const size = resource.transferSize || estimateResourceSize(resource.name);
            totalSize += size;
            
            if (resource.responseEnd > 0) {
                loadedSize += size;
            }
        });
        
        // Оцениваем общий размер с учетом возможных дополнительных ресурсов
        const estimatedTotalSize = totalSize * (1 + estimatedAdditionalResources / resources.length);
        
        // Вычисляем прогресс загрузки
        loadProgress = resources.length > 0 ? loadedSize / estimatedTotalSize : 0.05;
        
        // Обновляем прогресс-бар
        if (progressBar) {
            progressBar.style.width = `${loadProgress * 100}%`;
        }
        
        // Оцениваем общее время загрузки на основе текущего прогресса и прошедшего времени
        const elapsedTime = (performance.now() - startTime) / 1000;
        let totalTime = loadProgress > 0 ? elapsedTime / loadProgress : 15;
        
        // Ограничиваем максимальное время до разумных пределов
        totalTime = Math.min(totalTime, 60);
        
        return totalTime;
    }
    
    // Функция оценки размера ресурса по его типу
    function estimateResourceSize(url) {
        const ext = url.split('.').pop().toLowerCase();
        
        // Примерные размеры разных типов файлов (в байтах)
        switch(ext) {
            case 'js': return 50000;  // ~50KB для JS файлов
            case 'css': return 20000; // ~20KB для CSS файлов
            case 'png': return 100000; // ~100KB для PNG изображений
            case 'jpg':
            case 'jpeg': return 150000; // ~150KB для JPEG изображений
            case 'woff2': return 30000; // ~30KB для шрифтов
            default: return 30000; // ~30KB по умолчанию
        }
    }
    
    // Функция форматирования времени в mm:ss
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Обновление времени
    function updateTimer() {
        const elapsedTime = (performance.now() - startTime) / 1000;
        
        if (estimatedTotalTime === 0) {
            estimatedTotalTime = estimateLoadTime();
        } else {
            // Постепенно корректируем оценку времени
            const newEstimate = estimateLoadTime();
            estimatedTotalTime = estimatedTotalTime * 0.8 + newEstimate * 0.2;
        }
        
        // Форматируем и отображаем время
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(elapsedTime);
        }
        
        if (totalTimeEl) {
            totalTimeEl.textContent = formatTime(estimatedTotalTime);
        }
        
        // Анимируем вращение диска в зависимости от прогресса
        const musicDisc = document.querySelector('.music-disc');
        if (musicDisc) {
            // Регулируем скорость вращения в зависимости от прогресса загрузки
            const rotationSpeed = 1 + (loadProgress * 4); // от 1 до 5 оборотов в секунду
            musicDisc.style.animation = `spin ${1/rotationSpeed}s linear infinite`;
        }
        
        // Обновляем прогресс-бар (если элемент существует)
        if (progressBar) {
            progressBar.style.width = `${loadProgress * 100}%`;
        }
        
        // Проверяем завершение загрузки
        if (loadProgress >= 0.99) {
            clearInterval(interval);
            loadProgress = 1;
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }
    }
    
    // Запускаем таймер
    interval = setInterval(updateTimer, 500);
    
    // Останавливаем таймер при полной загрузке страницы
    window.addEventListener('load', function() {
        // Продолжаем еще немного для плавного завершения
        setTimeout(function() {
            clearInterval(interval);
            loadProgress = 1;
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }, 1000);
    });
});

// Скрипт для работы с инструкцией
document.addEventListener('DOMContentLoaded', function() {
    // Функция для скрытия кнопки инструкции только во время прелоадера
    function toggleInstructionButton() {
        const instructionBtn = document.getElementById('instructionBtn');
        const mainContainer = document.getElementById('mainContainer');
        const preloader = document.getElementById('sitePreloader');
        
        if (!instructionBtn) return;
        
        // Скрываем кнопку только если прелоадер виден
        if (preloader && (preloader.style.display !== 'none' && preloader.style.opacity !== '0')) {
            // Если прелоадер отображается, скрываем кнопку
            instructionBtn.style.display = 'none';
        } else {
            // Иначе показываем кнопку
            instructionBtn.style.display = 'flex';
        }
    }
    
    // Проверяем статус кнопки при загрузке страницы
    toggleInstructionButton();
    
    // Также проверяем статус после полной загрузки страницы
    window.addEventListener('load', toggleInstructionButton);
    
    // Наблюдаем за изменениями в DOM и обновляем статус кнопки
    const observer = new MutationObserver(toggleInstructionButton);
    
    // Начинаем наблюдение за изменениями в DOM, особенно за прелоадером
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    // Получаем кнопку инструкции и раздел инструкции
    const instructionBtn = document.getElementById('instructionBtn');
    const instructionSection = document.getElementById('instructionSection');
    
    // Все разделы в main.content
    const sections = document.querySelectorAll('main.content > div');
    
    // Флаг, показывающий открыта ли инструкция
    let isInstructionOpen = false;
    
    // Функция для показа инструкции с красивой анимацией
    function showInstruction() {
        // Добавляем анимацию кнопке
        instructionBtn.classList.add('instruction-active');
        
        // Скрываем все секции с анимацией
        sections.forEach(section => {
            if (!section.classList.contains('hidden')) {
                section.style.transition = 'opacity 0.3s, transform 0.3s';
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    section.classList.add('hidden');
                    section.style.opacity = '';
                    section.style.transform = '';
                }, 300);
            } else {
                section.classList.add('hidden');
            }
        });
        
        // Подготавливаем инструкцию к появлению
        instructionSection.style.opacity = '0';
        instructionSection.style.transform = 'translateY(20px)';
        instructionSection.classList.remove('hidden');
        
        // Плавно показываем инструкцию с анимацией
        setTimeout(() => {
            instructionSection.style.transition = 'opacity 0.5s, transform 0.5s';
            instructionSection.style.opacity = '1';
            instructionSection.style.transform = 'translateY(0)';
        }, 50);
        
        // Обновляем флаг
        isInstructionOpen = true;
        
        // Меняем иконку кнопки с анимацией
        instructionBtn.style.transition = 'transform 0.3s';
        instructionBtn.style.transform = 'rotate(90deg)';
        setTimeout(() => {
            instructionBtn.innerHTML = '<i class="fas fa-times"></i>';
            setTimeout(() => {
                instructionBtn.style.transform = 'rotate(0deg)';
            }, 50);
        }, 150);
        
        // Прокручиваем страницу вверх
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Функция для закрытия инструкции с красивой анимацией
    function hideInstruction() {
        // Убираем класс активности с кнопки
        instructionBtn.classList.remove('instruction-active');
        
        // Анимируем исчезновение инструкции
        instructionSection.style.transition = 'opacity 0.4s, transform 0.4s';
        instructionSection.style.opacity = '0';
        instructionSection.style.transform = 'translateY(-20px)';
        
        // Подготавливаем следующий раздел
        const activeSection = document.querySelector('.nav-link.active');
        const sectionToShow = activeSection ? activeSection.getAttribute('data-section') : 'users';
        const targetSection = document.getElementById(sectionToShow + 'Section') || 
                              document.getElementById('usersList');
        
        // После завершения анимации скрываем инструкцию и показываем раздел
        setTimeout(() => {
            // Скрываем инструкцию
            instructionSection.classList.add('hidden');
            instructionSection.style.opacity = '';
            instructionSection.style.transform = '';
            
            // Подготавливаем появление раздела
            if (targetSection) {
                targetSection.style.opacity = '0';
                targetSection.style.transform = 'translateY(20px)';
                targetSection.classList.remove('hidden');
                
                // Плавно показываем раздел
                setTimeout(() => {
                    targetSection.style.transition = 'opacity 0.4s, transform 0.4s';
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                }, 50);
            }
            
            // Обновляем флаг
            isInstructionOpen = false;
            
            // Анимируем смену иконки кнопки
            instructionBtn.style.transition = 'transform 0.3s';
            instructionBtn.style.transform = 'rotate(90deg)';
            setTimeout(() => {
                instructionBtn.innerHTML = '<i class="fas fa-question-circle"></i>';
                setTimeout(() => {
                    instructionBtn.style.transform = 'rotate(0deg)';
                }, 50);
            }, 150);
        }, 400);
    }
    
    // Обработчик клика по кнопке инструкции
    instructionBtn.addEventListener('click', function(event) {
        // Предотвращаем всплытие события, чтобы оно не дошло до document
        event.stopPropagation();
        
        if (isInstructionOpen) {
            hideInstruction();
        } else {
            showInstruction();
        }
    });
    
    // Добавляем обработчик клика по документу
    document.addEventListener('click', function(event) {
        // Игнорируем клики по самой кнопке инструкции и её потомкам
        if (instructionBtn.contains(event.target)) {
            return;
        }
        
        // Если инструкция открыта и клик был не на ней
        if (isInstructionOpen && !instructionSection.contains(event.target)) {
            hideInstruction();
        }
    });
    
    // Обработчик для кнопки закрытия инструкции
    const closeInstructionBtn = document.getElementById('closeInstructionBtn');
    if (closeInstructionBtn) {
        closeInstructionBtn.addEventListener('click', function() {
            hideInstruction();
        });
    }
    
    // Добавляем обработчик для ссылок в боковом меню,
    // чтобы скрывать инструкцию при переключении разделов
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (isInstructionOpen) {
                hideInstruction();
            }
        });
    });
});

class Main {
    constructor() {
        console.log('Main constructor called');
        this.schools = [];
        this.statsChart = null;
        this.tableData = null;
        this.currentTable = null;
        this.initPhoneInputs();
        this.initEventListeners();
    }

    initEventListeners() {
        console.log('Initializing event listeners');
        const buttons = document.querySelectorAll('.open-modal');
        console.log('Found buttons:', buttons.length);
        
        buttons.forEach(button => {
            button.onclick = (e) => {
                e.preventDefault();
                const userType = button.dataset.type;
                this.openCreateUserModal(userType);
            };
        });

        const closeButton = document.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                console.log('Close button clicked');
                this.closeCreateUserModal();
            });
        } else {
            console.error('Close button not found');
        }

        const form = document.getElementById('userForm');
        if (form) {
            form.onsubmit = null;
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.createUser();
            });
        } else {
            console.error('Form not found');
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link.dataset.section);
            });
        });

        const toggleUserPassword = document.getElementById('toggleUserPassword');
        if (toggleUserPassword) {
            toggleUserPassword.addEventListener('click', function() {
                const input = document.getElementById('userPassword');
                if (input.type === 'password') {
                    input.type = 'text';
                } else {
                    input.type = 'password';
                }
                this.classList.toggle('fa-eye-slash');
            });
        }

        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', function() {
                const input = document.getElementById('confirmPassword');
                if (input.type === 'password') {
                    input.type = 'text';
                } else {
                    input.type = 'password';
                }
                this.classList.toggle('fa-eye-slash');
            });
        }
    }

    async openCreateUserModal(userType) {
        console.log('Opening modal for user type:', userType);
        const modal = document.getElementById('userModal');
        if (!modal) {
            console.error('Modal element not found');
            return;
        }
        console.log('Modal element found');
        
        const userTypeInput = document.getElementById('userType');
        const modalTitle = document.getElementById('modalTitle');
        const modalIcon = document.getElementById('modalIcon');
        
        if (!userTypeInput || !modalTitle || !modalIcon) {
            console.error('Required modal elements not found');
            return;
        }

        userTypeInput.value = userType;

        document.getElementById('userForm').reset();
        document.querySelectorAll('.role-fields').forEach(el => el.classList.add('hidden'));

        if (userType === 'student') {
            document.getElementById('studentFields').classList.remove('hidden');
            this.fillSchoolSelect('studentSchool');
            modalTitle.textContent = 'Создание ученика';
            modalIcon.innerHTML = '<i class="fas fa-user-graduate"></i>';
        } else if (userType === 'teacher') {
            document.getElementById('teacherFields').classList.remove('hidden');
            modalTitle.textContent = 'Создание учителя';
            modalIcon.innerHTML = '<i class="fas fa-chalkboard-teacher"></i>';
        } else if (userType === 'admin') {
            document.getElementById('adminFields').classList.remove('hidden');
            modalTitle.textContent = 'Создание администратора';
            modalIcon.innerHTML = '<i class="fas fa-user-cog"></i>';
        }

        modal.classList.remove('hidden');
        modal.classList.add('show');
        console.log('Modal shown');

        this.reinitOpenModalButtons();
    }

    fillSchoolSelect(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = '';
        this.schools.forEach(school => {
            const option = document.createElement('option');
            option.value = school.id;
            option.textContent = school.name;
            select.appendChild(option);
        });
    }

    closeCreateUserModal() {
        const modal = document.getElementById('userModal');
        const form = document.getElementById('userForm');
        modal.classList.remove('show');
        modal.classList.add('hidden');
        setTimeout(() => {
            form.reset();
            document.querySelectorAll('.role-fields').forEach(el => el.classList.add('hidden'));
        }, 300);
    }

    async createUser() {
        const userType = document.getElementById('userType').value;
        // Общие поля
        const fullName = document.getElementById('fullName').value.trim();
        const birthDate = document.getElementById('birthDate').value;
        const email = document.getElementById('userEmail').value.trim();
        const password = document.getElementById('userPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (!fullName || !email || !password || !confirmPassword) {
            this.showErrorMessage('Заполните все обязательные поля!');
            return;
        }
        if (password !== confirmPassword) {
            this.showErrorMessage('Пароли не совпадают!');
            return;
        }
        let userData = { fullname: fullName, birthDate, email, password, role: userType };
        // Специфические поля
        if (userType === 'student') {
            userData = {
                ...userData,
                phone: document.getElementById('studentPhone').value,
            };
        } else if (userType === 'teacher') {
            userData = {
                ...userData,
                phone: document.getElementById('teacherPhone').value
            };

        } else if (userType === 'admin') {
            userData = {
                ...userData,
                phone: document.getElementById('adminPhone').value
            };
        }
        try {
            await Database.createUser(userData);
            this.closeCreateUserModal();
            this.showSuccessMessage('Пользователь успешно создан');
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            this.showErrorMessage(error.message);
        }
    }

    handleNavigation(section) {
        // Скрываем все секции
        document.getElementById('usersList').classList.add('hidden');
        document.getElementById('statsSection').classList.add('hidden');
        document.getElementById('databaseSection').classList.add('hidden');
        document.getElementById('serverSection').classList.add('hidden');
        
        // Показываем нужную секцию
        if (section === 'users') {
            document.getElementById('usersList').classList.remove('hidden');
        } else if (section === 'stats') {
            document.getElementById('statsSection').classList.remove('hidden');
            this.showStatsSection();
        } else if (section === 'database') {
            document.getElementById('databaseSection').classList.remove('hidden');
            this.showDatabaseSection();
        } else if (section === 'server') {
            document.getElementById('serverSection').classList.remove('hidden');
            this.showServerSection();
        }
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
    }

    showUsersSection() {
        // Логика отображения раздела пользователей
    }

    showSecuritySection() {
        // Логика отображения раздела безопасности
    }

    async showStatsSection() {
        // Получаем количество пользователей по ролям - с принудительным обновлением
        const students = await window.supabaseService.client.from('students').select('id', { count: 'exact', head: true }).limit(0);
        const teachers = await window.supabaseService.client.from('teachers').select('id', { count: 'exact', head: true }).limit(0);
        const admins = await window.supabaseService.client.from('admins').select('id', { count: 'exact', head: true }).limit(0);

        document.getElementById('statsSummary').innerHTML = `
            <div class="stats-cards">
                <div class="stats-card"><i class="fas fa-user-graduate"></i><h3>Ученики</h3><p>${students.count}</p></div>
                <div class="stats-card"><i class="fas fa-chalkboard-teacher"></i><h3>Учителя</h3><p>${teachers.count}</p></div>
                <div class="stats-card"><i class="fas fa-user-cog"></i><h3>Админы</h3><p>${admins.count}</p></div>
            </div>
        `;
    }

    showSettingsSection() {
        // Логика отображения раздела настроек
    }

    async showDatabaseSection() {
        console.log('Загрузка раздела базы данных...');
        document.querySelector('[data-section="database"]').classList.add('active');
        
        try {
            // Получаем всех пользователей из всех таблиц
            const [students, teachers, admins] = await Promise.all([
                window.supabaseService.client.from('students').select('*'),
                window.supabaseService.client.from('teachers').select('*'),
                window.supabaseService.client.from('admins').select('*')
            ]);

            console.log('Данные загружены:', { students: students.data?.length, teachers: teachers.data?.length, admins: admins.data?.length });

            // Получаем список всех таблиц в базе данных
            let tables = [];
            try {
                const { data: tablesData, error: tablesError } = await window.supabaseService.client.rpc('get_tables');
                if (!tablesError && tablesData) {
                    tables = tablesData;
                }
            } catch (err) {
                console.warn('Ошибка при получении списка таблиц:', err);
                // Используем как минимум известные таблицы
                tables = ['students', 'teachers', 'admins'];
            }
            
            let html = '';

            // Добавляем раздел с SQL Editor
            html += `
            <div class="database-controls">
                <button id="showUsersBtn" class="btn btn-primary active">Просмотр пользователей</button>
                <button id="showTableEditorBtn" class="btn btn-primary">Table Editor</button>
                <button id="showSqlEditorBtn" class="btn btn-primary">SQL Editor</button>
            </div>
            `;

            // Раздел с пользователями
            html += `<div id="usersSection">`;
            
            // Заголовок и информация о пользователях
            html += `
            <div class="database-header">
                <h2 class="db-section-title">Пользователи в базе данных</h2>
                <div class="db-stats">
                    <div class="db-stat-item">
                        <i class="fas fa-user-graduate"></i>
                        <span>Ученики: ${students.data ? students.data.length : 0}</span>
                    </div>
                    <div class="db-stat-item">
                        <i class="fas fa-chalkboard-teacher"></i>
                        <span>Учителя: ${teachers.data ? teachers.data.length : 0}</span>
                    </div>
                    <div class="db-stat-item">
                        <i class="fas fa-user-cog"></i>
                        <span>Админы: ${admins.data ? admins.data.length : 0}</span>
                    </div>
                </div>
            </div>

            <div class="users-grid">
            `;
            
            html += `
            <div class="user-section teacher-section">
                <div class="user-section-header">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <h3>Учителя</h3>
                </div>
                <div class="user-cards">
            `;
            
            if (teachers.data && teachers.data.length > 0) {
                teachers.data.forEach(user => {
                    html += `
                    <div class="user-card">
                        <div class="user-card-header">
                            <div class="user-avatar">${user.fullname?.charAt(0) || user.fullName?.charAt(0) || user.name?.charAt(0) || 'T'}</div>
                            <button class="user-actions" data-id="${user.id}" data-role="teacher">⋮</button>
                        </div>
                        <div class="user-card-body">
                            <h4>${user.fullname || user.fullName || user.name || 'Без имени'}</h4>
                            <div class="user-info-list">
                                <p class="user-email">
                                    <i class="fas fa-envelope"></i>
                                    <span class="user-email-text">${user.email || 'Нет email'}</span>
                                    ${user.email ? `<span class="full-email">${user.email}</span>` : ''}
                                </p>
                                <p class="user-phone">
                                    <i class="fas fa-phone"></i>
                                    <span class="user-phone-text">${user.phone || 'Нет телефона'}</span>
                                </p>
                            </div>
                            <div class="user-card-actions">
                                <button class="user-card-btn view-btn" data-id="${user.id}" data-role="teacher">
                                    <i class="fas fa-eye"></i>
                                    <span></span>
                                </button>
                                <button class="user-card-btn edit-btn" data-id="${user.id}" data-role="teacher">
                                    <i class="fas fa-edit"></i>
                                    <span></span>
                                </button>
                                <button class="user-card-btn delete-btn" data-id="${user.id}" data-role="teacher">
                                    <i class="fas fa-trash-alt"></i>
                                    <span></span>
                                </button>
                            </div>
                        </div>
                    </div>`;                    
                });
            } else {
                html += `<div class="no-data-message">
                    <i class="fas fa-info-circle"></i>
                    <p>Учителя не найдены</p>
                </div>`;
            }
            
            html += `</div></div>`;

            html += `
            <div class="user-section student-section">
                <div class="user-section-header">
                    <i class="fas fa-user-graduate"></i>
                    <h3>Ученики</h3>
                </div>
                <div class="user-cards">
            `;
            
            if (students.data && students.data.length > 0) {
                students.data.forEach(user => {
                    html += `
                    <div class="user-card">
                        <div class="user-card-header">
                            <div class="user-avatar">${user.fullname?.charAt(0) || user.fullName?.charAt(0) || user.name?.charAt(0) || 'S'}</div>
                            <button class="user-actions" data-id="${user.id}" data-role="student">⋮</button>
                        </div>
                        <div class="user-card-body">
                            <h4>${user.fullname || user.fullName || user.name || 'Без имени'}</h4>
                            <div class="user-info-list">
                                <p class="user-email">
                                    <i class="fas fa-envelope"></i>
                                    <span class="user-email-text">${user.email || 'Нет email'}</span>
                                    ${user.email ? `<span class="full-email">${user.email}</span>` : ''}
                                </p>
                                <p class="user-phone">
                                    <i class="fas fa-phone"></i>
                                    <span class="user-phone-text">${user.phone || 'Нет телефона'}</span>
                                </p>
                            </div>
                            <div class="user-balance">
                                <div class="user-balance-label">
                                    <i class="fas fa-coins"></i>
                                    <span>Баланс:</span>
                                </div>
                                <div class="user-balance-amount">${user.balance ? `${user.balance} ₽` : '0 ₽'}</div>
                            </div>
                            <div class="user-card-actions">
                                <button class="user-card-btn view-btn" data-id="${user.id}" data-role="student">
                                    <i class="fas fa-eye"></i>
                                    <span></span>
                                </button>
                                <button class="user-card-btn edit-btn" data-id="${user.id}" data-role="student">
                                    <i class="fas fa-edit"></i>
                                    <span></span>
                                </button>
                                <button class="user-card-btn delete-btn" data-id="${user.id}" data-role="student">
                                    <i class="fas fa-trash-alt"></i>
                                    <span></span>
                                </button>
                            </div>
                        </div>
                    </div>`;                    
                });
            } else {
                html += `<div class="no-data-message">
                    <i class="fas fa-info-circle"></i>
                    <p>Ученики не найдены</p>
                </div>`;
            }
            
            html += `</div></div>`; // Закрываем user-cards и student-section

            // Секция с админами
            html += `
            <div class="user-section admin-section">
                <div class="user-section-header">
                    <i class="fas fa-user-cog"></i>
                    <h3>Администраторы</h3>
                </div>
                <div class="user-cards">
            `;
            
            if (admins.data && admins.data.length > 0) {
                admins.data.forEach(user => {
                    html += `
                    <div class="user-card">
                        <div class="user-card-header">
                            <div class="user-avatar">${user.fullname?.charAt(0) || user.fullName?.charAt(0) || user.name?.charAt(0) || 'A'}</div>
                            <button class="user-actions" data-id="${user.id}" data-role="admin">⋮</button>
                        </div>
                        <div class="user-card-body">
                            <h4>${user.fullname || user.fullName || user.name || 'Без имени'}</h4>
                            <div class="user-info-list">
                                <p class="user-email">
                                    <i class="fas fa-envelope"></i>
                                    <span class="user-email-text">${user.email || 'Нет email'}</span>
                                    ${user.email ? `<span class="full-email">${user.email}</span>` : ''}
                                </p>
                                <p class="user-phone">
                                    <i class="fas fa-phone"></i>
                                    <span class="user-phone-text">${user.phone || 'Нет телефона'}</span>
                                </p>
                            </div>
                            <div class="user-card-actions">
                                <button class="user-card-btn view-btn" data-id="${user.id}" data-role="admin">
                                    <i class="fas fa-eye"></i>
                                    <span>Просмотр</span>
                                </button>
                                <button class="user-card-btn edit-btn" data-id="${user.id}" data-role="admin">
                                    <i class="fas fa-edit"></i>
                                    <span>Изменить</span>
                                </button>
                                <button class="user-card-btn delete-btn" data-id="${user.id}" data-role="admin">
                                    <i class="fas fa-trash-alt"></i>
                                    <span>Удалить</span>
                                </button>
                            </div>
                        </div>
                    </div>`;                    
                });
            } else {
                html += `<div class="no-data-message">
                    <i class="fas fa-info-circle"></i>
                    <p>Администраторы не найдены</p>
                </div>`;
            }
            
            html += `</div></div>`; // Закрываем user-cards и admin-section
            
            html += `</div>`; // Закрываем users-grid
            html += `</div>`; // Закрываем usersSection

            // Раздел с Table Editor
            html += `<div id="tableEditorSection" class="hidden">
                <div class="table-editor-container">
                    <div class="table-select">
                        <h3>Выберите таблицу:</h3>
                        <select id="tableSelector" class="form-control">
                            ${tables.map(table => `<option value="${table}">${table}</option>`).join('')}
                        </select>
                        <button id="loadTableBtn" class="btn btn-primary">Загрузить таблицу</button>
                    </div>
                    <div class="table-content">
                        <div id="tableDataContainer"></div>
                    </div>
                    <div class="table-actions">
                        <button id="saveTableChangesBtn" class="btn btn-success">Сохранить изменения</button>
                        <button id="addRowBtn" class="btn btn-primary">Добавить строку</button>
                        <button id="refreshTableBtn" class="btn btn-secondary">Обновить</button>
                    </div>
                </div>
            </div>

            <!-- Раздел с SQL Editor -->
            <div id="sqlEditorSection" class="hidden">
                <div class="sql-editor-container">
                    <div class="sql-editor">
                        <h3>SQL Запрос:</h3>
                        <textarea id="sqlQuery" class="form-control" rows="8" placeholder="SELECT * FROM students;"></textarea>
                        <button id="executeSqlBtn" class="btn btn-primary">Выполнить запрос</button>
                    </div>
                    <div class="sql-result">
                        <h3>Результаты:</h3>
                        <div id="sqlResultContainer"></div>
                    </div>
                </div>
            </div>`;

            // Обновляем содержимое
            document.getElementById('databaseSection').innerHTML = html;

            // Навешиваем обработчики на ⋮
            document.querySelectorAll('.user-actions').forEach(btn => {
                btn.onclick = function() {
                    showUserActionsMenu(this.dataset.id, this.dataset.role, this);
                };
            });

            // Добавляем обработчики для Table Editor и SQL Editor
            this.initDatabaseSectionHandlers();
            
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            document.getElementById('databaseSection').innerHTML = `
                <div class="content-header">
                    <h2 class="content-title">Управление базой данных</h2>
                </div>
                <div class="error-message">
                    <p>Произошла ошибка при загрузке данных: ${error.message}</p>
                    <button id="retryDatabaseLoadBtn" class="btn btn-primary">Повторить загрузку</button>
                </div>
            `;
            
            const retryBtn = document.getElementById('retryDatabaseLoadBtn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => this.showDatabaseSection());
            }
        }
    }

    async showServerSection() {
        // Отображение раздела управления сервером
        document.querySelector('[data-section="server"]').classList.add('active');
        
        let html = `
            <div class="content-header">
                <h2 class="content-title">Управление сервером Supabase</h2>
            </div>
            
            <div class="server-controls">
                <button id="initDatabaseBtn" class="btn btn-primary">
                    <i class="fas fa-database"></i> Инициализировать базу данных
                </button>
                <button id="checkRLSBtn" class="btn btn-primary">
                    <i class="fas fa-shield-alt"></i> Проверить настройки RLS
                </button>
                <button id="createBackupBtn" class="btn btn-primary">
                    <i class="fas fa-download"></i> Создать резервную копию
                </button>
            </div>
            
            <div class="server-sql-section">
                <h3>Выполнение административных SQL-запросов</h3>
                <p class="sql-description">Здесь вы можете выполнять специальные SQL-запросы для настройки базы данных</p>
                
                <div class="admin-sql-editor">
                    <textarea id="adminSqlQuery" class="form-control" rows="8" placeholder="-- Введите SQL-запрос для настройки базы данных">-- SQL запросы для настройки базы данных</textarea>
                    <button id="executeAdminSqlBtn" class="btn btn-primary">Выполнить</button>
                </div>
                
                <div class="admin-sql-result">
                    <h4>Результат выполнения:</h4>
                    <div id="adminSqlResultContainer" class="sql-result-box">
                        <p>Здесь будет отображаться результат выполнения SQL-запроса</p>
                    </div>
                </div>
            </div>
            
            <div class="server-status-section">
                <h3>Статус сервера</h3>
                <div class="status-cards">
                    <div class="status-card">
                        <h4>Статус базы данных</h4>
                        <div class="status-indicator online">
                            <i class="fas fa-circle"></i> Онлайн
                        </div>
                    </div>
                    <div class="status-card">
                        <h4>Статус API</h4>
                        <div class="status-indicator online">
                            <i class="fas fa-circle"></i> Онлайн
                        </div>
                    </div>
                    <div class="status-card">
                        <h4>Статус аутентификации</h4>
                        <div class="status-indicator online">
                            <i class="fas fa-circle"></i> Онлайн
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('serverSection').innerHTML = html;
        
        // Добавляем обработчики событий
        this.initServerSectionHandlers();
    }

    showSuccessMessage(message) {
        alert(message);
    }

    showErrorMessage(message) {
        this.showModal('Ошибка', message, 'error');
    }

    // Функция для отображения модального окна с сообщением
    showModal(title, message, type = 'info') {
        // Если есть библиотека для модальных окон, используем её
        if (window.modalService) {
            window.modalService.showModal(title, message, type);
        } else {
            // Иначе используем обычный alert
            alert(`${title}: ${message}`);
        }
    }

    // Функция для отображения результатов SQL запроса в виде таблицы
    renderSqlResultTable(container, data) {
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="sql-no-data">
                    <i class="fas fa-info-circle"></i>
                    <p>Запрос выполнен, но не вернул данных</p>
                </div>
            `;
            return;
        }
        
        // Получаем колонки из первой строки данных
        const columns = Object.keys(data[0]);
        
        // Создаем HTML таблицы
        let tableHtml = `
        <div class="sql-result-info">
            <span class="sql-row-count"><i class="fas fa-table"></i> Найдено строк: ${data.length}</span>
        </div>
        <div class="sql-result-table-wrapper">
            <table class="sql-result-table">
                <thead>
                    <tr>
                        ${columns.map(col => `<th>${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Добавляем строки с данными
        data.forEach(row => {
            tableHtml += '<tr>';
            columns.forEach(col => {
                const value = row[col];
                // Форматируем значение в зависимости от типа
                if (value === null) {
                    tableHtml += '<td class="sql-null-value">NULL</td>';
                } else if (typeof value === 'object') {
                    tableHtml += `<td class="sql-object-value"><pre>${JSON.stringify(value, null, 2)}</pre></td>`;
                } else {
                    tableHtml += `<td>${value}</td>`;
                }
            });
            tableHtml += '</tr>';
        });
        
        tableHtml += `
                </tbody>
            </table>
        </div>
        `;
        
        container.innerHTML = tableHtml;
    }

    initPhoneInputs() {
        // Находим все поля ввода с атрибутом type="tel" или содержащие слово "phone" в id
        const phoneInputs = document.querySelectorAll('input[type="tel"], input[id*="phone"], input[id*="Phone"]');

        phoneInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', (e) => {
                    const formatted = phoneUtils.formatPhoneNumber(e.target.value);
                    e.target.value = formatted;
                });
            }
        });
    }

    // Гарантируем повторную инициализацию обработчиков при динамическом изменении DOM
    reinitOpenModalButtons() {
        const buttons = document.querySelectorAll('.open-modal');
        buttons.forEach(button => {
            button.onclick = (e) => {
                e.preventDefault();
                const userType = button.dataset.type;
                this.openCreateUserModal(userType);
            };
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (!window.main) {
        window.main = new Main();
    }
});

// Обработчики для раздела администрирования сервера
Main.prototype.initServerSectionHandlers = function() {
    // Кнопка инициализации базы данных
    const initDatabaseBtn = document.getElementById('initDatabaseBtn');
    if (initDatabaseBtn) {
        initDatabaseBtn.addEventListener('click', async () => {
            try {
                initDatabaseBtn.disabled = true;
                initDatabaseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Инициализация...';
                
                // Проверяем и создаем необходимые SQL-функции
                if (window.SqlHelper) {
                    await window.SqlHelper.setupDatabaseFunctions();
                    this.showSuccessMessage('База данных успешно инициализирована');
                } else {
                    this.showErrorMessage('Модуль SqlHelper не найден. Проверьте подключение скрипта supabase-sql.js');
                }
            } catch (error) {
                console.error('Ошибка при инициализации базы данных:', error);
                this.showErrorMessage(`Ошибка при инициализации базы данных: ${error.message}`);
            } finally {
                initDatabaseBtn.disabled = false;
                initDatabaseBtn.innerHTML = '<i class="fas fa-database"></i> Инициализировать базу данных';
            }
        });
    }
    
    // Кнопка проверки настроек RLS
    const checkRLSBtn = document.getElementById('checkRLSBtn');
    if (checkRLSBtn) {
        checkRLSBtn.addEventListener('click', async () => {
            try {
                checkRLSBtn.disabled = true;
                checkRLSBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка...';
                
                // Проверяем настройки RLS
                const tables = ['students', 'teachers', 'admins'];
                let missingRLS = [];
                
                for (const table of tables) {
                    // Пытаемся получить данные из таблицы
                    const { data, error } = await window.supabaseService.client
                        .from(table)
                        .select('id')
                        .limit(1);
                    
                    if (error && error.code === '42501') { // Код ошибки для нарушения политики доступа
                        missingRLS.push(table);
                    }
                }
                
                if (missingRLS.length > 0) {
                    this.showErrorMessage(`Проблемы с настройками RLS в таблицах: ${missingRLS.join(', ')}`);
                } else {
                    this.showSuccessMessage('Настройки RLS проверены и работают корректно');
                }
            } catch (error) {
                console.error('Ошибка при проверке настроек RLS:', error);
                this.showErrorMessage(`Ошибка при проверке настроек RLS: ${error.message}`);
            } finally {
                checkRLSBtn.disabled = false;
                checkRLSBtn.innerHTML = '<i class="fas fa-shield-alt"></i> Проверить настройки RLS';
            }
        });
    }
    
    // Кнопка создания резервной копии
    const createBackupBtn = document.getElementById('createBackupBtn');
    if (createBackupBtn) {
        createBackupBtn.addEventListener('click', async () => {
            try {
                createBackupBtn.disabled = true;
                createBackupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создание резервной копии...';
                
                // Получаем данные из всех таблиц
                const [students, teachers, admins] = await Promise.all([
                    window.supabaseService.client.from('students').select('*'),
                    window.supabaseService.client.from('teachers').select('*'),
                    window.supabaseService.client.from('admins').select('*')
                ]);
                
                // Формируем резервную копию
                const backup = {
                    timestamp: new Date().toISOString(),
                    version: '1.0',
                    data: {
                        students: students.data || [],
                        teachers: teachers.data || [],
                        admins: admins.data || []
                    }
                };
                
                // Конвертируем в JSON и создаем файл для скачивания
                const jsonString = JSON.stringify(backup, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `supabase_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.showSuccessMessage('Резервная копия создана и скачана');
            } catch (error) {
                console.error('Ошибка при создании резервной копии:', error);
                this.showErrorMessage(`Ошибка при создании резервной копии: ${error.message}`);
            } finally {
                createBackupBtn.disabled = false;
                createBackupBtn.innerHTML = '<i class="fas fa-download"></i> Создать резервную копию';
            }
        });
    }
    
    // Кнопка выполнения административного SQL-запроса
    const executeAdminSqlBtn = document.getElementById('executeAdminSqlBtn');
    if (executeAdminSqlBtn) {
        executeAdminSqlBtn.addEventListener('click', async () => {
            try {
                const sqlQuery = document.getElementById('adminSqlQuery').value.trim();
                if (!sqlQuery) {
                    this.showModal('Предупреждение', 'Введите SQL-запрос для выполнения', 'warning');
                    return;
                }
                
                // Показываем индикатор загрузки
                executeAdminSqlBtn.disabled = true;
                executeAdminSqlBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Выполнение...';
                
                const resultContainer = document.getElementById('adminSqlResultContainer');
                resultContainer.innerHTML = `
                    <div class="sql-loading">
                        <div class="sql-spinner"></div>
                        <p>Выполняется запрос...</p>
                    </div>
                `;
                
                // Выполняем SQL-запрос
                if (window.SqlHelper) {
                    const result = await window.SqlHelper.executeAdminSql(sqlQuery);
                    
                    // Отображаем результат в зависимости от успешности
                    if (result.success) {
                        if (result.rows && result.rows.length > 0) {
                            // Создаем таблицу результатов, если есть данные
                            this.renderSqlResultTable(resultContainer, result.rows);
                        } else {
                            resultContainer.innerHTML = `
                                <div class="sql-success-result">
                                    <i class="fas fa-check-circle"></i>
                                    <h4>Запрос выполнен успешно</h4>
                                    <p>${result.message || 'Запрос не вернул данных'}</p>
                                    <p class="sql-timestamp">Время выполнения: ${new Date(result.timestamp).toLocaleTimeString()}</p>
                                </div>
                            `;
                        }
                    } else {
                        // Показываем ошибку
                        resultContainer.innerHTML = `
                            <div class="sql-error-result">
                                <i class="fas fa-exclamation-triangle"></i>
                                <h4>Ошибка выполнения запроса</h4>
                                <p>${result.error}</p>
                                <div class="sql-error-details">
                                    <pre>${result.error}</pre>
                                </div>
                                <p class="sql-timestamp">Время: ${new Date(result.timestamp).toLocaleTimeString()}</p>
                            </div>
                        `;
                    }
                } else {
                    this.showModal('Ошибка', 'Модуль SqlHelper не найден. Проверьте подключение скрипта supabase-sql.js', 'error');
                    resultContainer.innerHTML = `
                        <div class="sql-error-result">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h4>Ошибка инициализации</h4>
                            <p>Модуль SqlHelper не найден. Проверьте подключение скрипта supabase-sql.js</p>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Ошибка при выполнении SQL-запроса:', error);
                this.showModal('Ошибка', `Ошибка при выполнении SQL-запроса: ${error.message}`, 'error');
                
                // Отображаем ошибку в контейнере результатов
                const resultContainer = document.getElementById('adminSqlResultContainer');
                resultContainer.innerHTML = `
                    <div class="sql-error-result">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h4>Ошибка выполнения запроса</h4>
                        <p>${error.message}</p>
                        <div class="sql-error-details">
                            <pre>${error.stack || error}</pre>
                        </div>
                    </div>
                `;
            } finally {
                executeAdminSqlBtn.disabled = false;
                executeAdminSqlBtn.innerHTML = '<i class="fas fa-play"></i> Выполнить';
            }
        });
    }
};

// Методы для работы с базой данных
Main.prototype.initDatabaseSectionHandlers = function() {
    // Обработчики для переключения между разделами
    const showUsersBtn = document.getElementById('showUsersBtn');
    const showTableEditorBtn = document.getElementById('showTableEditorBtn');
    const showSqlEditorBtn = document.getElementById('showSqlEditorBtn');
    const usersSection = document.getElementById('usersSection');
    const tableEditorSection = document.getElementById('tableEditorSection');
    const sqlEditorSection = document.getElementById('sqlEditorSection');

    if (showUsersBtn) {
        showUsersBtn.addEventListener('click', () => {
            showUsersBtn.classList.add('active');
            showTableEditorBtn.classList.remove('active');
            showSqlEditorBtn.classList.remove('active');
            usersSection.classList.remove('hidden');
            tableEditorSection.classList.add('hidden');
            sqlEditorSection.classList.add('hidden');
        });
    }

    if (showTableEditorBtn) {
        showTableEditorBtn.addEventListener('click', () => {
            showUsersBtn.classList.remove('active');
            showTableEditorBtn.classList.add('active');
            showSqlEditorBtn.classList.remove('active');
            usersSection.classList.add('hidden');
            tableEditorSection.classList.remove('hidden');
            sqlEditorSection.classList.add('hidden');
        });
    }

    if (showSqlEditorBtn) {
        showSqlEditorBtn.addEventListener('click', () => {
            showUsersBtn.classList.remove('active');
            showTableEditorBtn.classList.remove('active');
            showSqlEditorBtn.classList.add('active');
            usersSection.classList.add('hidden');
            tableEditorSection.classList.add('hidden');
            sqlEditorSection.classList.remove('hidden');
        });
    }

    // Обработчики для Table Editor
    const loadTableBtn = document.getElementById('loadTableBtn');
    if (loadTableBtn) {
        loadTableBtn.addEventListener('click', async () => {
            const tableSelector = document.getElementById('tableSelector');
            const tableName = tableSelector.value;
            await this.loadTableData(tableName);
        });
    }

    const saveTableChangesBtn = document.getElementById('saveTableChangesBtn');
    if (saveTableChangesBtn) {
        saveTableChangesBtn.addEventListener('click', async () => {
            await this.saveTableChanges();
        });
    }

    const addRowBtn = document.getElementById('addRowBtn');
    if (addRowBtn) {
        addRowBtn.addEventListener('click', () => {
            this.addNewRowToTable();
        });
    }

    const refreshTableBtn = document.getElementById('refreshTableBtn');
    if (refreshTableBtn) {
        refreshTableBtn.addEventListener('click', async () => {
            if (this.currentTable) {
                await this.loadTableData(this.currentTable);
            }
        });
    }

    // Обработчик для SQL Editor
    const executeSqlBtn = document.getElementById('executeSqlBtn');
    if (executeSqlBtn) {
        executeSqlBtn.addEventListener('click', async () => {
            await this.executeSqlQuery();
        });
    }
};

Main.prototype.loadTableData = async function(tableName) {
    this.currentTable = tableName;
    try {
        // Показываем индикатор загрузки
        const container = document.getElementById('tableDataContainer');
        container.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Загрузка данных из таблицы ${tableName}...</p>
            </div>
        `;
        
        // Загружаем данные из таблицы
        const { data, error } = await window.supabaseService.client
            .from(tableName)
            .select('*')
            .limit(100);

        if (error) {
            throw error;
        }

        // Получаем структуру таблицы для определения типов данных
        const { data: tableInfo, error: tableInfoError } = await window.supabaseService.client
            .rpc('get_table_info', { table_name: tableName });

        if (tableInfoError) {
            console.warn('Не удалось получить информацию о структуре таблицы:', tableInfoError);
        }

        this.tableData = data || [];
        this.tableStructure = tableInfo || null;
        this.renderTableData(this.tableData, tableName, this.tableStructure);
    } catch (error) {
        console.error(`Ошибка при загрузке таблицы ${tableName}:`, error);
        
        const container = document.getElementById('tableDataContainer');
        container.innerHTML = `
            <div class="error-message-card">
                <div class="error-icon-container">
                    <i class="fas fa-exclamation-circle error-icon-pulse"></i>
                </div>
                <div class="error-content">
                    <h3 class="error-title">Ошибка при загрузке таблицы ${tableName}</h3>
                    <p class="error-description">${error.message || 'Произошла неизвестная ошибка'}</p>
                    <div class="error-code">${error.code ? `Код ошибки: ${error.code}` : ''}</div>
                </div>
                <div class="error-actions">
                    <button id="retryLoadBtn" class="error-action-btn retry-btn">
                        <i class="fas fa-sync-alt"></i> Повторить попытку
                    </button>
                    <button id="reportErrorBtn" class="error-action-btn report-btn">
                        <i class="fas fa-bug"></i> Сообщить об ошибке
                    </button>
                </div>
            </div>
        `;
        
        // Добавляем обработчик на кнопку повторной загрузки
        const retryBtn = document.getElementById('retryLoadBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadTableData(tableName));
        }
        
        // Добавляем обработчик для кнопки сообщить об ошибке
        const reportBtn = document.getElementById('reportErrorBtn');
        if (reportBtn) {
            reportBtn.addEventListener('click', () => {
                // Показываем модальное окно для отправки отчета об ошибке
                this.showModal('Сообщить об ошибке', `
                    <div class="report-error-form">
                        <p>Детали ошибки:</p>
                        <pre class="error-details">${JSON.stringify({message: error.message, code: error.code, table: tableName}, null, 2)}</pre>
                        <div class="form-group">
                            <label for="errorDescription">Опишите, что произошло:</label>
                            <textarea id="errorDescription" class="form-control" rows="4"></textarea>
                        </div>
                        <button id="sendErrorReportBtn" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Отправить отчет
                        </button>
                    </div>
                `);
                
                // Обработчик для кнопки отправки отчета
                document.getElementById('sendErrorReportBtn').addEventListener('click', () => {
                    const description = document.getElementById('errorDescription').value;
                    // Здесь будет логика отправки отчета об ошибке
                    console.log('Отправка отчета об ошибке:', {error, description});
                    this.hideModal();
                    this.showToast('Отчет об ошибке отправлен', 'success');
                });
            });
        }
    }
};

Main.prototype.renderTableData = function(data, tableName, tableStructure) {
    const container = document.getElementById('tableDataContainer');
    
    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="no-data-message-table">
                <i class="fas fa-info-circle"></i>
                <h3>Таблица ${tableName} пуста</h3>
                <p>В таблице нет данных или она не существует</p>
            </div>
        `;
        return;
    }

    // Определяем колонки таблицы
    const columns = Object.keys(data[0]);
    
    let tableHtml = `
    <div class="table-info-panel">
        <div class="table-info">
            <span class="table-info-badge"><i class="fas fa-table"></i> Таблица: <strong>${tableName}</strong></span>
            <span class="table-info-badge"><i class="fas fa-list"></i> Записей: <strong>${data.length}</strong></span>
        </div>
        <div class="table-search">
            <input type="text" id="tableSearchInput" placeholder="Поиск по таблице..." class="table-search-input">
            <button id="tableSearchBtn" class="table-search-btn"><i class="fas fa-search"></i></button>
        </div>
    </div>
    <div class="table-editor-wrapper">
        <table class="table-editor-table" id="editableTable">
            <thead>
                <tr>
                    <th class="row-num-column">#</th>
                    ${columns.map(col => `<th class="data-column">${col}</th>`).join('')}
                    <th class="actions-column">Действия</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Создаем строки таблицы с учетом типов данных
    data.forEach((row, index) => {
        tableHtml += `<tr data-index="${index}">
            <td class="row-num-cell">${index + 1}</td>
            ${columns.map(col => {
                const value = row[col] !== null ? row[col] : '';
                // Определяем тип поля и его стилизацию
                let inputHtml = '';
                
                // Для времени
                if (col === 'time' || col.toLowerCase().includes('time')) {
                    let timeValue = value;
                    if (typeof value === 'number') {
                        // Если время в секундах или миллисекундах, отображаем в формате ЧЧ:ММ:СС
                        const hours = Math.floor(value / 3600);
                        const minutes = Math.floor((value % 3600) / 60);
                        const seconds = value % 60;
                        timeValue = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }
                    inputHtml = `<input type="text" data-column="${col}" value="${timeValue}" class="table-editor-input time-input">`;
                }
                // Для даты/времени
                else if (col === 'birthDate' || col.toLowerCase().includes('date')) {
                    const dateValue = value ? (typeof value === 'string' ? value.split('T')[0] : new Date(value).toISOString().split('T')[0]) : '';
                    inputHtml = `<input type="date" data-column="${col}" value="${dateValue}" class="table-editor-input date-input">`;
                } 
                // Для ID - делаем только для чтения
                else if (col === 'id') {
                    inputHtml = `<input type="text" data-column="${col}" value="${value}" class="table-editor-input id-input" readonly>`;
                }
                // Для баланса и числовых полей
                else if (col === 'balance' || typeof value === 'number') {
                    inputHtml = `<input type="number" data-column="${col}" value="${value}" class="table-editor-input number-input" step="0.01">`;
                }
                // Для email - улучшенное отображение
                else if (col === 'email') {
                    inputHtml = `<input type="email" data-column="${col}" value="${value}" class="table-editor-input email-input">`;
                }
                // Для телефона - маска ввода
                else if (col === 'phone') {
                    inputHtml = `<input type="tel" data-column="${col}" value="${value}" class="table-editor-input phone-input" placeholder="+7 (999) 999-99-99">`;
                }
                // Для пароля
                else if (col === 'password') {
                    inputHtml = `<input type="password" data-column="${col}" value="${value}" class="table-editor-input password-input">`;
                }
                // Для обычных текстовых полей
                else {
                    inputHtml = `<input type="text" data-column="${col}" value="${value}" class="table-editor-input text-input">`;
                }
                
                return `<td class="data-cell" data-label="${col}">${inputHtml}</td>`;
            }).join('')}
            <td class="actions-cell">
                <div class="table-actions">
                    <button class="table-action-btn edit-row-btn" title="Редактировать" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="table-action-btn view-row-btn" title="Просмотр" data-index="${index}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="table-action-btn delete-row-btn" title="Удалить" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    });

    tableHtml += `</tbody></table></div>
    <div class="table-pagination">
        <button id="prevPageBtn" class="pagination-btn" disabled><i class="fas fa-chevron-left"></i></button>
        <span class="pagination-info">Страница 1 из 1</span>
        <button id="nextPageBtn" class="pagination-btn" disabled><i class="fas fa-chevron-right"></i></button>
    </div>`;
    
    container.innerHTML = tableHtml;

    this.initTableButtons(data, tableName);
};


Main.prototype.initTableButtons = function(data, tableName) {
    const self = this;
    document.querySelectorAll('.delete-row-btn').forEach(btn => {
        btn.onclick = function() {
            const index = parseInt(this.getAttribute('data-index'));
            const rowData = data[index];
            
            if (rowData && rowData.id) {
                if (confirm(`Вы действительно хотите удалить запись #${rowData.id}?`)) {
                    self.deleteRecord(tableName, rowData.id);
                }
            }
        };
    });
    
    document.querySelectorAll('.edit-row-btn').forEach(btn => {
        btn.onclick = function() {
            const row = this.closest('tr');
            if (row) {
                const inputs = row.querySelectorAll('input');
                const readonly = inputs[0].readOnly !== false;
                
                inputs.forEach(input => {
                    input.readOnly = !readonly;
                    if (!readonly) {
                        input.classList.add('editing');
                    } else {
                        input.classList.remove('editing');
                    }
                });
                
                const icon = this.querySelector('i');
                if (readonly) {
                    icon.className = 'fas fa-save';
                    self.showToast('Режим редактирования', 'info');
                } else {
                    icon.className = 'fas fa-edit';
                    self.showToast('Изменения сохранены', 'success');
                }
            }
        };
    });
    
    
    document.querySelectorAll('.view-row-btn').forEach(btn => {
        btn.onclick = function() {
            const index = parseInt(this.getAttribute('data-index'));
            const rowData = data[index];
            
            if (rowData && rowData.id) {
                let modalContent = '<div class="record-details">';
                
                for (const [key, value] of Object.entries(rowData)) {
                    if (value !== null && value !== '') {
                        modalContent += `<div class="record-field"><strong>${key}:</strong> ${value}</div>`;
                    }
                }
                modalContent += '</div>';
                
                self.showModal(`Информация о записи #${rowData.id}`, modalContent);
            }
        };
    });
    
    const searchInput = document.getElementById('tableSearchInput');
    const searchBtn = document.getElementById('tableSearchBtn');
    
    if (searchInput && searchBtn) {
        const filterTable = () => {
            const searchText = searchInput.value.toLowerCase();
            const table = document.getElementById('editableTable');
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                let found = false;
                const cells = row.querySelectorAll('.data-cell');
                
                cells.forEach(cell => {
                    const input = cell.querySelector('input');
                    if (input && input.value.toLowerCase().includes(searchText)) {
                        found = true;
                    }
                });
                
                row.style.display = found ? '' : 'none';
            });
            
            const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none').length;
            const tableInfoBadge = document.querySelector('.table-info-badge:nth-child(2) strong');
            if (tableInfoBadge) {
                tableInfoBadge.textContent = `${visibleRows} из ${data.length}`;
            }
        };
        
        searchBtn.addEventListener('click', filterTable);
        searchInput.addEventListener('input', filterTable);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') filterTable();
        });
    }
    
    let saveTimeout = null;
    document.querySelectorAll('.table-editor-input').forEach(input => {
        input.addEventListener('input', () => {
            if (saveTimeout) clearTimeout(saveTimeout);
            
            saveTimeout = setTimeout(() => {
                input.classList.add('modified');
            }, 300);
        });
    });
};


Main.prototype.deleteRecord = function(tableName, recordId) {
    console.log(`Удаление записи ${recordId} из таблицы ${tableName}`);
    
    try {
        window.supabaseService.client
            .from(tableName)
            .delete()
            .eq('id', recordId)
            .then(({ error }) => {
                if (error) {
                    console.error('Ошибка при удалении записи:', error);
                    this.showToast(`Ошибка при удалении: ${error.message}`, 'error');
                } else {
                    this.loadTableData(tableName);
                    this.showToast(`Запись #${recordId} успешно удалена`, 'success');
                }
            });
    } catch (err) {
        console.error('Ошибка при удалении записи:', err);
        this.showToast(`Ошибка при удалении: ${err.message}`, 'error');
    }
};


Main.prototype.showConfirmModal = function(title, content, onConfirm) {
    this.showModal(title, `
        ${content}
        <div class="modal-confirm-actions">
            <button id="modalCancelBtn" class="btn btn-secondary">Отмена</button>
            <button id="modalConfirmBtn" class="btn btn-danger">Подтвердить</button>
        </div>
    `);
    
    document.getElementById('modalCancelBtn').addEventListener('click', () => {
        this.hideModal();
    });
    
    document.getElementById('modalConfirmBtn').addEventListener('click', () => {
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
        this.hideModal();
    });
}


Main.prototype.deleteRow = function(index) {
    this.tableData.splice(index, 1);
    this.renderTableData(this.tableData, this.currentTable);
};

Main.prototype.addNewRowToTable = function() {
    if (!this.tableData || this.tableData.length === 0) {
        this.showErrorMessage('Нельзя добавить строку в пустую таблицу');
        return;
    }

    // Создаем новую строку с теми же колонками, что и у существующих данных
    const newRow = {};
    const columns = Object.keys(this.tableData[0]);
    columns.forEach(col => {
        newRow[col] = null;
    });

    this.tableData.push(newRow);
    this.renderTableData(this.tableData, this.currentTable);
};

Main.prototype.saveTableChanges = async function() {
    if (!this.tableData || !this.currentTable) {
        this.showErrorMessage('Нет данных для сохранения');
        return;
    }

    try {
        // Собираем данные из инпутов
        const editableTable = document.getElementById('editableTable');
        
        // Проверка, что таблица существует
        if (!editableTable) {
            this.showErrorMessage('Таблица не найдена или не загружена');
            return;
        }
        
        const tbody = editableTable.querySelector('tbody');
        if (!tbody) {
            this.showErrorMessage('Таблица не содержит данных');
            return;
        }
        
        const rows = tbody.querySelectorAll('tr');
        
        if (!rows || rows.length === 0) {
            // Если нет строк, используем текущие данные
            console.log('Строки в таблице не найдены, используются исходные данные');
        } else {
            // Собираем данные из строк
            const updatedData = Array.from(rows).map((row) => {
                const rowData = {};
                const inputs = row.querySelectorAll('input');
                inputs.forEach(input => {
                    const column = input.dataset.column;
                    if (input.value === '') {
                        rowData[column] = null;
                    } else if (column === 'id') {
                        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                        if (uuidRegex.test(input.value)) {
                            rowData[column] = input.value;
                        } else {
                            // Если это не UUID, то используем как число или строку
                            const numValue = Number(input.value);
                            rowData[column] = isNaN(numValue) ? input.value : numValue;
                        }
                    } else if (!isNaN(Number(input.value)) && input.value.trim() !== '') {
                        // Если это число
                        rowData[column] = Number(input.value);
                    } else {
                        // Иначе оставляем как строку
                        rowData[column] = input.value;
                    }
                });
                return rowData;
            });

            // Обновляем this.tableData
            this.tableData = updatedData;
        }

        // Если таблица пустая, просто выводим сообщение
        if (!this.tableData || this.tableData.length === 0) {
            this.showSuccessMessage('Таблица пуста, нечего сохранять');
            return;
        }

        // Используем подход с upsert вместо удаления и вставки
        try {
            // Вставляем данные с опцией upsert
            const { error: upsertError } = await window.supabaseService.client
                .from(this.currentTable)
                .upsert(this.tableData, { onConflict: 'id' });

            if (upsertError) throw upsertError;

            this.showSuccessMessage('Изменения успешно сохранены');
            
            // Перезагружаем данные
            await this.loadTableData(this.currentTable);
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
            this.showErrorMessage(`Ошибка при сохранении: ${error.message}`);
        }
    } catch (error) {
        console.error('Ошибка при обработке таблицы:', error);
        this.showErrorMessage(`Ошибка при обработке таблицы: ${error.message}`);
    }
};

Main.prototype.executeSqlQuery = async function() {
    const sqlQuery = document.getElementById('sqlQuery').value.trim();
    if (!sqlQuery) {
        this.showErrorMessage('Введите SQL запрос');
        return;
    }

    try {
        const { data, error } = await window.supabaseService.client.rpc('run_sql_query', {
            query_text: sqlQuery
        });

        if (error) throw error;

        this.renderSqlResults(data);
    } catch (error) {
        console.error('Ошибка при выполнении SQL запроса:', error);
        this.showErrorMessage(`Ошибка SQL: ${error.message}`);
    }
};

Main.prototype.renderSqlResults = function(data) {
    const container = document.getElementById('sqlResultContainer');
    
    if (!data || data.length === 0) {
        container.innerHTML = '<p>Запрос выполнен, но результатов нет.</p>';
        return;
    }

    if (typeof data === 'string') {
        container.innerHTML = `<p>${data}</p>`;
        return;
    }

    // Создаем таблицу с результатами
    const columns = Object.keys(data[0]);
    
    let tableHtml = `<table class="sql-result-table">
        <thead>
            <tr>
                ${columns.map(col => `<th>${col}</th>`).join('')}
            </tr>
        </thead>
        <tbody>`;

    data.forEach(row => {
        tableHtml += `<tr>
            ${columns.map(col => `<td>${row[col] !== null ? row[col] : ''}</td>`).join('')}
        </tr>`;
    });

    tableHtml += `</tbody></table>`;
    container.innerHTML = tableHtml;
};

// Инициализация Google Autocomplete
function initGoogleAutocomplete() {
    // Для ученика
    const studentSchool = document.getElementById('studentSchool');
    if (studentSchool) {
        new google.maps.places.Autocomplete(studentSchool, {
            types: ['establishment'],
            componentRestrictions: { country: 'ru' }
        });
    }
    // Для учителя (каждый адрес через запятую — автокомплит только для последнего)
    const teacherSchools = document.getElementById('teacherSchools');
    if (teacherSchools) {
        // Можно сделать автокомплит только для первого адреса, либо реализовать сложнее для каждого через запятую
        new google.maps.places.Autocomplete(teacherSchools, {
            types: ['establishment'],
            componentRestrictions: { country: 'ru' }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.google && window.google.maps && window.google.maps.places) {
        initGoogleAutocomplete();
    } else {
        // Ждём загрузки скрипта Google Maps
        let interval = setInterval(() => {
            if (window.google && window.google.maps && window.google.maps.places) {
                clearInterval(interval);
                initGoogleAutocomplete();
            }
        }, 300);
    }
});





function showUserActionsMenu(userId, role, btn) {
    // Удаляем старое меню
    document.querySelectorAll('.user-actions-menu').forEach(el => el.remove());
    // Создаём меню
    const menu = document.createElement('div');
    menu.className = 'user-actions-menu';
    menu.innerHTML = `
        <button onclick="showUserDetails('${userId}', '${role}')">Подробнее</button>
        <button onclick="editUser('${userId}', '${role}')">Изменить</button>
        <button onclick="deleteUser('${userId}', '${role}')">Удалить</button>
    `;
    menu.style.position = 'absolute';
    menu.style.zIndex = 1000;
    menu.style.left = btn.getBoundingClientRect().left + 'px';
    menu.style.top = btn.getBoundingClientRect().bottom + 'px';
    document.body.appendChild(menu);
    // Закрытие по клику вне меню
    setTimeout(() => {
        document.addEventListener('click', function handler(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', handler);
            }
        });
    }, 10);
}

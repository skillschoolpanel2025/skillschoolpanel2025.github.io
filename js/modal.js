class App {
    constructor() {
        this.USER_KEY = 'eldev_users';
        this.currentUser = null;
        this.init();
    }

    init() {
        this.initAuth();
        this.initModals();
        this.initNavigation();
        this.loadUsers();
    }

    initAuth() {
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
    }

    togglePasswordVisibility() {
        const input = document.getElementById('password');
        const icon = document.getElementById('togglePassword');
        input.type = input.type === 'password' ? 'text' : 'password';
        icon.classList.toggle('fa-eye-slash');
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => errorElement.style.display = 'none', 3000);
    }

    initModals() {
        document.getElementById('createUserBtn').addEventListener('click', () => {
            this.toggleModal(true);
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            this.toggleModal(false);
        });

    }

    toggleModal(show) {
        document.getElementById('userModal').classList.toggle('hidden', !show);
    }


    getUserType(type) {
        const types = {
            student: 'Ученик',
            teacher: 'Учитель',
            admin: 'Администратор'
        };
        return types[type] || 'Неизвестно';
    }

    initNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveSection(link.dataset.section);
            });
        });
    }

    setActiveSection(section) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');
    }
}

new App();
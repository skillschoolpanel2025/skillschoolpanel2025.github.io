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
    }

    async init() {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (session) {
            this.user = session.user;
            if (this.isAuthorizedEmail(this.user.email)) {
                this.showMainContainer();
            } else {
                await this.signOut();
                this.showError('Доступ запрещен. Используйте авторизованный адрес электронной почты.');
            }
        }
        this.hideError();
    }

    isAuthorizedEmail(email) {
        return email === 'saralashvilischool2025@gmail.com';
    }

    async signIn(email, password) {
        try {
            if (!this.isAuthorizedEmail(email)) {
                this.showError('Доступ запрещен. Используйте авторизованный адрес электронной почты.');
                throw new Error('Unauthorized email');
            }

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.user = data.user;
            this.showMainContainer();
            this.hideError();
            return data.user;
        } catch (error) {
            if (error.message !== 'Unauthorized email') {
                console.error('Ошибка при входе:', error);
                this.showError(error.message);
            }
            throw error;
        }
    }

    async signInWithGoogle() {
        try {
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error('Ошибка при входе через Google:', error);
            this.showError(error.message);
            throw error;
        }
    }

    async signOut() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;

            localStorage.removeItem('supabase.auth.token');
            sessionStorage.removeItem('supabase.auth.token');
            this.user = null;
            this.showAuthContainer();
            this.hideError();
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            if (!this.isAuthorizedEmail(this.user?.email)) {
                throw new Error('Недостаточно прав для создания пользователей');
            }
            
            const { data: authData, error: authError } = await supabaseClient.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        fullname: userData.fullName,
                        role: userData.role
                    }
                }
            });

            if (authError) throw authError;

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
        document.getElementById('authContainer').classList.add('hidden');
        document.getElementById('mainContainer').classList.remove('hidden');
        this.updateUserInfo();
        this.hideError();
    }

    showError(message) {
        const errorElement = document.getElementById('authError');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    hideError() {
        const errorElement = document.getElementById('authError');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    updateUserInfo() {
        if (this.user) {
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');
            
            userAvatar.textContent = this.user.user_metadata.fullName
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase();
            
            userName.textContent = this.user.user_metadata.fullName;
        }
    }
}

const auth = new Auth();

document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('loadingSpinner').style.display = 'flex';
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    
    try {
        await auth.signIn(email, password);
    } catch (error) {
        document.getElementById('loadingSpinner').style.display = 'none';
    }
});

document.getElementById('googleAuthBtn').addEventListener('click', () => {
    auth.signInWithGoogle();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut();
});

// Обработчик для переключения видимости пароля
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('authPassword');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Скрывать ошибку при вводе в email или пароль
document.getElementById('authEmail').addEventListener('input', function() {
    auth.hideError();
});
document.getElementById('authPassword').addEventListener('input', function() {
    auth.hideError();
});

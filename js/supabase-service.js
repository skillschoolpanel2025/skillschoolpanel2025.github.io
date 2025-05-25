class SupabaseService {
    constructor() {
        // Используем существующий клиент вместо создания нового
        this.client = window.supabaseClient;
        this.session = null;
        this.user = null;
        this.authorizedEmail = 'saralashvilischool2025@gmail.com';
        this.init();
    }

    async init() {
        try {
            const { data: { session }, error } = await this.client.auth.getSession();
            if (error) throw error;
            
            if (session) {
                if (session.user.email === this.authorizedEmail) {
                    this.session = session;
                    this.user = session.user;
                    return true;
                } else {
                    await this.signOut();
                    return false;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async signIn(email, password) {
        try {
            if (email !== this.authorizedEmail) {
                throw new Error('Доступ запрещен');
            }

            const { data, error } = await this.client.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.session = data.session;
            this.user = data.user;
            return data.user;
        } catch (error) {
            throw error;
        }
    }

    async signInWithGoogle() {
        try {
            const { data, error } = await this.client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        hd: 'gmail.com',
                        prompt: 'select_account',
                        access_type: 'offline' 
                    }
                }
            });

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    async signUp(email, password, userData) {
        try {
            if (this.user?.email !== this.authorizedEmail) {
                throw new Error('Недостаточно прав для создания пользователей');
            }

            const { data, error } = await this.client.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    }

    async signOut() {
        try {
            const { error } = await this.client.auth.signOut();
            if (error) throw error;

            localStorage.removeItem('supabase.auth.token');
            sessionStorage.removeItem('supabase.auth.token');
            this.session = null;
            this.user = null;
            return true;
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(email) {
        try {
            const { error } = await this.client.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Ошибка сброса пароля:', error);
            throw error;
        }
    }

    async updateUser(userData) {
        try {
            const { data, error } = await this.client.auth.updateUser({
                data: userData
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Ошибка обновления пользователя:', error);
            throw error;
        }
    }

    handleAuthError(error) {
        const errorMessages = {
            'Invalid login credentials': 'Неверные учетные данные',
            'Email not confirmed': 'Email не подтвержден',
            'User already registered': 'Пользователь уже зарегистрирован',
            'Password recovery requires an email': 'Для восстановления пароля требуется email',
            'New password should be different from the old password': 'Новый пароль должен отличаться от старого'
        };

        return new Error(errorMessages[error.message] || error.message);
    }

    isAuthenticated() {
        return !!this.session;
    }

    getCurrentUser() {
        return this.user;
    }

    getSession() {
        return this.session;
    }
}

window.supabaseService = new SupabaseService();



window.Database = window.Database || {};

// Определяем функцию createUser, которая отсутствовала
async function createUser(userData, role) {
    try {
        const { data, error } = await window.supabaseService.client
            .from(role + 's') // Добавляем 's' для названия таблицы (ученики, учителя, админы)
            .insert([userData]);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
        throw error;
    }
}

// Регистрируем функцию в глобальном объекте Database
window.Database.createUser = createUser;

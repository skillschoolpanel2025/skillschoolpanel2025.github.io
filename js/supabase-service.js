class SupabaseService {
    constructor() {
        this.client = window.supabase.createClient(
            'https://amwkvqajytcgzmzhntoz.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtd2t2cWFqeXRjZ3ptemhudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjc2ODUsImV4cCI6MjA2MjMwMzY4NX0.L_1gcvx3PqkOespMcwLWvMp4F4pEJOTxGU-DGr8OxBw'
        );
        this.session = null;
        this.user = null;
        this.init();
    }

    async init() {
        try {
            const { data: { session }, error } = await this.client.auth.getSession();
            if (error) throw error;
            
            if (session) {
                this.session = session;
                this.user = session.user;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Ошибка инициализации Supabase:', error);
            return false;
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.session = data.session;
            this.user = data.user;
            return data.user;
        } catch (error) {
            console.error('Ошибка входа:', error);
            throw error;
        }
    }

    async signInWithGoogle() {
        try {
            const { data, error } = await this.client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Ошибка входа через Google:', error);
            throw error;
        }
    }

    async signUp(email, password, userData) {
        try {
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
            console.error('Ошибка регистрации:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            const { error } = await this.client.auth.signOut();
            if (error) throw error;

            this.session = null;
            this.user = null;
            return true;
        } catch (error) {
            console.error('Ошибка выхода:', error);
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

async function createUser(userData) {
    let table = '';
    switch (userData.role) {
        case 'admin':
            table = 'admins';
            break;
        case 'student':
            table = 'students';  
            break;  
        case 'teacher':
            table = 'teachers';
            break;
        default:
            throw new Error('Неизвестная роль пользователя');
    }
    const insertData = { ...userData };
    delete insertData.role;
    const { data, error } = await window.supabaseService.client.from(table).insert([insertData]);
    if (error) throw error;
    return data;
}

window.Database = window.Database || {};
window.Database.createUser = createUser;
window.supabaseClient = window.supabase.createClient(
  'https://amwkvqajytcgzmzhntoz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtd2t2cWFqeXRjZ3ptemhudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjc2ODUsImV4cCI6MjA2MjMwMzY4NX0.L_1gcvx3PqkOespMcwLWvMp4F4pEJOTxGU-DGr8OxBw'
);

window.TABLES = {
    USERS: 'users',
    STUDENTS: 'students',
    TEACHERS: 'teachers',
    ADMINS: 'admins',
};

window.Database = {
    async init() {
        console.log('Инициализация завершена (создание таблиц через SQL Editor Supabase)');
    },

    async createUser(userData) {
        try {
            const { data: user, error: userError } = await window.supabaseClient
                .from(window.TABLES.USERS)
                .insert([{
                    email: userData.email,
                    password: userData.password,
                    role: userData.role
                }])
                .select()
                .single();
            
            if (userError) throw userError;

            let specificData;
            switch (userData.role) {
                case 'student':
                    specificData = {
                        user_id: user.id,
                        fullname: userData.fullName,
                        balance: userData.balance,
                        phone: userData.phone,
                        teachers: userData.teachers,
                    };
                    await this.createStudent(specificData);
                    break;
                case 'teacher':
                    specificData = {
                        user_id: user.id,
                        fullname: userData.fullName,
                    };
                    await this.createTeacher(specificData);
                    break;
                case 'admin':
                    specificData = {
                        user_id: user.id,
                        fullname: userData.fullName
                    };
                    await this.createAdmin(specificData);
                    break;
            }
            return user;
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            throw error;
        }
    },

    async getUserByEmail(email) {
        try {
            const { data, error } = await window.supabaseClient
                .from(window.TABLES.USERS)
                .select('*')
                .eq('email', email)
                .single();
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Ошибка при получении пользователя:', error);
            throw error;
        }
    },

    async createStudent(studentData) {
        try {
            const { data, error } = await window.supabaseClient
                .from(window.TABLES.STUDENTS)
                .insert([studentData])
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Ошибка при создании ученика:', error);
            throw error;
        }
    },

    async createTeacher(teacherData) {
        try {
            const { data, error } = await window.supabaseClient
                .from(window.TABLES.TEACHERS)
                .insert([teacherData])
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Ошибка при создании учителя:', error);
            throw error;
        }
    },

    async createAdmin(adminData) {
        try {
            const { data, error } = await window.supabaseClient
                .from(window.TABLES.ADMINS)
                .insert([adminData])
                .select();
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Ошибка при создании администратора:', error);
            throw error;
        }
    },

};

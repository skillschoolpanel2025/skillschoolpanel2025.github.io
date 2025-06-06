window.supabaseClient = window.supabase.createClient(
  'https://amwkvqajytcgzmzhntoz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtd2t2cWFqeXRjZ3ptemhudG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjc2ODUsImV4cCI6MjA2MjMwMzY4NX0.L_1gcvx3PqkOespMcwLWvMp4F4pEJOTxGU-DGr8OxBw',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: {
        getItem: (key) => {
          try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : null;
          } catch (e) {
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            sessionStorage.setItem(key, JSON.stringify(value));
          } catch (e) {}
        },
        removeItem: (key) => {
          try {
            sessionStorage.removeItem(key);
          } catch (e) {}
        }
      }
    }
  }
);

window.TABLES = {
    USERS: 'users',
    STUDENTS: 'students',
    TEACHERS: 'teachers',
    ADMINS: 'admins',
};

window.Database = {
    async init() {
        return true;
    },

    async createUser(userData) {
        try {
            console.log('Создание пользователя:', userData);
            if (!userData.email || !userData.password || !userData.role) {
                throw new Error('Необходимые поля отсутствуют');
            }

            // Проверяем, есть ли уже пользователь с таким email
            const { data: existingUser } = await window.supabaseClient
                .from(window.TABLES.USERS)
                .select('*')
                .eq('email', userData.email)
                .single();

            if (existingUser) {
                throw new Error('Пользователь с таким email уже существует');
            }

            // Создаем пользователя в таблице users
            const { data: user, error: userError } = await window.supabaseClient
                .from(window.TABLES.USERS)
                .insert([{
                    email: userData.email,
                    password: this.hashPassword(userData.password),
                    role: userData.role,
                    fullname: userData.fullname || ''
                }])
                .select()
                .single();
            
            if (userError) throw userError;

            let specificData;
            switch (userData.role) {
                case 'student':
                    specificData = {
                        user_id: user.id,
                        fullname: userData.fullname || userData.fullName || '',
                        balance: userData.balance || 0,
                        phone: userData.phone || '',
                        teachers: userData.teachers || []
                    };
                    console.log('Создание студента:', specificData);
                    await this.createStudent(specificData);
                    break;
                case 'teacher':
                    specificData = {
                        user_id: user.id,
                        fullname: userData.fullname || userData.fullName || ''
                    };
                    console.log('Создание учителя:', specificData);
                    await this.createTeacher(specificData);
                    break;
                case 'admin':
                    specificData = {
                        user_id: user.id,
                        fullname: userData.fullname || userData.fullName || ''
                    };
                    console.log('Создание администратора:', specificData);
                    await this.createAdmin(specificData);
                    break;
            }
            return user;
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            throw error;
        }
    },

    hashPassword(password) {
        try {
            return btoa(password + '_skillschool_secure');
        } catch (e) {
            return password;
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

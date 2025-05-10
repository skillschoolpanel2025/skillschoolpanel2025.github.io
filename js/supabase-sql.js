// SQL-запросы для создания функций в Supabase
const createGetTablesFunction = `
CREATE OR REPLACE FUNCTION get_tables()
RETURNS SETOF text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT tablename::text FROM pg_catalog.pg_tables 
  WHERE schemaname = 'public';
END;
$$;
`;

const createRunSqlQueryFunction = `
CREATE OR REPLACE FUNCTION run_sql_query(query_text text)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE 'WITH result AS (' || query_text || ') SELECT jsonb_agg(row_to_json(result)) FROM result' INTO result;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_array(jsonb_build_object('error', SQLERRM));
END;
$$;
`;

const createRLSPolicies = `
-- Политики для таблицы students
CREATE POLICY IF NOT EXISTS "Allow authenticated users to select students"
ON public.students
FOR SELECT TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert students"
ON public.students
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to update students"
ON public.students
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete students"
ON public.students
FOR DELETE TO authenticated
USING (true);

-- Политики для таблицы teachers
CREATE POLICY IF NOT EXISTS "Allow authenticated users to select teachers"
ON public.teachers
FOR SELECT TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert teachers"
ON public.teachers
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to update teachers"
ON public.teachers
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete teachers"
ON public.teachers
FOR DELETE TO authenticated
USING (true);

-- Политики для таблицы admins
CREATE POLICY IF NOT EXISTS "Allow authenticated users to select admins"
ON public.admins
FOR SELECT TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert admins"
ON public.admins
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to update admins"
ON public.admins
FOR UPDATE TO authenticated
USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete admins"
ON public.admins
FOR DELETE TO authenticated
USING (true);
`;

// Функция для выполнения SQL-запросов напрямую в базе данных
async function executeAdminSql(sqlQuery) {
    try {
        // Проверка на пустой запрос
        if (!sqlQuery || sqlQuery.trim() === '') {
            throw new Error('SQL запрос не может быть пустым');
        }
        
        // Проверка на опасные операции
        const dangerousCommands = ['DROP DATABASE', 'DROP SCHEMA public', 'TRUNCATE SCHEMA'];
        const queryUpperCase = sqlQuery.toUpperCase();
        for (const command of dangerousCommands) {
            if (queryUpperCase.includes(command)) {
                throw new Error(`Опасная операция '${command}' не разрешена для выполнения`);
            }
        }
        
        // Логируем запрос для отладки
        console.log('Выполняем SQL запрос:', sqlQuery);
        
        // Выполняем запрос
        const { data, error } = await window.supabaseService.client.rpc('run_sql_query', {
            query_text: sqlQuery
        });

        if (error) {
            console.error('Ошибка выполнения SQL:', error);
            throw error;
        }
        
        // Форматируем результат для лучшей читаемости
        if (data && typeof data === 'object') {
            // Проверка на ошибку в данных
            if (data[0] && data[0].error) {
                throw new Error(data[0].error);
            }
            
            return {
                success: true,
                rows: data,
                rowCount: Array.isArray(data) ? data.length : 0,
                timestamp: new Date().toISOString()
            };
        }
        
        return {
            success: true,
            message: 'Запрос выполнен успешно',
            timestamp: new Date().toISOString(),
            rows: []
        };
    } catch (error) {
        console.error('Ошибка при выполнении SQL-запроса:', error);
        return {
            success: false,
            error: error.message || 'Произошла ошибка при выполнении запроса',
            timestamp: new Date().toISOString()
        };
    }
}

// Функция для проверки и создания необходимых SQL-функций
async function setupDatabaseFunctions() {
    try {
        // Проверяем существование необходимых функций
        const { data: functionsExist, error } = await window.supabaseService.client
            .from('pg_proc')
            .select('proname')
            .eq('proname', 'get_tables')
            .limit(1);
            
        if (error) {
            console.log('Ошибка при проверке функций, попробуем создать их:', error);
            
            // Создаем функцию get_tables
            await executeAdminSql(createGetTablesFunction);
            console.log('Функция get_tables создана');
            
            // Создаем функцию run_sql_query
            await executeAdminSql(createRunSqlQueryFunction);
            console.log('Функция run_sql_query создана');
            
            // Создаем политики RLS
            await executeAdminSql(createRLSPolicies);
            console.log('Политики RLS созданы');
            
            return true;
        }
        
        // Если функции уже существуют
        return true;
    } catch (error) {
        console.error('Ошибка при настройке функций базы данных:', error);
        return false;
    }
}

// Инициализация настройки базы данных при загрузке
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await setupDatabaseFunctions();
        console.log('Функции базы данных успешно настроены');
    } catch (error) {
        console.error('Не удалось настроить функции базы данных:', error);
    }
});

// Экспортируем функции для использования в других файлах
window.SqlHelper = {
    executeAdminSql,
    setupDatabaseFunctions
};

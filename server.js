const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ОШИБКА: SUPABASE_URL или SUPABASE_SERVICE_KEY не настроены в .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Проверка подключения к Supabase
async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('authUser')
      .select('count', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('❌ Ошибка подключения к Supabase:', error.message);
      
      // Проверим, существует ли таблица authUser
      console.log('⚠️ Проверяю существование таблицы authUser...');
      
      // Попробуем создать таблицу если её нет
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS authUser (
          id SERIAL PRIMARY KEY,
          login TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          isCreator BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { 
        sql: createTableSQL 
      });
      
      if (createError) {
        console.log('📝 Создайте таблицу вручную в Supabase:');
        console.log('1. Откройте Supabase Dashboard');
        console.log('2. Перейдите в Table Editor');
        console.log('3. Создайте таблицу "authUser" с полями:');
        console.log('   - id: integer (primary key, auto increment)');
        console.log('   - login: text (unique)');
        console.log('   - password: text');
        console.log('   - isCreator: boolean');
        console.log('   - created_at: timestamptz');
        console.log('   - updated_at: timestamptz');
      } else {
        console.log('✅ Таблица authUser создана');
      }
    } else {
      console.log('✅ Подключение к Supabase успешно');
    }
  } catch (err) {
    console.error('❌ Ошибка при проверке подключения:', err.message);
  }
}

checkSupabaseConnection();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ==================== API МАРШРУТЫ ====================

// 1. Проверка сервера
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер работает!',
    supabase: supabaseUrl ? 'Подключен' : 'Не подключен'
  });
});

// 2. Регистрация нового пользователя
app.post('/api/auth/register', async (req, res) => {
  console.log('=== REGISTER REQUEST ===');
  console.log('Request body:', req.body);
  
  try {
    const { login, password } = req.body;

    // Валидация...
    
    console.log('Проверяем существующего пользователя...');
    const { data: existingUser, error: checkError } = await supabase
      .from('authUser')
      .select('id')
      .eq('login', login)
      .limit(1);

    if (checkError) {
      console.error('❌ Ошибка проверки пользователя в Supabase:', checkError);
      console.error('Код ошибки:', checkError.code);
      console.error('Сообщение:', checkError.message);
      console.error('Детали:', checkError.details);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка проверки пользователя: ' + checkError.message 
      });
    }

    console.log('Существующий пользователь:', existingUser);
    
    if (existingUser && existingUser.length > 0) {
      console.log('⚠️ Пользователь уже существует');
      return res.status(400).json({ 
        success: false,
        error: 'Пользователь с таким логином уже существует' 
      });
    }

    console.log('Хешируем пароль...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Пароль захэширован');

    console.log('Создаем пользователя в Supabase...');
    console.log('Данные для вставки:', {
      login: login,
      password: hashedPassword,
      isCreator: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const { data: newUser, error: insertError } = await supabase
      .from('authUser')
      .insert([{
        login: login,
        password: hashedPassword,
        isCreator: null  // или false, в зависимости от вашей логики
        // УБРАТЬ created_at и updated_at!
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Ошибка создания пользователя:', insertError);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка создания пользователя: ' + insertError.message 
      });
    }

    console.log('✅ Пользователь создан:', newUser);

    // Создаем сессию
    req.session.userId = newUser.id;
    req.session.login = login;
    req.session.isCreator = false;

    console.log('✅ Сессия создана');

    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      user: {
        id: newUser.id,
        login: newUser.login,
        isCreator: newUser.isCreator || false,
        created_at: newUser.created_at
      }
    });

  } catch (err) {
    console.error('❌ Неожиданная ошибка в регистрации:');
    console.error(err);
    console.error('Stack:', err.stack);
    
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера: ' + err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// 3. Вход пользователя
app.post('/api/auth/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Логин и пароль обязательны' 
      });
    }

    // Ищем пользователя
    const { data: user, error } = await supabase
      .from('authUser')
      .select('id, login, password, isCreator')
      .eq('login', login)
      .limit(1)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        success: false,
        error: 'Неверный логин или пароль' 
      });
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Неверный логин или пароль' 
      });
    }

    // Создаем сессию
    req.session.userId = user.id;
    req.session.login = user.login;
    req.session.isCreator = user.isCreator || false;

    res.json({
      success: true,
      message: 'Вход выполнен',
      user: {
        id: user.id,
        login: user.login,
        isCreator: user.isCreator || false
      }
    });

  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка авторизации' 
    });
  }
});

// 4. Проверка авторизации
app.get('/api/auth/check', (req, res) => {
  if (req.session.userId) {
    res.json({
      success: true,
      authenticated: true,
      user: {
        id: req.session.userId,
        login: req.session.login,
        isCreator: req.session.isCreator || false
      }
    });
  } else {
    res.json({
      success: true,
      authenticated: false,
      user: null
    });
  }
});

// 5. Выход
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка выхода' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Выход выполнен' 
    });
  });
});

// 6. Обновление статуса seller/buyer
app.post('/api/buyer_or_seller', async (req, res) => {
  try {
    // Проверяем авторизацию
    if (!req.session.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }

    const { isCreator } = req.body;

    if (isCreator === undefined) {
      return res.status(400).json({ 
        success: false,
        error: 'Поле isCreator обязательно' 
      });
    }

    // Обновляем статус в базе
    const { data, error } = await supabase
      .from('authUser')
      .update({ 
        isCreator: isCreator,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.session.userId)
      .select('id, login, isCreator')
      .single();

    if (error) {
      console.error('Ошибка обновления статуса:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка обновления данных' 
      });
    }

    // Обновляем сессию
    req.session.isCreator = isCreator;

    res.json({
      success: true,
      message: `Статус успешно обновлен на: ${isCreator ? 'Продавец' : 'Покупатель'}`,
      user: data
    });

  } catch (err) {
    console.error('Ошибка обновления статуса:', err);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// 7. Получение статуса пользователя
app.get('/api/user/status', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }

    const { data, error } = await supabase
      .from('authUser')
      .select('id, login, isCreator, created_at')
      .eq('id', req.session.userId)
      .single();

    if (error) {
      console.error('Ошибка получения статуса:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка получения данных' 
      });
    }

    res.json({
      success: true,
      isCreator: data.isCreator || false,
      user: data
    });

  } catch (err) {
    console.error('Ошибка получения статуса:', err);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📌 Проверка сервера: http://localhost:${PORT}/api/health`);
  console.log(`📌 Supabase URL: ${supabaseUrl ? '✅ Настроен' : '❌ Не настроен'}`);
});
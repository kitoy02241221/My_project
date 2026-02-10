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

// Middleware - ПРОСТОЙ И РАБОЧИЙ
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Сессия - ОБЯЗАТЕЛЬНО ДО ЛОГИРОВАНИЯ
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key-change-me',
  resave: true, // ИЗМЕНИЛ НА true
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax' // ДОБАВИЛ
  }
}));

// ПРОСТОЕ ЛОГИРОВАНИЕ БЕЗ ПЕРЕЗАПИСИ МЕТОДОВ
app.use((req, res, next) => {
  console.log('\n=== 📨 НОВЫЙ ЗАПРОС ===');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log(`🌐 ${req.method} ${req.url}`);
  console.log('👤 Session userId:', req.session?.userId);
  console.log('🍪 Cookies:', req.headers.cookie ? 'Есть' : 'Нет');
  next();
});

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
  
  try {
    const { login, password, name, surname } = req.body;

    if (!login || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Логин и пароль обязательны' 
      });
    }
    
    // Проверяем существующего пользователя
    const { data: existingUser, error: checkError } = await supabase
      .from('authUser')
      .select('id')
      .eq('login', login)
      .limit(1);

    if (checkError) {
      console.error('❌ Ошибка проверки пользователя:', checkError);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка проверки пользователя' 
      });
    }
    
    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Пользователь с таким логином уже существует' 
      });
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создаем пользователя
    const { data: newUser, error: insertError } = await supabase
      .from('authUser')
      .insert([{
        login: login,
        password: hashedPassword,
        name: name,
        surname: surname,
        role: false,
        roleChosen: false
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Ошибка создания пользователя:', insertError);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка создания пользователя' 
      });
    }

    // СОХРАНЯЕМ В СЕССИЮ
    req.session.userId = newUser.id;
    req.session.login = login;
    req.session.name = name;
    req.session.surname = surname;
    req.session.role = false;
    req.session.roleChosen = false;

    // СИНХРОНИЗИРУЕМ СЕССИЮ
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Сессия создана для пользователя:', newUser.id);

    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      user: {
        id: newUser.id,
        login: newUser.login,
        name: newUser.name,
        surname: newUser.surname,
        role: newUser.role || false,
        roleChosen: newUser.roleChosen || false,
        created_at: newUser.created_at
      }
    });

  } catch (err) {
    console.error('❌ Неожиданная ошибка в регистрации:', err);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// 3. Вход пользователя
app.post('/api/auth/login', async (req, res) => {
  console.log('=== LOGIN REQUEST ===');
  
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Логин и пароль обязательны' 
      });
    }

    const { data: user, error } = await supabase
      .from('authUser')
      .select('id, login, password, role, roleChosen')
      .eq('login', login)
      .limit(1)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        success: false,
        error: 'Неверный логин или пароль' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Неверный логин или пароль' 
      });
    }

    // СОХРАНЯЕМ В СЕССИЮ
    req.session.userId = user.id;
    req.session.login = user.login;
    req.session.role = user.role || false;
    req.session.roleChosen = user.roleChosen || false;

    // СИНХРОНИЗИРУЕМ СЕССИЮ
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('✅ Пользователь вошел:', user.id);

    res.json({
      success: true,
      message: 'Вход выполнен',
      user: {
        id: user.id,
        login: user.login,
        role: user.role || false,
        roleChosen: user.roleChosen || false
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
  console.log('=== AUTH CHECK ===');
  console.log('Session userId:', req.session.userId);
  
  if (req.session.userId) {
    res.json({
      success: true,
      authenticated: true,
      user: {
        id: req.session.userId,
        login: req.session.login,
        role: req.session.role || false,
        roleChosen: req.session.roleChosen || false
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
  console.log('=== LOGOUT ===');
  
  req.session.destroy((err) => {
    if (err) {
      console.error('Ошибка выхода:', err);
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























// ==================== КОРЗИНА (inCart) ====================

// 1. Добавить товар в корзину
app.post('/api/cart/add', async (req, res) => {
  console.log('=== CART ADD DEBUG ===');
  
  try {
    const userId = req.session.userId;
    console.log('👤 UserId из сессии:', userId);
    
    if (!userId) {
      console.log('❌ Нет userId в сессии. Вся сессия:', req.session);
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }

    const { product_id, quantity = 1 } = req.body;
    console.log('📦 Полученные данные:', { product_id, quantity });

    // 1. Проверь что товар существует
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', product_id)
      .maybeSingle();
    
    console.log('🛍️ Товар из БД:', { product, productError });
    
    if (productError) {
      throw productError;
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Товар не найден'
      });
    }

    // 2. Проверь корзину (оставь твой код)
    const { data: existingItem, error: checkError } = await supabase
      .from('inCart')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .maybeSingle();

    console.log('🛒 Существующий товар в корзине:', { existingItem, checkError });

    let result;

    if (existingItem) {
      console.log('🔄 Обновление с', existingItem.quantity, 'на', existingItem.quantity + quantity);
      
      const { data, error } = await supabase
        .from('inCart')
        .update({ 
          quantity: existingItem.quantity + quantity,
        })
        .eq('id', existingItem.id)
        .select()
        .single();

      console.log('📝 Результат обновления:', { data, error });
      
      if (error) throw error;
      result = data;
    } else {
      console.log('🆕 Вставка нового товара');
      
      const { data, error } = await supabase
        .from('inCart')
        .insert([{
          user_id: userId,
          product_id: product_id,
          quantity: quantity,
        }])
        .select()
        .single();

      console.log('📝 Результат вставки:', { data, error });
      
      if (error) throw error;
      result = data;
    }

    // 3. Проверь что действительно добавилось
    const { data: verify, error: verifyError } = await supabase
      .from('inCart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .single();
    
    console.log('✅ Проверка после операции:', { verify, verifyError });

    console.log('🎉 Финальный результат:', result);

    res.json({
      success: true,
      message: 'Товар добавлен в корзину',
      item: result,
      debug: { // временно для отладки
        userId,
        productExists: !!product,
        operation: existingItem ? 'update' : 'insert',
        verifyResult: verify
      }
    });

  } catch (err) {
    console.error('❌ Ошибка добавления в корзину:', err);
    console.error('❌ Stack:', err.stack);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка добавления в корзину',
      details: err.message
    });
  }
});

// 2. Получить корзину пользователя
app.get('/api/cart', async (req, res) => {
  console.log('=== GET CART ===');
  console.log('Session userId:', req.session.userId);

  try {
    const userId = req.session.userId;
    
    if (!userId) {
      console.log('❌ Нет userId в сессии');
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован'
      });
    }

    console.log('✅ User authenticated, userId:', userId);

    // 1. Получаем товары из корзины
    const { data: cartItems, error: cartError } = await supabase
      .from('inCart')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (cartError) {
      console.error('❌ Ошибка получения корзины:', cartError);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка получения корзины'
      });
    }

    if (!cartItems || cartItems.length === 0) {
      console.log('🛒 Корзина пуста');
      return res.json({
        success: true,
        items: [],
        total: 0,
        count: 0
      });
    }

    // 2. Получаем ID всех товаров для запроса
    const productIds = cartItems.map(item => item.product_id);
    
    // 3. Получаем информацию о товарах С image_url
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, description, price, image_url, created_at, updated_at, user_id')
      .in('id', productIds);

    if (productsError) {
      console.error('❌ Ошибка получения товаров:', productsError);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка получения товаров'
      });
    }

    // 4. Собираем данные вместе
    const productMap = {};
    products.forEach(product => {
      productMap[product.id] = product;
    });

    // 5. Формируем ответ
    let total = 0;
    const formattedItems = cartItems.map(item => {
      const product = productMap[item.product_id] || {};
      const itemTotal = (product.price || 0) * item.quantity;
      total += itemTotal;
      
      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        created_at: item.created_at,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          created_at: product.created_at,
          updated_at: product.updated_at,
          user_id: product.user_id
        },
        item_total: itemTotal,
      };
    });

    console.log('✅ Cart returned, items:', formattedItems.length);

    res.json({
      success: true,
      items: formattedItems,
      total: total,
      count: formattedItems.length
    });

  } catch (err) {
    console.error('❌ Общая ошибка:', err);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// 3. Обновить количество товара в корзине
app.put('/api/cart/update/:id', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }

    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Количество должно быть больше 0' 
      });
    }

    // Проверяем, что товар принадлежит пользователю
    const { data: existingItem, error: checkError } = await supabase
      .from('inCart')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingItem) {
      return res.status(404).json({ 
        success: false,
        error: 'Товар не найден в вашей корзине' 
      });
    }

    // Обновляем количество
    const { data, error } = await supabase
      .from('inCart')
      .update({ 
        quantity: quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Количество обновлено',
      item: data
    });

  } catch (err) {
    console.error('Ошибка обновления корзины:', err);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка обновления корзины' 
    });
  }
});

// 4. Удалить товар из корзины
app.delete('/api/cart/remove/:id', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }

    const { id } = req.params;

    // Проверяем, что товар принадлежит пользователю
    const { data: existingItem, error: checkError } = await supabase
      .from('inCart')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingItem) {
      return res.status(404).json({ 
        success: false,
        error: 'Товар не найден в вашей корзине' 
      });
    }

    // Удаляем товар
    const { error } = await supabase
      .from('inCart')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Товар удален из корзины'
    });

  } catch (err) {
    console.error('Ошибка удаления из корзины:', err);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка удаления из корзины' 
    });
  }
});

// 5. Очистить корзину пользователя
app.delete('/api/cart/clear', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }

    // Удаляем все товары пользователя из корзины
    const { error } = await supabase
      .from('inCart')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Корзина очищена'
    });

  } catch (err) {
    console.error('Ошибка очистки корзины:', err);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка очистки корзины' 
    });
  }
});

// 6. Получить количество товаров в корзине
app.get('/api/cart/count', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.json({
        success: true,
        count: 0,
        total_items: 0
      });
    }

    const { data: cartItems, error } = await supabase
      .from('inCart')
      .select('quantity')
      .eq('user_id', userId);

    if (error) {
      console.error('Ошибка получения количества товаров:', error);
      return res.json({
        success: true,
        count: 0,
        total_items: 0
      });
    }

    const totalItems = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);
    const uniqueItems = (cartItems || []).length;

    res.json({
      success: true,
      count: uniqueItems,
      total_items: totalItems
    });

  } catch (err) {
    console.error('Ошибка получения количества товаров:', err);
    res.json({
      success: true,
      count: 0,
      total_items: 0
    });
  }
});

// 7. Проверить, есть ли товар в корзине пользователя
app.get('/api/cart/check/:product_id', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.json({
        success: true,
        in_cart: false,
        quantity: 0
      });
    }

    const { product_id } = req.params;

    const { data: cartItem, error } = await supabase
      .from('inCart')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .single();

    if (error || !cartItem) {
      console.log("ошибка, товар не в корзине")
      return res.json({
        success: true,
        in_cart: false,
        quantity: 0
      });
    }

    res.json({
      success: true,
      in_cart: true,
      quantity: cartItem.quantity,
      cart_item_id: cartItem.id
    });

  } catch (err) {
    console.error('Ошибка проверки товара в корзине:', err);
    res.json({
      success: true,
      in_cart: false,
      quantity: 0
    });
  }
});


















// ==================== ТОВАРЫ ====================

// Загрузка изображения на Supabase Storage
const uploadImageToStorage = async (base64Image, userId) => {
  console.log('=== UPLOAD IMAGE DEBUG START ===');
  
  try {
    // 1. Проверка входных данных
    console.log('📥 Входные данные:');
    console.log('   userId:', userId);
    console.log('   base64Image type:', typeof base64Image);
    console.log('   base64Image length:', base64Image?.length || 0);
    
    if (!base64Image || typeof base64Image !== 'string') {
      console.error('❌ base64Image не строка или пусто');
      throw new Error('Нет данных изображения');
    }
    
    // 2. Проверка формата
    console.log('🔍 Проверка формата...');
    console.log('   Начинается с data:image/?', base64Image.startsWith('data:image/'));
    
    const matches = base64Image.match(/^data:image\/([a-zA-Z]+);base64,/);
    console.log('   Регулярка нашла:', matches);
    
    if (!matches) {
      console.log('   Первые 100 символов:', base64Image.substring(0, 100));
      throw new Error('Некорректный формат base64. Ожидается data:image/...;base64,...');
    }
    
    const imageType = matches[1].toLowerCase();
    console.log('✅ Тип изображения:', imageType);
    
    // 3. Извлечение base64 данных
    console.log('🔧 Извлекаю base64 данные...');
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    console.log('   Длина после очистки:', base64Data.length);
    console.log('   Первые 50 символов данных:', base64Data.substring(0, 50));
    
    if (!base64Data || base64Data.length < 100) {
      throw new Error('Слишком мало данных после очистки');
    }
    
    // 4. Конвертация в Buffer
    console.log('🔄 Конвертация в Buffer...');
    let buffer;
    try {
      buffer = Buffer.from(base64Data, 'base64');
      console.log('   Успешно. Размер буфера:', buffer.length, 'байт');
    } catch (bufferError) {
      console.error('❌ Ошибка создания Buffer:', bufferError.message);
      throw new Error('Некорректные base64 данные');
    }
    
    if (buffer.length === 0) {
      throw new Error('Буфер пустой');
    }
    
    // 5. Подготовка к загрузке в Supabase
    const fileName = `product_${userId}_${Date.now()}.${imageType === 'jpg' ? 'jpeg' : imageType}`;
    const filePath = `products/${userId}/${fileName}`;
    
    console.log('📁 Параметры загрузки:');
    console.log('   fileName:', fileName);
    console.log('   filePath:', filePath);
    console.log('   contentType:', `image/${imageType}`);
    console.log('   buffer size:', buffer.length, 'bytes');
    
    // 6. Загрузка в Supabase Storage
    console.log('🚀 Отправляю в Supabase Storage...');
    const uploadStartTime = Date.now();
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, buffer, {
        contentType: `image/${imageType}`,
        upsert: false
      });
    
    const uploadTime = Date.now() - uploadStartTime;
    console.log(`   Время загрузки: ${uploadTime}ms`);
    
    if (error) {
      console.error('❌ Ошибка Supabase Storage:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // Проверка конкретных ошибок
      if (error.message.includes('bucket') || error.message.includes('Bucket')) {
        console.error('⚠️ Возможно bucket "product-images" не существует в Supabase');
      }
      
      if (error.message.includes('JWT')) {
        console.error('⚠️ Проблема с аутентификацией Supabase');
      }
      
      throw error;
    }
    
    console.log('✅ Успешно загружено в Storage. Data:', data);
    
    // 7. Получение публичного URL
    console.log('🔗 Получаю публичный URL...');
    const { data: urlData, error: urlError } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    if (urlError) {
      console.error('❌ Ошибка получения URL:', urlError);
      throw urlError;
    }
    
    console.log('✅ Публичный URL:', urlData.publicUrl);
    console.log('=== UPLOAD IMAGE DEBUG END ===');
    
    return urlData.publicUrl;
    
  } catch (error) {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА ЗАГРУЗКИ:', {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack
    });
    console.log('=== UPLOAD IMAGE DEBUG END WITH ERROR ===');
    throw error;
  }
};

// Создание нового товара
app.post('/api/products/create', async (req, res) => {
  console.log('=== CREATE PRODUCT ===');
  
  try {
    console.log('📦 Тело запроса получено');
    console.log('Ключи:', Object.keys(req.body || {}));
    
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }
    
    const { name, description, price, image_base64 } = req.body;
    
    console.log('📊 Данные:', {
      name: name,
      price: price,
      description: description,
      image_base64_length: image_base64?.length || 0
    });
    
    // Валидация
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Название товара обязательно' 
      });
    }
    
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Цена должна быть положительным числом' 
      });
    }
    
    // Обработка изображения
    let image_url = null;
    
    if (image_base64 && typeof image_base64 === 'string' && 
        image_base64.trim() !== "" && image_base64.startsWith('data:image/')) {
      
      console.log('🖼️ Загружаю изображение...');
      
      try {
        image_url = await uploadImageToStorage(image_base64, userId);
        console.log('✅ Изображение загружено, URL:', image_url);
      } catch (uploadError) {
        console.error('⚠️ Ошибка загрузки изображения:', uploadError.message);
        image_url = null;
      }
    } else {
      console.log('ℹ️ Нет изображения для загрузки');
    }
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([{
        name: name.trim(),
        description: (description || '').trim(),
        price: priceNum,
        image_url: image_url,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (productError) {
      console.error('❌ Ошибка Supabase:', productError);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка создания товара'
      });
    }
    
    console.log('🎉 ТОВАР СОЗДАН! ID:', product.id);
    
    res.status(201).json({
      success: true,
      message: image_url ? 'Товар создан с изображением' : 'Товар создан (без изображения)',
      product: product,
      hasImage: !!image_url
    });
    
  } catch (err) {
    console.error('💥 Критическая ошибка:', err.message);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// Получение товаров пользователя
app.get('/api/products/my', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Ошибка получения товаров:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка получения товаров' 
      });
    }
    
    res.json({
      success: true,
      products: products || []
    });
    
  } catch (err) {
    console.error('Ошибка получения товаров:', err);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Получение всех товаров (публичный)
app.get('/api/products', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Ошибка получения товаров:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка получения товаров' 
      });
    }
    
    res.json({
      success: true,
      products: products || []
    });
    
  } catch (err) {
    console.error('Ошибка получения товаров:', err);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера' 
    });
  }
});












// Выбор роли
app.post('/api/user/choose-role', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }

    const { isSeller } = req.body;

    if (isSeller === undefined) {
      return res.status(400).json({ 
        success: false,
        error: 'Поле isSeller обязательно (true/false)' 
      });
    }

    const { data, error } = await supabase
      .from('authUser')
      .update({ 
        role: isSeller,
        roleChosen: true,
      })
      .eq('id', userId)
      .select('id, login, role, roleChosen')
      .single();

    if (error) {
      console.error('Ошибка обновления роли:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка обновления роли' 
      });
    }

    req.session.role = isSeller;
    req.session.roleChosen = true;

    // СИНХРОНИЗИРУЕМ СЕССИЮ
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: `Роль успешно выбрана: ${isSeller ? 'Продавец' : 'Покупатель'}`,
      user: data
    });

  } catch (err) {
    console.error('Ошибка выбора роли:', err);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Получение статуса пользователя
app.get('/api/user/status', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }

    const { data, error } = await supabase
      .from('authUser')
      .select('id, login, role, roleChosen')
      .eq('id', userId)
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
      role: data.role || false,
      roleChosen: data.roleChosen || false,
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

// Проверка выбрана ли роль
app.get('/api/user/role-check', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }

    const { data, error } = await supabase
      .from('authUser')
      .select('roleChosen, role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Ошибка проверки роли:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка проверки роли' 
      });
    }

    res.json({
      success: true,
      roleChosen: data.roleChosen || false,
      role: data.role || false
    });

  } catch (err) {
    console.error('Ошибка проверки роли:', err);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Получение текущей роли
app.get('/api/user/role', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }

    const { data, error } = await supabase
      .from('authUser')
      .select('role, roleChosen')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Ошибка получения роли:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка получения роли' 
      });
    }

    res.json({
      success: true,
      role: data.role || false,
      roleChosen: data.roleChosen || false
    });

  } catch (err) {
    console.error('Ошибка получения роли:', err);
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
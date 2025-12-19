const API_URL = 'http://localhost:3001/api';

// Проверка соединения с backend
export const checkBackend = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) throw new Error('Backend не отвечает');
    const data = await response.json();
    return {
      ...data,
      database: data.database || 'unknown'
    };
  } catch (error) {
    throw new Error('Backend сервер не доступен');
  }
};

// Вход пользователя
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка входа');
    }
    
    if (data.success && data.user) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Ошибка подключения к серверу');
  }
};

// Регистрация пользователя
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка регистрации');
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Ошибка подключения к серверу');
  }
};

// Получить всех пользователей
export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка загрузки пользователей');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Ошибка подключения к серверу');
  }
};

// Обновить пользователя
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка обновления пользователя');
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Ошибка подключения к серверу');
  }
};

// Удалить пользователя
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка удаления пользователя');
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Ошибка подключения к серверу');
  }
};

// Поиск пользователей
export const searchUsers = async (query) => {
  try {
    const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка поиска');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Ошибка подключения к серверу');
  }
};

// Получить статистику
export const getStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка загрузки статистики');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Ошибка подключения к серверу');
  }
};

// Выход пользователя
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  return Promise.resolve({ success: true, message: 'Выход выполнен' });
};

// Получить текущего пользователя из localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Проверить, авторизован ли пользователь
export const isAuthenticated = () => {
  return !!getCurrentUser();
};

// Проверить, является ли пользователь админом
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};
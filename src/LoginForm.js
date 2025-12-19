import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './api';
import './LoginForm.css';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Введите логин и пароль');
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await loginUser({
        username: username,
        password: password
      });

      if (result.success) {
        if (onLogin) {
          onLogin(result.user);
        }
        navigate('/main');
      } else {
        setError(result.error || 'Ошибка входа');
      }
    } catch (err) {
      setError(err.message || 'Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Функция восстановления пароля в разработке');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Вход в систему</h2>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин или Email:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите ваш логин или email"
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="links">
          <p>
            <a href="#" onClick={handleForgotPassword}>
              Забыли пароль?
            </a> 
            | 
            <a href="#" onClick={handleRegisterClick}>
              Регистрация
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
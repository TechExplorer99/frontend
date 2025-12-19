import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
  isAdmin,
  logoutUser,
} from './api';
import './MainSite.css';

function MainSite({ username, userRole, onLogout }) {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const [activeTab, setActiveTab] = useState('главная');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const storedUser = getCurrentUser();
  const currentUser = storedUser || {
    username: username || 'Пользователь',
    role: userRole || 'user',
  };
  const isUserAdmin = isAdmin() || currentUser.role === 'admin';

  const tabs = [
    { id: 'главная', label: 'Главная' },
    { id: 'о-нас', label: 'О нас' },
    { id: 'галерея', label: 'Галерея' },
    { id: 'поддержка', label: 'Поддержка' },
    { id: 'пользователи', label: 'Пользователи' },
  ];

  useEffect(() => {
    if (activeTab === 'пользователи') {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await getUsers();
      if (result.success) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      alert('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      const result = await deleteUser(userId);
      if (result.success) {
        alert('Пользователь удален');
        loadUsers();
      }
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error);
      alert(error.message || 'Не удалось удалить пользователя');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!editForm.username.trim() || !editForm.email.trim()) {
      alert('Заполните все обязательные поля');
      return;
    }

    const updateData = {
      username: editForm.username,
      email: editForm.email,
    };

    if (editForm.password.trim()) {
      if (editForm.password.length < 6) {
        alert('Пароль должен быть не менее 6 символов');
        return;
      }
      updateData.password = editForm.password;
    }

    if (isUserAdmin && editForm.role) {
      updateData.role = editForm.role;
    }

    try {
      const result = await updateUser(editingUser, updateData);
      if (result.success) {
        alert('Данные пользователя обновлены');
        setEditingUser(null);
        setEditForm({ username: '', email: '', password: '', role: 'user' });
        loadUsers();
      }
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
      alert(error.message || 'Не удалось обновить данные пользователя');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ username: '', email: '', password: '', role: 'user' });
  };

  const renderUsersTab = () => {
    if (!isUserAdmin) {
      return <p>Только администратор может просматривать и редактировать пользователей.</p>;
    }

    if (loading) {
      return <p>Загрузка пользователей...</p>;
    }

    const filteredUsers = users.filter((user) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        user.username.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        String(user.id).includes(q)
      );
    });

    if (!users.length) {
      return <p className="no-users">Пользователи не найдены.</p>;
    }

    return (
      <div className="users-tab">
        <div className="users-header">
          <div>
            <h2>Пользователи</h2>
            <p className="users-subtitle">
              Всего: {users.length}
              {searchQuery.trim() && ` · Отфильтровано: ${filteredUsers.length}`}
            </p>
          </div>
          <div className="users-search">
            <input
              type="text"
              placeholder="Поиск по имени, email или ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Создан</th>
              <th>Последнее обновление</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser === user.id && isUserAdmin ? (
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleEditChange}
                      className="edit-input"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>{user.created_at}</td>
                <td>
                  <div className="updated-info">{user.updated_at}</div>
                </td>
                <td className="actions-cell">
                  {editingUser === user.id ? (
                    <>
                      <button className="save-btn" onClick={handleSaveEdit}>
                        Сохранить
                      </button>
                      <button className="cancel-btn" onClick={handleCancelEdit}>
                        Отмена
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditUser(user)}
                      >
                        Изменить
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Удалить
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'о-нас':
        return (
          <div className="container">
            <div className="content-section">
              <p>Это демонстрационный сайт после входа в систему.</p>
            </div>
          </div>
        );
      case 'галерея':
        return (
          <div className="container">
            <div className="content-section">
              <p>Здесь могла бы быть ваша галерея.</p>
            </div>
          </div>
        );
      case 'поддержка':
        return (
          <div className="container">
            <div className="content-section">
              <p>По вопросам поддержки обращайтесь к администратору.</p>
            </div>
          </div>
        );
      case 'пользователи':
        return (
          <div className="container">
            <div className="content-section users-content">
              {renderUsersTab()}
            </div>
          </div>
        );
      case 'главная':
      default:
        return (
          <div className="container">
            <div className="content-section">
              <h2>Добро пожаловать, {currentUser.username}!</h2>
              <p>Вы успешно вошли в систему.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="main-site">
      <header className="main-header">
        <div className="logo">My Login App</div>

        <nav className="main-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="user-info">
          <span>
            {currentUser.username} ({currentUser.role})
          </span>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </header>

      <main className="main-content">{renderContent()}</main>

      <footer className="site-footer">
        <div>© {currentYear} My Login App. Все права защищены.</div>
        <div className="footer-links">
          <a href="#privacy">Политика конфиденциальности</a>
          <a href="#terms">Условия использования</a>
        </div>
      </footer>
    </div>
  );
}

export default MainSite;
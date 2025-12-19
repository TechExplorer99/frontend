import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import Register from './Register';
import MainSite from './MainSite';
import { getCurrentUser } from './api';
import './styles.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            !isAuthenticated ? 
              <LoginForm onLogin={handleLogin} /> : 
              <Navigate to="/main" />
          } />
          <Route path="/register" element={
            !isAuthenticated ? 
              <Register /> : 
              <Navigate to="/main" />
          } />
          <Route path="/main" element={
            isAuthenticated ? 
              <MainSite 
                username={currentUser?.username} 
                userRole={currentUser?.role}
                onLogout={handleLogout} 
              /> : 
              <Navigate to="/" />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
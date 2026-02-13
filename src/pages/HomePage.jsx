

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth.jsx';
import LoginPopup from '../components/LoginPopup';
import '../styles/HomePage.css';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [typed, setTyped] = useState('');
  const fullText = 'Bienvenido a la UI de usuario para nuestro proyecto backend.';
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const hasSession = Boolean(token);

  useEffect(() => {
    setTyped('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        i++;
        setTyped(fullText.substring(0, i));
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-root">
      <div className="home-title" style={{ minHeight: 60, letterSpacing: 1.2 }}>
        {typed}
        <span className="type-cursor">|</span>
      </div>
      <div className="home-subtitle">Inicia sesión para tener acceso al CRUD de productos.</div>
      <div className="home-btns">
        <button
          className="home-btn primary"
          onClick={() => {
            if (hasSession) {
              navigate('/productos');
              return;
            }
            setShowLogin(true);
          }}
        >
          {hasSession ? 'Sesión iniciada' : 'Iniciar sesión'}
        </button>
        <button
          className="home-btn secondary"
          onClick={() => {
            logout();
            navigate('/productos');
          }}
        >
          Entrar como invitado
        </button>
      </div>
      <LoginPopup open={!hasSession && showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}

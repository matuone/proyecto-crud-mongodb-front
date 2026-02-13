

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth.jsx';
import LoginPopup from '../components/LoginPopup';
import '../styles/HomePage.css';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [typed, setTyped] = useState('');
  const fullText = 'Bienvenido a la UI de usuario para nuestro proyecto backend.';
  const navigate = useNavigate();
  const { login } = useAuth();

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
      <div className="home-subtitle">¡Accede como administrador, usuario o invitado!</div>
      <div className="home-btns">
        <button className="home-btn primary" onClick={() => setShowLogin(true)}>
          Iniciar sesión
        </button>
        <button
          className="home-btn secondary"
          onClick={() => {
            login('guest-token');
            navigate('/productos');
          }}
        >
          Entrar como invitado
        </button>
      </div>
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
    </div>
  );
}

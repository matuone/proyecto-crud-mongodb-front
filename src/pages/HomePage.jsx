
import React, { useState, useEffect } from 'react';
import LoginPopup from '../components/LoginPopup';
import '../styles/HomePage.css';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [typed, setTyped] = useState('');
  const fullText = 'Bienvenido a la UI de usuario para nuestro proyecto backend.';

  useEffect(() => {
    let i = 0;
    setTyped('');
    const interval = setInterval(() => {
      setTyped((prev) =>
        i < fullText.length ? prev + fullText[i] : prev
      );
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
    // eslint-disable-next-line
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
        <button className="home-btn secondary" onClick={() => setShowLogin(true)}>
          Entrar como invitado
        </button>
      </div>
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
    </div>
  );
}

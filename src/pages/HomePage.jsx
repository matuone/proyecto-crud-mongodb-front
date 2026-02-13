import React, { useState } from 'react';
import LoginPopup from '../components/LoginPopup';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h1>Bienvenido a la tienda</h1>
      <button onClick={() => setShowLogin(true)}>
        Iniciar sesión
      </button>
      <button style={{ marginLeft: 10 }} onClick={() => setShowLogin(true)}>
        Entrar como invitado
      </button>
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
    </div>
  );
}

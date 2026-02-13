import React, { createContext, useState, useContext } from 'react';

// Decodifica un JWT y retorna el payload (sin validación de firma)
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) return JSON.parse(stored);
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.usuario) return payload.usuario;
    }
    return null;
  });

  const login = (jwt, userData = null) => {
    if (!jwt) return;

    localStorage.setItem('token', jwt);
    setToken(jwt);

    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      // Intentar extraer usuario del token si no viene userData
      const payload = parseJwt(jwt);
      if (payload && payload.usuario) {
        setUser(payload.usuario);
        localStorage.setItem('user', JSON.stringify(payload.usuario));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

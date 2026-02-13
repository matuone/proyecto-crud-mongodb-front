
import React, { useState } from 'react';
import { useAuth } from '../auth/auth.jsx';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';

export default function LoginPopup({ onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    if (role === 'guest') {
      login('guest-token');
      onClose();
      return;
    }
    try {
      const res = await axios.post('URL_DE_TU_API/login', { email, password, role });
      login(res.data.token);
      onClose();
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <Dialog open onClose={onClose} transitionDuration={400}>
      <form onSubmit={handleLogin}>
        <DialogTitle>Iniciar sesión</DialogTitle>
        <DialogContent>
          <Select
            value={role}
            onChange={e => setRole(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="user">Usuario</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="guest">Invitado</MenuItem>
          </Select>
          {role !== 'guest' && (
            <>
              <TextField
                type="email"
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                type="password"
                label="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
          {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained">Entrar</Button>
          <Button onClick={onClose} variant="outlined">Cancelar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

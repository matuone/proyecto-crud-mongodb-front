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
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPopup({ onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (role === 'guest') {
      login('guest-token', { rol: 'guest', nombre: 'Invitado', email: 'guest@guest.com' });
      onClose();
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/usuarios/login', { email, contraseña: password });
      if (res.data.token) {
        login(res.data.token, res.data.usuario);
        onClose();
      } else {
        setError('No se recibió token del servidor');
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <Dialog
        open
        onClose={onClose}
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, scale: 0.92, y: 40 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.92, y: 40 },
          transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
          sx: {
            background: 'linear-gradient(135deg, rgba(30,41,59,0.96) 60%, rgba(91,33,182,0.96) 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
            borderRadius: 4,
            p: 0,
            overflow: 'visible',
            minWidth: 350,
            maxWidth: 400,
            mx: 'auto',
          },
        }}
      >
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 700, fontSize: '1.5rem', color: '#fff', letterSpacing: 1 }}>
            Iniciar sesión
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', background: 'transparent', pb: 0 }}>
            <Select
              value={role}
              onChange={e => setRole(e.target.value)}
              fullWidth
              sx={{
                mb: 2,
                background: 'rgba(51,65,85,0.92)',
                color: '#fff',
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '& .MuiSvgIcon-root': { color: '#fff' }
              }}
              MenuProps={{
                PaperProps: {
                  sx: { background: '#232946', color: '#fff' }
                }
              }}
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
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(51,65,85,0.92)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#7c3aed' }
                    },
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#cbd5e1' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#7c3aed' }
                  }}
                />
                <TextField
                  type="password"
                  label="Contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  fullWidth
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(51,65,85,0.92)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#7c3aed' }
                    },
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#cbd5e1' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#7c3aed' }
                  }}
                />
              </>
            )}
            {error && (
              <div style={{ color: '#f87171', marginBottom: 8, fontSize: '0.97rem', textAlign: 'center', width: '100%' }}>
                {error}
              </div>
            )}
          </DialogContent>
          <DialogActions sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 3, pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                background: 'linear-gradient(90deg, #2563eb 60%, #7c3aed 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                py: 1.2,
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1e40af 60%, #6d28d9 100%)',
                  boxShadow: '0 6px 16px rgba(37,99,235,0.35)',
                },
                '&:disabled': {
                  background: 'rgba(148,163,184,0.5)',
                  color: 'rgba(255,255,255,0.5)',
                }
              }}
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </Button>
            <Button
              onClick={onClose}
              variant="outlined"
              fullWidth
              sx={{
                color: '#fff',
                borderColor: 'rgba(100,116,139,0.5)',
                borderRadius: 2,
                py: 1.2,
                fontWeight: 500,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'rgba(51,65,85,0.3)',
                '&:hover': {
                  background: 'rgba(71,85,105,0.5)',
                  borderColor: '#7c3aed',
                },
              }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </AnimatePresence>
  );
}
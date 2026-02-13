import React, { useState } from 'react';
import { useAuth } from '../auth/auth.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

function LoginPopup({ open, onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const EyeOpenIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12C3.8 8.5 7.3 6 12 6C16.7 6 20.2 8.5 22 12C20.2 15.5 16.7 18 12 18C7.3 18 3.8 15.5 2 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );

  const EyeClosedIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.6 6.2C11.06 6.07 11.53 6 12 6C16.7 6 20.2 8.5 22 12C21.2 13.56 20.1 14.9 18.75 15.92" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.1 14.3C13.57 14.74 12.82 15 12 15C10.34 15 9 13.66 9 12C9 11.18 9.26 10.43 9.7 9.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.1 6.9C4.43 8.09 3.07 9.84 2 12C3.8 15.5 7.3 18 12 18C13.6 18 15.05 17.71 16.35 17.18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/usuarios/login`, { email, contraseña: password });
      if (res.data.token) {
        login(res.data.token, res.data.usuario);
        onClose && onClose();
        navigate('/productos');
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
      {open && (
        <Dialog
          open={open}
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
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'stretch', background: 'transparent', pb: 0 }}>
              {/* Solo login de administrador */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <label htmlFor="login-email" style={{ color: '#a0aec0', fontSize: '0.95rem', fontWeight: 500 }}>
                  Usuario
                </label>
                <TextField
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoComplete="username"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(51,65,85,0.92)',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#7c3aed' }
                    },
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputBase-input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px rgba(51,65,85,0.92) inset',
                      WebkitTextFillColor: '#fff',
                      transition: 'background-color 9999s ease-out 0s',
                      caretColor: '#fff',
                      borderRadius: '8px',
                    }
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <label htmlFor="login-password" style={{ color: '#a0aec0', fontSize: '0.95rem', fontWeight: 500 }}>
                  Contraseña *
                </label>
                <TextField
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  fullWidth
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                          sx={{ color: '#cbd5e1', p: 0.5 }}
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(51,65,85,0.92)',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#7c3aed' }
                    },
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputBase-input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 100px rgba(51,65,85,0.92) inset',
                      WebkitTextFillColor: '#fff',
                      transition: 'background-color 9999s ease-out 0s',
                      caretColor: '#fff',
                      borderRadius: '8px',
                    }
                  }}
                />
              </div>
              {error && (
                <div style={{ color: '#f87171', marginBottom: 8, fontSize: '0.97rem', textAlign: 'center', width: '100%' }}>
                  {error}
                </div>
              )}
            </DialogContent>
            <DialogActions
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.2,
                p: 3,
                pt: 2.5,
                '& > :not(style) ~ :not(style)': {
                  marginLeft: 0,
                },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  width: '92%',
                  maxWidth: 420,
                  background: 'linear-gradient(90deg, #2563eb 60%, #7c3aed 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: 2,
                  py: 1,
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
                sx={{
                  width: '92%',
                  maxWidth: 420,
                  color: '#fff',
                  borderColor: 'rgba(100,116,139,0.5)',
                  borderRadius: 2,
                  py: 1,
                  fontWeight: 600,
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
      )}
    </AnimatePresence>

  );
}

export default LoginPopup;
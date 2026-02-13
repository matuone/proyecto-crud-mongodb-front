

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import '../styles/ProductsPage.css';
const API_URL = import.meta.env.VITE_API_URL;
import { useAuth } from '../auth/auth.jsx';


export default function ProductsPage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
  });
  const [createForm, setCreateForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
  });

  const hasSession = Boolean(token);
  const canManageProducts = hasSession;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/productos`);
        setProducts(res.data);
      } catch (err) {
        setError('Error al cargar productos');
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categorias`);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Error al cargar categorías');
      }
    };
    Promise.all([fetchProducts(), fetchCategories()]).finally(() => setLoading(false));
  }, []);

  const filteredProducts = Array.isArray(products)
    ? (selectedCategory
      ? products.filter(p => {
        // Soporta categoria como string o como objeto
        if (!p.categoria) return false;
        if (typeof p.categoria === 'string') return p.categoria === selectedCategory;
        if (typeof p.categoria === 'object' && p.categoria.nombre) return p.categoria.nombre === selectedCategory;
        return false;
      })
      : products)
    : [];

  const handleEdit = (product) => {
    if (!canManageProducts) return;
    setError(null);
    setEditingProduct(product);
    setEditForm({
      nombre: product.nombre ?? '',
      precio: String(product.precio ?? ''),
      descripcion: product.descripcion ?? '',
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingProduct) return;

    const newPrice = Number(editForm.precio);
    if (Number.isNaN(newPrice)) {
      setError('El precio debe ser un número válido');
      return;
    }

    const payload = {
      nombre: String(editForm.nombre).trim(),
      precio: newPrice,
      descripcion: String(editForm.descripcion).trim(),
    };

    if (!payload.nombre) {
      setError('El título no puede estar vacío');
      return;
    }

    try {
      setEditLoading(true);
      const res = await axios.put(`${API_URL}/productos/${editingProduct._id}`, payload, {
        headers: authHeaders,
      });

      const updatedProduct = res.data?.producto || res.data || payload;

      setProducts((prev) =>
        prev.map((item) =>
          item._id === editingProduct._id ? { ...item, ...updatedProduct } : item
        )
      );
      setEditOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al editar producto');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = (product) => {
    if (!canManageProducts) return;
    setError(null);
    setDeletingProduct(product);
    setDeleteOpen(true);
  };

  const handleOpenCreate = () => {
    if (!canManageProducts) return;
    setError(null);
    setCreateForm({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: '',
    });
    setCreateOpen(true);
  };

  const handleCreateProduct = async () => {
    const precio = Number(createForm.precio);
    const stock = Number(createForm.stock);

    const payload = {
      nombre: String(createForm.nombre).trim(),
      descripcion: String(createForm.descripcion).trim(),
      precio,
      stock,
      categoria: String(createForm.categoria).trim(),
    };

    if (!payload.nombre || !payload.descripcion || !payload.categoria) {
      setError('Completa nombre, descripción y categoría');
      return;
    }

    if (Number.isNaN(precio) || Number.isNaN(stock)) {
      setError('Precio y stock deben ser números válidos');
      return;
    }

    try {
      setCreateLoading(true);
      await axios.post(`${API_URL}/productos`, payload, {
        headers: authHeaders,
      });

      const refreshed = await axios.get(`${API_URL}/productos`);
      setProducts(Array.isArray(refreshed.data) ? refreshed.data : []);
      setCreateOpen(false);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear producto');
    } finally {
      setCreateLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      setDeleteLoading(true);
      await axios.delete(`${API_URL}/productos/${deletingProduct._id}`, {
        headers: authHeaders,
      });

      const refreshed = await axios.get(`${API_URL}/productos`);
      setProducts(Array.isArray(refreshed.data) ? refreshed.data : []);

      setDeleteOpen(false);
      setDeletingProduct(null);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al eliminar producto');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="products-root" style={{ padding: 32 }}>Cargando productos...</div>;
  if (error) return <div className="products-root" style={{ color: 'red', padding: 32 }}>{error}</div>;

  return (
    <div className="products-root">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 20, marginBottom: 16, position: 'relative' }}>
        {canManageProducts && (
          <button
            onClick={handleOpenCreate}
            style={{
              padding: '0.7em 1.5em',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(90deg, #2563eb 60%, #7c3aed 100%)',
              border: '1.5px solid #fff4',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
              boxShadow: '0 4px 16px #2563eb33',
              outline: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1e40af 60%, #6d28d9 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 60%, #7c3aed 100%)'}
          >
            + Crear producto
          </button>
        )}
        {hasSession && (
          <button
            className="logout-btn"
            onClick={handleLogout}
            style={{
              padding: '0.7em 1.5em',
              fontSize: '1rem',
              fontWeight: 500,
              color: '#fff',
              background: 'linear-gradient(90deg, #7c3aed 60%, #2563eb 100%)',
              border: '1.5px solid #fff4',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
              boxShadow: '0 4px 16px #7c3aed33',
              outline: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #6d28d9 60%, #1e40af 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #7c3aed 60%, #2563eb 100%)'}
          >
            Cerrar sesión
          </button>
        )}
        <button className="back-home-btn" style={{ position: 'static', margin: 0 }} onClick={() => navigate('/')}>← Volver</button>
      </div>
      <div className="products-title">Productos</div>
      <div className="products-filter">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ padding: '0.5em 1em', borderRadius: 8, fontSize: '1rem', border: '1.5px solid #fff6', background: '#232526', color: '#fff', minWidth: 180 }}
        >
          <option value="">Todas las categorías</option>
          {(Array.isArray(categories) ? categories : []).map(cat => (
            <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
          ))}
        </select>
      </div>
      <div className="products-list">
        <AnimatePresence>
          {(Array.isArray(filteredProducts) ? filteredProducts : []).map(prod => {
            // Asegurarse de que los campos sean string o number
            const nombre = typeof prod.nombre === 'object' ? JSON.stringify(prod.nombre) : prod.nombre;
            const precio = typeof prod.precio === 'object' ? JSON.stringify(prod.precio) : prod.precio;
            const descripcion = typeof prod.descripcion === 'object' ? JSON.stringify(prod.descripcion) : prod.descripcion;
            return (
              <motion.div
                className="product-card"
                key={prod._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.35, type: 'spring', stiffness: 80 }}
              >
                {hasSession && <div className="product-id">{prod._id}</div>}
                <div className="product-name">{nombre}</div>
                {typeof precio !== 'undefined' && (
                  <div className="product-price">${precio}</div>
                )}
                {descripcion && (
                  <div className="product-desc">{descripcion}</div>
                )}
                {canManageProducts && (
                  <div className="product-actions">
                    <button className="btn-edit" onClick={() => handleEdit(prod)}>✏️</button>
                    <button className="btn-delete" onClick={() => handleDelete(prod)}>🗑️</button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Dialog
        open={createOpen}
        onClose={() => !createLoading && setCreateOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(30,41,59,0.98) 60%, rgba(91,33,182,0.98) 100%)',
            color: '#fff',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>Crear producto</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Nombre"
            value={createForm.nombre}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, nombre: e.target.value }))}
            fullWidth
            margin="normal"
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(51,65,85,0.92)',
                color: '#fff',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
              },
              '& .MuiInputLabel-root': { color: '#cbd5e1' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#c4b5fd' },
            }}
          />
          <TextField
            label="Descripción"
            value={createForm.descripcion}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, descripcion: e.target.value }))}
            multiline
            minRows={3}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(51,65,85,0.92)',
                color: '#fff',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
              },
              '& .MuiInputLabel-root': { color: '#cbd5e1' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#c4b5fd' },
            }}
          />
          <TextField
            label="Precio"
            type="number"
            value={createForm.precio}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, precio: e.target.value }))}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(51,65,85,0.92)',
                color: '#fff',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
              },
              '& .MuiInputLabel-root': { color: '#cbd5e1' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#c4b5fd' },
            }}
          />
          <TextField
            label="Stock"
            type="number"
            value={createForm.stock}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, stock: e.target.value }))}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(51,65,85,0.92)',
                color: '#fff',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
              },
              '& .MuiInputLabel-root': { color: '#cbd5e1' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#c4b5fd' },
            }}
          />
          <TextField
            select
            label="Categoría"
            value={createForm.categoria}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, categoria: e.target.value }))}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(51,65,85,0.92)',
                color: '#fff',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
              },
              '& .MuiInputLabel-root': { color: '#cbd5e1' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#c4b5fd' },
              '& .MuiSvgIcon-root': { color: '#cbd5e1' },
            }}
          >
            {(Array.isArray(categories) ? categories : []).map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.nombre}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCreateOpen(false)} disabled={createLoading} sx={{ color: '#cbd5e1' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateProduct}
            variant="contained"
            disabled={createLoading}
            sx={{
              background: 'linear-gradient(90deg, #2563eb 60%, #7c3aed 100%)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { background: 'linear-gradient(90deg, #1e40af 60%, #6d28d9 100%)' },
            }}
          >
            {createLoading ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={() => !editLoading && setEditOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(30,41,59,0.98) 60%, rgba(91,33,182,0.98) 100%)',
            color: '#fff',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>Editar producto</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Título"
            value={editForm.nombre}
            onChange={(e) => setEditForm((prev) => ({ ...prev, nombre: e.target.value }))}
            fullWidth
            margin="normal"
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(51,65,85,0.92)',
                color: '#fff',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
              },
              '& .MuiInputLabel-root': { color: '#cbd5e1' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#c4b5fd' },
            }}
          />
          <TextField
            label="Precio"
            type="number"
            value={editForm.precio}
            onChange={(e) => setEditForm((prev) => ({ ...prev, precio: e.target.value }))}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(51,65,85,0.92)',
                color: '#fff',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
              },
              '& .MuiInputLabel-root': { color: '#cbd5e1' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#c4b5fd' },
            }}
          />
          <TextField
            label="Descripción"
            value={editForm.descripcion}
            onChange={(e) => setEditForm((prev) => ({ ...prev, descripcion: e.target.value }))}
            multiline
            minRows={3}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(51,65,85,0.92)',
                color: '#fff',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
              },
              '& .MuiInputLabel-root': { color: '#cbd5e1' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#c4b5fd' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditOpen(false)} disabled={editLoading} sx={{ color: '#cbd5e1' }}>Cancelar</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            disabled={editLoading}
            sx={{
              background: 'linear-gradient(90deg, #2563eb 60%, #7c3aed 100%)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { background: 'linear-gradient(90deg, #1e40af 60%, #6d28d9 100%)' },
            }}
          >
            {editLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={() => !deleteLoading && setDeleteOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(30,41,59,0.98) 60%, rgba(91,33,182,0.98) 100%)',
            color: '#fff',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>Eliminar producto</DialogTitle>
        <DialogContent sx={{ color: '#cbd5e1' }}>
          ¿Seguro que quieres eliminar
          {deletingProduct?.nombre ? ` "${deletingProduct.nombre}"` : ' este producto'}?
          Esta acción no se puede deshacer.
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleteLoading} sx={{ color: '#cbd5e1' }}>
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            disabled={deleteLoading}
            sx={{
              background: 'linear-gradient(90deg, #ef4444 60%, #dc2626 100%)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { background: 'linear-gradient(90deg, #dc2626 60%, #b91c1c 100%)' },
            }}
          >
            {deleteLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
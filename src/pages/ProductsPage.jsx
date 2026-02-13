

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ProductsPage.css';
const API_URL = import.meta.env.VITE_API_URL;
import { useAuth } from '../auth/auth.jsx';


export default function ProductsPage() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = user?.rol === 'admin';

  // Debug: verificar estado de autenticación
  console.log('ProductsPage - User:', user);
  console.log('ProductsPage - isAdmin:', isAdmin);
  console.log('ProductsPage - Token:', token);

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

  const handleEdit = (productId) => {
    console.log('Editar producto:', productId);
    // TODO: Implementar edición
  };

  const handleDelete = (productId) => {
    console.log('Eliminar producto:', productId);
    // TODO: Implementar eliminación
  };

  if (loading) return <div className="products-root" style={{ padding: 32 }}>Cargando productos...</div>;
  if (error) return <div className="products-root" style={{ color: 'red', padding: 32 }}>{error}</div>;

  return (
    <div className="products-root">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 20, marginBottom: 16, position: 'relative' }}>
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
                <div className="product-id">{prod._id}</div>
                <div className="product-name">{nombre}</div>
                {typeof precio !== 'undefined' && (
                  <div className="product-price">${precio}</div>
                )}
                {descripcion && (
                  <div className="product-desc">{descripcion}</div>
                )}
                <div className="product-actions">
                  <button className="btn-edit" onClick={() => handleEdit(prod._id)}>✏️</button>
                  <button className="btn-delete" onClick={() => handleDelete(prod._id)}>🗑️</button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
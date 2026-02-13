import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/auth.jsx';

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const fetchProducts = async () => {
      try {
        const res = await axios.get('URL_DE_TU_API/productos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        setError('Error al cargar productos');
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await axios.get('URL_DE_TU_API/categorias', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        setError('Error al cargar categorías');
      }
    };
    Promise.all([fetchProducts(), fetchCategories()]).finally(() => setLoading(false));
  }, [token]);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoria === selectedCategory)
    : products;

  if (loading) return <div style={{ padding: 32 }}>Cargando productos...</div>;
  if (error) return <div style={{ color: 'red', padding: 32 }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2>Productos</h2>
      <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
        <option value="">Todas las categorías</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
        ))}
      </select>
      <ul style={{ marginTop: 24 }}>
        {filteredProducts.map(prod => (
          <li key={prod._id}>
            {prod.nombre} - ${prod.precio} ({prod.categoria})
          </li>
        ))}
      </ul>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/auth';

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetchProducts = async () => {
      const res = await axios.get('URL_DE_TU_API/productos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    };
    const fetchCategories = async () => {
      const res = await axios.get('URL_DE_TU_API/categorias', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    };
    fetchProducts();
    fetchCategories();
  }, [token]);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoria === selectedCategory)
    : products;

  return (
    <div>
      <h2>Productos</h2>
      <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
        <option value="">Todas las categorías</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
        ))}
      </select>
      <ul>
        {filteredProducts.map(prod => (
          <li key={prod._id}>
            {prod.nombre} - ${prod.precio} ({prod.categoria})
          </li>
        ))}
      </ul>
    </div>
  );
}
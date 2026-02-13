import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import ProductsPage from '../pages/ProductsPage.jsx';
import { useAuth } from '../auth/auth.jsx';

function GuestOnly({ children }) {
  const { token } = useAuth();
  if (token) return <Navigate to="/productos" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route
          path="/login"
          element={(
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}
import axios from 'axios';
import { useAuth } from '../auth/auth.jsx';

export function useApi() {
  const { token } = useAuth();
  const api = axios.create({
    baseURL: 'URL_DE_TU_API',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return api;
}

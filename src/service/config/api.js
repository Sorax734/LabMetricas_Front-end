import axios from 'axios';

// 1) Leer la cadena o usar '{}' por defecto
const stored = localStorage.getItem('user') || '{}';

// 2) Parsear con seguridad
let user;
try {
  user = JSON.parse(stored);
} catch (err) {
  console.error('No se pudo parsear `user` desde localStorage:', err);
  user = {};
}

// 3) Sacar token (si existía)
const token = user?.token;

// 4) Crear instancia Axios
const api = axios.create({
  baseURL: 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
    // solo inyecta Authorization si realmente hay token
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
  timeout: 3600000,
});

export { api };

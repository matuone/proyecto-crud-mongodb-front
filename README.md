
# 🚀 Proyecto CRUD MongoDB - Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Material UI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

## ✨ Descripción

Frontend en React + Vite para gestionar productos con autenticación JWT.
Incluye login modal, persistencia de sesión, rutas protegidas y CRUD de productos desde la vista principal.

---

## ✅ Funcionalidades finales

- Login con popup (`usuario + contraseña`) y toggle de visibilidad de contraseña.
- Sesión persistida en `localStorage` (`token` + `user`).
- Home dinámico:
	- Sin sesión: botón de login.
	- Con sesión: muestra “Sesión iniciada” y permite ir directo a productos.
	- Invitado: permite entrar a productos en modo solo lectura.
- Vista de productos con:
	- listado y filtro por categoría,
	- crear producto (modal),
	- editar producto (modal),
	- eliminar producto (confirmación modal),
	- refresco automático del listado tras crear/eliminar.

---

## 🔐 Acceso y permisos

- `/productos` es accesible para invitados en modo solo lectura.
- El CRUD (crear, editar, eliminar) solo está habilitado cuando hay sesión activa (token JWT).
- `/login` es ruta solo para invitados (`GuestOnly`).
	- Si ya hay sesión, redirige a `/productos`.

### Creación de cuenta

Este frontend no incluye pantalla de registro.
Para crear una cuenta, debes hacerlo desde el backend usando Bruno con la request correspondiente.
La llamada exacta está documentada en el README del backend.

---

## 🧱 Modelo usado para crear productos

El frontend envía este payload al backend en `POST /productos`:

```json
{
	"nombre": "Notebook Lenovo",
	"descripcion": "14 pulgadas, 8GB RAM",
	"precio": 350000,
	"stock": 10,
	"categoria": "ID_DE_LA_CATEGORIA"
}
```

---

## ⚙️ Variables de entorno

Archivo `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Pasos:

1. Copiar `.env.example` a `.env`.
2. Ajustar `VITE_API_URL` según tu backend.

---

## ▶️ Instalación y ejecución

```bash
git clone https://github.com/matuone/proyecto-crud-mongodb-front.git
cd proyecto-crud-mongodb-front
npm install
npm run dev
```

---

## 🧼 Revisión de seguridad en frontend

- Sin `console.log`, `console.warn` ni `console.error` en `src/`.
- Endpoints configurados por variable de entorno (`VITE_API_URL`) en los flujos principales.
- Acciones sensibles del CRUD dependen de sesión activa (token JWT).

---

## 👨‍💻 Autor

Proyecto realizado por Matias Castells.

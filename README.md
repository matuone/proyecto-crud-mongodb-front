
# 🚀 Proyecto CRUD MongoDB - Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Material UI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

## ✨ Descripción

Frontend moderno en React + Vite para el proyecto final del curso Backend. Permite autenticación (admin, usuario, invitado), listado y filtrado de productos por categorías, y consumo seguro de una API protegida con JWT.

---

## 📦 Estructura del proyecto

```
proyecto-crud-mongodb-front/
├── src/
│   ├── app/           # App principal y entrypoint
│   ├── auth/          # Contexto y lógica de autenticación
│   ├── components/    # Componentes reutilizables (ej: LoginPopup)
│   ├── pages/         # Vistas principales (Home, ProductsPage)
│   ├── router/        # Rutas de la app
│   ├── services/      # Lógica de consumo de API
│   └── styles/        # Archivos CSS
├── .env.example       # Variables de entorno frontend
├── package.json       # Dependencias y scripts
└── README.md          # Documentación
```

---

## ⚙️ Instalación y uso

1. **Clona el repositorio:**

	```bash
	git clone https://github.com/matuone/proyecto-crud-mongodb-front.git
	cd proyecto-crud-mongodb-front
	```

2. **Instala dependencias:**

	```bash
	npm install
	```

3. **Configura las variables de entorno:**

	- Copia `.env.example` a `.env` y ajusta la URL de tu backend:
	  ```bash
	  cp .env.example .env
	  # Edita .env y pon la URL real de tu backend
	  ```

4. **Inicia la app en modo desarrollo:**

	```bash
	npm run dev
	```

---

## 🔗 Conexión con el backend

- El frontend espera que el backend exponga endpoints REST bajo la URL definida en `VITE_API_URL`.
- Ejemplo de variable en `.env`:
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```
- El backend debe tener configuradas sus propias variables de entorno (ver `.env.example` en el backend).

---

## 🛡️ Autenticación y roles

- Login con popup animado (Material UI): elige entre **Administrador**, **Usuario** o **Invitado**.
- El token JWT se almacena en localStorage y se envía automáticamente en cada request.
- El acceso a productos requiere estar autenticado.

---

## 🛒 Funcionalidades principales

- Listado de productos y filtrado por categoría.
- Interfaz moderna, responsiva y con efectos visuales.
- Separación clara de lógica, componentes y estilos.

---

## 📝 Notas

- No subas tu archivo `.env` real al repositorio (ya está en `.gitignore`).
- Si tienes dudas, revisa los comentarios en el código y este README.

---

## 👨‍💻 Autor

- Proyecto realizado por Matias Castells para el curso Backend 2026.

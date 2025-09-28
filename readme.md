# 🚀 API Backend Template

Un template completo para crear APIs RESTful con Node.js, Express y Sequelize.

## 📋 Características

- **Framework**: Express.js
- **ORM**: Sequelize con PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: Helmet, CORS, bcrypt
- **Testing**: Jest con Supertest
- **Desarrollo**: Nodemon para hot reload
- **Estructura**: Arquitectura MVC organizada

## 🛠️ Tecnologías Incluidas

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT para autenticación
- bcrypt para encriptación
- Helmet para seguridad
- CORS habilitado
- Jest para testing

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app.js              # Configuración principal de Express
│   ├── server.js           # Punto de entrada del servidor
│   ├── config/
│   │   └── config.js       # Configuración de base de datos
│   ├── models/
│   │   └── index.js        # Configuración de modelos Sequelize
│   ├── routes/
│   │   ├── index.js        # Enrutador principal
│   │   ├── user.router.js  # Rutas de usuarios
│   │   ├── city.router.js  # Rutas de ciudades
│   │   ├── hotel.router.js # Rutas de hoteles
│   │   ├── booking.router.js # Rutas de reservas
│   │   ├── review.router.js  # Rutas de reseñas
│   │   └── image.router.js   # Rutas de imágenes
│   ├── utils/
│   │   ├── catchError.js   # Manejo de errores
│   │   ├── connection.js   # Conexión a BD
│   │   ├── errorHandler.js # Handler global de errores
│   │   └── verifyJWT.js    # Middleware JWT
│   ├── seeders/           # Datos de prueba
│   └── tests/             # Archivos de testing
├── package.json
└── README.md
```

## 🚀 Inicio Rápido

### 1. Clonar el template
```bash
git clone <repository-url>
cd bookings-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PORT=8080
```

### 4. Configurar base de datos
```bash
# Ejecutar migraciones
npx sequelize db:migrate

# (Opcional) Ejecutar seeders
npx sequelize db:seed:all
```

### 5. Ejecutar el proyecto
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📝 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor en modo desarrollo con nodemon
- `npm start` - Ejecuta el servidor en modo producción
- `npm test` - Ejecuta las pruebas con Jest
- `npm run reset:migrate` - Resetea las migraciones
- `npm run production:migrate` - Ejecuta migraciones en producción

## 🗃️ Comandos Sequelize Útiles

### Generar modelos
```bash
npx sequelize model:generate --name ModelName --attributes field1:string,field2:integer
```

### Migraciones
```bash
# Ejecutar migraciones hacia adelante
npx sequelize db:migrate

# Revertir última migración
npx sequelize db:migrate:undo

# Crear nueva migración
npx sequelize migration:generate --name migration-name
```

### Seeders
```bash
# Generar seeder
npx sequelize-cli seed:generate --name seeder-name

# Ejecutar seeders
npx sequelize db:seed:all

# Revertir seeders
npx sequelize db:seed:undo:all
```

## 🔐 Autenticación

El template incluye autenticación JWT lista para usar:
- Registro de usuarios
- Login con hash de contraseñas
- Middleware de verificación JWT
- Rutas protegidas

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm test -- --watch
```

## 🛡️ Seguridad

- Helmet para headers de seguridad
- CORS configurado
- Encriptación de contraseñas con bcrypt
- Autenticación JWT
- Validación de datos

## 📚 Endpoints Incluidos

- `POST /api/v1/users` - Registro de usuarios
- `POST /api/v1/users/login` - Login
- `GET /api/v1/users` - Obtener usuarios (protegido)
- Más endpoints según los routers incluidos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## ✨ Personalización

Este template está diseñado para ser fácilmente personalizable:

1. **Modifica los modelos**: Agrega tus propios modelos en `src/models/`
2. **Crea nuevas rutas**: Añade routers en `src/routes/`
3. **Personaliza la autenticación**: Modifica `src/utils/verifyJWT.js`
4. **Agrega middleware**: Extiende `src/app.js`
5. **Configura tu BD**: Ajusta `src/config/config.js`

¡Comienza a construir tu API increíble! 🎉



# 🔐 JWT Authentication Template

> **Una plantilla completa y lista para producción de autenticación JWT para aplicaciones Node.js/Express**

Esta es una plantilla reutilizable que puedes clonar y usar en cualquier proyecto Node.js que necesite autenticación JWT robusta y segura.

## ✨ Características

- 🔑 **Verificación JWT Completa** - Middleware seguro para validación de tokens
- 🔄 **Access & Refresh Tokens** - Sistema completo de manejo de tokens
- 👥 **Control de Acceso por Roles** - Sistema flexible de permisos
- 🛡️ **Múltiples Estrategias de Auth** - Autenticación requerida, opcional y por propiedad
- ⚙️ **Configuración Flexible** - Configuración basada en variables de entorno
- 🚨 **Manejo Completo de Errores** - Respuestas de error detalladas
- 📝 **Bien Documentado** - Documentación clara con ejemplos
- 🧪 **Listo para Testing** - Estructurado para pruebas fáciles
- 🚀 **Fácil de Usar** - Plug-and-play en cualquier proyecto Express

## � Instalación Rápida

### 1. Usar esta plantilla

```bash
# Clona este repositorio template
git clone https://github.com/tuusuario/jwt-auth-template.git mi-nuevo-proyecto
cd mi-nuevo-proyecto

# Elimina el git remoto original
rm -rf .git
git init

# Conecta con tu nuevo repositorio
git remote add origin https://github.com/tuusuario/mi-nuevo-proyecto.git
```

### 2. Configurar el proyecto

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Generar secretos seguros (IMPORTANTE!)
npm run generate-secret
```

### 3. Configurar variables de entorno

Edita tu archivo `.env` con los secretos generados:

```env
TOKEN_SECRET=tu-secreto-super-seguro-de-64-caracteres
REFRESH_TOKEN_SECRET=tu-secreto-de-refresh-super-seguro-de-64-caracteres
TOKEN_EXPIRATION=1h
REFRESH_TOKEN_EXPIRATION=7d
```

### 4. ¡Empezar a desarrollar!

```bash
# Modo desarrollo
npm run dev

# Servidor iniciará en http://localhost:3000
```

## 📋 Uso Básico

### Implementación en 3 pasos:

**1. Importa los middlewares en tu app:**

```javascript
const express = require("express");
const { verifyJWT, optionalJWT } = require("./src/utils/verifyJWT");
const { generateTokenPair } = require("./src/utils/tokenGenerator");

const app = express();
app.use(express.json());
```

**2. Crea tu endpoint de login:**

```javascript
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Valida credenciales (reemplaza con tu lógica)
  const user = await validateUser(email, password);

  if (user) {
    const tokens = generateTokenPair({
      userLogin: user,
      roles: [user.role],
    });

    res.json({
      message: "Login exitoso",
      user: user,
      ...tokens,
    });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
});
```

**3. Protege tus rutas:**

```javascript
// Ruta protegida
app.get("/api/profile", verifyJWT, (req, res) => {
  res.json({
    message: "¡Acceso concedido!",
    user: req.user,
  });
});

// Ruta pública con auth opcional
app.get("/api/public", optionalJWT, (req, res) => {
  const message = req.user ? `¡Hola ${req.user.email}!` : "¡Hola invitado!";

  res.json({ message });
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en puerto 3000");
});
```

## 🎯 Middlewares Disponibles

Esta plantilla incluye varios middlewares para diferentes necesidades de autenticación:

### Autenticación Básica

```javascript
const { verifyJWT, optionalJWT } = require("./src/utils/verifyJWT");

// Token requerido
app.get("/api/profile", verifyJWT, (req, res) => {
  // req.user contiene los datos del token
  res.json({ user: req.user });
});

// Token opcional
app.get("/api/feed", optionalJWT, (req, res) => {
  // req.user será null si no hay token válido
  const isAuthenticated = !!req.user;
  res.json({ isAuthenticated, user: req.user });
});
```

### Control por Roles

```javascript
const {
  verifyAdmin,
  verifyUserOrAdmin,
  verifyJWTWithRoles,
} = require("./src/utils/authMiddleware");

// Solo administradores
app.get("/api/admin/users", verifyAdmin, (req, res) => {
  res.json({ message: "Panel de administrador" });
});

// Usuarios o administradores
app.get("/api/dashboard", verifyUserOrAdmin, (req, res) => {
  res.json({ message: "Dashboard accesible" });
});

// Roles personalizados
app.get(
  "/api/moderator/reports",
  verifyJWTWithRoles(["moderator", "admin"]),
  (req, res) => {
    res.json({ message: "Acceso de moderador" });
  }
);
```

### Control por Propiedad

```javascript
const { verifyTokenOwnership } = require("./src/utils/authMiddleware");

// Los usuarios solo pueden acceder a sus propios datos
app.get(
  "/api/users/:userId/profile",
  verifyTokenOwnership("userId"),
  (req, res) => {
    res.json({ message: "Perfil del usuario", userId: req.params.userId });
  }
);

app.put(
  "/api/orders/:userId/cancel",
  verifyTokenOwnership("userId"),
  (req, res) => {
    res.json({ message: "Orden cancelada" });
  }
);
```

## 🗂️ Estructura del Proyecto

```
jwt-auth-template/
├── src/
│   ├── config/
│   │   └── jwt.config.js              # ⚙️ Configuración JWT centralizada
│   └── utils/
│       ├── verifyJWT.js               # 🔐 Middleware básico de verificación
│       ├── authMiddleware.js          # 👥 Middlewares avanzados (roles, propiedad)
│       └── tokenGenerator.js         # 🎫 Generación y manejo de tokens
├── .env.example                       # 📝 Variables de entorno template
├── .gitignore                         # 🚫 Archivos a ignorar
├── package.json                       # 📦 Dependencias y scripts
├── README.md                          # 📖 Esta documentación
└── app-example.js                     # 🚀 Ejemplo completo de implementación
```

## ⚙️ Variables de Entorno

| Variable                   | Descripción                             | Valor por Defecto |
| -------------------------- | --------------------------------------- | ----------------- |
| `TOKEN_SECRET`             | 🔑 Clave secreta para tokens de acceso  | _(Requerido)_     |
| `TOKEN_EXPIRATION`         | ⏱️ Expiración de tokens de acceso       | `1h`              |
| `REFRESH_TOKEN_SECRET`     | 🔄 Clave secreta para tokens de refresh | _(Requerido)_     |
| `REFRESH_TOKEN_EXPIRATION` | ⏰ Expiración de tokens de refresh      | `7d`              |
| `JWT_ISSUER`               | 🏷️ Identificador del emisor             | `your-app-name`   |
| `JWT_AUDIENCE`             | 👥 Identificador de audiencia           | `your-app-users`  |
| `NODE_ENV`                 | 🌍 Entorno de ejecución                 | `development`     |
| `PORT`                     | 🚪 Puerto del servidor                  | `3000`            |

### Estructura del Token JWT

```javascript
{
  "userLogin": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "username": "usuario123"
  },
  "roles": ["user", "moderator"],
  "permissions": ["read", "write"],
  "type": "access", // o "refresh"
  "iat": 1234567890,
  "exp": 1234567890,
  "iss": "mi-app",
  "aud": "mis-usuarios"
}
```

## 🔧 API de Referencia

### Funciones de Middleware

#### `verifyJWT(req, res, next)`

Middleware básico de verificación JWT. Requiere token válido en el header Authorization.

**Uso:**

```javascript
app.get("/api/protected", verifyJWT, (req, res) => {
  // req.user contiene los datos del usuario
});
```

#### `optionalJWT(req, res, next)`

Verificación opcional de JWT. Establece `req.user` a null si no hay token válido.

#### `verifyJWTWithRoles(allowedRoles)`

Control de acceso basado en roles.

**Ejemplo:**

```javascript
app.get("/api/admin", verifyJWTWithRoles(["admin"]), handler);
```

#### `verifyTokenOwnership(userIdParam)`

Asegura que los usuarios solo puedan acceder a sus propios recursos.

### Generación de Tokens

#### `generateAccessToken(payload, options)`

Genera un nuevo token de acceso.

#### `generateRefreshToken(payload, options)`

Genera un nuevo token de refresh.

#### `generateTokenPair(payload)`

Genera ambos tokens (acceso y refresh) al mismo tiempo.

#### `verifyRefreshToken(token)`

Verifica y decodifica un token de refresh.

## 🔒 Buenas Prácticas de Seguridad

### ✅ Implementadas en esta plantilla:

1. **Secretos Fuertes**: Generación de secretos criptográficamente seguros
2. **Tokens de Corta Duración**: Tokens de acceso de corta vida (15-60 minutos)
3. **Variables de Entorno**: Nunca commits secretos al control de versiones
4. **Manejo de Errores Detallado**: Respuestas de error informativas
5. **Validación de Headers**: Verificación correcta del formato Bearer
6. **Soporte para Refresh Tokens**: Implementación completa de refresh tokens

### 🚀 Recomendaciones adicionales:

1. **HTTPS Only**: Usar siempre HTTPS en producción
2. **Almacenamiento Seguro**: Guardar refresh tokens en httpOnly cookies
3. **Rate Limiting**: Agregar limitación de velocidad a endpoints de auth
4. **Rotación de Tokens**: Implementar rotación de refresh tokens
5. **Blacklist de Tokens**: Considerar implementar blacklist para logout
6. **Audit Logs**: Registrar eventos de autenticación

## 🧪 Testing

### Estructura de pruebas sugerida:

```javascript
const request = require("supertest");
const app = require("../src/app");

describe("🔐 Autenticación JWT", () => {
  test("Debería proteger rutas sin token", async () => {
    const response = await request(app).get("/api/protected").expect(401);

    expect(response.body.error).toBe(
      "Access denied. No token provided or invalid format."
    );
  });

  test("Debería permitir acceso con token válido", async () => {
    const token = "tu-token-de-prueba";
    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe("¡Acceso concedido!");
  });

  test("Debería rechazar tokens expirados", async () => {
    const expiredToken = "token-expirado";
    await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(403);
  });
});
```

## 🚀 Despliegue

### Scripts NPM disponibles:

```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
npm test           # Ejecutar pruebas
npm run test:watch # Pruebas en modo watch
npm run lint       # Verificar código
npm run generate-secret # Generar secretos seguros
```

### Docker (Opcional):

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

### Variables de Entorno para Producción:

```bash
# Generar secretos seguros
TOKEN_SECRET=$(openssl rand -hex 64)
REFRESH_TOKEN_SECRET=$(openssl rand -hex 64)
NODE_ENV=production
PORT=3000
```

## 📝 Personalización

### Para usar esta plantilla en tu proyecto:

1. **Clona y personaliza:**

   - Cambia el nombre en `package.json`
   - Actualiza la información del autor
   - Modifica los ejemplos según tu caso de uso

2. **Adapta la lógica de usuario:**

   - Reemplaza la validación mock en `app-example.js`
   - Conecta con tu base de datos
   - Ajusta la estructura del payload JWT

3. **Configura roles:**
   - Define los roles específicos de tu aplicación
   - Personaliza los middlewares de autorización
   - Ajusta los niveles de permisos

## 📞 Soporte y Contribución

### 🐛 Reportar Problemas

Si encuentras algún bug o tienes una sugerencia, por favor:

1. Revisa los [issues existentes](https://github.com/tuusuario/jwt-auth-template/issues)
2. Crea un nuevo issue con detalles claros
3. Incluye ejemplos de código si es posible

### 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/increible-feature`)
3. Commit tus cambios (`git commit -m 'Agrega increíble feature'`)
4. Push a la rama (`git push origin feature/increible-feature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - consulta el archivo [LICENSE](LICENSE) para más detalles.

---

**🌟 ¡Dale una estrella si te fue útil esta plantilla!**

_Hecho con ❤️ para la comunidad de desarrolladores Node.js_

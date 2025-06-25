# 🎁 GiftPoint API

Una API RESTful para gestionar gift cards personales, desarrollada con Express y SQLite. Incluye autenticación, operaciones CRUD y transferencia de saldo entre tarjetas.

---

## 📦 Requisitos previos

* Node.js (v18 o superior recomendado)
* npm (v9 o superior)

---

## 🔧 Instalación

```bash
npm install
```

---

## ⚙️ Configuración de entorno

Crea un archivo `.env` con la siguiente variable:

```
JWT_SECRET=tu_clave_secreta
```

Y opcionalmente un `.env.test` para ambiente de pruebas:

```
JWT_SECRET=test_secret
```

> Esto asegura que cada entorno use claves de firma JWT distintas.

---

## 🚀 Ejecución

```bash
npm run dev       # Modo desarrollo con nodemon
npm start         # Ejecución en producción
```

---

## 🧪 Tests

Ejecuta todos los tests con:

```bash
npm test
```

### 🧰 Estructura de pruebas

Se incluyen pruebas para:

* Registro y login de usuarios (`/auth/register`, `/auth/login`)
* Operaciones sobre gift cards: crear, listar, obtener, actualizar, eliminar y transferir saldo

### 📂 ¿Por qué `jest.setup.js`?

Se creó un archivo `jest.setup.js` para:

* Limpiar e inicializar la base de datos antes de cada test
* Registrar eventos comunes o mocks globales

Este archivo es cargado automáticamente gracias a la configuración en `package.json`:

```json
"jest": {
  "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"]
}
```

---

## 📂 Estructura de este Proyecto

```
📁 data
 └── database.sqlite                # Aquí se crea automáticamente la base de datos
📁 src
 ├── config/                        # Conexión DB y lógica base
 ├── controllers/                   # Lógica de endpoints
 ├── middlewares/                   # Auth y logger
 ├── routes/                        # Definición de rutas Express
 ├── utils/                         # Funciones auxiliares (validaciones)
 └── app.js
📁 test
 └── auth.test.js                   # Pruebas de  autenticación
 └── giftcards.test.js              # Pruebas de giftcards
index.js                            # Entry point principal
.env                                # Variables de entorno
GiftCard.postman_collection.json    # Collection de Postman (Para hacer pruebas en Postman en caso de requerirlo)
.env.test                           # Variables de entorno de pruebas
jest.setup.js                       # Configuración de Jest
package.json                        # Declaración de dependencias
package-lock.json                   # Dependencias
README.md                           # Este archivo

```

---

## 📬 Endpoints disponibles

### 🔐 Todos los endpoints de giftcards requieren el header:

```
Authorization: Bearer <token>
```

### Auth

* `POST /auth/register` – Registro
* `POST /auth/login` – Login y obtención de token

### Gift Cards

* `GET /giftcards` – Listar gift cards del usuario autenticado
* `POST /giftcards` – Crear nueva gift card
* `GET /giftcards/:id` – Detalle de una gift card
* `PATCH /giftcards/:id` – Editar saldo o expiración
* `DELETE /giftcards/:id` – Eliminar gift card
* `POST /giftcards/transfer` – Transferencia entre dos tarjetas del mismo usuario

---

## 📸 Resultado esperado

Al ejecutar `npm test`, todos los tests deben pasar correctamente:

![Tests Passing Screenshot](/giftpoint-api/resources/tests-passing.png)

---

## 🧠 Stack Tecnológico

Este proyecto fue construido utilizando las siguientes tecnologías:

* **Node.js** – Entorno de ejecución para JavaScript del lado del servidor.
* **Express** – Framework minimalista para construir la API REST.
* **SQLite** – Base de datos ligera y embebida, ideal para desarrollo local y pruebas rápidas.
* **JWT (jsonwebtoken)** – Para autenticación y autorización mediante tokens seguros.
* **bcryptjs** – Para el hasheo seguro de contraseñas.
* **Jest + Supertest** – Frameworks de testing para validar endpoints y asegurar la funcionalidad del backend.

---

## 🗄️ Estructura de la Base de Datos (SQLite)

La base de datos se define en el archivo `database.sqlite` y se inicializa automáticamente al ejecutar la API. Se almacenará en la carpeta `data` del proyecto.

Contiene las siguientes tablas:

* **users**

  * `id` (INTEGER, clave primaria)
  * `email` (TEXT, único)
  * `password` (TEXT, encriptado con bcrypt)

* **giftcards**

  * `id` (INTEGER, clave primaria)
  * `userId` (INTEGER, clave foránea que referencia a `users.id`)
  * `amount` (REAL, saldo disponible)
  * `currency` (TEXT, por ejemplo: USD)
  * `expirationDate` (TEXT, formato `YYYY-MM-DD`)

> Cada gift card está asociada a un único usuario. Las operaciones de consulta, edición, eliminación y transferencia están protegidas por autenticación JWT.

---


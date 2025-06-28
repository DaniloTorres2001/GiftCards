# 🎁 GiftCard API

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

![Tests Passing Screenshot](/resources/tests-passing.png)

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

# 🧾 GiftCard App - Frontend FlutterFlow

Este proyecto representa el **Frontend de la aplicación GiftPoint**, desarrollado completamente en **FlutterFlow** y conectado con un backend local utilizando **ngrok** para exposición externa.

---

## 🚀 Funcionalidades principales

* ✅ Inicio de sesión con autenticación por JWT
* ✅ Visualización de tarjetas gift card del usuario autenticado
* ✅ Registro de nuevas tarjetas
* ✅ Edición y eliminación de tarjetas
* ✅ Transferencia de saldo entre tarjetas
* ✅ Alerta de expiración próxima de tarjetas
* ✅ Paginación dinámica en cliente

---

## 🌐 Conexión con Backend

El backend fue levantado localmente (`localhost:3000`) pero **expuesto a través de [ngrok](https://ngrok.com/)** para que FlutterFlow pudiera acceder a él:

```
https://xxxxx.ngrok-free.app
```

### ⚠️ Header especial requerido en API Calls:

```json
"ngrok-skip-browser-warning": "true"
```

Este header evita que el proxy de ngrok retorne una advertencia HTML en lugar de JSON y es **necesario en todos los endpoints** cuando se usa ngrok.

---

## 🧩 Variables de App State usadas

| Variable             | Tipo    | Uso                                            |
| -------------------- | ------- | ---------------------------------------------- |
| `jwt`                | String  | Token JWT del usuario autenticado              |
| `idCard`             | Integer | ID de la tarjeta seleccionada                  |
| `cardCurrency`       | String  | Moneda de la tarjeta seleccionada              |
| `cardAmount`         | Double  | Monto de la tarjeta seleccionada               |
| `cardExpirationDate` | String  | Fecha de expiración de la tarjeta seleccionada |
| `cardExp`            | JSON    | Tarjeta próxima a expirar                      |
| `cardList`           | JSON    | Lista completa de tarjetas                     |
| `AmounToTransfer`    | Double  | Monto a transferir                             |
| `destinationCardId`  | Integer | ID de la tarjeta destino                       |
| `excludedId`         | Integer | ID a excluir en filtros                        |
| `cardJson`           | List    | Lista de tarjetas en formato JSON              |
| `currentPage`        | Integer | Página actual para paginación                  |
| `totalPages`         | Integer | Número total de páginas                        |
| `currentPageCards`   | List    | Tarjetas visibles en la página actual          |

---
Cada vez que se cierra sesion , todas estas variables se les actualiza el valor a null, tambien en momentos requeridos durante algun "update state"


## 🔧 Custom Actions utilizadas

### 1. `getExpiringSoonCard`

Filtra y devuelve una lista con las tarjetas que vencen en los próximos 7 días. Usa múltiples formatos para parsear fechas y asegura compatibilidad.

```dart
import 'package:intl/intl.dart'; // ← AGREGADO: Import correcto para DateFormat

dynamic getExpiringSoonCard(List<dynamic> cardsJson) {
  final now = DateTime.now();
  final result = <Map<String, dynamic>>[];

  // Lista de formatos de fecha posibles
  final dateFormats = [
    DateFormat('yyyy-MM-dd'), // 2025-07-04
    DateFormat('yyyy/MM/dd'), // 2025/07/04
    DateFormat('yyyy/M/d'), // 2025/7/4
    DateFormat('yy-MM-dd'), // 25-06-27
  ];

  for (var card in cardsJson) {
    try {
      final expirationDateString = card['expirationDate'].toString();
      DateTime? expiration;

      // Intentar parsear con cada formato
      for (var format in dateFormats) {
        try {
          expiration = format.parse(expirationDateString);
          break; // Si funciona, salir del bucle
        } catch (_) {
          continue; // Si falla, probar el siguiente formato
        }
      }

      if (expiration != null) {
        final days = expiration.difference(now).inDays;
        print('Card ID: ${card['id']}, Days until expiration: $days'); // Debug

        if (days >= 0 && days <= 7) {
          result.add(Map<String, dynamic>.from(card));
        }
      } else {
        print('Could not parse date: $expirationDateString'); // Debug
      }
    } catch (e) {
      print('Error processing card: $e'); // Debug
      continue;
    }
  }

  print('Found ${result.length} expiring cards'); // Debug
  return result;
}
```

### 2. `excludeGiftCardById`

Permite filtrar una lista excluyendo la tarjeta con el ID proporcionado. Útil para prevenir transferencias a sí misma.

```dart
List<dynamic> excludeGiftCardById(List<dynamic> cardsJson, int excludedId) {
  return cardsJson.where((card) {
    if (card is Map<String, dynamic>) {
      return card['id'] != excludedId;
    }
    return true;
  }).toList();
}
```

### 3. `paginateCards`

Toma la lista completa (`allCards`), el número de la página actual (`currentPage`) y el límite de ítems por página (`itemsPerPage`), y retorna solo la porción correspondiente.

```dart
List<dynamic> paginateCards(
  List<dynamic> allCards,
  int currentPage,
  int itemsPerPage,
) {
  final start = currentPage * itemsPerPage;
  final end = (start + itemsPerPage > allCards.length)
      ? allCards.length
      : start + itemsPerPage;
  return allCards.sublist(start, end);
}
```

### 4. `calculateTotalPages`

Calcula el número total de páginas necesarias para mostrar todas las tarjetas según el límite por página. Resultado: `(allCards.length / itemsPerPage).ceil()`.

```dart
int calculateTotalPages(
  int itemsPerPage,
  List<dynamic> allCards,
) {
  return (allCards.length / itemsPerPage).ceil();
}
```

---

## 📍 Proyecto FlutterFlow

🔗 [Abrir Proyecto en FlutterFlow](https://app.flutterflow.io/project/gift-cards-app-hhig8j)

---

## 🎥 Demo del funcionamiento

🔗 [Video Demo](https://drive.google.com/file/d/1KPtqM1TiC2Dk0Yw0VmdSQmhgcRehcJIy/view?usp=drive_link)

---


Made by Danilo Torres Vera

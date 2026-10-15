# 🗳️ Sistema de Votaciones API - Prueba Técnica

API RESTful desarrollada en **Node.js** con **TypeScript**, **Express**, **Prisma ORM** y **PostgreSQL**. La API gestiona el registro de votantes, candidatos, la emisión de votos bajo reglas de negocio estrictas y la generación de estadísticas.

---

## 🛠️ Tecnologías Utilizadas

- **Lenguaje:** Node.js, TypeScript
- **Framework:** Express.js
- **ORM:** Prisma ORM
- **Base de Datos:** PostgreSQL (en contenedor Docker)
- **Documentación:** Swagger UI (OpenAPI 3.0)
- **Seguridad:** Middleware de HTTP Basic Authentication

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno local:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (con Docker Compose)
- [Git](https://git-scm.com/)

---

## 🚀 Pasos para Ejecutar el Proyecto Localmente

### 1. Clonar el repositorio
```bash
git clone <URL_DE_TU_REPOSITORIO_GITHUB>
cd sistema-votaciones    
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto basado en las credenciales configuradas:

```bash
PORT=3000
DATABASE_URL="postgresql://admin:adminpassword@localhost:5433/voting_system?schema=public"
ADMIN_USER="admin"
ADMIN_PASS="admin123"
```

### 4. Levantar la base de datos con Docker
```bash
docker-compose up -d
```

### 5. Sincronizar el esquema de Prisma con la Base de Datos
```bash
npx prisma db push
```

### 6. Iniciar el servidor en modo desarrollo
```bash
npm run dev
```
El servidor estará corriendo en: http://localhost:3000


### 🔒 Autenticación
Los endpoints están protegidos mediante Basic Auth. Debes enviar las credenciales en la cabecera Authorization:

### 📌 Ejemplos de Uso de la API (curl)

### 1. Votantes (/voters)
Registrar un votante:
```bash
curl -X POST http://localhost:3000/voters \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{"name": "Carlos Mendoza", "email": "carlos.mendoza@example.com"}'
```

Listar Votantes (Paginado y Filtrado)
```bash
curl -X GET "http://localhost:3000/voters?page=1&limit=10&search=Carlos" \
  -u admin:admin123
```

### 2. Candidatos (/candidates)
Registrar un candidato:
```bash
curl -X POST http://localhost:3000/candidates \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{"name": "Ana Gómez", "party": "Partido Innovación", "email": "ana.gomez@example.com"}'
```

### 3. Votos (/votes)
Emitir un voto:
```bash
curl -X POST http://localhost:3000/votes \
  -u admin:admin123 \
  -H "Content-Type: application/json" \
  -d '{"voterId": "<VOTER_ID>", "candidateId": "<CANDIDATE_ID>"}'
```

Consultar estadísticas:
```bash
curl -X GET http://localhost:3000/votes/statistics \
  -u admin:admin123
```

Screenshot de las estadisticas generadas donde se ve total de votos por candidato, porcentaje de votos por candidato y total de votantes que han votado:
![Estadísticas de Votación](./docs/screenshots/statistics.png)

### Los demás Endpoints se pueden ver en 'Swagger' después de iniciar el servidor.






























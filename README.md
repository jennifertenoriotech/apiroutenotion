# Gestor de Paginas Notion

## Descripcion

Aplicacion web completa con backend RESTful y frontend HTML/CSS/JavaScript para gestionar paginas, notas y espacios de trabajo inspirados en Notion. Permite crear, listar, editar y eliminar registros almacenados en MongoDB.

## Tecnologias utilizadas

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- cors

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap
- Fetch API
- Manipulacion del DOM

## Estructura del proyecto

```txt
BACKENDNOTION/
|-- config/
|   `-- database.js
|-- controllers/
|   `-- notion.controllers.js
|-- models/
|   `-- notion.model.js
|-- public/
|   |-- index.html
|   |-- css/
|   |   `-- styles.css
|   `-- js/
|       `-- app.js
|-- routes/
|   |-- index.routes.js
|   `-- notion.routes.js
|-- .env
|-- .gitignore
|-- app.js
|-- package-lock.json
|-- package.json
|-- README.md
`-- server.js
```

## Instalacion

```bash
npm install
```

## Variables de entorno

Crear o conservar el archivo `.env` local con estas variables. No se deben publicar credenciales reales.

```env
MONGO_URI=...
PORT=...
```

## Ejecucion

```bash
npm start
```

## Rutas de la API

```txt
GET    /api/notion
GET    /api/notion/:id
POST   /api/notion
PUT    /api/notion/:id
DELETE /api/notion/:id
```

## Uso del frontend

Abrir:

```txt
http://localhost:3000/
```

El frontend permite listar, crear, editar y eliminar paginas de Notion usando la API real del backend.

## Modelo de datos

Campos principales:

- tituloPagina
- espacioTrabajo
- tipoContenido
- categoria
- estado
- fechaCreacion
- responsable
- descripcion

## Cumplimiento de la rubrica

- Backend CRUD completo.
- Estructura modular.
- Codigos HTTP correctos.
- Frontend HTML/CSS/JS.
- Bootstrap.
- fetch + async/await.
- Manipulacion del DOM.
- README completo.
- Listo para GitHub y ZIP.

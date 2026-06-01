# Rent A Car API

## Descripción

API REST desarrollada con Node.js, Express y MySQL para la gestión de vehículos de una empresa de arriendo de automóviles.

## Stack Tecnológico

* Node.js
* Express
* MySQL
* mysql2
* Git y GitHub
* Postman

## Instalación

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
```

Instalar dependencias:

```bash
npm install
```

## Variables de Entorno

Crear un archivo `.env` basado en `.env.example`.

Ejemplo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=rentacar_db
PORT=3000
```

## Ejecución Local

Modo normal:

```bash
npm start
```

Modo desarrollo:

```bash
npm run dev
```

## Estructura del Proyecto

```txt
17_Rent_A_Car/
│
├── client/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── app.js
│
├── .env.example
├── package.json
└── README.md
```

## Alcance

* Gestión de vehículos.
* Registro de reservas.
* Consulta de disponibilidad.
* Gestión de devoluciones.
* Aplicación de multas.
* Control de kilometraje.

## Cronograma

| Hito          | Estado        |
| ------------- | ------------- |
| Hito 1        | En desarrollo |
| Hito 2        | Pendiente     |
| Hito 3        | Pendiente     |
| Hito 4        | Pendiente     |
| Entrega Final | Pendiente     |

```
```

## Variables de Entorno

El proyecto utiliza variables de entorno para separar la configuración del código fuente.

### Desarrollo local

Crear un archivo `.env` basado en `.env.example`.

Ejemplo:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mysql://root:password@localhost:3306/rentacar_db
JWT_SECRET=mi_clave_secreta
CORS_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:3000
```

### Producción

Las variables NO deben almacenarse en archivos `.env` dentro del servidor.

#### Railway

En Railway:

1. Abrir el proyecto.
2. Entrar a Variables.
3. Crear cada variable definida en `.env.example`.
4. Guardar los cambios.

#### Frontend (Vercel o Netlify)

Configurar:

```env
VITE_API_URL=https://api-del-proyecto.com
```

desde el panel de Variables de Entorno del proveedor.

Las variables de producción deben configurarse desde el panel del hosting y no mediante archivos subidos al repositorio.

## RQ-01: Entidad principal del dominio

### Vehículo

La entidad principal del sistema es Vehículo, utilizada para representar los automóviles disponibles para arriendo.

Campos implementados:

| Campo       | Tipo         | Descripción                         |
| ----------- | ------------ | ----------------------------------- |
| id          | INT          | Identificador único                 |
| marca       | VARCHAR(100) | Marca del vehículo                  |
| modelo      | VARCHAR(100) | Modelo del vehículo                 |
| anio        | INT          | Año de fabricación                  |
| patente     | VARCHAR(20)  | Patente única                       |
| color       | VARCHAR(50)  | Color del vehículo                  |
| kilometraje | INT          | Kilometraje acumulado               |
| disponible  | BOOLEAN      | Indica disponibilidad para arriendo |


## RQ-01 – Entidad principal del dominio: Vehículo

Se implementó la entidad principal Vehículo para el sistema Rent A Car.

### Campos

* id
* marca
* modelo
* anio
* patente
* color
* kilometraje
* disponible
* createdAt
* updatedAt

### Endpoints

| Método | Ruta           | Descripción                 |
| ------ | -------------- | --------------------------- |
| GET    | /vehiculos     | Obtener todos los vehículos |
| GET    | /vehiculos/:id | Obtener vehículo por ID     |
| POST   | /vehiculos     | Crear vehículo              |
| PUT    | /vehiculos/:id | Actualizar vehículo         |
| DELETE | /vehiculos/:id | Eliminar vehículo           |

La implementación utiliza Express, MySQL y Sequelize para la gestión de datos.


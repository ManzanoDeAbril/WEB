# 17_Rent_A_Car

## Descripción

API REST desarrollada con Node.js, Express y MySQL para la gestión de vehículos y reservas de una empresa de arriendo de automóviles.

El proyecto forma parte de la asignatura de Programación Web y se desarrolla siguiendo una metodología incremental basada en hitos de avance.

---

## Tecnologías utilizadas

* Node.js
* Express
* MySQL
* MySQL2
* Git y GitHub
* Postman

---

## Alcance del Proyecto

El sistema permitirá administrar el proceso de arriendo de vehículos mediante una API REST.

### Funcionalidades principales

* Gestión de vehículos.
* Registro de reservas.
* Consulta de disponibilidad de vehículos.
* Control de kilometraje.
* Gestión de devoluciones.
* Aplicación de multas por atraso.
* Gestión de extras asociados a reservas.

### Funcionalidades implementadas en el Hito 1

* Configuración del proyecto Node.js.
* Configuración de la base de datos MySQL.
* Conexión entre Express y MySQL.
* Creación de la tabla Vehículos.
* Inserción de datos de prueba.
* CRUD completo de vehículos:

  * GET /vehiculos
  * GET /vehiculos/:id
  * POST /vehiculos
  * PUT /vehiculos/:id
  * DELETE /vehiculos/:id

---

## Cronograma

| Hito          | Actividad                                              | Estado        |
| ------------- | ------------------------------------------------------ | ------------- |
| Hito 1        | Configuración inicial del proyecto y CRUD de Vehículos | En desarrollo |
| Hito 2        | Implementación CRUD de Reservas                        | Pendiente     |
| Hito 3        | Validación de disponibilidad y reglas de negocio       | Pendiente     |
| Hito 4        | Gestión de devoluciones y multas                       | Pendiente     |
| Hito 5        | Pruebas finales y documentación                        | Pendiente     |
| Entrega Final | Presentación y entrega del proyecto completo           | Pendiente     |

---

## Instalación

1. Clonar el repositorio.

```bash
git clone <url-del-repositorio>
```

2. Instalar dependencias.

```bash
npm install
```

3. Configurar la base de datos MySQL.

4. Ejecutar el proyecto.

```bash
npm start
```

o

```bash
npm run dev
```

---

## Autor

Matías Ojeda

Ingeniería en Informática

CREATE DATABASE rentacar_db;
USE rentacar_db;
SHOW DATABASES;

CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    anio INT NOT NULL,
    patente VARCHAR(10) UNIQUE NOT NULL,
    color VARCHAR(50),
    kilometraje INT DEFAULT 0,
    disponible BOOLEAN DEFAULT TRUE
);

INSERT INTO vehiculos
(marca, modelo, anio, patente, color, kilometraje, disponible)
VALUES
('Toyota','Corolla',2024,'ABCD11','Blanco',15000,TRUE),
('Hyundai','Accent',2023,'EFGH22','Rojo',23000,TRUE),
('Kia','Rio',2022,'IJKL33','Negro',40000,FALSE);

CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    nombre_cliente VARCHAR(150) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('reservada','activa','finalizada','cancelada') DEFAULT 'reservada',

    FOREIGN KEY (vehiculo_id)
    REFERENCES vehiculos(id)
);

SELECT * FROM vehiculos;
SHOW DATABASES;

USE rentacar_db;

SHOW TABLES;

DROP TABLE vehiculos;

DESCRIBE vehiculos;

DELETE FROM vehiculos;
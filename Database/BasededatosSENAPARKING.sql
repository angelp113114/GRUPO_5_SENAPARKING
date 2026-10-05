CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_del_rol VARCHAR(35) NOT NULL UNIQUE
);

CREATE TABLE cuenta (
    id_cuenta SERIAL PRIMARY KEY,
    correo VARCHAR(50) NOT NULL UNIQUE,
    contraseña VARCHAR(50) NOT NULL
);

CREATE TABLE tipo_documento (
    id_tipo_documento SERIAL PRIMARY KEY,
    nombre_del_documento VARCHAR(50) NOT NULL UNIQUE,
    sigla VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    primer_nombre VARCHAR(35) NOT NULL,
    segundo_nombre VARCHAR(35),
    primer_apellido VARCHAR(35) NOT NULL,
    segundo_apellido VARCHAR(35),
    numero_documento INT NOT NULL UNIQUE,
    numero_celular VARCHAR(15) UNIQUE,
    id_cuenta INT UNIQUE,
    id_tipo_documento INT NOT NULL,
FOREIGN KEY (id_cuenta) REFERENCES cuenta(id_cuenta),
    FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo_documento)
);


CREATE TABLE cuenta_rol (
    id_cuenta INT,
    id_rol INT,
    PRIMARY KEY (id_cuenta, id_rol),

    FOREIGN KEY (id_cuenta) REFERENCES cuenta(id_cuenta),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);


CREATE TABLE tipo_contacto (
    id_tipo_contacto SERIAL PRIMARY KEY,
    nombre_tipo_contacto VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE centro_de_formacion (
    id_centro_de_formacion SERIAL PRIMARY KEY,
    nombre_del_centro VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE contacto_centro (
    id_contacto_centro SERIAL PRIMARY KEY,
    detalle_contacto VARCHAR(100) NOT NULL,
    id_centro_de_formacion INT NOT NULL,
    id_tipo_contacto INT NOT NULL,

    FOREIGN KEY (id_centro_de_formacion) REFERENCES centro_de_formacion(id_centro_de_formacion),
    FOREIGN KEY (id_tipo_contacto) REFERENCES tipo_contacto(id_tipo_contacto)
);

CREATE TABLE tipo_vehiculo (
    id_tipo_vehiculo SERIAL PRIMARY KEY,
    nombre_del_vehiculo VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE vehiculo (
    id_vehiculo SERIAL PRIMARY KEY,
    id_tipo_vehiculo INT NOT NULL,
    id_centro_de_formacion INT NOT NULL,

    FOREIGN KEY (id_tipo_vehiculo) REFERENCES tipo_vehiculo(id_tipo_vehiculo),
    FOREIGN KEY (id_centro_de_formacion) REFERENCES centro_de_formacion(id_centro_de_formacion)
);

CREATE TABLE moto (
    id_moto SERIAL PRIMARY KEY,
    id_vehiculo INT UNIQUE,
    foto_moto VARCHAR(50) NOT NULL,
    foto_placa_moto VARCHAR(50) NOT NULL,
    tarjeta_de_propiedad_moto VARCHAR(50) NOT NULL,
    soat_y_tecno_mecanica_vigentes VARCHAR(50) NOT NULL,
    marca_de_la_moto VARCHAR(50) NOT NULL,
    cilindraje_moto VARCHAR(50) NOT NULL,
    color_de_la_moto VARCHAR(50) NOT NULL,
    modelo_de_la_moto VARCHAR(50) NOT NULL,

    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo)
);

CREATE TABLE bicicleta (
    id_bicicleta SERIAL PRIMARY KEY,
    id_vehiculo INT UNIQUE,
    foto_de_la_bicicleta VARCHAR(50) NOT NULL,
    foto_serial_bicicleta VARCHAR(50) NOT NULL,
    marca_de_la_bicicleta VARCHAR(50) NOT NULL,
    color_de_la_bicicleta VARCHAR(50) NOT NULL,
    serial_de_la_bicicleta VARCHAR(50) NOT NULL UNIQUE,

    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo)
);

CREATE TABLE administrador (
    id_administrador SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE celador (
    id_celador SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE aprendiz (
    id_aprendiz SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE,
    foto_url_del_aprendiz VARCHAR(100) NOT NULL,
    firma_url_digital_aprendiz VARCHAR(100) NOT NULL,
    documento_identidad_del_aprendiz VARCHAR(50) NOT NULL,
    carnet_url_del_aprendiz VARCHAR(100) NOT NULL,
    fecha_de_inicio_de_vinculacion DATE NOT NULL,
    fecha_fin_de_vinculacion DATE NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    celular VARCHAR(15),

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


CREATE TABLE vehiculo_aprendiz (
    id_vehiculo_aprendiz SERIAL PRIMARY KEY,
    id_aprendiz INT NOT NULL,
    id_vehiculo INT NOT NULL,

    FOREIGN KEY (id_aprendiz) REFERENCES aprendiz(id_aprendiz),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo)
);

CREATE TABLE codigo_qr (
    id_codigo_qr SERIAL PRIMARY KEY,
    url_direccion_qr VARCHAR(100) NOT NULL UNIQUE,
    fecha_creacion DATE NOT NULL,
    id_celador INT NOT NULL,

    FOREIGN KEY (id_celador) REFERENCES celador(id_celador)
);

CREATE TABLE entrada_salida_aprendiz (
    id_entrada_salida_aprendiz SERIAL PRIMARY KEY,
    hora_entrada TIMESTAMP NOT NULL,
    hora_salida TIMESTAMP,
    id_aprendiz INT NOT NULL,
    id_vehiculo INT NOT NULL,
    id_codigo_qr INT NOT NULL,

    UNIQUE (id_aprendiz, id_vehiculo, hora_entrada),
    UNIQUE (id_codigo_qr, hora_entrada),

    FOREIGN KEY (id_aprendiz) REFERENCES aprendiz(id_aprendiz),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo),
    FOREIGN KEY (id_codigo_qr) REFERENCES codigo_qr(id_codigo_qr)
);

CREATE TABLE soporte_tecnico (
    id_reporte SERIAL PRIMARY KEY,
    nombre_del_reporte VARCHAR(45) NOT NULL,
    descripcion_del_reporte VARCHAR(100) NOT NULL,
    id_usuario INT NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);



-- Inserta los tipos de contacto que puede tener un centro (teléfono o correo)
INSERT INTO tipo_contacto (nombre_tipo_contacto) VALUES
('Teléfono'),
('Correo');

-- Inserta los tipos de documento que pueden tener los usuarios
INSERT INTO tipo_documento (nombre_del_documento, sigla) VALUES
('Cédula de ciudadanía', 'CC'),
('Tarjeta de identidad', 'TI');

-- Inserta los tipos de vehículos permitidos en el sistema
INSERT INTO tipo_vehiculo (nombre_del_vehiculo) VALUES
('Moto'),
('Bicicleta');

-- Inserta un centro de formación donde estarán asociados usuarios y vehículos
INSERT INTO centro_de_formacion (nombre_del_centro) VALUES
('Centro Industrial');

-- Inserta las cuentas del sistema (credenciales de acceso)
INSERT INTO cuenta (correo, contraseña) VALUES
('admin@mail.com', '123'),
('aprendiz@mail.com', '123'),
('celador@mail.com', '123');

-- Inserta los roles del sistema (permisos o tipos de usuario)
INSERT INTO rol (nombre_del_rol) VALUES
('Administrador'),
('Aprendiz'),
('Celador');

-- =========================
-- USUARIOS
-- =========================

-- Inserta los usuarios con sus datos personales y relaciones a cuenta y tipo de documento
INSERT INTO usuario (
primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
numero_documento, numero_celular, id_cuenta, id_tipo_documento
) VALUES
('Juan', 'Carlos', 'Perez', 'Lopez', 123456, '3001111111', 1, 1),
('Maria', 'Luisa', 'Gomez', 'Diaz', 654321, '3002222222', 2, 1),
('Pedro', 'Jose', 'Ramirez', 'Torres', 987654, '3003333333', 3, 1);

-- =========================
-- RELACIONES
-- =========================

-- Relaciona cada cuenta con su rol (tabla intermedia muchos a muchos)
INSERT INTO cuenta_rol (id_cuenta, id_rol) VALUES
(1,1), -- Cuenta 1 es Administrador
(2,2), -- Cuenta 2 es Aprendiz
(3,3); -- Cuenta 3 es Celador

-- =========================
-- TIPOS DE USUARIO
-- =========================

-- Define que el usuario con id 1 tiene rol de administrador
INSERT INTO administrador (id_usuario) VALUES (1);

-- Define que el usuario con id 3 tiene rol de celador
INSERT INTO celador (id_usuario) VALUES (3);

-- Inserta un aprendiz con información adicional requerida para su registro
INSERT INTO aprendiz (
id_usuario, foto_url_del_aprendiz, firma_url_digital_aprendiz,
documento_identidad_del_aprendiz, carnet_url_del_aprendiz,
fecha_de_inicio_de_vinculacion, fecha_fin_de_vinculacion,
direccion, celular
) VALUES (
2, 'foto.jpg', 'firma.jpg', 'doc.pdf', 'carnet.jpg',
'2024-01-01', '2025-01-01', 'Calle 1', '3002222222'
);

-- =========================
-- CENTRO Y CONTACTOS
-- =========================

-- Inserta los contactos del centro (teléfono y correo)
INSERT INTO contacto_centro (detalle_contacto, id_centro_de_formacion, id_tipo_contacto) VALUES
('3001234567', 1, 1), -- Teléfono del centro
('centro@mail.com', 1, 2); -- Correo del centro

-- =========================
-- VEHICULOS
-- =========================

-- Inserta vehículos asociados al centro de formación
INSERT INTO vehiculo (id_tipo_vehiculo, id_centro_de_formacion) VALUES
(1,1), -- Vehículo tipo Moto
(2,1); -- Vehículo tipo Bicicleta

-- Inserta la información específica de una moto
INSERT INTO moto (
id_vehiculo, foto_moto, foto_placa_moto,
tarjeta_de_propiedad_moto, soat_y_tecno_mecanica_vigentes,
marca_de_la_moto, cilindraje_moto, color_de_la_moto, modelo_de_la_moto
) VALUES (
1, 'moto.jpg', 'placa.jpg', 'tarjeta.pdf', 'soat.pdf',
'Yamaha', '150cc', 'Rojo', '2022'
);

-- Inserta la información específica de una bicicleta
INSERT INTO bicicleta (
id_vehiculo, foto_de_la_bicicleta, foto_serial_bicicleta,
marca_de_la_bicicleta, color_de_la_bicicleta, serial_de_la_bicicleta
) VALUES (
2, 'bici.jpg', 'serial.jpg', 'GW', 'Negro', 'ABC123'
);

-- =========================
-- RELACION APRENDIZ - VEHICULO
-- =========================

-- Relaciona el aprendiz con los vehículos que utiliza
INSERT INTO vehiculo_aprendiz (id_aprendiz, id_vehiculo) VALUES
(1,1), -- Aprendiz usa la moto
(1,2); -- Aprendiz usa la bicicleta

-- =========================
-- CODIGO QR
-- =========================

-- Inserta un código QR generado por un celador
INSERT INTO codigo_qr (url_direccion_qr, fecha_creacion, id_celador) VALUES
('qr1.png', '2025-01-01', 1);

-- =========================
-- MOVIMIENTOS
-- =========================

-- Registra la entrada y salida de un aprendiz con su vehículo usando un QR
INSERT INTO entrada_salida_aprendiz (
hora_entrada, hora_salida, id_aprendiz, id_vehiculo, id_codigo_qr
) VALUES (
'2025-01-01 08:00:00',
'2025-01-01 17:00:00',
1, 1, 1
);

-- =========================
-- SOPORTE TECNICO
-- =========================

-- Inserta un reporte de soporte técnico generado por un usuario
INSERT INTO soporte_tecnico (
nombre_del_reporte, descripcion_del_reporte, id_usuario
) VALUES
('Error app', 'No carga el sistema', 1);




--UPDATES

-- Cambia la contraseña de una cuenta
UPDATE cuenta SET contraseña='456' WHERE id_cuenta=1;

-- Cambia el correo de una cuenta
UPDATE cuenta SET correo='nuevo@gmail.com' WHERE id_cuenta=2;

-- Actualiza nombres del usuario
UPDATE usuario SET primer_nombre='Juan' WHERE id_usuario=1;
UPDATE usuario SET segundo_nombre='Carlos' WHERE id_usuario=1;

-- Cambia el nombre de un tipo de documento
UPDATE tipo_documento SET nombre_del_documento='Cedula Ciudadania' WHERE id_tipo_documento=1;

-- Actualiza datos de usuario
UPDATE usuario SET numero_celular=3009999999 WHERE id_usuario=2;
UPDATE usuario SET primer_apellido='Gomez' WHERE id_usuario=2;

-- Cambia otra contraseña
UPDATE cuenta SET contraseña='789' WHERE id_cuenta=3; 


--SELECT

-- Muestra todos los usuarios con su número de celular y documento
SELECT primer_nombre, numero_documento, numero_celular
FROM usuario;

-- Muestra los aprendices con su dirección
SELECT u.primer_nombre, a.direccion
FROM aprendiz a
INNER JOIN usuario u ON a.id_usuario = u.id_usuario;

-- Muestra los vehículos con su tipo
SELECT v.id_vehiculo, tv.nombre_del_vehiculo
FROM vehiculo v
INNER JOIN tipo_vehiculo tv ON v.id_tipo_vehiculo = tv.id_tipo_vehiculo;

-- Muestra las motos con su marca y color
SELECT marca_de_la_moto, color_de_la_moto
FROM moto;

-- Muestra bicicletas con su marca y serial
SELECT marca_de_la_bicicleta, serial_de_la_bicicleta
FROM bicicleta;

-- Muestra qué aprendiz tiene qué vehículo
SELECT u.primer_nombre, va.id_vehiculo
FROM vehiculo_aprendiz va
INNER JOIN aprendiz a ON va.id_aprendiz = a.id_aprendiz
INNER JOIN usuario u ON a.id_usuario = u.id_usuario;

-- Muestra entradas y salidas de aprendices con su nombre
SELECT u.primer_nombre, e.hora_entrada, e.hora_salida
FROM entrada_salida_aprendiz e
INNER JOIN aprendiz a ON e.id_aprendiz = a.id_aprendiz
INNER JOIN usuario u ON a.id_usuario = u.id_usuario;

-- Muestra los contactos del centro con su tipo
SELECT cc.detalle_contacto, tc.nombre_tipo_contacto
FROM contacto_centro cc
INNER JOIN tipo_contacto tc ON cc.id_tipo_contacto = tc.id_tipo_contacto;

-- Muestra reportes de soporte con el nombre del usuario
SELECT s.nombre_del_reporte, s.descripcion_del_reporte, u.primer_nombre
FROM soporte_tecnico s
INNER JOIN usuario u ON s.id_usuario = u.id_usuario;

-- Muestra cuántos vehículos hay por tipo
SELECT tv.nombre_del_vehiculo, COUNT(v.id_vehiculo) AS cantidad
FROM vehiculo v
INNER JOIN tipo_vehiculo tv ON v.id_tipo_vehiculo = tv.id_tipo_vehiculo
GROUP BY tv.nombre_del_vehiculo;


--SUBCONSULTAS

-- Muestra nombres de usuarios que tienen cuenta con correo específico
SELECT primer_nombre
FROM usuario
WHERE id_cuenta = (
    SELECT id_cuenta
    FROM cuenta
    WHERE correo = 'admin@mail.com'
);

-- Muestra correos de cuentas que son del rol "Aprendiz"
SELECT correo
FROM cuenta
WHERE id_cuenta IN (
    SELECT id_cuenta
    FROM cuenta_rol
    WHERE id_rol = (
        SELECT id_rol
        FROM rol
        WHERE nombre_del_rol = 'Aprendiz'
    )
);

-- Muestra usuarios que tienen tipo de documento "CC"
SELECT primer_nombre
FROM usuario
WHERE id_tipo_documento = (
    SELECT id_tipo_documento
    FROM tipo_documento
    WHERE sigla = 'CC'
);

-- Muestra usuarios que son celadores
SELECT primer_nombre
FROM usuario
WHERE id_usuario IN (
    SELECT id_usuario
    FROM celador
);

-- Muestra vehículos que pertenecen al "Centro Industrial"
SELECT id_vehiculo
FROM vehiculo
WHERE id_centro_de_formacion = (
    SELECT id_centro_de_formacion
    FROM centro_de_formacion
    WHERE nombre_del_centro = 'Centro Industrial'
);

-- Muestra marcas de motos que están registradas como vehículos
SELECT marca_de_la_moto
FROM moto
WHERE id_vehiculo IN (
    SELECT id_vehiculo
    FROM vehiculo
);

-- Muestra nombres de usuarios que tienen rol "Administrador"
SELECT primer_nombre
FROM usuario
WHERE id_cuenta IN (
    SELECT id_cuenta
    FROM cuenta_rol
    WHERE id_rol = (
        SELECT id_rol
        FROM rol
        WHERE nombre_del_rol = 'Administrador'
    )
);

-- Muestra centros de formación que tienen vehículos registrados
SELECT nombre_del_centro
FROM centro_de_formacion
WHERE id_centro_de_formacion IN (
    SELECT id_centro_de_formacion
    FROM vehiculo
);

-- Muestra usuarios que tienen más de un rol
SELECT primer_nombre
FROM usuario
WHERE id_cuenta IN (
    SELECT id_cuenta
    FROM cuenta_rol
    GROUP BY id_cuenta
    HAVING COUNT(id_rol) > 1
);

-- Muestra aprendices que tienen vehículos registrados
SELECT id_aprendiz
FROM aprendiz
WHERE id_aprendiz IN (
    SELECT id_aprendiz
    FROM vehiculo_aprendiz
);


--DELETE
-- Elimina registros de entrada/salida
DELETE FROM entrada_salida_aprendiz WHERE id_entrada_salida_aprendiz = 1;

-- Elimina código QR
DELETE FROM codigo_qr WHERE id_codigo_qr = 1;

-- Elimina relación vehículo-aprendiz
DELETE FROM vehiculo_aprendiz WHERE id_vehiculo_aprendiz = 1;

-- Elimina bicicleta
DELETE FROM bicicleta WHERE id_bicicleta = 1;

-- Elimina moto
DELETE FROM moto WHERE id_moto = 1;

-- Elimina vehículo
DELETE FROM vehiculo WHERE id_vehiculo = 1;

-- Elimina aprendiz (primero relaciones)
DELETE FROM vehiculo_aprendiz WHERE id_aprendiz = 1;
DELETE FROM aprendiz WHERE id_aprendiz = 1;

-- Elimina celador
DELETE FROM celador WHERE id_celador = 1;

-- Elimina administrador
DELETE FROM administrador WHERE id_administrador = 1;

-- Elimina usuario (primero quitar relaciones)
DELETE FROM administrador
WHERE id_usuario = 1;
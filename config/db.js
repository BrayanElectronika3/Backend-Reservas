/*
CREATE TABLE configuracionreservas (
    id                 		INT AUTO_INCREMENT PRIMARY KEY,
    idServicio	       	INT NOT NULL,
    idSede		INT NOT NULL,
    idTenant          	CHAR(36) NOT NULL,
    horaInicial		DATETIME NOT NULL,
    horaFinal		DATETIME NOT NULL,
    duracionReserva	INT NOT NULL,
    createdAt		DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt		DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt		DATETIME DEFAULT NULL
);

CREATE TABLE reservas (
    id                 		INT AUTO_INCREMENT PRIMARY KEY,
    idPersona	       	INT NOT NULL,
    idTenant          	CHAR(36) NOT NULL,
    idServicio	       	INT NOT NULL,
    idSede		INT NOT NULL,
    horaReserva		DATETIME NOT NULL,
    duracionReserva	DATETIME NOT NULL,
    createdAt		DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt		DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt		DATETIME DEFAULT NULL
);
*/
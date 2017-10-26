 CREATE TABLE `cliente` (
  `rutCliente` int(11) NOT NULL,
  `nombreCliente` varchar(45) NOT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `mail` varchar(60) DEFAULT NULL,
  `fecha_nacimiento` varchar(20) DEFAULT NULL,
  `monedero` int(11) NOT NULL,
  PRIMARY KEY (`rutCliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `factura` (
  `id_Factura` int(9) NOT NULL AUTO_INCREMENT,
  `Fecha` datetime NOT NULL,
  `Costo` int(50) NOT NULL,
  `Iva` int(2) NOT NULL,
  `Ready` tinyint(1) NOT NULL,
  `bulto_pendiente` int(2) NOT NULL,
  `Bultos` int(11) NOT NULL,
  `Rut_Proveedor` int(11) NOT NULL,
  `Num_Documento` int(11) NULL,
  PRIMARY KEY (`id_Factura`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8


CREATE TABLE `producto` (
  `id_producto` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cantidadtotal` int(11) NOT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `productofactura` (
  `id_producto` int(10) NOT NULL,
  `id_factura` int(9) NOT NULL,
  `indice_bulto` int(2) NOT NULL,
  `precio` int(11) NOT NULL,
  `cantidad` int(3) NOT NULL,
  PRIMARY KEY (`id_producto`,`id_factura`,`indice_bulto`),
  KEY `idProducto` (`id_producto`),
  KEY `idFactura` (`id_factura`),
  CONSTRAINT `idFactura` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id_Factura`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `idProducto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8



CREATE TABLE `proveedor` (
  `Rut_proveedor` int(11) NOT NULL,
  `Nombre_proveedor` varchar(45) NOT NULL,
  `Telefono` int(15) DEFAULT NULL,
  `Direccion` varchar(100) DEFAULT NULL,
  `Mail` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`Rut_proveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `tag` (
  `tag` varchar(30) NOT NULL,
  PRIMARY KEY (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

CREATE TABLE `tagproducto` (
  `tag` varchar(45) NOT NULL,
  `id_producto` int(11) NOT NULL,
  PRIMARY KEY (`tag`,`id_producto`),
  KEY `idProducto` (`id_producto`),
  KEY `Tag` (`tag`),
  CONSTRAINT `id_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `tag` FOREIGN KEY (`tag`) REFERENCES `tag` (`tag`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8







CREATE TABLE `usuario` (
  `nombre` varchar(45) NOT NULL,
  `contrasenna` varchar(45) NOT NULL,
  PRIMARY KEY (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8



CREATE TABLE `vendedor` (
  `rutVendedor` int(11) NOT NULL,
  `nombreVendedor` varchar(45) NOT NULL,
  PRIMARY KEY (`rutVendedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `venta` (
  `id_venta` int(10) NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `rut_vendedor` int(11) DEFAULT NULL,
  `rut_cliente` int(11) DEFAULT NULL,
  `pago` varchar(20) NOT NULL,
  `monto` int(11) NOT NULL,
  PRIMARY KEY (`id_venta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `ventaproducto` (
  `id_venta` int(11) NOT NULL,
  `codigo_producto` varchar(16) NOT NULL COMMENT 'codigo completo de 16 digitos ',
  `precio` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  PRIMARY KEY (`id_venta`,`codigo_producto`),
  KEY `idVenta` (`id_venta`),
  KEY `idProducto` (`codigo_producto`),
  CONSTRAINT `id_venta` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `liquidaciones` (
  `codigo_producto_liquidacion` varchar(16) NOT NULL COMMENT 'codigo completo de 16 digitos ',
  `precio_liquidacion` int(11) NOT NULL,
  PRIMARY KEY (`codigo_producto`) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `liquidaciontags` (
  `id_tag_liquidacion` int(11) NOT NULL AUTO_INCREMENT,
  `tag_liquidacion` varchar(16) NOT NULL COMMENT 'codigo completo de 16 digitos ',
  `descuento` int(11) NOT NULL,
  `tipo` varchar(11) NOT NULL,
  PRIMARY KEY (`id_tag_liquidacion`) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `importaciones` (
  `id_producto_importacion` int(7) NOT NULL,
  `nombre_importacion` varchar(60) NOT NULL,
  `precio_importacion` int(11) NOT NULL,
  `cantidad_importacion` int(3) NOT NULL
  PRIMARY KEY (`id_producto_importacion`) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8
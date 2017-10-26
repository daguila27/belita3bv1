exports.new = function(req, res){
	req.session.saleProducts = [];
	req.session.codeProducts = [];
	req.session.nameSeller = "";
	req.session.codVenta = 0;
	req.session.CostoTotal = 0;
	console.log(req.session.saleProducts);
	res.render('sale', {page_title: 'Nueva Venta', login_admin: req.session.login_admin});
}
exports.refresh = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	//req.session.saleProducts[parseInt(input.indice)].precio = parseInt(input.nuevoPrecio);
	req.session.saleProducts[parseInt(input.indice)].precioFinal = parseInt(input.nuevoPrecio);
	req.session.CostoTotal = 0;
	console.log(req.session.saleProducts);
	for(var i=0; i<req.session.saleProducts.length; i++){
		if(req.session.saleProducts[i] != null){
			if(req.session.saleProducts[i].precioFinal || req.session.saleProducts[i].precioFinal == 0){
				req.session.CostoTotal += req.session.saleProducts[i].precioFinal;
			}
			else{
				req.session.CostoTotal += req.session.saleProducts[i].precio;	
			}
		}
	}
	res.render('costo', {costo: req.session.CostoTotal});
}
exports.sale = function(req, res){
	console.log(req.session.saleProducts);
	console.log(req.session.CostoTotal);
	res.render('sale_table', {data: req.session.saleProducts, Costo: req.session.CostoTotal});
}


















function interseccion(array1, array2){
	var aux = [];
	for(var i=0; i<array1.length; i++){
		for(var j=0; j<array2.length; j++){
			if(array1[i] == array2[j]){
				aux[j] = array1[i];
				break;
			}
		}
	}
	console.log("INTERSECCION EN ENTRE");
	console.log(array1);
	console.log(array2);
	console.log(aux);
	return aux;
}





function igual(array1, array2){
	if(array1.length != array2.length){
		return false;
	}
	for(var i=0; i<array1.length; i++){
		if(array1[i] != array2[i]){
			return false;
		}
	}
	return true;
}

















exports.add_product = function(req, res){
	// 00 00005 000002 000
	var input = JSON.parse(JSON.stringify(req.body));
	var indice_bulto = parseInt(input.codigo.toString().substring(0,2));
	var id_factura = parseInt(input.codigo.toString().substring(3, 7));
	var id_producto = parseInt(input.codigo.toString().substring(8, 13));
	req.getConnection(function(err, connection){

		connection.query('SELECT * FROM liquidaciones WHERE codigo_producto_liquidacion = ?', input.codigo, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			if(rows.length > 0){
				var liq = rows[0];
				console.log("se detecto la siguiente liquidacion");
				console.log(liq);
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							console.log(req.session.saleProducts);
							var i = req.session.saleProducts.length;	
							if(liq.length != 0){
								console.log(req.session.saleProducts);
								req.session.saleProducts[i-1].precio = liq.precio_liquidacion;
								req.session.CostoTotal += liq.precio_liquidacion;
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								console.log(req.session.saleProducts);
							}
							else{
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal;
								console.log(req.session.saleProducts);
							}
							res.redirect('/render_sale');
						}
					});
			}
			else{
				console.log('no exiten liquidaciones');
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							var data = req.session.saleProducts[req.session.saleProducts.length-1];
							var array = data.nombre.split(',');
								connection.query("SELECT * FROM liquidaciontags", function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);
									if(rows.length > 0){
										for(var j=0; j<rows.length; j++){
												if(igual(interseccion(array, rows[j].tag_liquidacion.split(',')), rows[j].tag_liquidacion.split(',')) ){
													console.log("LIQUIDACIONES VALIDA");
													if(rows[j].tipo == 'porcentaje'){
														var precio = parseInt(rows[0].descuento)/100;
														precio = req.session.saleProducts[req.session.saleProducts.length-1].precio - precio*req.session.saleProducts[req.session.saleProducts.length-1].precio;
														req.session.saleProducts[req.session.saleProducts.length-1].precio = precio;
														req.session.CostoTotal += precio;
														break;
													}
													else{
														var precio = parseInt(rows[0].descuento);
														req.session.saleProducts[req.session.saleProducts.length-1].precio = precio;
														req.session.CostoTotal += precio;
														break;
													}		
												};
											}
									}
									else{//EL PRODUCTO NO TIENE LIQUIDACIONES POR SUS TAGS
										req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length-1].precio;
									}
									console.log(req.session.saleProducts);
									res.redirect('/render_sale');
								});
						}
					});
			}

		});

	});
}





/*exports.add_product = function(req, res){
	// 00 00005 000002 000
	var input = JSON.parse(JSON.stringify(req.body));
	var indice_bulto = parseInt(input.codigo.toString().substring(0,2));
	var id_factura = parseInt(input.codigo.toString().substring(3, 7));
	var id_producto = parseInt(input.codigo.toString().substring(8, 13));
	req.getConnection(function(err, connection){

		connection.query('SELECT * FROM liquidaciones WHERE codigo_producto_liquidacion = ?', input.codigo, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			if(rows.length > 0){
				var liq = rows[0];
				console.log("se detecto la siguiente liquidacion");
				console.log(liq);
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							console.log(req.session.saleProducts);
							var i = req.session.saleProducts.length;	
							if(liq.length != 0){
								console.log(req.session.saleProducts);
								req.session.saleProducts[i-1].precio = liq.precio_liquidacion;
								req.session.CostoTotal += liq.precio_liquidacion;
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								console.log(req.session.saleProducts);
							}
							else{
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal;
								console.log(req.session.saleProducts);
							}
							res.redirect('/render_sale');
						}
					});
			}
			else{
				console.log('no exiten liquidaciones');
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							var data = req.session.saleProducts[req.session.saleProducts.length-1];
							var array = data.nombre.split(',');
								connection.query("SELECT * FROM liquidaciontags", function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);
									if(rows.length > 0){
										for(var j=0; j<rows.length; j++){
												if(igual(interseccion(array, rows[j].tag_liquidacion.split(',')), rows[j].tag_liquidacion.split(',')) ){
													console.log("LIQUIDACIONES VALIDA");
													if(rows[j].tipo == 'porcentaje'){
														var precio = parseInt(rows[0].descuento)/100;
														precio = req.session.saleProducts[req.session.saleProducts.length-1].precio - precio*req.session.saleProducts[req.session.saleProducts.length-1].precio;
														req.session.saleProducts[req.session.saleProducts.length-1].precio = precio;
														req.session.CostoTotal += precio;
														break;
													}
													else{
														var precio = parseInt(rows[0].descuento);
														req.session.saleProducts[req.session.saleProducts.length-1].precio = precio;
														req.session.CostoTotal += precio;
														break;
													}		
												};
											}
									}
									else{//EL PRODUCTO NO TIENE LIQUIDACIONES POR SUS TAGS
										req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length-1].precio;
									}
									console.log(req.session.saleProducts);
									res.redirect('/render_sale');
								});						}
					});
			}

		});

	});
}
*/
























































/*

exports.add_product_other = function(req, res){
	// 00 00005 000002 000
	var input = JSON.parse(JSON.stringify(req.body));
	var indice_bulto = parseInt(input.codigo.toString().substring(0,2));
	var id_factura = parseInt(input.codigo.toString().substring(3, 7));
	var id_producto = parseInt(input.codigo.toString().substring(8, 13));
	var mysql = require('mysql');
	var connection = mysql.createPool({
	    		host: '127.0.0.1',
	    		user: 'root',
	    		password : 'belita3b',
	    		port : 3306, 
	    		database:'belita3'});
	connection.getConnection(function(err, connection){
		connection.query('SELECT * FROM liquidaciones WHERE codigo_producto_liquidacion = ?', input.codigo, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			if(rows.length > 0){
				var liq = rows[0];
				console.log("se detecto la siguiente liquidacion");
				console.log(liq);
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							console.log(req.session.saleProducts);
							var i = req.session.saleProducts.length;	
							if(liq.length != 0){
								console.log(req.session.saleProducts);
								req.session.saleProducts[i-1].precio = liq.precio_liquidacion;
								req.session.CostoTotal += liq.precio_liquidacion;
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								console.log(req.session.saleProducts);
							}
							else{
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal;
								console.log(req.session.saleProducts);
							}
							res.redirect('/render_sale');
						}
					});
			}
			else{
				console.log('no exiten liquidaciones');
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							req.session.CostoTotal += rows[0].precio;
							console.log(req.session.saleProducts);
							res.redirect('/render_sale');
						}
					});
			}

		});

	});
}
*/



exports.add_product_other = function(req, res){
	// 00 00005 000002 000
	var input = JSON.parse(JSON.stringify(req.body));
	var indice_bulto = parseInt(input.codigo.toString().substring(0,2));
	var id_factura = parseInt(input.codigo.toString().substring(3, 7));
	var id_producto = parseInt(input.codigo.toString().substring(8, 13));
	var mysql = require('mysql');
	var connection = mysql.createPool({
	    		host: '127.0.0.1',
	    		user: 'root',
	    		password : 'belita3b',
	    		port : 3306, 
	    		database:'belita3'});
	connection.getConnection(function(err, connection){

		connection.query('SELECT * FROM liquidaciones WHERE codigo_producto_liquidacion = ?', input.codigo, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			if(rows.length > 0){
				var liq = rows[0];
				console.log("se detecto la siguiente liquidacion");
				console.log(liq);
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							console.log(req.session.saleProducts);
							var i = req.session.saleProducts.length;	
							if(liq.length != 0){
								console.log(req.session.saleProducts);
								req.session.saleProducts[i-1].precio = liq.precio_liquidacion;
								req.session.CostoTotal += liq.precio_liquidacion;
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								console.log(req.session.saleProducts);
							}
							else{
								req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal = req.session.saleProducts[req.session.saleProducts.length-1].precio;
								req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length - 1].precioFinal;
								console.log(req.session.saleProducts);
							}
							res.redirect('/render_sale');
						}
					});
			}
			else{
				console.log('no exiten liquidaciones');
				connection.query("SELECT * FROM productofactura LEFT JOIN (producto) ON (productofactura.id_producto = producto.id_producto) WHERE productofactura.id_producto = ? AND id_factura = ? AND indice_bulto = ?", [id_producto,id_factura,indice_bulto], function(err, rows){
						if(err){
							console.log("PRODUCTO NO LOCALIZADO...");
							console.log("Error inserting : %s", err);
						}
						else if(rows.length > 0){
							req.session.codeProducts[req.session.codeProducts.length] = input.codigo.toString();
							req.session.saleProducts[req.session.saleProducts.length] = rows[0];
							var data = req.session.saleProducts[req.session.saleProducts.length-1];
							var array = data.nombre.split(',');
								connection.query("SELECT * FROM liquidaciontags", function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);
									if(rows.length > 0){
										for(var j=0; j<rows.length; j++){
												if(igual(interseccion(array, rows[j].tag_liquidacion.split(',')), rows[j].tag_liquidacion.split(',')) ){
													console.log("LIQUIDACIONES VALIDA");
													if(rows[j].tipo == 'porcentaje'){
														var precio = parseInt(rows[0].descuento)/100;
														precio = req.session.saleProducts[req.session.saleProducts.length-1].precio - precio*req.session.saleProducts[req.session.saleProducts.length-1].precio;
														req.session.saleProducts[req.session.saleProducts.length-1].precio = precio;
														req.session.CostoTotal += precio;
														break;
													}
													else{
														var precio = parseInt(rows[0].descuento);
														req.session.saleProducts[req.session.saleProducts.length-1].precio = precio;
														req.session.CostoTotal += precio;
														break;
													}		
												};
											}
									}
									else{//EL PRODUCTO NO TIENE LIQUIDACIONES POR SUS TAGS
										req.session.CostoTotal += req.session.saleProducts[req.session.saleProducts.length-1].precio;
									}
									console.log(req.session.saleProducts);
									res.redirect('/render_sale');
								});
						}
					});
			}

		});

	});
}












































exports.remove_product = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.session.saleProducts[input.indice] = null;
	req.session.codeProducts[input.indice] = null;
	req.session.CostoTotal -= parseInt(input.precio);
	res.redirect('/render_sale');
}


//UPDATE test SET col2 = CASE col1 WHEN 'test1' THEN 1 WHEN 'test2' THEN 3 WHEN 'test3' THEN 5
//UPDATE producto SET precio = ? WHERE id_producto = ? ',
exports.finish_sale = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var pago = input.pago;
	var RutVendedor = input.CodigoVendedor;
	var RutCliente = input.CodigoCliente;
	var fecha = new Date();
	var productos = req.session.saleProducts;
	var insertId;
	if(RutVendedor == ''){RutVendedor = 0;}
	if(RutCliente == ''){RutCliente = 0;}
	req.getConnection(function(err, connection){
		console.log(productos);
		console.log(req.session.saleProducts);
		data = {
			fecha: fecha,
			rut_vendedor: RutVendedor,
			rut_cliente: RutCliente,
			pago: pago,
			monto: req.session.CostoTotal
		};
		connection.query('INSERT INTO venta SET ?', data, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			
			insertId = rows.insertId;
			req.session.codVenta = rows.insertId;
			
			for(var i=0; i<productos.length; i++){
				if(productos[i] != null){
					if(req.session.codeProducts[i].toString().substring(13, 14) == 0){
						console.log("descontando de importaciones");
						connection.query('UPDATE importaciones SET cantidad_importacion = cantidad_importacion - 1 WHERE id_producto_importacion = ? AND id_factura_importacion = ? AND indice_bulto_importacion = ?', [productos[i].id_producto, productos[i].id_factura, productos[i].indice_bulto], function(err, rows){
							if(err)
								console.log("Error Selecting : %s", err);
						});
					}
					else{
						connection.query('UPDATE producto SET cantidadtotal = cantidadtotal - 1 WHERE id_producto = ?', [productos[i].id_producto], function(err, rows){
							if(err)
								console.log("Error Selecting : %s", err);
						});
						connection.query('UPDATE productofactura SET cantidad = cantidad - 1 WHERE id_producto = ? AND id_factura = ? AND indice_bulto = ?', [productos[i].id_producto, productos[i].id_factura, productos[i].indice_bulto], function(err, rows){
							if(err)
								console.log("Error Selecting : %s", err);

						});
					}
					if(productos[i].precioFinal || productos[i].precioFinal == 0){
						var dataProduct = {
							id_venta: insertId,
							codigo_producto: req.session.codeProducts[i],
							precio: productos[i].precioFinal,
							id_producto: parseInt(req.session.codeProducts[i].substring(7, 13)),
							nombre_producto: productos[i].nombre
						};
					}
					else{
						var dataProduct = {
							id_venta: insertId,
							codigo_producto: req.session.codeProducts[i],
							precio: productos[i].precio,
							id_producto: parseInt(req.session.codeProducts[i].substring(7, 13)),
							nombre_producto: productos[i].nombre
						};
					}
					connection.query('INSERT INTO ventaproducto SET ?', dataProduct, function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
									
					});
				}
				if(i == productos.length-1){res.redirect('/voucher_sale');}
			}
	});
	});

}


exports.estadisticasxproducto = function(req, res){
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM ventaproducto LEFT JOIN venta ON (ventaproducto.id_venta = venta.id_venta)', function(err, rows){
            if(err)
                console.log("Error Selecting : %s", err);
            console.log(rows);
            res.render('estadisticas_ventas', {page_title: 'Estadisticas de Ventas', data: rows});
        });

        
    });
}



exports.estadisticas = function(req, res){
	var datosVendedor; 
    req.getConnection(function(err, connection){
        connection.query('select * from venta right join vendedor on (venta.rut_vendedor = vendedor.rutVendedor) left join cliente on (venta.rut_cliente = cliente.rutCliente)', function(err, rows){
            if(err)
                console.log("Error Selecting : %s", err);
            res.render('estadisticas_ventas', {page_title: 'Estadisticas de Ventas', data: rows});

        });

        
    });

}



exports.details = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('select * from venta left join vendedor on (venta.rut_vendedor = vendedor.rutVendedor) left join cliente on (venta.rut_cliente = cliente.rutCliente)', function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			console.log(rows);
			res.render('details_sale_table', {data: rows});

		});
	});
}

exports.fillSeller = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('select * from vendedor right join venta on (vendedor.rutVendedor = venta.rut_vendedor)', function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);

			res.render('fill_seller_table', {data: rows});
			
		});
	});
}

exports.fillDate = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('', function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			res.render('fill_date_table');
			
		});
	});
}


exports.cambiarTabla = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM venta', function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
			var datos = rows;
			for(var i=0; i<datos.length; i++){
				connection.query('SELECT * FROM venta LEFT JOIN ventaproducto ON (venta.id_venta = ventaproducto.id_venta) WHERE venta.id_venta = ?', datos[i].id_venta, function(err, rows){
					if(err){console.log("Error Selecting : %s", err);}
					var monto = 0;
					for(var j=0; j<rows.length; j++){
						monto += rows[j].precio;
					}
					console.log(monto);
					connection.query('UPDATE venta SET monto = ' + monto  + ' WHERE id_venta = ? ', rows[0].id_venta, function(err, rows){
						if(err){console.log("Error Selecting : %s", err);}
					});
				});
			}
		});
	});
	res.redirect('/');
}


exports.tableDate = function(req, res){
		var input = JSON.parse(JSON.stringify(req.body));
		var date = input.fecha.split('/');
		var fecha = "";
		for(var i=date.length-1; i>=0; i--){
			fecha += date[i];
			if(i != 0){fecha += "-";}
		}
		req.getConnection(function(err, connection){
			connection.query("select * from venta right join vendedor on (venta.rut_vendedor = vendedor.rutVendedor) left join cliente on (venta.rut_cliente = cliente.rutCliente)  where venta.fecha like '"+fecha+"%'", function(err, rows){
				if(err){
					console.log("Error Selecting : %s", err);
				}
				res.render('date_table', {data: rows});
			});
		});	
}

exports.find = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query('select * from venta right join vendedor on (venta.rut_vendedor = vendedor.rutVendedor) left join cliente on (venta.rut_cliente = cliente.rutCliente) where venta.id_venta = ?', [input.codVenta], function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			console.log(rows);
			res.render('sale_item', {data: rows, type: input.type, page_title: "Detalles de la venta"});
		});
	});
}



exports.actualizarTabla = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM ventaproducto', function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
			var datos = rows;
			for(var i=0; i<datos.length; i++){
				connection.query('UPDATE ventaproducto SET id_producto = ' + parseInt(datos[i].codigo_producto.substring(7, 13))  + ' WHERE codigo_producto = ? ', datos[i].codigo_producto, function(err, rows){
						if(err){console.log("Error Selecting : %s", err);}
				});
			}
		});
	});
	res.redirect('/');
}


exports.deleteProduct = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var indice_bulto = parseInt(input.codigoProducto.toString().substring(0,2));
	var id_factura = parseInt(input.codigoProducto.toString().substring(3, 7));
	var id_producto = parseInt(input.codigoProducto.toString().substring(8, 13));
	var indice_tienda = parseInt(input.codigoProducto.toString().substring(13, 14));
	req.getConnection(function(err, connection){
			connection.query('SELECT * FROM ventaproducto right join venta ON (ventaproducto.id_venta = venta.id_venta) WHERE codigo_producto = ? AND ventaproducto.id_venta = ? ;', [input.codigoProducto, input.idVenta], function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				var saldo = rows[0].precio;
				var rutCliente = rows[0].rut_cliente;
				connection.query('UPDATE cliente SET monedero = monedero+'+saldo+' WHERE rutCliente = ?', [rutCliente], function(err, rows){	
					if(err)
						console.log("Error Selecting : %s", err);
					connection.query('DELETE FROM ventaproducto WHERE codigo_producto = ?', [input.codigoProducto], function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err)
						connection.query('UPDATE venta SET monto = monto -' + input.precio  + ' WHERE id_venta = ? ', [input.idVenta], function(err, rows){
							if(err)
								console.log("Error Selecting : %s", err);
							if(indice_tienda == 1){
								connection.query('UPDATE importaciones SET cantidad_importacion = cantidad_importacion + 1 WHERE id_producto_importacion = ? AND id_factura_importacion = ? AND indice_bulto_importacion = ?', [id_producto, id_factura, indice_bulto], function(err, rows){
										if(err)
											console.log("Error Selecting : %s", err);							
										res.send('success');
									});
							}
							else if(indice_tienda == 0){
								connection.query('UPDATE producto SET cantidadtotal = cantidadtotal + 1 WHERE id_producto = ?', [parseInt(input.codigoProducto.substring(7, 13))],function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);
									connection.query('UPDATE productofactura SET cantidad = cantidad + 1 WHERE id_producto = ? AND id_factura = ? AND indice_bulto = ?', [id_producto, id_factura, indice_bulto], function(err, rows){
										if(err)
											console.log("Error Selecting : %s", err);							
										res.send('success');
									});
								});
							}
						});	
					});
				});
			});
		});
}


exports.remove = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM ventaproducto WHERE id_venta = ?', [input.id_venta], function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			var data = rows;
			var query = "UPDATE producto SET cantidadtotal = cantidadtotal + 1 ";
			var query2 = "UPDATE productofactura SET cantidad = cantidad + 1 "; 
			var query3 = "UPDATE importaciones SET cantidad_importacion = cantidad_importacion + 1 ";
 			for(var i=0; i<data.length; i++){
				if(i==0){
					query += "WHERE ";
					query2 += "WHERE ";
					query3 += "WHERE ";
				}
				if(parseInt(data[i].codigo_producto.substring(13, 14)) == 1){
					query += "id_producto = " + parseInt(data[i].codigo_producto.substring(7, 13));
					query2 += "id_producto = " + parseInt(data[i].codigo_producto.substring(7, 13)) + " AND id_factura="+parseInt(data[i].codigo_producto.substring(3, 7))+" AND indice_bulto="+parseInt(data[i].codigo_producto.substring(0, 2));
					if(i != data.length-1){
						query += " OR ";
						query2 += " OR ";
					}
					if(i==data.length-1 && query.substring(query.length-4,query.length-1)==" OR "){
						query = query.substring(0, query.length-4);	
					}
					if(i==data.length-1 && query2.substring(query2.length-4,query2.length-1)==" OR "){
						query2 = query2.substring(0, query2.length-4);	
					}
				}
				else if(parseInt(data[i].codigo_producto.substring(13, 14)) == 0){
					query3 += "id_producto_importacion = " + parseInt(data[i].codigo_producto.substring(7, 13)) + " AND id_factura_importacion="+parseInt(data[i].codigo_producto.substring(3, 7))+" AND indice_bulto_importacion="+parseInt(data[i].codigo_producto.substring(0, 2));
					if(i != data.length-1){
						query3 += " OR ";
					}
					if(i==data.length-1 && query3.substring(query3.length-4,query3.length-1)==" OR "){
						query3 = query3.substring(0, query3.length-4);	
					}
				}
			}
			console.log(query);
			console.log(query3);
			connection.query(query, function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				connection.query(query2, function(err, rows){
					if(err)
						console.log("Error Selecting : %s", err);
					connection.query(query3, function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						connection.query('SELECT * FROM venta WHERE id_venta = ?', [input.id_venta], function(err, rows){
							if(err)
								console.log("Error Selecting : %s", err);
							var monto = rows[0].monto;
							var vendedorRut = rows[0].rut_cliente;
							console.log(monto);
							console.log(vendedorRut);
							connection.query('UPDATE cliente SET monedero = monedero + '+monto+' WHERE rutCliente = ?', [vendedorRut], function(err, rows){
								if(err)
									console.log("Error Selecting : %s", err);
								connection.query('DELETE from ventaproducto WHERE id_venta = ?', [input.id_venta], function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);
									connection.query('DELETE from venta WHERE id_venta = ?', [input.id_venta], function(err, rows){
										if(err)
											console.log("Error Selecting : %s", err);
										res.send('ok');
									});
								});
							});
						});
					});
				});
			});
		});
	});
}





exports.calculateDif = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	var total = req.session.CostoTotal;
	var dif = total - parseInt(input.saldo);
	res.send(' '+dif+' ');
}

exports.sessionSeller = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM vendedor WHERE rutVendedor = ?', input.rut, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			req.session.nameSeller = rows[0].nombreVendedor;
			res.send('NOMBRE ALMACENADO');
		});
	});
}
















exports.range_sale = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM vendedor', function(err, rows){
			if(err){console.log("Error Selecting : %s", err);}
			var order = "ORDER BY FIELD (rutVendedor, ";
			for(var i=0; i<rows.length; i++){
				order += '"'+rows[i].rutVendedor+'"';
				if(i == rows.length-1){
					order += ")";
					console.log(order);
					connection.query('select * from vendedor right join venta on (vendedor.rutVendedor = venta.rut_vendedor) WHERE venta.fecha BETWEEN "'+input.desde+'" AND "'+input.hasta+'"  '+order, function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						//console.log(rows);
						res.render('range_sale', {data: rows});
					});
				}
				else{order += ","}

			}
		});
	});
}
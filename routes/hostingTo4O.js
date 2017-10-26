//ESTE ARCHIVO ES EL QUE SE UTILIZA EN 4 ORIENTE
//SUBIMOS LA BASE DE DATOS A 4 ORIENTE Y BAJAMOS LA DE SAN ANTONIO


exports.delete_all = function(req, res){
				req.session.subida = 0;
				var request = require("request");

				request({
				  uri: "http://186.64.115.190/~tiendasb/belitarequest/DB4Oriente/delete_all.php",
				  method: "POST",
				  json: {"query": "hola"}
				}, function(error, response, body) {
				  if(error){console.log("Error Selecting : %s", error);}
				  console.log(body);
					res.redirect('/subir_productos');
				});


}

exports.delete_all_local = function(req, res){
	req.session.bajada = 0;
	var mysql = require('mysql');
	var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
	connection.getConnection(function(err, connection){
		connection.query('DELETE FROM productofactura', function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			connection.query('DELETE FROM tagproducto', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
					connection.query('DELETE FROM tag', function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						connection.query('DELETE FROM ventaproducto', function(err, rows){
							if(err)
								console.log("Error Selecting : %s", err);
						connection.query('DELETE FROM venta', function(err, rows){
							if(err)
								console.log("Error Selecting : %s", err);
							connection.query('DELETE FROM producto', function(err, rows){
								if(err)
									console.log("Error Selecting : %s", err);
								connection.query('DELETE FROM factura', function(err, rows){
									if(err)
										console.log("Error Selecting : %s", err);
									connection.query('DELETE FROM liquidaciones', function(err, rows){
										if(err)
											console.log("Error Selecting : %s", err);
										connection.query('DELETE FROM liquidaciontags', function(err, rows){
											if(err)
												console.log("Error Selecting : %s", err);
											connection.query('DELETE FROM proveedor', function(err, rows){
												if(err)
													console.log("Error Selecting : %s", err);
												connection.query('DELETE FROM vendedor', function(err, rows){
													if(err)
														console.log("Error Selecting : %s", err);
													connection.query('DELETE FROM cliente', function(err, rows){
														if(err)
															console.log("Error Selecting : %s", err);
														res.redirect('/bajar_producto');
					
		});
		});
		});
		});					
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



function bajar_data(req, res, table, next, connection){

	var request = require("request");

	request({
		uri: "http://186.64.115.190/~tiendasb/belitarequest/DBSanAntonio/select_"+table+".php",
		method: "POST",
		json: {'tabla': table}
		}, function(error, response, body) {
		  	if(error){console.log("Error Selecting : %s", error);}
			//console.log(body);
			//var connection_belita3 = req.app.get('connection_two');
			connection.getConnection(function(err, connection){
				//el PHP retorna la los valores parael comando insert ya ordenados en "()" y separados por ","
				var query = "INSERT INTO "+table+" VALUES "+body.substring(0, body.length-1);
				console.log(query);
				connection.query(query, function(err, rows){
					if(err)
						console.log("Error Selecting : %s", err);
					connection.release();				
					res.redirect(next);
				});
			});
		});	

}


exports.bajar_producto = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
		bajar_data(req, res, 'producto', '/bajar_factura', connection);
		//res.redirect('/bajar_factura');	
}
exports.bajar_factura = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
		bajar_data(req, res, 'factura','/bajar_cliente', connection);
		//res.redirect('/bajar_cliente');
}
exports.bajar_cliente = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
		bajar_data(req, res, 'cliente', '/bajar_proveedor', connection);
		//res.redirect('/bajar_proveedor');
}
exports.bajar_proveedor = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
		bajar_data(req, res, 'proveedor', '/bajar_venta', connection);
		//res.redirect('/bajar_venta');
}
exports.bajar_venta = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
		bajar_data(req, res, 'venta', '/bajar_vendedor', connection);
		//res.redirect('/bajar_vendedor');
}
exports.bajar_vendedor = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
	bajar_data(req, res, 'vendedor', '/bajar_tag', connection);
	//res.redirect('/bajar_tag');
}
exports.bajar_tag = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
	bajar_data(req, res, 'tag', '/bajar_liquidaciones', connection);
//	res.redirect('/bajar_liquidaciones');
}
exports.bajar_liquidaciones = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
	bajar_data(req, res, 'liquidaciones', '/bajar_productofactura', connection);
	//res.redirect('/bajar_productofactura');
}
exports.bajar_productofactura = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
		bajar_data(req, res, 'productofactura', '/bajar_ventaproducto', connection);
		//res.redirect('/bajar_ventaproducto');	
}
exports.bajar_ventaproducto = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
		bajar_data(req, res, 'ventaproducto', '/bajar_liquidaciontags', connection);
		//res.redirect('/bajar_tagproducto');
}

exports.bajar_liquidaciontags = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
	bajar_data(req, res, 'liquidaciontags', '/bajar_tagproducto', connection);
	//res.redirect('/facture_list');
}
exports.bajar_tagproducto = function(req, res){
		var mysql = require('mysql');
		var connection = mysql.createPool({
    		host: '127.0.0.1',
    		user: 'root',
    		password : 'belita3b',
    		port : 3307, 
    		database:'belita3'});
	req.session.bajada++;
	if(req.session.bajada == 1){
		bajar_data(req, res, 'tagproducto', '/bajar_producto', connection);
	}
	else{
		bajar_data(req, res, 'tagproducto', '/fusionar_liquidaciones', connection);
	}
	//res.redirect('/bajar_liquidaciontags');
}



function sendData(query){

				var request = require("request");

				request({
				  uri: "http://186.64.115.190/~tiendasb/belitarequest/DB4Oriente/insert.php",
				  method: "POST",
				  json: {"query": query}
				}, function(error, response, body) {
				  if(error){console.log("Error Selecting : %s", error);}
				  console.log(body);
				});
}

exports.subir_productos = function(req, res){
		var localProducts;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM producto', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				localProducts = rows;
				var query = "INSERT INTO producto VALUES ";
				for(var i=0; i<localProducts.length; i++){
					query += "(" + localProducts[i].id_producto + ",'" + localProducts[i].nombre + "'," + localProducts[i].cantidadtotal + ")";
					if(i == localProducts.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}
				
				sendData(query);
				res.redirect('/subir_facturas');
				
				
			});
		});
}


exports.subir_facturas = function(req, res){
		var localFactures;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM factura', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				localFactures = rows;
				var query = "INSERT INTO factura VALUES ";
				for(var i=0; i<localFactures.length; i++){
					//var date = localFactures[i].Fecha.getDate() + "/"+ localFactures[i].Fecha.getMonth()+"/"+localFactures[i].Fecha.getFullYear()+" "+localFactures[i].Fecha.getHours()+":"+localFactures[i].Fecha.getMinutes()+":"+localFactures[i].Fecha.getSeconds();
					query += "(" + localFactures[i].id_Factura + ",'" + localFactures[i].Fecha + "'," + localFactures[i].Costo + "," + localFactures[i].Iva + "," + localFactures[i].Ready + "," + localFactures[i].bulto_pendiente + "," + localFactures[i].Bultos + "," + localFactures[i].Rut_Proveedor + ")";
					if(i == localFactures.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}
				
				sendData(query);
				res.redirect('/subir_productofactura');
				
				
			});
		});
}

exports.subir_productofactura = function(req, res){
		var data;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM productofactura', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				data = rows;
				var query = "INSERT INTO productofactura VALUES ";
				for(var i=0; i<data.length; i++){
					query += "(" + data[i].id_producto + "," + data[i].id_factura + "," + data[i].indice_bulto + "," + data[i].precio + "," + data[i].cantidad + ")";
					if(i == data.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}
				
				
				sendData(query);
				res.redirect('/subir_ventas');
				
			});
		});
}


exports.subir_ventas = function(req, res){
		var data;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM venta', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				data = rows;
				var query = "INSERT INTO venta VALUES ";
				for(var i=0; i<data.length; i++){
					var date = data[i].fecha.getDate() + "/"+ data[i].fecha.getMonth()+"/"+data[i].fecha.getFullYear()+" "+data[i].fecha.getHours()+":"+data[i].fecha.getMinutes()+":"+data[i].fecha.getSeconds();
					query += "(" + data[i].id_venta + ",'" + date + "'," + data[i].rut_vendedor + "," + data[i].rut_cliente + ",'" + data[i].pago + "'," + data[i].monto + ")";
					if(i == data.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}

				sendData(query);
				res.redirect('/subir_ventaproducto');
				
				
			});
		});
}

exports.subir_ventaproducto = function(req, res){
		var data;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM ventaproducto', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				data = rows;
				var query = "INSERT INTO ventaproducto VALUES ";
				for(var i=0; i<data.length; i++){
					query += "(" + data[i].id_venta + ",'" + data[i].codigo_producto + "'," + data[i].precio + "," + data[i].id_producto + ")";
					if(i == data.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}

				sendData(query);
				res.redirect('/subir_tag');
				
				
			});
		});
}

exports.subir_tag = function(req, res){
		var data;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM tag', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				data = rows;
				var query = "INSERT INTO tag VALUES ";
				for(var i=0; i<data.length; i++){
					query += "('" + data[i].tag + "')";
					if(i == data.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}

				sendData(query);
				res.redirect('/subir_tagproducto');
				
				
			});
		});
}


exports.subir_tagproducto = function(req, res){
		var data;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM tagproducto', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				data = rows;
				var query = "INSERT INTO tagproducto VALUES ";
				for(var i=0; i<data.length; i++){
					query += "('" + data[i].tag + "',"+data[i].id_producto+")";
					if(i == data.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}

				sendData(query);
				res.redirect('/subir_cliente');
				
				
			});
		});
}
exports.subir_cliente = function(req, res){
		var data;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM cliente', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				data = rows;
				var query = "INSERT INTO cliente VALUES ";
				for(var i=0; i<data.length; i++){
					query += "(" + data[i].rutCliente + ",'"+data[i].nombreCliente+"',"+data[i].telefono+",'"+ data[i].mail+"','"+ data[i].fecha_nacimiento+"',"+ data[i].monedero+")";
					if(i == data.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}

				sendData(query);
				res.redirect('/subir_vendedor');
			});
		});
}


exports.subir_vendedor = function(req, res){
		var data;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM vendedor', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				data = rows;
				var query = "INSERT INTO vendedor VALUES ";
				for(var i=0; i<data.length; i++){
					query += "(" + data[i].rutVendedor + ",'"+data[i].nombreVendedor+"')";
					if(i == data.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}

				sendData(query);
				res.redirect('/subir_proveedor');
			});
		});
}


exports.subir_proveedor = function(req, res){
		var data;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM proveedor', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				data = rows;
				var query = "INSERT INTO proveedor VALUES ";
				for(var i=0; i<data.length; i++){
					query += "(" + data[i].Rut_proveedor + ",'"+data[i].Nombre_proveedor+"',"+data[i].Telefono+",'"+data[i].Direccion+"','"+data[i].Mail+"')";
					if(i == data.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}

				sendData(query);
				res.redirect('/subir_liquidaciones');
			});
		});
}



exports.subir_liquidaciones = function(req, res){
		var data;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM liquidaciones', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				data = rows;
				var query = "INSERT INTO liquidaciones VALUES ";
				for(var i=0; i<data.length; i++){
					query += "('"+data[i].codigo_producto_liquidacion+"',"+data[i].precio_liquidacion+")";
					if(i == data.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}

				sendData(query);
				res.redirect('/subir_liquidaciontags');
			});
		});
}

exports.subir_liquidaciontags = function(req, res){
		var data;
		req.getConnection(function(err, connection){
			connection.query('SELECT * FROM liquidaciontags', function(err, rows){
				if(err)
					console.log("Error Selecting : %s", err);
				data = rows;
				var query = "INSERT INTO liquidaciontags VALUES ";
				for(var i=0; i<data.length; i++){
					query += "('" + data[i].tag_liquidacion + "'," + data[i].descuento + ",'" + data[i].tipo +"')";
					if(i == data.length - 1){
						query += ";";
					}
					else{
						query += ",";
					}
				}

				sendData(query);
				req.session.subida++;
				if(req.session.subida == 1){
					res.redirect('/subir_productos');
				}
				else{
					res.redirect('/facture_list');
				}
			});
		});
}




exports.fusionar_liquidaciones = function(req, res){
	/*FUSIONAR TABLAS SE HACE CON LA FINALIDAD DE QUE AMBAS BD TENGAS LOS MISMOS DATOS EN SUS RESPECTIVAS TABLA liquidaciones Y liquidaciontags*/
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM liquidaciones', function(err, rows){
		if(err)
			console.log("Error Selecting : %s", err);
			var liq = rows;
			console.log(rows);
			var mysql = require('mysql');
			var connection2 = mysql.createPool({
		    		host: '127.0.0.1',
		    		user: 'root',
		    		password : 'belita3b',
		    		port : 3307, 
		    		database:'belita3'});
			connection2.getConnection(function(err, connection){
				var query = "INSERT INTO liquidaciones VALUES ";
				for(var i=0; i<liq.length; i++){
					connection.query('INSERT INTO liquidaciones VALUES (?, ?)', [liq[i].codigo_producto_liquidacion, liq[i].precio_liquidacion], function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						connection.release();
					});
				}
				res.redirect('/fusionar_liquidaciones_reversa');
			});
		});	
	});
}

exports.fusionar_liquidaciones_reversa = function(req, res){
	var mysql = require('mysql');
	var connection2 = mysql.createPool({
		  	host: '127.0.0.1',
		   	user: 'root',
	 		password : 'belita3b',
		    port : 3307, 
		    database:'belita3'});
	connection2.getConnection(function(err, connection){
		connection.query('SELECT * FROM liquidaciones', function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			var liq = rows;
			req.getConnection(function(err, connection){
				for(var i=0; i<liq.length; i++){
					connection.query('INSERT INTO liquidaciones VALUES (?, ?)', [liq[i].codigo_producto_liquidacion, liq[i].precio_liquidacion], function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						connection.release();
					});
				}
				res.redirect('/fusionar_liquidaciontags');
			});
		});
	});		
} 



exports.fusionar_liquidaciontags = function(req, res){
	/*FUSIONAR TABLAS SE HACE CON LA FINALIDAD DE QUE AMBAS BD TENGAS LOS MISMOS DATOS EN SUS RESPECTIVAS TABLA liquidaciones Y liquidaciontags*/
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM liquidaciontags', function(err, rows){
		if(err)
			console.log("Error Selecting : %s", err);
			var liq = rows;
			console.log(rows);
			var mysql = require('mysql');
			var connection2 = mysql.createPool({
		    		host: '127.0.0.1',
		    		user: 'root',
		    		password : 'belita3b',
		    		port : 3307, 
		    		database:'belita3'});
			connection2.getConnection(function(err, connection){
				var query = "INSERT INTO liquidaciones VALUES ";
				for(var i=0; i<liq.length; i++){
					connection.query('INSERT INTO liquidaciontags VALUES (?, ?, ?)', [liq[i].tag_liquidacion, liq[i].descuento, liq[i].tipo], function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						connection.release();
					});
				}
				res.redirect('/fusionar_liquidaciontags_reversa');
			});
		});	
	});
}

exports.fusionar_liquidaciontags_reversa = function(req, res){
	var mysql = require('mysql');
	var connection2 = mysql.createPool({
		  	host: '127.0.0.1',
		   	user: 'root',
	 		password : 'belita3b',
		    port : 3307, 
		    database:'belita3'});
	connection2.getConnection(function(err, connection){
		connection.query('SELECT * FROM liquidaciontags', function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			var liq = rows;
			req.getConnection(function(err, connection){
				for(var i=0; i<liq.length; i++){
					connection.query('INSERT INTO liquidaciontags VALUES (?, ?, ?)', [liq[i].tag_liquidacion, liq[i].descuento, liq[i].tipo], function(err, rows){
						if(err)
							console.log("Error Selecting : %s", err);
						connection.release();
					});
				}
				res.redirect('/facture_list');
			});
		});
	});		
}
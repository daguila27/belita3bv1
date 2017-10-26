exports.new_inventory = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err,connection){
						var cod_factura = parseInt(input.codFactura);
						var ind_bulto = parseInt(input.nextbundle);
						var siguiente = ind_bulto + 1;
						
						req.session.codFactura = cod_factura;
						req.session.nextBundle = siguiente;
						req.session.thisBundle = ind_bulto;
						console.log('codigo de factura en session: '+req.session.codFactura);
						//req.session.preciobulto = '';
						connection.query('SELECT * FROM factura WHERE id_Factura = ?', cod_factura,function(err,rows)
						{
								if(err)
										console.log("Error Selecting : %s ",err );
				 				req.session.CantidadTotal = 0;
				 				req.session.CantidadBultos = rows[0].Bultos;
				 				console.log(req.session);
				 				console.log(ind_bulto);
				 				connection.query('UPDATE factura SET bulto_pendiente = ' + ind_bulto + ' WHERE id_Factura = ?', [cod_factura], function(err, rows){
				 							if(err)
				 								console.log("Error Selecting : %s", err);
				 				});
				 				if(ind_bulto == req.session.CantidadBultos ){//YA SE HA INVENTARIADO TODO
				 						res.redirect('/saved_facture');
				 				}
				 				else{
				 						res.render('new_inventory', {page_title: 'Nuevo Inventario', data_facture: rows, index_bundle: ind_bulto, allBundle: req.session.CantidadBultos});		
										
				 				}
						});
				 				
				});


						 
}

exports.list = function(req, res){
		res.render('facture_list', {page_title: 'Facturas pendientes'});
					
	}

exports.details = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM productofactura RIGHT JOIN factura ON (productofactura.id_factura = factura.id_Factura) RIGHT JOIN producto ON (productofactura.id_producto = producto.id_producto) RIGHT JOIN proveedor ON (factura.Rut_Proveedor = proveedor.Rut_proveedor) WHERE productofactura.id_factura = ?', input.codFactura, function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);
			console.log(rows);
			res.render('details_factura', {page_title: 'Detalle de la Factura', datos: rows});
		});
	});
}


exports.save = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('UPDATE factura SET Ready = true WHERE id_Factura = ?', req.session.codFactura, function(err, rows){

			if(err)
				console.log("Error Selecting : %s ",err );

			console.log("REDIRECT");
			res.redirect('/facture_list');

		});
	});
}

exports.next = function(req, res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log('hola');
	req.getConnection(function(err, connection){
		connection.query('SELECT * FROM factura WHERE id_Factura = ?', input.id_Factura, function(err, rows){
			if(err)
				console.log("Error Selecting : %s ", err);

			console.log(rows);
			res.render('setprice', {page_title: 'Nuevo', data_facture: rows});

		});
	});

	res.render('setprice', {page_title: 'Nuevo'});
}


exports.delete_all = function(req, res){
	req.getConnection(function(err, connection){
		connection.query('DELETE FROM factura',function(err, rows){
			if(err)
				console.log("Error Selecting : %s", err);

			res.redirect("/facture_list");
		});
	});
}

exports.table_render = function(req, res){
	req.getConnection(function(err,connection){
						connection.query('SELECT * FROM factura',function(err,rows)
						{
								if(err){
										console.log("Error Selecting : %s ",err );
										}
								list_factura = rows;
								req.getConnection(function(err,connection){
									connection.query('SELECT * FROM proveedor',function(err,rows){
										if(err){
											console.log("Error Selecting : %s ",err );
											}			
										res.render('table_factures', {session: req.session, data_f: list_factura, data_p: rows });
						 			});
						 		});
						});
					});
}